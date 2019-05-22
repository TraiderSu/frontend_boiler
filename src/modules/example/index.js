import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NavLinks } from './constants/navLinks';
import * as Paths from './constants/paths';
import { Routes } from './constants/routes';

const Module = props => (
  <React.Suspense fallback="Загрузка">
    <Switch>
      {Routes.map(({ path, component: Component, exact }) => (
        <Route key={ path } path={ path } exact={ exact } render={ ownProps => <Component { ...props } { ...ownProps } /> } />
      ))}
    </Switch>
  </React.Suspense>
);

const ModulePath = Paths.ExamplePage.path;

export {
  Paths, NavLinks, Module, ModulePath
};
