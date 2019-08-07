import React, { useState, useEffect } from 'react';
import Auth from '../services/Auth';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    Auth.isAuthenticated().then(authStatus => {
      setIsAuthenticated(authStatus);
    });
  });

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
