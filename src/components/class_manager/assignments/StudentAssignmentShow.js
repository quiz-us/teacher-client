import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ReadOnly from '../../editor/ReadOnly';
import { GET_STUDENT_ASSIGNMENT_RESULTS } from '../../queries/Assignment';

const Modal = ({ open, children, title, handleClose }) => (
  <Dialog maxWidth="xl" open={open} onClose={handleClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{children}</DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary" autoFocus>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

const AssignmentShow = ({ studentId, assignmentId }) => {
  const { data, loading } = useQuery(GET_STUDENT_ASSIGNMENT_RESULTS, {
    variables: { assignmentId, studentId },
  });
  console.log('HI', data);
  if (loading) {
    return null;
  }
  const { studentAssignmentResults } = data;
  return (
    <div>
      {studentAssignmentResults.map(
        ({ richText, id, responses, questionType }) => {
          return (
            <div>
              <ReadOnly
                key={`student-question-${id}`}
                value={JSON.parse(richText)}
              />
              {responses.length ? (
                responses.map((response, i) => {
                  const {
                    responseText,
                    createdAt,
                    selfGrade,
                    mcCorrect,
                  } = response;
                  const Answer = responseText
                    ? () => <div>{responseText}</div>
                    : () => (
                        <ReadOnly
                          key={`response-${response.id}`}
                          value={JSON.parse(response.questionOption.richText)}
                        />
                      );
                  return (
                    <div>
                      <div>{`Response Number #${i + 1}:`}</div>
                      <Answer />
                    </div>
                  );
                })
              ) : (
                <div>No answer yet</div>
              )}
            </div>
          );
        }
      )}
    </div>
  );
  // fetch student assignment and display it in the modal
};

const StudentAssignmentShow = ({ studentId, assignmentId, handleClose }) => {
  return (
    <Modal open={!!studentId} title={studentId} handleClose={handleClose}>
      <AssignmentShow studentId={studentId} assignmentId={assignmentId} />
    </Modal>
  );
};

StudentAssignmentShow.propTypes = {
  studentId: PropTypes.string, // could start as null if no student is selected
  assignmentId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default StudentAssignmentShow;
