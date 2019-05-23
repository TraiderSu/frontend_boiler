/**
 * Создает экземпляр, представляющий ошибку, возникающую при попытке выполнить запрос к API
 */
class RequestError extends Error {
  constructor(message) {
    super();
    this.name = 'Ошибка при выполнении запроса';
    this.message = message;
  }
}

/**
 * Создает экземпляр, представляющий ошибку, возвращаемую сервером при выполнении запроса к API
 */
class ApiError extends Error {
  constructor({
    status, statusText, data, config
  }) {
    super();
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.errors = data.errors;
    this.url = config.url;
    this.message = (data.errors && data.errors[0] && data.errors[0].message) || '';
  }
}

/**
 * Ошибка, если не пришел ожидаемый payload или payload.result
 */
class InternalError extends Error {
  constructor(message) {
    super();
    this.name = 'InternalError';
    this.message = message;
  }
}

export { RequestError, ApiError, InternalError };
