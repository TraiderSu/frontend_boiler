import React from 'react';
import * as Paths from './paths';

const ExamplePage = React.lazy(() => import(/* webpackChunkName: 'ExamplePage' */ '../pages/ExamplePage'));

const Routes = [
  {
    ...Paths.ExamplePage,
    exact: true,
    component: ExamplePage
  }
];

export { Routes };
