import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import GlobalLoader from '../app/GlobalLoader';
import { LOGOUT } from '../gql/mutations/Auth';

const useStyles = makeStyles({
  logout: {
    marginLeft: 'auto',
  },
});

const Logout = ({ logout }) => {
  const classes = useStyles();
  let history = useHistory();

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
