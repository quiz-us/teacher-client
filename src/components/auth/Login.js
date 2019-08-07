import React from 'react';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '50px'
  },
  formContainer: {
    width: '30%',
    height: '50%',
    padding: '30px'
  },
  form: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  header: {
    textAlign: 'center'
  },
  submitButton: {},
  helpText: {
    textAlign: 'center'
  }
});

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Card className={classes.formContainer}>
        <form className={classes.form}>
          <h3 className={classes.header}>Login</h3>
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
          <div className={classes.helpText}>
            New to Quiz Us? Sign up <a href="/">here</a>.
          </div>
        </form>
      </Card>
    </div>
  );
};
