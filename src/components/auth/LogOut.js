import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  logout: {
    marginLeft: 'auto',
  },
});

const Logout = ({ logout }) => {
  const classes = useStyles();

  return (
    <Button
      onClick={() => logout()}
      variant="contained"
      color="secondary"
      className={classes.logout}
    >
      Log Out
    </Button>
  );
};

export default Logout;
