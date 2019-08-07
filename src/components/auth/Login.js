import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import useAuthFormStyles from './AuthFormStyles';
import AuthForm from './AuthForm';

export default () => {
  const classes = useAuthFormStyles();
  return (
    <AuthForm type="login">
      <form className={classes.form}>
        <TextField id="standard-name" label="email" margin="normal" />
        <TextField id="standard-name" label="password" margin="normal" />
        <Button
          color="primary"
          variant="contained"
          type="submit"
          className={classes.submitButton}
        >
          Sign In
        </Button>
      </form>
    </AuthForm>
  );
};
