import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import GlobalLoader from '../../app/GlobalLoader';
import { GET_CLASS_ASSIGNMENTS } from '../../queries/Assignment';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Table from '../../table/Table';

const generateColumns = match => [
  {
    Header: 'Name',
    accessor: 'deck.name',
    Cell: ({ cell: { value, row } }) => {
      const assignmentId = row.original.id;
      return (
        <div>
          <Link className="link" to={`${match.url}/${assignmentId}`}>
            {value}
          </Link>
        </div>
      );
    },
  },
  {
    Header: 'Description',
    accessor: 'deck.description',
  },
  {
    Header: 'Instructions',
    accessor: 'instructions',
  },
  {
    Header: 'Due',
    accessor: 'due',
    Cell: ({ cell: { value } }) => moment(value).format('MM-DD-YYYY'),
  },
];

const useStyles = makeStyles({
  root: {
    margin: '50px',
  },
});

const AssignmentsIndex = ({ match }) => {
  const classes = useStyles();
  const { params } = match;
  const { data, loading } = useQuery(GET_CLASS_ASSIGNMENTS, {
    variables: { periodId: params.id },
  });

  const columns = generateColumns(match);

  if (loading) {
    return <GlobalLoader />;
  }
  const { periodAssignments } = data;
  return (
    <div className={classes.root}>
      <h3>Assignments</h3>
      <Table
        className={classes.table}
        columns={columns}
        data={periodAssignments}
      />
    </div>
  );
};

export default AssignmentsIndex;
