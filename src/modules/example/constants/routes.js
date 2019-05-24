import React from 'react';
import * as Paths from './paths';

const ExampleRecordListPage = React.lazy(() => import(/* webpackChunkName: 'ExampleRecordListPage' */ '../pages/ExampleRecordListPage')
);

const Routes = [
  {
    ...Paths.ExampleRecordListPage,
    exact: true,
    component: ExampleRecordListPage
  }
];

export { Routes };
