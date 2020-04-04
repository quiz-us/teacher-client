import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import Nav from './components/nav/Nav';
import LogIn from './components/auth/LogIn';
import { createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import teal from '@material-ui/core/colors/teal';
import amber from '@material-ui/core/colors/amber';
import PrivateRoute from './components/PrivateRoute';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';

import { InMemoryCache } from 'apollo-cache-inmemory';

import MainRoutes from './components/MainRoutes';
import CssBaseline from '@material-ui/core/CssBaseline';
import Notifications from './components/app/notifications';
import { useAuth0 } from './react-auth0-spa';
import GlobalLoader from './components/app/GlobalLoader';

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: amber,
  },
});

const { REACT_APP_SERVER } = process.env;

const appCache = new InMemoryCache();

const server = REACT_APP_SERVER;

const httpLink = createHttpLink({
  uri: server,
});

// set the auth token with every http request:

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

const App = () => {
  const { getTokenSilently, loginWithRedirect, isAuthenticated } = useAuth0();
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect({});
      return;
    }
    getTokenSilently().then(token => {
      const setAuthLink = setContext((_, { headers }) => ({
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : null,
        },
      }));
      const link = ApolloLink.from([errorLink, setAuthLink, httpLink]);

      const client = new ApolloClient({
        link,
        cache: appCache,
      });

      setClient(client);
    });
  }, [getTokenSilently, isAuthenticated, loginWithRedirect]);
  if (!client) {
    return <GlobalLoader />;
  }

  return (
    <ApolloProvider client={client}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Nav />
            <Switch>
              <Route exact path="/login" component={LogIn} />
              {/* <Route exact path="/signup" component={SignUp} /> */}
              <PrivateRoute path="/" component={MainRoutes} />
            </Switch>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
        <Notifications />
      </Router>
    </ApolloProvider>
  );
};

const AppContainer = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <GlobalLoader />;
  }
  return <App />;
};

export default AppContainer;
