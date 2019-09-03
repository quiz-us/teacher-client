import React from 'react';
import { Link, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ClassRoster from './ClassRoster';
import ClassAssignments from './ClassAssignments';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '20px'
  },
  panel: {
    padding: '10px'
  }
}));

const ClassShow = ({ match }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Tabs>
        <TabList>
          <Tab>
            <Link to={`${match.url}`}>Roster</Link>
          </Tab>
          <Tab>
            <Link to={`${match.url}/assignments`}>Assignments</Link>
          </Tab>
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
