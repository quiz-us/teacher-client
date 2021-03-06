import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import { useQuery, useMutation } from '@apollo/react-hooks';
import GlobalLoader from '../app/GlobalLoader';
import { GET_PERIOD } from '../../gql/queries/Period';
import { EDIT_PERIOD, DELETE_PERIOD } from '../../gql/mutations/Period';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ErrorModal from '.././app/ErrorModal';

const useStyles = makeStyles(theme => ({
  heading: {
    display: 'flex',
    alignItems: 'center',
    height: 80,
  },
  buttonsContainer: {
    display: 'flex',
    marginLeft: 20,
  },
  iconButtons: {
    height: 30,
    padding: 0,
    marginRight: 5,
  },
  field: {
    fontWeight: 'bold',
    fontSize: '2em',
    marginRight: 20,
  },
}));

const ClassEdit = ({ history, match }) => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [editableName, setEditableName] = useState('');
  const { params } = match;
  const { data, loading } = useQuery(GET_PERIOD, {
    variables: { periodId: params.id },
    onCompleted: ({ period }) => {
      setEditableName(period.name);
    },
  });
  const [error, setError] = useState(null);

  const [editPeriod] = useMutation(EDIT_PERIOD, {
    onCompleted: () => setEditMode(false),
    onError: err => setError(err),
  });

  const [deletePeriod] = useMutation(DELETE_PERIOD, {
    onCompleted: () => history.push('/class-manager'),
    onError: err => setError(err),
  });

  if (loading) {
    return <GlobalLoader />;
  }
  const {
    period: { name },
  } = data;

  const submit = e => {
    e.preventDefault();
    editPeriod({ variables: { periodId: params.id, name: editableName } });
  };
  return (
    <div className={classes.heading}>
      {editMode ? (
        <form onSubmit={submit}>
          <TextField
            className={classes.field}
            name="classTitle"
            type="text"
            onChange={e => setEditableName(e.target.value)}
            value={editableName}
          />
          <IconButton
            className={classes.iconButtons}
            aria-label="Save Edits"
            type="submit"
            title="save edits"
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            className={classes.iconButtons}
            title="cancel edits"
            aria-label="Cancel Edits"
            onClick={() => setEditMode(false)}
          >
            <CloseIcon />
          </IconButton>
        </form>
      ) : (
        <React.Fragment>
          <h2>{name}</h2>
          <div className={classes.buttonsContainer}>
            <IconButton
              className={classes.iconButtons}
              title="edit class name"
              aria-label="Edit Class Name"
              onClick={() => setEditMode(true)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              className={classes.iconButtons}
              title="delete class"
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to delete this class? This will unenroll all students and then delete this class!'
                  )
                ) {
                  deletePeriod({
                    variables: { periodId: params.id },
                  });
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </React.Fragment>
      )}
      <ErrorModal error={error} />
    </div>
  );
};

export default ClassEdit;
