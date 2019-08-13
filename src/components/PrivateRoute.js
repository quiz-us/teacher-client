import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import Auth from '../services/Auth';
import localforage from 'localforage';
import { useQuery } from '@apollo/react-hooks';
import { Route, Redirect } from 'react-router-dom';

const GET_AUTH = gql`
  {
    loggedIn @client
  }
`;

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isCheckingForToken, setIsCheckingFortoken] = useState(true);
  const { data, loading, client } = useQuery(GET_AUTH);

  useEffect(() => {
    localforage.getItem('__QUIZUS__').then(token => {
      if (token) {
        client.writeData({
          data: { loggedIn: true }
        });
      }
      setIsCheckingFortoken(false);
    });
  }, [client]);

  if (isCheckingForToken || loading) {
    // adding a loader while auth service asynchronously reads from localforage:
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={props =>
        data.loggedIn ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
