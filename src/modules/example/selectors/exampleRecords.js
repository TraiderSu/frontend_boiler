import { createSelector } from 'reselect';
import {
  getEntities, getProps, getLists, getSearch
} from 'helpers/selectors';
import queryString from 'query-string';
import { compact } from 'lodash';

export const getExampleRecords = createSelector(
  getLists('exampleRecords'),
  getEntities('exampleRecords'),
  getProps,
  (exampleRecordLists, exampleRecordEntities, props) => {
    const search = getSearch(props);
    const { offset, limit, ...restSearch } = queryString.parse(search);
    const extendedSearch = queryString.stringify(queryString.parse(search));
    const ids = exampleRecordLists.ids[extendedSearch] || [];
    const total = exampleRecordLists.total[queryString.stringify(restSearch)];
    const fetchStatus = exampleRecordLists.fetchStatus[extendedSearch];
    const error = exampleRecordLists.errors[search];

    return {
      data: compact(ids.map(id => exampleRecordEntities[id])),
      total,
      fetchStatus,
      error
    };
  }
);
