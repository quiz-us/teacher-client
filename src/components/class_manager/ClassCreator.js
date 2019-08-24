import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

const ClassCreator = () => {
  const [activated, setActivated] = useState(false);
  if (activated) {
    return (
      <form>
        <input type="text" />
      </form>
    );
  }
  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() => setActivated(true)}
    >
      Create class
    </Button>
  );
};

export default ClassCreator;
