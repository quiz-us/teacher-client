import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';
import GlobalLoader from '../app/GlobalLoader';
import { GET_STUDENTS } from '../queries/Student';
import StudentCreator from './StudentCreator';
import Table from '../table/Table';
import { Link } from 'react-router-dom';

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
const ClassRoster = ({ match }) => {
  const classes = useStyles();
  const { params } = match;
  const { data, loading } = useQuery(GET_STUDENTS, {
    variables: { periodId: params.id }
  });
  const { students } = data;

  if (loading) {
    return <GlobalLoader />;
  }
  return (
    <div className={classes.root}>
      <h3>
        Your Students (
        <Link className="link" to={`${match.url}/badges`}>
          QR Badges
        </Link>
        )
      </h3>
      <Table className={classes.table} columns={columns} data={students} />
      <StudentCreator periodId={params.id} />
    </div>
  );
};

export default ClassRoster;
