import { schema as Schema } from 'normalizr';
import { decamelizeKeys } from 'humps';
import { CALL_API } from 'core/api';
import { getApiUrl, getUrl } from './urlBuilder';

// /**
//  * Возвращает набор справочников
//  */
export const fetchEntityList = (name, {
  types, schema, path, params = {}, meta
}) => ({
  [CALL_API]: {
    types,
    endpoint: getApiUrl({ path, method: 'GET' }, params),
    schema: schema || [new Schema.Entity(name)],
    meta
  }
});

// /**
//  * Возвращает созданную запись справочника
//  * @param  {string} referenceName имя справочника
//  * @param  {number} id            id записи справочника
//  */
export const fetchEntity = (name, {
  types, id, schema, path, meta
}) => ({
  [CALL_API]: {
    types,
    endpoint: getApiUrl({ path: `${ path }/:id`, method: 'GET' }, { id }),
    schema: schema || new Schema.Entity(name),
    meta: {
      id,
      ...meta
    }
  }
});

// /**
//  * Возвращает id созданной записи справочника
//  * @param  {string} referenceName имя справочника
//  * @param  {object} body          данные формы
//  */
export const createEntity = (name, {
  types, schema, body, path
}) => ({
  [CALL_API]: {
    types,
    endpoint: getApiUrl({ path, method: 'POST' }),
    body: decamelizeKeys(body),
    schema: schema || new Schema.Entity(name)
  }
});

export const createMultipleEntities = (name, {
  types, schema, body, path
}) => ({
  [CALL_API]: {
    types,
    endpoint: getApiUrl({ path, method: 'POST' }),
    body: decamelizeKeys(body),
    schema: schema || new Schema.Entity(name)
  }
});

// /**
//  * Возвращает id обновленной записи справочника
//  * @param  {string} referenceName имя справочника
//  * @param  {object} body          данные формы
//  */
export const patchEntity = (name, {
  types, schema, body: { id, ...body }, path, meta
}) => ({
  [CALL_API]: {
    types,
    endpoint: getApiUrl({ path: getUrl(`${ path }/:id`, { id }), method: 'PATCH' }),
    body: decamelizeKeys({ id, ...body }),
    schema: schema || new Schema.Entity(name),
    meta: {
      id,
      ...meta
    }
  }
});

// /**
//  * Отмечает запись в справочнике как удаленную
//  * @param  {string} referenceName имя справочника
//  * @param  {number} id            id записи справочника
//  */
export const deleteEntity = (name, {
  types, id, path, schema, meta
}) => ({
  [CALL_API]: {
    types,
    endpoint: getApiUrl({ path: `${ path }/:id`, method: 'DELETE' }, { id }),
    schema: schema || {},
    meta: { id, isDeleting: true, ...meta }
  }
});
