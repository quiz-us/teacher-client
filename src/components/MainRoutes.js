import React, { useContext, useState } from 'react';
import Home from './home/Home';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Route } from 'react-router-dom';
import DecksContainer from './decks/DecksContainer';
import ClassManager from './class_manager/ClassManager';
import StandardsManager from './standards/StandardsManager';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { GET_COURSES } from '../gql/queries/Course';
import { CREATE_COURSE } from '../gql/mutations/Course';
import GlobalLoader from './app/GlobalLoader';
import parseError from '../util/parseError';
import { NotificationsContext } from './app/notifications/NotificationsContext';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100vh',
  },
  welcomeContainer: {
    display: 'flex',
    marginTop: '40px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    width: '80%',
    margin: '20px',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  field: {
    marginBottom: '25px',
  },
});

export default () => {
  const classes = useStyles();
  const { data, loading } = useQuery(GET_COURSES);
  const [courseName, setCourseName] = useState('');
  const { dispatch: dispatchNotify } = useContext(NotificationsContext);
  const [createCourse, { loading: createCourseLoading }] = useMutation(
    CREATE_COURSE,
    {
      variables: { title: courseName },
      onError: error => {
        dispatchNotify({
          type: 'OPEN_DIALOG',
          dialog: {
            title: 'Error Occured',
            message: parseError(error),
          },
        });
      },
      update: (cache, res) => {
        const { courses } = cache.readQuery({
          query: GET_COURSES,
        });

        cache.writeQuery({
          query: GET_COURSES,
          data: { courses: [...courses, res.data.createCourse] },
        });
      },
    }
  );
  if (loading || createCourseLoading) {
    return <GlobalLoader />;
  }

  const { courses } = data;

  if (!courses.length) {
    return (
      <div className={classes.welcomeContainer}>
        <p>Welcome to Quiz Us! Please create a course.</p>
        <form className={classes.form} onSubmit={createCourse}>
          <TextField
            autoFocus
            label="Course Name"
            type="text"
            className={classes.field}
            name="email"
            value={courseName}
            onChange={e => setCourseName(e.target.value)}
          />
          <Button
            color="primary"
            variant="contained"
            type="submit"
            className={classes.submitButton}
          >
            Create Course
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Route exact path="/" component={Home} />
      <Route path="/decks" component={DecksContainer} />
      <Route path="/class-manager" component={ClassManager} />
      <Route path="/standards-manager" component={StandardsManager} />
    </div>
  );
};
