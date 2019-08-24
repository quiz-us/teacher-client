import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '20px',
    display: 'flex',
    justifyContent: 'center'
  },
  form: {
    display: 'flex'
  },
  createButton: {}
}));

const Form = ({ classes }) => {
  return (
    <form className={classes.form}>
      <TextField
        label="Class Name"
        type="text"
        InputProps={{
          endAdornment: (
            <React.Fragment>
              <IconButton color="primary" aria-label="Create Class">
                <AddCircleIcon />
              </IconButton>
            </React.Fragment>
          )
        }}
      />
    </form>
  );
};

const ClassCreator = () => {
  const classes = useStyles();
  const [activated, setActivated] = useState(false);
  return (
    <div className={classes.root}>
      {activated ? (
        <Form classes={classes} />
      ) : (
        <Button
          className={classes.createButton}
          color="secondary"
          variant="contained"
          onClick={() => setActivated(true)}
        >
          Create class
        </Button>
      )}
    </div>
  );
};

export default ClassCreator;
