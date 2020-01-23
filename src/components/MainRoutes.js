import React from 'react';
import Home from './home/Home';
import { makeStyles } from '@material-ui/core/styles';
import { Route } from 'react-router-dom';
import DecksContainer from './decks/DecksContainer';
import ClassManager from './class_manager/ClassManager';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100vh',
  },
});

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Route exact path="/" component={Home} />
      <Route path="/decks" component={DecksContainer} />
      <Route path="/class-manager" component={ClassManager} />
    </div>
  );
};
