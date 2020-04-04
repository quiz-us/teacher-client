import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-tabs/style/react-tabs.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Auth0Provider } from './react-auth0-spa';
import { NotificationsProvider } from './components/app/notifications/NotificationsContext';
import ErrorBoundary from './ErrorBoundary';
import history from './util/history';

const {
  REACT_APP_AUTH_0_CLIENT_ID,
  REACT_APP_AUTH_0_DOMAIN,
  REACT_APP_AUDIENCE,
} = process.env;

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <ErrorBoundary>
    <Auth0Provider
      domain={REACT_APP_AUTH_0_DOMAIN}
      client_id={REACT_APP_AUTH_0_CLIENT_ID}
      audience={REACT_APP_AUDIENCE}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </Auth0Provider>
  </ErrorBoundary>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
