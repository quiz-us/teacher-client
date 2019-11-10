import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default ({ errorMessage }) => {
  const [message, setMessage] = useState(errorMessage);

  useEffect(() => {
    setMessage(errorMessage);
  }, [errorMessage]);

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
