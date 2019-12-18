import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import parseError from '../../util/parseError';

export default ({ error }) => {
  const [message, setMessage] = useState(parseError(error));

  useEffect(() => {
    setMessage(parseError(error));
  }, [error]);

  if (!message) {
    return null;
  }

  return (
    <Modal
      message={message}
      open={!!message}
      title="Error Occured"
      handleClose={() => setMessage('')}
    />
  );
};
