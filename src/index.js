import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from 'core/App';
import { ViewportControl } from 'components/ViewportControl';

const render = () => {
  ReactDOM.render(
    <BrowserRouter>
      <ViewportControl>
        <App />
      </ViewportControl>
    </BrowserRouter>,
    document.getElementById('app')
  );
};

render();

if (module.hot) {
  module.hot.accept(['./core/App'], render);
}
