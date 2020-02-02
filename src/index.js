import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-tabs/style/react-tabs.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import localforage from 'localforage';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { NotificationsProvider } from './components/app/notifications/NotificationsContext';
import ErrorBoundary from './ErrorBoundary';

const { NODE_ENV, REACT_APP_SERVER } = process.env;

const appCache = new InMemoryCache();

let server = 'http://localhost:3000/graphql';
if (NODE_ENV === 'production') {
  server = REACT_APP_SERVER;
}
const httpLink = createHttpLink({
  uri: server,
});

// set the auth token with every http request:
const asyncAuthLink = setContext(
  (_, { headers }) =>
    new Promise((resolve, reject) => {
      localforage.getItem('__QUIZUS__').then(token => {
        resolve({
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null,
          },
        });
      });
    })
);

// client side auth was heavily influenced by:
// https://www.jaygould.co.uk/2018-08-11-react-apollo-global-error-handling/
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError) {
    alert(
      `[Something went wrong. Please contact us about this error]: ${networkError}`
    );
    console.error(`[Network error]: ${networkError}`);
  }
  if (graphQLErrors) {
    graphQLErrors.some(({ message }) => {
      if (message === 'Unauthenticated') {
        appCache.writeData({
          data: {
            loggedIn: false,
          },
        });
        return true;
      }
      console.error(message);
      return false;
    });
  }
});

const link = ApolloLink.from([errorLink, asyncAuthLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: appCache,
});

client.writeData({
  data: {
    loggedIn: false,
  },
});

ReactDOM.render(
  <ErrorBoundary>
    <ApolloProvider client={client}>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </ApolloProvider>
  </ErrorBoundary>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
