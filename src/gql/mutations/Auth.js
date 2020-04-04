import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation logInTeacher($email: String!, $password: String!) {
    logInTeacher(email: $email, password: $password) {
      id
      email
      token
    }
  }
`;

export const LOGOUT = gql`
  mutation logOutTeacher {
    logOutTeacher
  }
`;
