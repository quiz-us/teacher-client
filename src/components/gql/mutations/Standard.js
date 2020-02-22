import gql from 'graphql-tag';

export const CREATE_STANDARD = gql`
  mutation createStandard(
    $categoryId: ID!
    $title: String!
    $description: String!
  ) {
    createStandard(
      categoryId: $categoryId
      title: $title
      description: $description
    ) {
      id
      title
      description
      standardsCategory {
        id
        title
      }
    }
  }
`;

export const EDIT_STANDARD = gql`
  mutation editStandard($id: ID!, $title: String!, $description: String!) {
    editStandard(id: $id, title: $title, description: $description) {
      title
      description
      id
      standardsCategory {
        id
        title
      }
    }
  }
`;

export const DELETE_STANDARD = gql`
  mutation deleteStandard($id: ID!) {
    deleteStandard(id: $id) {
      id
      title
    }
  }
`;
