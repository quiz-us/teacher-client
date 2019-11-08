import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default ({ open, message, title, handleClose }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary" autoFocus>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);
