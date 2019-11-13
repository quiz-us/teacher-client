import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';
import { prefix } from 'inline-style-prefixer';
import {
  GET_ASSIGNMENT_RESULTS,
  GET_ASSIGNMENT,
} from '../../queries/Assignment';
import MaterialTable from 'material-table';
import tableIcons from '../../table/TableIcons';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ClearIcon from '@material-ui/icons/Clear';
import GlobalLoader from '../../app/GlobalLoader';

const useStyles = makeStyles(theme => ({
  root: {
    'td:nth-child(1)': {
      position: 'sticky',
    },
  },
  expandedContainer: {
    margin: '20px',
    overflow: 'scroll',
    height: '180px',
    padding: '20px',
  },
  expandedRow: {
    marginBottom: '20px',
  },
  expandedQuestion: {
    fontWeight: 'bold',
  },
}));

const generateColumns = (data = {}) => {
  const cellStyle = {
    backgroundColor: '#039be5',
    color: '#FFF',
    zIndex: 11,
    position: 'sticky',
    left: 0,
  };
  const headerStyle = prefix({
    backgroundColor: '#039be5',
    position: 'sticky',
    left: 0,
    zIndex: 11,
  });
  const columns = [
    {
      title: 'Student',
      field: 'fullname',
      cellStyle,
      headerStyle,
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
  const parsedData = useMemo(() => generateData(data), [data]);
  const columns = useMemo(() => generateColumns(assignmentData), [
    assignmentData,
  ]);
  if (loading || assignmentLoading) {
    return <GlobalLoader />;
  }
  const { teacherAssignment = { deck: {} } } = assignmentData;
  const name = teacherAssignment.deck.name || '';
  return (
    <div className={classes.root}>
      <MaterialTable
        icons={tableIcons}
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
