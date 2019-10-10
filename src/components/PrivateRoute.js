import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
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
    // render nothing while auth service asynchronously reads from localforage:
    return null;
  }

  const { loggedIn } = data;

  return (
    <Route
      {...rest}
      render={props =>
        loggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
