import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { apiMiddleware } from 'core/api';
import reducer from 'core/reducer';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

const {
  middleware: offlineMiddleware,
  enhanceReducer: offlineEnhanceReducer,
  enhanceStore: offlineEnhanceStore
} = createOffline({
  ...offlineConfig,
  persist: false
});

const middlewares = [thunk, apiMiddleware, offlineMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

export default () => {
  const store = createStore(
    offlineEnhanceReducer(reducer),
    composeWithDevTools(offlineEnhanceStore, applyMiddleware(...middlewares))
  );

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./reducer', () => {
        store.replaceReducer(offlineEnhanceReducer(reducer));
      });
    }
  }

  const persistor = persistStore(store);

  return { store, persistor };
};
