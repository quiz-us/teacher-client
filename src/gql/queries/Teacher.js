import gql from 'graphql-tag';

export const GET_TEACHER = gql`
  query teacher {
    teacher {
      id
      onboarded
    }
  }
`;
