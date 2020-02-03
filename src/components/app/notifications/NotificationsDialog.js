import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import { NotificationsContext } from './NotificationsContext';

const NotificationsDialog = () => {
  const {
    notifications: { dialog },
    dispatch,
  } = useContext(NotificationsContext);

  const { title = '', message = '', maxWidth = 'lg' } = dialog;

  const handleClose = () => {
    dispatch({ type: 'CLOSE_DIALOG' });
  };
  return (
    <Dialog
      maxWidth={maxWidth}
      disableScrollLock
      fullWidth={true}
      open={message.length > 0}
      onClose={handleClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationsDialog;
