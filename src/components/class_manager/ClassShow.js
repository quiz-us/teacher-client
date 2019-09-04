import React from 'react';
import { Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { GET_PERIOD } from '../queries/Period';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ClassRoster from './ClassRoster';
import ClassAssignments from './ClassAssignments';
import { useQuery } from '@apollo/react-hooks';
import GlobalLoader from '../app/GlobalLoader';

const defaultIndex = location => {
  const routeComponents = location.pathname.split('/');
  let tabIndex = 0;
  if (routeComponents.some(component => component === 'assignments')) {
    tabIndex = 1;
  }
  return tabIndex;
};

const useStyles = makeStyles(theme => ({
  root: {
    margin: '25px 40px'
  },
  panel: {
    padding: '10px'
  }
}));

const ClassShow = ({ match, location, history }) => {
  const { params } = match;
  const classes = useStyles();
  const { data: classData, loading: classLoading } = useQuery(GET_PERIOD, {
    variables: { periodId: params.id }
  });
  if (classLoading) {
    return <GlobalLoader />;
  }

  const navigate = path => {
    return () => {
      history.push(path);
    };
  };

  return (
    <div className={classes.root}>
      <h1>{classData.period.name}</h1>
      <Tabs defaultIndex={defaultIndex(location)}>
        <TabList>
          {/* NOTE: not using Link because UX is not ideal with Tab:*/}
          <Tab onClick={navigate(match.url)}>Roster</Tab>
          <Tab onClick={navigate(`${match.url}/assignments`)}>Assignments</Tab>
        </TabList>

        <TabPanel className={classes.panel}>
          <Route exact path={`${match.path}`} component={ClassRoster} />
        </TabPanel>
        <TabPanel className={classes.panel}>
          <Route
            path={`${match.path}/assignments`}
            component={ClassAssignments}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ClassShow;
