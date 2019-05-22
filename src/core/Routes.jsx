import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Module as ExampleModule, ModulePath as ExampleModulePath } from 'modules/example';
import { MainPage } from 'core/ServicePages/MainPage';
import { NotFoundPage } from 'core/ServicePages/NotFoundPage';

export const Routes = () => (
  <Switch>
    <Route path={ ExampleModulePath } component={ ExampleModule } />
    <Route path="/" component={ MainPage } />
    <Route component={ NotFoundPage } />
  </Switch>
);
