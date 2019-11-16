import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../app/Modal';

const StudentAssignmentShow = ({ studentId, assignmentId, handleClose }) => {
  return (
    <Modal
      open={!!studentId}
      message={''}
      title={studentId}
      handleClose={handleClose}
    />
  );
};

StudentAssignmentShow.propTypes = {
  studentId: PropTypes.string, // could start as null if no student is selected
  assignmentId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default StudentAssignmentShow;
