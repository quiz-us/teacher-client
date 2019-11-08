import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useQuery, useMutation } from '@apollo/react-hooks';
import GlobalLoader from '../app/GlobalLoader';
import { GET_STUDENTS, EDIT_STUDENT } from '../queries/Student';
import StudentCreator from './StudentCreator';
import MaterialTable from '../table/MaterialTable';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'First Name',
    field: 'firstName',
  },
  {
    title: 'Last Name',
    field: 'lastName',
  },
  {
    title: 'Email',
    field: 'email',
  }
];

const useStyles = makeStyles({
  root: {
    margin: '50px',
  }
});

const ClassRoster = ({ match }) => {
  const classes = useStyles();
  const { params } = match;
  const { data, loading } = useQuery(GET_STUDENTS, {
    variables: { periodId: params.id }
  });
  const [editStudent] = useMutation(EDIT_STUDENT);

  if (loading) {
    return <GlobalLoader />;
  }

  const { students } = data;
  return (
    <div className={classes.root}>
      <h3>
        Your Students (
        <Link className="link" to={`${match.url}/badges`}>
          QR Badges
        </Link>
        )
      </h3>
      <MaterialTable
        columns={columns}
        data={students}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              editStudent({ variables: {
                studentId: newData.id,
                studentParams: {
                  firstName: newData.firstName,
                  lastName: newData.lastName,
                  email: newData.email
                }
              }}).then(({ data }) => {
                resolve(data.editStudent);
              }).catch(error => {
                resolve(error);
              })
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                  console.log('hi')
                  resolve();
                }, 1000);
            })
        }}
      />
      <StudentCreator periodId={params.id} />
    </div>
  );
};

export default ClassRoster;
