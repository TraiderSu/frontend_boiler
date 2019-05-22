import React from 'react';
import './reset.less';
import styles from './App.less';

class App extends React.Component {
  render() {
    return (
      <>
        <div className={ styles.header }>Header</div>
        <div className={ styles.body }>Body</div>
      </>
    );
  }
}

export { App };
