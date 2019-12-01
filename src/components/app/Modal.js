import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const Modal = ({ open, message, title, handleClose, children, maxWidth }) => (
  <Dialog maxWidth={maxWidth} open={open} onClose={handleClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {message && message}
      {children && children}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary" autoFocus>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  maxWidth: PropTypes.string,
  children: PropTypes.element,
  message: PropTypes.string,
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Modal;
