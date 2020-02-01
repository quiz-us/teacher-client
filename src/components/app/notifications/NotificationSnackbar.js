import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { NotificationsContext } from './NotificationsContext';

const NotificationSnackbar = () => {
  const {
    notifications: { snacks },
    dispatch,
  } = useContext(NotificationsContext);
  const [notification] = snacks;
  const {
    message = '',
    severity = 'success',
    vertical = 'bottom',
    horizontal = 'center',
  } = notification || {};

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch({ type: 'SHIFT_SNACK' });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={snacks.length > 0}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
