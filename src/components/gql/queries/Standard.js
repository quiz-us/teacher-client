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

export const GET_STANDARDS_WITH_CATEGORIES = gql`
  {
    allStandards {
      title
      description
      id
      standardsCategory {
        title
        description
        id
      }
    }
  }
`;
