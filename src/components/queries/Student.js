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

export const EDIT_STUDENT = gql`
  mutation editStudent($studentId: ID!, $studentParams: StudentParams!) {
    editStudent(studentId: $studentId, studentParams: $studentParams) {
      id
      firstName
      lastName
      email
    }
  }
`
