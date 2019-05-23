import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import entitiesNames from 'core/entitiesNames';
import { exampleRecordsReducers } from 'modules/example';

const allReducers = {
  ...exampleRecordsReducers
};

const reducers = Object.values(entitiesNames).reduce(
  (obj, name) => ({
    entities: {
      ...obj.entities,
      [name]: allReducers[name].reducers.entities
    },
    lists: {
      ...obj.lists,
      [name]: allReducers[name].reducers.list
    }
  }),
  {}
);

const entities = combineReducers(reducers.entities);
const lists = combineReducers(reducers.lists);

export default combineReducers({
  entities: persistReducer({ key: 'entities', storage }, entities),
  lists
});
