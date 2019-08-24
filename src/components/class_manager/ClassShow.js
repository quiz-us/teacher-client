import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import GlobalLoader from '../app/GlobalLoader';
import { GET_STUDENTS } from '../queries/Student';

const ClassShow = ({ match }) => {
  const { params } = match;
  const { data, loading } = useQuery(GET_STUDENTS, {
    variables: { periodId: params.id }
  });
  const { students } = data;
  console.log('STUDENT', students);
  if (loading) {
    return <GlobalLoader />;
  }
  return <div>i am class show</div>;
};

export default ClassShow;
