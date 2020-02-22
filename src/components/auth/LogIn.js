import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useAuthFormStyles from './AuthFormStyles';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { LOGIN } from '../gql/mutations/Auth';
import AuthForm from './AuthForm';
import localforage from 'localforage';
import useForm from '../hooks/useForm';
import parseError from '../../util/parseError';

export default ({ history }) => {
  const classes = useAuthFormStyles();
  const client = useApolloClient();
  const [error, setError] = useState('');
  const [logInTeacher, { loading }] = useMutation(LOGIN, {
    onError: error => {
      setError(parseError(error));
    },
    onCompleted: async ({ logInTeacher: { token } }) => {
      if (token) {
        await localforage.setItem('__QUIZUS__', token);
        const {
          push,
          location: { state = { from: { pathname: '/' } } },
        } = history;
        client.writeData({
          data: { loggedIn: true },
        });
        push(state.from.pathname);
      }
    },
  });
  const { inputs, handleInputChange } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = async e => {
    e.preventDefault();
    await logInTeacher({ variables: inputs });
  };

  return (
    <AuthForm type="login">
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          autoFocus
          label="Email"
          type="email"
          className={classes.field}
          value={inputs.email}
          name="email"
          onChange={handleInputChange}
        />
        <TextField
          label="Password"
          type="password"
          className={classes.field}
          value={inputs.password}
          name="password"
          onChange={handleInputChange}
        />
        {loading ? (
          'loading...'
        ) : (
          <Button
            color="primary"
            variant="contained"
            type="submit"
            className={classes.submitButton}
          >
            Log In
          </Button>
        )}
        {error ? <div className={classes.error}>{error}</div> : null}
      </form>
    </AuthForm>
  );
};
