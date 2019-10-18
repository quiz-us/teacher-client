import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import { useQuery, useMutation } from '@apollo/react-hooks';
import GlobalLoader from '../app/GlobalLoader';
import { GET_PERIOD, EDIT_PERIOD } from '../queries/Period';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles(theme => ({
  heading: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
    height: 80
  },
  buttonsContainer: {
    display: 'flex',
    marginLeft: 20
  },
  iconButtons: {
    height: 30,
    padding: 0,
    marginRight: 5
  },
  field: {
    fontWeight: 'bold',
    fontSize: '2em',
    marginRight: 20
  }
}));

const ClassEdit = ({ match }) => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [editableName, setEditableName] = useState('');
  const { params } = match;
  const { data, loading } = useQuery(GET_PERIOD, {
    variables: { periodId: params.id },
    onCompleted: ({ period }) => {
      setEditableName(period.name);
    }
  });

  const [editPeriod] = useMutation(EDIT_PERIOD, {
    onCompleted: () => setEditMode(false),
    onError: err => console.error(err)
  });

  if (loading) {
    return <GlobalLoader />;
  }
  const {
    period: { name }
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
            type="submit"
            title="save edits"
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            className={classes.iconButtons}
            title="cancel edits"
            onClick={() => setEditMode(false)}
          >
            <CloseIcon />
          </IconButton>
        </form>
      ) : (
        <React.Fragment>
          <h1>{name}</h1>
          <div className={classes.buttonsContainer}>
            <IconButton
              className={classes.iconButtons}
              title="edit class name"
              onClick={() => setEditMode(true)}
            >
              <EditIcon />
            </IconButton>
            <IconButton className={classes.iconButtons} title="delete class">
              <DeleteIcon />
            </IconButton>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default ClassEdit;