import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  GET_ASSIGNMENT_RESULTS,
  GET_ASSIGNMENT,
} from '../../queries/Assignment';
import MaterialTable from '../../table/MaterialTable';
import GlobalLoader from '../../app/GlobalLoader';

const parseAndConvert = str => {
  // str should be formatted like `${numCorrect} / ${numAttempted}
  const numStr = str.split('/')[0].trim();
  return parseInt(numStr, 10);
};

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
    customSort: (a, b) => parseAndConvert(a.result) - parseAndConvert(b.result),
  },
];

const AssignmentResults = ({ match }) => {
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

  if (loading || assignmentLoading) {
    return <GlobalLoader />;
  }
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
    </div>
  );
};

export default AssignmentResults;
