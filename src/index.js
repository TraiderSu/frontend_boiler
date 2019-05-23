import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { App } from 'core/App';
import configureStore from 'core/configureStore';
import { ViewportControl } from 'components/ViewportControl';

const { store, persistor } = configureStore();

const render = () => {
  ReactDOM.render(
    <Provider store={ store }>
      <PersistGate loading="Загрузка" persistor={ persistor }>
        <BrowserRouter>
          <ViewportControl>
            <App />
          </ViewportControl>
        </BrowserRouter>
      </PersistGate>
    </Provider>,
    document.getElementById('app')
  );
};

render();

if (module.hot) {
  module.hot.accept(['./core/App'], render);
}
