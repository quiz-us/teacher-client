import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-tabs/style/react-tabs.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import localforage from 'localforage';
import { InMemoryCache } from 'apollo-cache-inmemory';

const appCache = new InMemoryCache();

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql'
});

// set the auth token with every http request:
const asyncAuthLink = setContext(
  (_, { headers }) =>
    new Promise((resolve, reject) => {
      localforage.getItem('__QUIZUS__').then(token => {
        resolve({
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null
          }
        });
      });
    })
);

// client side auth was heavily influenced by:
// https://www.jaygould.co.uk/2018-08-11-react-apollo-global-error-handling/
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      if (message === 'Unauthenticated') {
        appCache.writeData({
          data: {
            loggedIn: false
          }
        });
      }
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      );
      return message;
    });
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = ApolloLink.from([errorLink, asyncAuthLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: appCache
});

client.writeData({
  data: {
    loggedIn: false
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
