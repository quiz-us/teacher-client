import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import useAuthFormStyles from './AuthFormStyles';
import AuthForm from './AuthForm';
import localforage from 'localforage';
import useForm from '../hooks/useForm';

const SIGNUP = gql`
  mutation signUpTeacher($email: String!, $password: String!) {
    signUpTeacher(email: $email, password: $password) {
      id
      email
      token
    }
  }
`;

export default ({ history }) => {
  const classes = useAuthFormStyles();
  const client = useApolloClient();
  const [signUpTeacher, { loading, error }] = useMutation(SIGNUP);
  const { inputs, handleInputChange } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const {
      data: {
        signUpTeacher: { token }
      }
    } = await signUpTeacher({ variables: inputs });
    if (token) {
      await localforage.setItem('__QUIZUS__', token);
      client.writeData({
        data: { loggedIn: true }
      });
      history.push('/');
    }
  };

  return (
    <AuthForm type="signup">
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
            Sign Up
          </Button>
        )}
        {error ? (
          <div className={classes.error}>{error.graphQLErrors[0].message}</div>
        ) : null}
      </form>
    </AuthForm>
  );
};
