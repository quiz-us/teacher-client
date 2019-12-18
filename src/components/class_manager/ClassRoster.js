import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from '@apollo/react-hooks';
import GlobalLoader from '../app/GlobalLoader';
import {
  GET_STUDENTS,
  EDIT_STUDENT,
  UNENROLL_STUDENT,
} from '../queries/Student';
import StudentCreator from './StudentCreator';
import MaterialTable from '../table/MaterialTable';
import Modal from '../app/Modal';
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
  },
];

const useStyles = makeStyles({
  root: {
    margin: '50px',
  },
});

const ClassRoster = ({ match }) => {
  const classes = useStyles();
  const { params } = match;
  const { data, loading } = useQuery(GET_STUDENTS, {
    variables: { periodId: params.id },
  });
  const [unenrollStudent] = useMutation(UNENROLL_STUDENT, {
    update: (cache, res) => {
      const { id } = res.data.unenrollStudent;
      const { students } = cache.readQuery({
        query: GET_STUDENTS,
        variables: { periodId: params.id },
      });

      const updatedStudents = students.filter(student => student.id !== id);

      cache.writeQuery({
        query: GET_STUDENTS,
        variables: { periodId: params.id },
        data: { students: updatedStudents },
      });
    },
  });
  const [editStudent] = useMutation(EDIT_STUDENT);
  const [modalState, setModalState] = useState({
    message: '',
    title: '',
    open: false,
  });

  if (loading) {
    return <GlobalLoader />;
  }
  const handleClose = () =>
    setModalState({ open: false, title: '', message: '' });

  const handleError = error => {
    let message = error.message && error.message;
    if (error.graphQLErrors) {
      message = error.graphQLErrors[0].message;
    }
    setModalState({
      open: true,
      title: 'Error Occured',
      message: message,
    });
  };
  const { message, title, open } = modalState;
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
          onRowUpdate: newData =>
            new Promise(resolve => {
              editStudent({
                variables: {
                  studentId: newData.id,
                  studentParams: {
                    firstName: newData.firstName,
                    lastName: newData.lastName,
                    email: newData.email,
                  },
                },
              })
                .then(({ data }) => {
                  resolve(data.editStudent);
                })
                .catch(error => {
                  handleError(error);
                  resolve(error);
                });
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              const { firstName, lastName, id } = oldData;
              unenrollStudent({
                variables: {
                  studentId: id,
                  periodId: params.id,
                },
              })
                .then(({ data }) => {
                  setModalState({
                    title: 'Success!',
                    message: `Successully unenrolled ${firstName} ${lastName} from this class.`,
                    open: true,
                  });
                  resolve(data.unenrollStudent);
                })
                .catch(error => {
                  handleError(error);
                  resolve(error);
                });
            }),
        }}
      />
      <StudentCreator periodId={params.id} />
      <Modal
        message={message}
        title={title}
        open={open}
        handleClose={handleClose}
      />
    </div>
  );
};

export default ClassRoster;
