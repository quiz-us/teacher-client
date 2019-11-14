import React, { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  GET_ASSIGNMENT_RESULTS,
  GET_ASSIGNMENT,
} from '../../queries/Assignment';
import StickyColumnTable from '../../table/StickyColumnTable';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ClearIcon from '@material-ui/icons/Clear';
import GlobalLoader from '../../app/GlobalLoader';

const generateColumns = (data = {}) => {
  const columns = [
    {
      title: 'Student',
      field: 'fullname',
    },
  ];
  if (!data.teacherAssignment) {
    return columns;
  }
  data.teacherAssignment.deck.questions.forEach(({ questionText, id }) => {
    columns.push({
      title: questionText,
      field: id,
      render: rowData => {
        if (!rowData[id]) {
          return null;
        }
        const { questionType, mcCorrect, selfGrade } = rowData[id];

        if (questionType === 'Free Response') {
          return selfGrade;
        } else if (questionType === 'Multiple Choice') {
          return mcCorrect ? <CheckCircleIcon /> : <ClearIcon />;
        }

        return null;
      },
    });
  });
  return columns;
};

const generateData = (data = {}) => {
  const parsedData = [];
  if (data.assignmentResults) {
    data.assignmentResults.forEach(({ fullname, answer }) => {
      const parsedAnswers = {};
      JSON.parse(answer).forEach(answer => {
        if (!parsedAnswers[answer.questionId]) {
          parsedAnswers[answer.questionId] = answer;
        }
      });
      parsedData.push({
        fullname,
        ...parsedAnswers,
      });
    });
  }
  return parsedData;
};

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
  const parsedData = useMemo(() => generateData(data), [data]);
  const columns = useMemo(() => generateColumns(assignmentData), [
    assignmentData,
  ]);
  if (loading || assignmentLoading) {
    return <GlobalLoader />;
  }
  const { teacherAssignment = { deck: {} } } = assignmentData;
  const name = teacherAssignment.deck.name || '';
  console.log(columns);
  return (
    <div>
      <StickyColumnTable
        columns={columns}
        data={parsedData}
        title={`${name} Results`}
        options={{
          search: true,
          sorting: false,
        }}
      />
    </div>
  );
};

export default AssignmentResults;
