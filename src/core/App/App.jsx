import React from 'react';
import { NavLink } from 'react-router-dom';
import { Routes } from '../Routes';

import 'semantic-ui-css/semantic.min.css';
import styles from './App.less';

class App extends React.Component {
  render() {
    return (
      <>
        <div className={ styles.header }>
          <div className={ styles.nav }>
            <NavLink to="/" exact className={ styles.nav__item }>
              Main Page
            </NavLink>
            <NavLink to="/example" className={ styles.nav__item }>
              Example Page
            </NavLink>
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
