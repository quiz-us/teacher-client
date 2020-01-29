import gql from 'graphql-tag';

export const GET_STUDENTS = gql`
  query getStudents($periodId: ID!) {
    students(periodId: $periodId) {
      firstName
      lastName
      email
      id
      qrCode
    }
  }
`;
