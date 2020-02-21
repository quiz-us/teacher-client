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
