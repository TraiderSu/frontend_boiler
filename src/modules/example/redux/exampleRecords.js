import { EXAMPLE_RECORDS } from 'core/entitiesNames';
import {
  fetchEntityList,
  createEntity,
  createMultipleEntities,
  patchEntity,
  deleteEntity
} from 'helpers/apiStandardActions';
import { createCrudActionTypes, createListReducer, createEntitiesReducer } from 'helpers/redux';

import { CALL_API } from 'core/api';
import { getApiUrl } from 'helpers/urlBuilder';
import { ModuleName } from 'modules/example';
import schemas from './schemas';

const API_ENDPOINT = '/api/v1/example_records';
const actionTypes = createCrudActionTypes(ModuleName, EXAMPLE_RECORDS);
const {
  FETCH_LIST, FETCH_ITEM, CREATE_ITEM, CREATE_MULTIPLE_ITEMS, PATCH_ITEM, DELETE_ITEM
} = actionTypes;

export const fetchExampleRecordList = (params = {}) => fetchEntityList(EXAMPLE_RECORDS, {
  path: API_ENDPOINT,
  params: { ...params, query: params.query },
  types: FETCH_LIST,
  schema: [schemas[EXAMPLE_RECORDS]],
  meta: {
    ...params
  }
});

export const fetchExampleRecord = id => ({
  [CALL_API]: {
    types: FETCH_ITEM,
    endpoint: getApiUrl({ path: `${ API_ENDPOINT }/:id`, method: 'GET' }, { id }),
    schema: schemas[EXAMPLE_RECORDS],
    meta: { id }
  }
});

export const createExampleRecord = body => createEntity(EXAMPLE_RECORDS, {
  path: API_ENDPOINT,
  body,
  types: CREATE_ITEM,
  schema: schemas[EXAMPLE_RECORDS]
});

export const createMultipleExampleRecords = body => createMultipleEntities(EXAMPLE_RECORDS, {
  path: `${ API_ENDPOINT }/many`,
  body,
  types: CREATE_MULTIPLE_ITEMS,
  schema: [schemas[EXAMPLE_RECORDS]]
});

export const patchExampleRecord = body => patchEntity(EXAMPLE_RECORDS, {
  path: API_ENDPOINT,
  body,
  types: PATCH_ITEM,
  schema: schemas[EXAMPLE_RECORDS]
});

export const deleteExampleRecord = id => deleteEntity(EXAMPLE_RECORDS, {
  path: API_ENDPOINT,
  id,
  types: DELETE_ITEM,
  schema: schemas[EXAMPLE_RECORDS]
});

export const reducers = {
  list: createListReducer(FETCH_LIST),
  entities: createEntitiesReducer(EXAMPLE_RECORDS, [
    // request action types
    [FETCH_ITEM[0], PATCH_ITEM[0], DELETE_ITEM[0]],
    // success action types
    [FETCH_ITEM[1], PATCH_ITEM[1], DELETE_ITEM[1]],
    // error action types
    [FETCH_ITEM[2], PATCH_ITEM[2], DELETE_ITEM[2]]
  ])
};
