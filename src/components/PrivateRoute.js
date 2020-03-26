import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import localforage from 'localforage';
import { useQuery } from '@apollo/react-hooks';
import { useAuth0 } from '../react-auth0-spa';
import { Route, Redirect } from 'react-router-dom';

const GET_AUTH = gql`
  {
    loggedIn @client
  }
`;

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();
  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: window.location.pathname },
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);
  const render = props =>
    isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
