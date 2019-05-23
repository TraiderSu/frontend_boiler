import {
  array, bool, func, number, object, oneOf, oneOfType, string
} from 'prop-types';

export const location = {
  hash: string.isRequired,
  key: string,
  pathname: string.isRequired,
  search: string.isRequired,
  state: oneOfType([array, bool, number, object, string])
};

export const history = {
  action: oneOf(['PUSH', 'REPLACE', 'POP']).isRequired,
  block: func.isRequired,
  createHref: func.isRequired,
  go: func.isRequired,
  goBack: func.isRequired,
  goForward: func.isRequired,
  length: number,
  listen: func.isRequired,
  location: location.isRequired,
  push: func.isRequired,
  replace: func.isRequired
};

export const match = {
  isExact: bool,
  params: object.isRequired,
  path: string.isRequired,
  url: string.isRequired
};

export default {
  location,
  history,
  match
};
