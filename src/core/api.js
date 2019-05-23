import axios from 'axios';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import { RequestError, ApiError } from 'helpers/errors';

const callApi = async ({
  method, url, body, ...props
}) => {
  const response = await axios({
    method,
    url,
    data: body,
    ...props
  });

  return response;
};

const CALL_API = 'Call API';

const apiMiddleware = () => next => async action => {
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  // const { endpoint, body, schema, types, meta: callApiMeta = {}, ...rest } = callAPI;
  const {
    endpoint, body, schema, types, meta = {}, ...rest
  } = callAPI;

  const { method, url } = endpoint;

  if (typeof method !== 'string') {
    throw new Error('Не указан метод запроса');
  }
  if (typeof url !== 'string') {
    throw new Error('Не указан параметр url');
  }
  if (schema === undefined) {
    throw new Error(`Не задана schema для [${ method }] ${ url }`);
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Массив action types должен содержать 3 элемента: request, success, fail');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Action type должен быть строкой');
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data);

    delete finalAction[CALL_API];

    return finalAction;
  };

  const [requestType, successType, failureType] = types;

  const {
    [requestType]: requestMeta, [successType]: successMeta, [failureType]: failureMeta, ...commonMeta
  } = meta;

  next(actionWith({ type: requestType, meta: { ...commonMeta, ...requestMeta } }));

  let response;

  try {
    response = await callApi({
      method,
      url,
      body,
      schema,
      ...rest
    });
  } catch (error) {
    if (error.response) {
      // Запрос был выполнен, но сервер вернул ошибку
      return next(
        actionWith({
          type: failureType,
          error: true,
          payload: new ApiError(error.response),
          meta: { ...commonMeta, ...failureMeta }
        })
      );
    }
    if (error.request) {
      // Запрос был выполнен, но ответ не был получен
      // https://github.com/axios/axios#handling-errors
      // TODO: сделать обработчик со своим типом RequestError.
      return next(
        actionWith({
          error: true,
          payload: new RequestError(error.request),
          type: requestType,
          meta: { ...commonMeta, ...failureMeta }
        })
      );
    }

    // Ошибка при попытке выполнения запроса
    return next(
      actionWith({
        error: true,
        payload: new RequestError(error.request),
        type: requestType,
        meta: { ...commonMeta, ...failureMeta }
      })
    );
  }

  const { result, pagination } = response.data;

  const camelizedJson = camelizeKeys(result);

  const payload = {
    ...(camelizedJson && schema ? normalize(camelizedJson, schema) : { result: camelizedJson }),
    ...(pagination && { pagination })
  };

  return next(
    actionWith({
      type: successType,
      payload,
      meta: { ...commonMeta, ...successMeta }
    })
  );
};

export { apiMiddleware, CALL_API };
