import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import { NotificationsContext } from './NotificationsContext';

const NotificationsDialog = () => {
  const {
    notifications: { confirmation },
    dispatch,
  } = useContext(NotificationsContext);
  const { message = '', maxWidth = 'lg', func } = confirmation;

  const handleClose = () => {
    dispatch({ type: 'CLOSE_CONFIRMATION' });
  };

  const handleConfirm = () => {
    func();
    handleClose();
  };

  return (
    <Dialog maxWidth={maxWidth} open={message.length > 0} onClose={handleClose}>
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationsDialog;
