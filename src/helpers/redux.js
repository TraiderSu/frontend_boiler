import { combineReducers } from 'redux';
import mergeWith from 'lodash/mergeWith';
import isArray from 'lodash/isArray';
import omit from 'lodash/omit';
import snakeCase from 'lodash/snakeCase';
import {
  fetchEntityList,
  fetchEntity,
  createEntity,
  createMultipleEntities,
  patchEntity,
  deleteEntity
} from 'helpers/apiStandardActions';
import queryString from 'query-string';

const API_STATES = ['start', 'success', 'failed'];
const API_ACTIONS = ['FETCH_LIST', 'FETCH_ITEM', 'CREATE_ITEM', 'CREATE_MULTIPLE_ITEMS', 'PATCH_ITEM', 'DELETE_ITEM'];

export function createApiActionTypes(opts) {
  const module = opts.module ? `${ opts.module.toLowerCase() }/` : '';
  const entitiesName = `${ opts.entitiesName.toUpperCase() }`;
  const action = `${ opts.action.toUpperCase() }`;

  return API_STATES.map(state => `${ module }${ entitiesName }/${ action } [${ state }]`);
}

export const mergeWithKey = (state, key, payload) => ({
  ...state,
  [key]: payload
});

export const mergeWithCustomizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    return srcValue;
  }
};

const entitiesIsLoaded = ({ entitiesName, action }) => action.payload && action.payload.entities && action.payload.entities[entitiesName];

const createReducers = listReducers => {
  if (!listReducers) {
    return null;
  }
  const reducers = {};

  Object.entries(listReducers).forEach(([key, reducer]) => {
    reducers[key] = (state = {}, action) => {
      const { id } = action.meta || {};

      if (id && reducer) {
        return mergeWithKey(state, id, reducer(state[id], action));
      }

      return state;
    };
  });

  return reducers;
};

export function createCrudActionTypes(module, entitiesName) {
  return API_ACTIONS.reduce(
    (obj, action) => ({
      ...obj,
      [action]: createApiActionTypes({
        module,
        entitiesName: snakeCase(entitiesName).toUpperCase(),
        action
      })
    }),
    {}
  );
}

export const createFetchStatusReducer = ([requestTypes, successTypes, failureTypes, reinitTypes = '']) => (
  state = 'none',
  action
) => {
  switch (true) {
    case requestTypes.includes(action.type):
      return 'fetching';
    case successTypes.includes(action.type):
      return 'loaded';
    case failureTypes.includes(action.type):
      return 'error';
    case reinitTypes.includes(action.type):
      return 'none';
    default:
      return state;
  }
};

export const createResultReducer = ([, successTypes], opts = {}) => (
  state = opts.initialState !== undefined ? opts.initialState : [],
  action
) => {
  if (successTypes.includes(action.type)) {
    return (opts.resultKey ? action.payload.result[opts.resultKey] : action.payload.result) || null;
  }

  return state;
};

export const createErrorReducer = ([requestTypes, successTypes, failureTypes]) => (state = null, action) => {
  if (requestTypes.includes(action.type) || successTypes.includes(action.type)) {
    return null;
  }

  if (failureTypes.includes(action.type)) {
    return action.payload;
  }

  return state;
};

export const createDataReducer = (actionTypes, opts = {}) => combineReducers({
  data: createResultReducer(actionTypes, opts),
  fetchStatus: createFetchStatusReducer(actionTypes),
  error: createErrorReducer(actionTypes)
});

export const createListReducer = ([requestTypes, successTypes, failureTypes], opts = {}) => {
  const ids = (state = {}, action) => {
    if (successTypes.includes(action.type)) {
      const { query } = action.meta || {};
      const key = queryString.stringify(query);

      return mergeWithKey(state, key, opts.resultKey ? action.payload.result[opts.resultKey] : action.payload.result);
    }

    return state;
  };

  const fetchStatus = (state = {}, action) => {
    const { query } = action.meta || {};
    const key = queryString.stringify(query);

    switch (true) {
      case requestTypes.includes(action.type):
        return mergeWithKey(state, key, 'fetching');
      case successTypes.includes(action.type):
        return mergeWithKey(state, key, 'loaded');
      case failureTypes.includes(action.type):
        return mergeWithKey(state, key, 'error');
      default:
        return state;
    }
  };

  const errors = (state = {}, action) => {
    const { query } = action.meta || {};
    const key = queryString.stringify(query);

    if ((requestTypes.includes(action.type) || successTypes.includes(action.type)) && state[key]) {
      return mergeWithKey(state, key, null);
    }
    if (failureTypes.includes(action.type)) {
      return mergeWithKey(state, key, action.payload);
    }

    return state;
  };

  const total = (state = {}, action) => {
    if (successTypes.includes(action.type)) {
      const { query } = action.meta || {};
      const { offset, limit, ...rest } = query || {};
      const key = queryString.stringify(rest);

      return mergeWithKey(state, key, action.payload.pagination && action.payload.pagination.total);
    }

    return state;
  };

  return combineReducers({
    ids,
    fetchStatus,
    errors,
    total
  });
};

export const createEntitiesReducer = (
  entitiesName,
  [requestTypes, successTypes, failureTypes],
  listReducers,
  opts = {}
) => {
  const entities = (state = {}, action) => {
    const { id, isDeleting } = action.meta || {};

    if (id && isDeleting && successTypes && successTypes.includes(action.type)) {
      return omit(state, id);
    }

    if (entitiesIsLoaded({ entitiesName, action })) {
      if (typeof opts.customMerge === 'function') {
        return opts.customMerge({ state, action });
      }

      return mergeWith({}, state, action.payload.entities[entitiesName], mergeWithCustomizer);
    }

    return state;
  };

  const fetchStatus = (state = {}, action) => {
    const { id, isDeleting } = action.meta || {};

    if (id) {
      switch (true) {
        case requestTypes.includes(action.type):
          return mergeWithKey(state, id, 'fetching');
        case successTypes.includes(action.type):
          if (isDeleting) {
            return omit(state, id);
          }

          return mergeWithKey(state, id, 'loaded');
        case failureTypes.includes(action.type):
          return mergeWithKey(state, id, 'error');
        default:
          return state;
      }
    }
    if (entitiesIsLoaded({ entitiesName, action })) {
      const statuses = {};

      Object.keys(action.payload.entities[entitiesName]).forEach(key => {
        if (state[key] !== 'loaded') {
          statuses[key] = 'preloaded';
        }
      });

      return {
        ...state,
        ...statuses
      };
    }

    return state;
  };

  const errors = (state = {}, action) => {
    const { id } = action.meta || {};

    if (id) {
      if ((requestTypes.includes(action.type) || successTypes.includes(action.type)) && state[id]) {
        return mergeWithKey(state, id, null);
      }
      if (failureTypes.includes(action.type)) {
        return mergeWithKey(state, id, action.payload);
      }
    }

    return state;
  };

  return combineReducers({
    entities,
    ...(opts.fetchStatus !== false && { fetchStatus }),
    ...(opts.errors !== false && { errors }),
    ...createReducers(listReducers)
  });
};

export const createRedux = ({
  MODULE, name, path, schemas = {}, actions, reducers
}) => {
  const actionTypes = createCrudActionTypes(MODULE, snakeCase(name).toUpperCase());
  const {
    FETCH_LIST, FETCH_ITEM, CREATE_ITEM, CREATE_MULTIPLE_ITEMS, PATCH_ITEM, DELETE_ITEM
  } = actionTypes;

  return {
    actionTypes,
    actions: {
      fetchList: params => fetchEntityList(name, {
        path,
        params,
        types: FETCH_LIST,
        schema: schemas.fetchList
      }),
      fetchItem: id => fetchEntity(name, {
        path,
        id,
        types: FETCH_ITEM,
        schema: schemas.fetchItem
      }),
      createItem: body => createEntity(name, {
        path,
        body,
        types: CREATE_ITEM,
        schema: schemas.createItem
      }),
      createMultipleItems: body => createMultipleEntities(name, {
        path,
        body,
        types: CREATE_MULTIPLE_ITEMS,
        schema: schemas.createMultipleItems
      }),
      patchItem: body => patchEntity(name, {
        path,
        body,
        types: PATCH_ITEM,
        schema: schemas.patchItem
      }),
      deleteItem: id => deleteEntity(name, {
        path,
        id,
        types: DELETE_ITEM,
        schema: schemas.deleteItem
      }),
      ...(actions && actions(actionTypes))
    },
    reducers: {
      list: createListReducer(FETCH_LIST),
      entities: createEntitiesReducer(name, [
        // request action types
        [FETCH_ITEM[0], PATCH_ITEM[0], DELETE_ITEM[0]],
        // success action types
        [FETCH_ITEM[1], PATCH_ITEM[1], DELETE_ITEM[1]],
        // error action types
        [FETCH_ITEM[2], PATCH_ITEM[2], DELETE_ITEM[2]]
      ]),
      ...(reducers && reducers(actionTypes))
    }
  };
};
