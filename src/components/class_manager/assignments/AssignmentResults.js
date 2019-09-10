import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';
import { prefix } from 'inline-style-prefixer';
import {
  GET_ASSIGNMENT_RESULTS,
  GET_ASSIGNMENT
} from '../../queries/Assignment';
import MaterialTable from 'material-table';
import tableIcons from '../../table/TableIcons';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ClearIcon from '@material-ui/icons/Clear';
import GlobalLoader from '../../app/GlobalLoader';

const useStyles = makeStyles(theme => ({
  expandedContainer: {
    margin: '20px',
    overflow: 'scroll',
    height: '180px',
    padding: '20px'
  },
  expandedRow: {
    marginBottom: '20px'
  },
  expandedQuestion: {
    fontWeight: 'bold'
  }
}));

const generateColumns = data => {
  const cellStyle = prefix({
    backgroundColor: '#039be5',
    color: '#FFF',
    position: 'sticky',
    left: 0
  });
  const headerStyle = prefix({
    backgroundColor: '#039be5',
    position: 'sticky',
    left: 0,
    zIndex: 11
  });
  const columns = [
    {
      title: 'Student',
      field: 'fullname',
      cellStyle,
      headerStyle
    }
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
      }
    });
  });
  return columns;
};

const generateData = data => {
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
        ...parsedAnswers
      });
    });
  }
  return parsedData;
};

const AssignmentResults = ({ match }) => {
  const classes = useStyles();
  const {
    params: { assignmentId }
  } = match;
  const { data: assignmentData, loading: assignmentLoading } = useQuery(
    GET_ASSIGNMENT,
    {
      variables: { assignmentId }
    }
  );
  const { data, loading } = useQuery(GET_ASSIGNMENT_RESULTS, {
    variables: { assignmentId }
  });
  const parsedData = useMemo(() => generateData(data), [data]);
  const columns = useMemo(() => generateColumns(assignmentData), [
    assignmentData
  ]);
  if (loading || assignmentLoading) {
    return <GlobalLoader />;
  }
  const { teacherAssignment = { deck: {} } } = assignmentData;
  const name = teacherAssignment.deck.name || '';
  const headerStyle = prefix({
    backgroundColor: '#01579b',
    color: '#FFF',
    position: 'sticky',
    top: 0
  });
  return (
    <div className="results-table">
      <MaterialTable
        icons={tableIcons}
        columns={columns}
        data={parsedData}
        title={`${name} Results`}
        detailPanel={rowData => {
          return (
            <div className={classes.expandedContainer}>
              {Object.keys(rowData).map((columnName, i) => {
                const question = rowData[columnName];
                if (!question.questionId) {
                  return null;
                }
                const {
                  responseText,
                  questionText,
                  mcCorrect,
                  questionType,
                  selfGrade,
                  questionId
                } = question;
                let result;
                if (questionType === 'Free Response') {
                  result = selfGrade;
                } else if (questionType === 'Multiple Choice') {
                  result = mcCorrect ? '✓' : 'x';
                }
                return (
                  <div
                    key={`expanded-${questionId}`}
                    className={classes.expandedRow}
                  >
                    <div className={classes.expandedQuestion}>{`${i +
                      1}. ${questionText}`}</div>
                    <div>{`[${result}] ${responseText}`}</div>
                  </div>
                );
              })}
            </div>
          );
        }}
        options={{
          headerStyle,
          search: false,
          sorting: false
        }}
      />
    </div>
  );
};

export default AssignmentResults;
