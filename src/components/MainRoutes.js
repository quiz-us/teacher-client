import React from 'react';
import Home from './home/Home';
import { makeStyles } from '@material-ui/core/styles';
// import { useQuery } from '@apollo/react-hooks';
import { Route } from 'react-router-dom';
import DecksContainer from './decks/DecksContainer';
import ClassManager from './class_manager/ClassManager';
import StandardsManager from './standards/StandardsManager';

// import { GET_TEACHER } from '../gql/queries/Teacher';
// import GlobalLoader from './app/GlobalLoader';
// import Onboarding from './onboarding';

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
  // const { data, loading } = useQuery(GET_TEACHER);
  // if (loading) {
  //   return <GlobalLoader />;
  // }

  // const {
  //   teacher: { onboarded },
  // } = data;

  return (
    <div className={classes.root}>
      {/* {!onboarded && <Onboarding />} */}
      <Route exact path="/" component={Home} />
      <Route path="/decks" component={DecksContainer} />
      <Route path="/class-manager" component={ClassManager} />
      <Route path="/standards-manager" component={StandardsManager} />
    </div>
  );
};
