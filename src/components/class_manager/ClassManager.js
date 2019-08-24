import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ClassCreator from './ClassCreator';

const dummyClasses = [
  {
    name: 'Period 1'
  },
  {
    name: 'Period 2'
  },
  {
    name: 'Period 3'
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    margin: '40px'
  },
  list: {
    backgroundColor: theme.palette.background.paper
  }
}));

const Period = ({ name }) => {
  return (
    <ListItem button>
      <ListItemText primary={name} />
    </ListItem>
  );
};

export default function SwitchListSecondary() {
  const classes = useStyles();
  const numClasses = dummyClasses.length;
  return (
    <div className={classes.root}>
      <h3>Your Classes</h3>
      {numClasses ? (
        <List className={classes.list}>
          {dummyClasses.map((period, i) => {
            const isNotLastListedClass = numClasses - 1 !== i;
            return (
              <React.Fragment>
                <Period name={period.name} />
                {isNotLastListedClass && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      ) : (
        <div>Create your first class!</div>
      )}

      <ClassCreator />
    </div>
  );
}
