import gql from 'graphql-tag';

export const CREATE_COURSE = gql`
  mutation createCourse($title: String!) {
    createCourse(title: $title) {
      id
    }
  }
`;
