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

const Logout = () => {
  const classes = useStyles();
  let history = useHistory();
  const [logOutTeacher, { loading }] = useMutation(LOGOUT, {
    onError: error => {
      console.error(error);
    },
    onCompleted: () => {
      history.push('/login');
    },
  });
  if (loading) {
    return <GlobalLoader />;
  }
  return (
    <Button
      onClick={logOutTeacher}
      variant="contained"
      color="secondary"
      className={classes.logout}
    >
      Log Out
    </Button>
  );
};

export default Logout;
