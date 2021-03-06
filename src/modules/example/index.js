import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { EXAMPLE_RECORDS } from 'core/entitiesNames';
import { NavLinks, ModuleLink } from './constants/navLinks';
import * as Paths from './constants/paths';
import { Routes } from './constants/routes';

import { reducers as exampleRecords } from './redux/exampleRecords';

const Module = props => (
  <React.Suspense fallback="Загрузка">
    <Switch>
      {Routes.map(({ path, component: Component, exact }) => (
        <Route key={ path } path={ path } exact={ exact } render={ ownProps => <Component { ...props } { ...ownProps } /> } />
      ))}
    </Switch>
  </React.Suspense>
);

export const exampleRecordsReducers = {
  [EXAMPLE_RECORDS]: {
    reducers: {
      ...exampleRecords
    }
  }
};

const ModuleName = 'exampleRecords';
const ModulePath = Paths.ExampleRecordListPage.path;

export {
  Paths, NavLinks, Module, ModuleName, ModulePath, ModuleLink
};
