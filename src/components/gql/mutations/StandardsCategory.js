import gql from 'graphql-tag';

export const CREATE_STANDARDS_CATEGORY = gql`
  mutation createStandardsCategory($title: String!, $description: String!) {
    createStandardsCategory(title: $title, description: $description) {
      title
      description
      id
    }
  }
`;

export const DELETE_STANDARDS_CATEGORY = gql`
  mutation deleteStandardsCategory($id: ID!) {
    deleteStandardsCategory(id: $id) {
      id
    }
  }
`;
