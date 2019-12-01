import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Modal from '../../../app/Modal';
import Responses from './Responses';
import Question from './Question';
import { GET_STUDENT_ASSIGNMENT_RESULTS } from '../../../queries/Assignment';

const useStyles = makeStyles({
  container: {
    marginBottom: '10px',
  },
  questionContainer: {
    margin: '25px',
  },
});

const AssignmentShow = ({ studentId, assignmentId }) => {
  const classes = useStyles();
  const { data, loading } = useQuery(GET_STUDENT_ASSIGNMENT_RESULTS, {
    variables: { assignmentId, studentId },
  });
  if (loading) {
    return <LinearProgress />;
  }
  const { studentAssignmentResults } = data;
  return (
    <div>
      {studentAssignmentResults.map(({ responses, ...question }, i) => {
        return (
          <div
            className={classes.container}
            key={`assignment-show-${question.id}`}
          >
            <h2>{`${i + 1}.)`}</h2>
            <div className={classes.questionContainer}>
              <Question question={question} />
              <Responses responses={responses} />
            </div>
            <hr />
          </div>
        );
      })}
    </div>
  );
};

AssignmentShow.propTypes = {
  studentId: PropTypes.string,
  assignmentId: PropTypes.string.isRequired,
};

const StudentAssignmentShow = ({
  selectedStudent: { studentId, firstname, lastname },
  assignmentId,
  handleClose,
}) => {
  return (
    <Modal
      open={!!studentId}
      title={`${firstname} ${lastname}`}
      handleClose={handleClose}
    >
      {studentId && (
        <AssignmentShow studentId={studentId} assignmentId={assignmentId} />
      )}
    </Modal>
  );
};

StudentAssignmentShow.propTypes = {
  selectedStudent: PropTypes.shape({
    studentId: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  assignmentId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default StudentAssignmentShow;
