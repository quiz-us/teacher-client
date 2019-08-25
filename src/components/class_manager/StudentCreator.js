import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import useForm from '../hooks/useForm';
import { useMutation } from '@apollo/react-hooks';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ENROLL_STUDENT, GET_STUDENTS } from '../queries/Student';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '20px',
    display: 'flex',
    justifyContent: 'center'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '25px',
    width: '100%'
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  field: {
    marginRight: theme.spacing(3),
    width: '25%',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  createButton: {
    [theme.breakpoints.down('sm')]: {
      marginTop: '25px'
    }
  }
}));

const Form = ({ classes, periodId }) => {
  const { inputs, handleInputChange, resetForm } = useForm({
    firstName: '',
    lastName: '',
    email: ''
  });
  const { firstName, lastName, email } = inputs;
  const [enrollStudent, { loading }] = useMutation(ENROLL_STUDENT, {
    onCompleted: data => {
      resetForm();
    },
    refetchQueries: [
      {
        query: GET_STUDENTS,
        variables: { periodId }
      }
    ],
    onError: err => console.error(err)
  });
  const handleSubmit = e => {
    e.preventDefault();
    enrollStudent({ variables: { ...inputs, periodId } });
  };
  return (
    <Card className={classes.formContainer}>
      <h3>Add Student</h3>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          className={classes.field}
          label="First Name"
          name="firstName"
          type="text"
          required
          value={firstName}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.field}
          required
          label="Last Name"
          name="lastName"
          type="text"
          value={lastName}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.field}
          required
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={handleInputChange}
        />
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Button
            className={classes.createButton}
            type="submit"
            color="secondary"
            variant="contained"
          >
            Create
          </Button>
        )}
      </form>
    </Card>
  );
};

const ClassCreator = ({ periodId }) => {
  const classes = useStyles();
  const [activated, setActivated] = useState(false);
  return (
    <div className={classes.root}>
      {activated ? (
        <Form classes={classes} periodId={periodId} />
      ) : (
        <Button
          color="secondary"
          variant="contained"
          onClick={() => setActivated(true)}
        >
          Add Student
        </Button>
      )}
    </div>
  );
};

export default ClassCreator;
