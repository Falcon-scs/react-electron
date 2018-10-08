// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import axios from '../fetch';
import rootReducer from '../reducers';

const effect = (effect, _action) => axios(effect.url, { ...effect.options });

const discard = (error, _action, _retries) => {
  const { response } = error;
  return response && 400 <= response.status && response.status < 500;
}

const history = createBrowserHistory();
const router = routerMiddleware(history);
const enhancers = [];
enhancers.push(applyMiddleware(thunk, router));

enhancers.push(offline({
  ...offlineConfig,
  effect,
  discard
}));

const enhancer = compose(...enhancers);

function configureStore(initialState?: {
  user: {
    data: null,
    isLoading: false
  }
}) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
