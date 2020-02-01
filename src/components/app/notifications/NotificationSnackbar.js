import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { NotificationsContext } from './NotificationsContext';

const NotificationSnackbar = ({ snack }) => {
  const { notifications, dispatch } = useContext(NotificationsContext);
  console.log(notifications);
  const {
    snack: { message, severity, vertical, horizontal },
  } = notifications;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch({ type: 'RESET_SNACK' });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={!!message}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
