import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import ButtonLink from '../../jss/ButtonLink';
import StudentAssignmentShow from './StudentAssignmentShow';
import {
  GET_ASSIGNMENT_RESULTS,
  GET_ASSIGNMENT,
} from '../../queries/Assignment';
import MaterialTable from '../../table/MaterialTable';
import GlobalLoader from '../../app/GlobalLoader';

const useStyles = makeStyles({
  buttonLink: ButtonLink,
});

const parseAndConvert = str => {
  // str should be formatted like `${numCorrect} / ${numAttempted}
  const numStr = str.split('/')[0].trim();
  return parseInt(numStr, 10);
};

const AssignmentResults = ({ match }) => {
  const classes = useStyles();
  const {
    params: { assignmentId },
  } = match;
  const { data: assignmentData, loading: assignmentLoading } = useQuery(
    GET_ASSIGNMENT,
    {
      variables: { assignmentId },
    }
  );
  const { data, loading } = useQuery(GET_ASSIGNMENT_RESULTS, {
    variables: { assignmentId },
  });
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  if (loading || assignmentLoading) {
    return <GlobalLoader />;
  }

  const columns = [
    {
      title: 'First Name',
      field: 'firstname',
    },
    {
      title: 'Last Name',
      field: 'lastname',
      defaultSort: 'asc',
    },
    {
      title: 'Results (total correct / total attempts)',
      field: 'result',
      render: rowData => (
        <button
          className={classes.buttonLink}
          onClick={() => setSelectedStudentId(rowData.studentId)}
        >
          {rowData.result}
        </button>
      ),
      customSort: (a, b) =>
        parseAndConvert(a.result) - parseAndConvert(b.result),
    },
  ];

  const { teacherAssignment = { deck: {} } } = assignmentData;
  const {
    deck: { name = '' },
    numQuestions,
  } = teacherAssignment;
  return (
    <div>
      <MaterialTable
        columns={columns}
        data={data.assignmentResults}
        title={`${name} Results (${numQuestions} total questions)`}
      />
      <StudentAssignmentShow
        studentId={selectedStudentId}
        assignmentId={assignmentId}
        handleClose={() => setSelectedStudentId(null)}
      />
    </div>
  );
};

AssignmentResults.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      assignmentId: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default AssignmentResults;
