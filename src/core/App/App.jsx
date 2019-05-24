import React from 'react';
import { NavLink } from 'react-router-dom';
import { ModuleLink as ExampleModuleLink } from 'modules/example';
import { Routes } from '../Routes';

import 'semantic-ui-css/semantic.min.css';
import styles from './App.less';

const modulesLinks = [ExampleModuleLink];

class App extends React.Component {
  render() {
    return (
      <>
        <div className={ styles.header }>
          <div className={ styles.nav }>
            <NavLink to="/" exact className={ styles.nav__item }>
              Main Page
            </NavLink>
            {modulesLinks.map(({ title, path }) => (
              <NavLink key={ path } to={ path } className={ styles.nav__item }>
                {title}
              </NavLink>
            ))}
          </div>
        </div>
        <div className={ styles.body }>
          <Routes />
        </div>
      </>
    );
  }
}

export { App };
