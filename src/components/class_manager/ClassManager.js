import React from 'react';
import { makeStyles } from '@material-ui/styles';
import ClassCreator from './ClassCreator';
const useStyles = makeStyles({
  root: {}
});

const ClassManager = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div></div>
      <ul>
        <li>Existing class 1</li>
        <li>Existing class 2</li>
      </ul>
      <ClassCreator />
    </div>
  );
};

export default ClassManager;
