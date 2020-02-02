import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { NotificationsContext } from './NotificationsContext';

const NotificationSnackbar = () => {
  const {
    notifications: {
      snacks: { open, snack },
    },
    dispatch,
  } = useContext(NotificationsContext);

  const {
    message = '',
    severity = 'success',
    vertical = 'bottom',
    horizontal = 'center',
    key,
  } = snack || {};

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch({ type: 'CLOSE_SNACK' });
  };

  const handleExited = () => dispatch({ type: 'UPDATE_SNACK_QUEUE' });

  return (
    <Snackbar
      key={key}
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      onExited={handleExited}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
