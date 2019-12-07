import React from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ClassRoster from './ClassRoster';
import ClassAssignments from './ClassAssignments';
import ClassMastery from './mastery/ClassMastery';
import ClassEdit from './ClassEdit';

import BadgeIndex from './BadgeIndex';

const defaultIndex = location => {
  const routeComponents = location.pathname.split('/');
  let tabIndex = 0;
  if (routeComponents.some(component => component === 'assignments')) {
    tabIndex = 1;
  } else if (routeComponents.some(component => component === 'mastery')) {
    tabIndex = 2;
  }
  return tabIndex;
};

const useStyles = makeStyles(theme => ({
  root: {
    margin: '25px 40px',
  },
  panel: {
    padding: '10px',
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonsContainer: {
    display: 'flex',
    marginLeft: 20,
  },
  iconButtons: {
    height: 30,
    padding: 0,
    marginRight: 5,
  },
}));

const ClassShow = ({ match, location }) => {
  const classes = useStyles();
  let history = useHistory();

  // Using onClick instead of react-router-dom Link because using Link causes
  // parts of the Tab to not have the correct click navigation behavior:
  return (
    <div className={classes.root}>
      <Link className="link" to="/class-manager">
        Back To All Classes
      </Link>
      <Route path={match.path} component={ClassEdit} />
      <Tabs defaultIndex={defaultIndex(location)}>
        <TabList>
          <Tab onClick={() => history.push(match.url)}>Roster</Tab>

          <Tab onClick={() => history.push(`${match.url}/assignments`)}>
            Assignments
          </Tab>

          <Tab onClick={() => history.push(`${match.url}/mastery`)}>
            Mastery Data
          </Tab>
        </TabList>

        <TabPanel className={classes.panel}>
          <Route exact path={`${match.path}`} component={ClassRoster} />
          <Route exact path={`${match.path}/badges`} component={BadgeIndex} />
        </TabPanel>
        <TabPanel className={classes.panel}>
          <Route
            path={`${match.path}/assignments`}
            component={ClassAssignments}
          />
        </TabPanel>
        <TabPanel className={classes.panel}>
          <Route path={`${match.path}/mastery`} component={ClassMastery} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ClassShow;
