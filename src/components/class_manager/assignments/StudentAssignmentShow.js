import React from 'react';
import PropTypes from 'prop-types';

const StudentAssignmentShow = ({ studentId, assignmentId }) => {
  return <div>{studentId}</div>;
};

StudentAssignmentShow.propTypes = {
  studentId: PropTypes.string, // could start as null if no student is selected
  assignmentId: PropTypes.string.isRequired,
};

export default StudentAssignmentShow;
