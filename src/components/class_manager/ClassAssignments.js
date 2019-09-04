import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';
import GlobalLoader from '../app/GlobalLoader';
import { GET_CLASS_ASSIGNMENTS } from '../queries/Assignment';
import Table from '../table/Table';

const columns = [
  {
    Header: 'Name',
    accessor: 'deck.name'
  },
  {
    Header: 'Description',
    accessor: 'deck.description'
  },
  {
    Header: 'Instructions',
    accessor: 'instructions'
  }
  // {
  //   Header: 'Due',
  //   accessor: 'due'
  // }
];

const useStyles = makeStyles({
  root: {
    margin: '50px'
  }
});
const ClassAssignments = ({ match }) => {
  const classes = useStyles();
  const { params } = match;
  const { data, loading } = useQuery(GET_CLASS_ASSIGNMENTS, {
    variables: { periodId: params.id }
  });
  const { periodAssignments } = data;

  if (loading) {
    return <GlobalLoader />;
  }
  console.log(data);
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

export default ClassAssignments;
