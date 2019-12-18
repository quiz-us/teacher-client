import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ClassCreator from './ClassCreator';
import { useQuery } from '@apollo/react-hooks';
import GlobalLoader from '../app/GlobalLoader';
import { Route } from 'react-router-dom';
import { GET_PERIODS } from '../queries/Period';
import { Link } from 'react-router-dom';
import ClassShow from './ClassShow';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '40px',
  },
  list: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const Period = ({ name, id }) => {
  return (
    <Link to={`/class-manager/${id}`}>
      <ListItem button>
        <ListItemText primary={name} />
      </ListItem>
    </Link>
  );
};

const ClassManager = () => {
  const { data, loading } = useQuery(GET_PERIODS, {
    fetchPolicy: 'network-only',
  });
  const classes = useStyles();

  if (loading) {
    return <GlobalLoader />;
  }
  const { periods } = data;
  const numClasses = periods ? periods.length : 0;

  return (
    <div className={classes.root}>
      <h3>Your Classes</h3>
      {numClasses ? (
        <List className={classes.list}>
          {periods.map((period, i) => {
            const { name, id } = period;
            const isNotLastListedClass = numClasses - 1 !== i;
            return (
              <React.Fragment key={`${name}-${id}`}>
                <Period id={id} name={name} />
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
};

export default ({ match }) => (
  <React.Fragment>
    <Route exact path="/class-manager" component={ClassManager} />
    <Route path={`${match.path}/:id`} component={ClassShow} />
  </React.Fragment>
);
