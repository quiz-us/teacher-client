import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import useAuthFormStyles from './AuthFormStyles';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import AuthForm from './AuthForm';
import localforage from 'localforage';
import useForm from '../hooks/useForm';

const LOGIN = gql`
  mutation logInTeacher($email: String!, $password: String!) {
    logInTeacher(email: $email, password: $password) {
      id
      email
      token
    }
  }
`;

export default ({ history }) => {
  const classes = useAuthFormStyles();
  const client = useApolloClient();
  const [logInTeacher, { loading, error }] = useMutation(LOGIN);
  const { inputs, handleInputChange } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const {
      data: {
        logInTeacher: { token }
      }
    } = await logInTeacher({ variables: inputs });
    if (token) {
      await localforage.setItem('__QUIZUS__', token);
      const {
        push,
        location: { state = { from: { pathname: '/' } } }
      } = history;
      client.writeData({
        data: { loggedIn: true }
      });
      push(state.from.pathname);
    }
  };

  return (
    <AuthForm type="login">
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={inputs.email}
          name="email"
          onChange={handleInputChange}
        />
        <TextField
          label="Password"
          type="password"
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
        {error ? (
          <div className={classes.error}>{error.graphQLErrors[0].message}</div>
        ) : null}
      </form>
    </AuthForm>
  );
};
