import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import useAuthFormStyles from './AuthFormStyles';
import AuthForm from './AuthForm';
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

export default () => {
  const classes = useAuthFormStyles();
  const [signUpTeacher, { loading, error, data }] = useMutation(SIGNUP);
  const { inputs, handleInputChange } = useForm({
    email: '',
    password: ''
  });
  console.log('data', data);
  console.log('error', error);
  console.log('loading', loading);
  const handleSubmit = e => {
    e.preventDefault();
    signUpTeacher({ variables: inputs });
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
