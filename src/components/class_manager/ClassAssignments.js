import React from 'react';
import { Route } from 'react-router-dom';
import AssignmentsIndex from './assignments/AssignmentsIndex';
import AssignmentResults from './assignments/AssignmentResults';

const ClassAssignments = ({ match }) => {
  return (
    <React.Fragment>
      <Route exact path={match.path} component={AssignmentsIndex} />
      <Route
        exact
        path={`${match.path}/:assignmentId`}
        component={AssignmentResults}
      />
    </React.Fragment>
  );
};

export default ClassAssignments;
