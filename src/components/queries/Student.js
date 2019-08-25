import gql from 'graphql-tag';

export const GET_STUDENTS = gql`
  query getStudents($periodId: ID!) {
    students(periodId: $periodId) {
      firstName
      lastName
      email
      id
    }
  }
`;

export const ENROLL_STUDENT = gql`
  mutation enrollStudent(
    $firstName: String!
    $lastName: String!
    $email: String!
    $periodId: ID!
  ) {
    enrollStudent(
      firstName: $firstName
      lastName: $lastName
      email: $email
      periodId: $periodId
    ) {
      firstName
      lastName
      email
      id
    }
  }
`;
