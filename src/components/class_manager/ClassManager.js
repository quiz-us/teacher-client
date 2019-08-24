import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ClassCreator from './ClassCreator';
import { useQuery } from '@apollo/react-hooks';
import GlobalLoader from '../app/GlobalLoader';
import { GET_PERIODS } from '../queries/Period';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '40px'
  },
  list: {
    backgroundColor: theme.palette.background.paper
  },
  listText: {
    textAlign: 'center'
  }
}));

const Period = ({ name, classes }) => {
  return (
    <ListItem button>
      <ListItemText primary={name} className={classes.listText} />
    </ListItem>
  );
};

export default function SwitchListSecondary() {
  const { data, loading } = useQuery(GET_PERIODS);
  const { periods } = data;
  const classes = useStyles();
  const numClasses = periods ? periods.length : 0;

  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <div className={classes.root}>
      <h3>Your Classes</h3>
      {numClasses ? (
        <List className={classes.list}>
          {periods.map((period, i) => {
            const isNotLastListedClass = numClasses - 1 !== i;
            return (
              <React.Fragment key={`${period.name}-i`}>
                <Period name={period.name} classes={classes} />
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
