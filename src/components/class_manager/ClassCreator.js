import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useMutation } from '@apollo/react-hooks';
import { GET_PERIODS } from '../../gql/queries/Period';
import { CREATE_PERIOD } from '../../gql/mutations/Period';
import { NotificationsContext } from '../app/notifications/NotificationsContext';
import parseError from '../../util/parseError';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
  },
}));

const Form = ({ classes }) => {
  const [periodName, setPeriodName] = useState('');
  const { dispatch: dispatchNotify } = useContext(NotificationsContext);
  const [createPeriod, { loading }] = useMutation(CREATE_PERIOD, {
    onCompleted: () => {
      setPeriodName('');
    },
    onError: error => {
      dispatchNotify({
        type: 'OPEN_DIALOG',
        dialog: {
          title: 'Error Occured',
          message: parseError(error),
        },
      });
    },
    refetchQueries: [
      {
        query: GET_PERIODS,
      },
    ],
  });
  const handleSubmit = e => {
    e.preventDefault();
    createPeriod({ variables: { name: periodName } });
  };
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        autoFocus
        label="Class Name"
        type="text"
        value={periodName}
        onChange={e => setPeriodName(e.target.value)}
        InputProps={{
          endAdornment: (
            <React.Fragment>
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <IconButton
                  type="submit"
                  color="primary"
                  aria-label="Create Class"
                >
                  <AddCircleIcon />
                </IconButton>
              )}
            </React.Fragment>
          ),
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
          color="secondary"
          variant="contained"
          onClick={() => setActivated(true)}
        >
          Create Class
        </Button>
      )}
    </div>
  );
};

export default ClassCreator;
