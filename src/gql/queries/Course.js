import gql from 'graphql-tag';

export const GET_COURSES = gql`
  query courses {
    courses {
      id
    }
  }
`;
