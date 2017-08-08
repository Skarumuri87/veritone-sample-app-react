import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { isFunction, flow } from 'lodash';
import { Sagas } from 'react-redux-saga';

import configureStore from 'reduxConfig/store/configureStore';
import { EnsureUserIsAuthenticated } from 'helpers/auth';
//import { syncHistoryWithStore } from 'react-router-redux';
// import {
//   EnsureUserIsAuthenticated,
//   EnsureUserCompletedDevSignup
// } from 'helpers/auth';

import App from 'App';
import loginRoute from 'plugins/login';
import noAccessRoute from 'plugins/noAccess';
import notFoundRoute from 'plugins/notFound';

const PassThrough = props => props.children;

//
const AuthChecks = flow([
  EnsureUserIsAuthenticated
]
)(PassThrough);

export function runConfig() {
  const store = configureStore();
  //const history = syncHistoryWithStore(browserHistory, store);

  const rootRoute = {
    path: '/',
    component: App,
    indexRoute: {
      //onEnter: (nextState, replace) => replace('/engines')
    },
    childRoutes: [
      loginRoute(store),
      {
        component: AuthChecks,
        childRoutes: [
          // auth-protected top-level routes
          noAccessRoute,
          notFoundRoute
        ].map(r => (isFunction(r) ? r(store) : r))
      }
    ]
  };

  return {
    store,
    rootRoute
  };
}

export const RootComponent = (
  { store, history, rootRoute } // eslint-disable-line
) =>
  <Provider store={store}>
    <Sagas middleware={store.sagaMiddleware}>
      <Router routes={rootRoute} />
    </Sagas>
  </Provider>;
