import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';
import GlobalLoader from '../app/GlobalLoader';
import { GET_STUDENTS } from '../queries/Student';
import StudentCreator from './StudentCreator';
import Table from '../table/Table';

const columns = [
  {
    Header: 'First Name',
    accessor: 'firstName'
  },
  {
    Header: 'Last Name',
    accessor: 'lastName'
  },
  {
    Header: 'Email',
    accessor: 'email'
  }
];

const useStyles = makeStyles({
  root: {
    margin: '50px'
  }
});
const ClassShow = ({ match }) => {
  const classes = useStyles();
  const { params } = match;
  const { data, loading } = useQuery(GET_STUDENTS, {
    variables: { periodId: params.id }
  });
  const { students } = data;
  console.log('STUDENT', students);
  if (loading) {
    return <GlobalLoader />;
  }
  return (
    <div className={classes.root}>
      <h3>Your Students</h3>
      <Table className={classes.table} columns={columns} data={students} />
      <StudentCreator periodId={params.id} />
    </div>
  );
};

export default ClassShow;
