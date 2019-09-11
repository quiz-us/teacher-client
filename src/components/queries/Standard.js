import gql from 'graphql-tag';

export const GET_STANDARDS = gql`
  {
    allStandards {
      title
      description
      id
    }
  }
`;
