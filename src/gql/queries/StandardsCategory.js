import gql from 'graphql-tag';

export const GET_STANDARDS_CATEGORIES = gql`
  {
    standardsCategoryIndex {
      title
      description
      id
    }
  }
`;
