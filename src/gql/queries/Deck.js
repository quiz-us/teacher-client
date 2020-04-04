import gql from 'graphql-tag';

export const GET_DECK = gql`
  query getDeck($id: ID!) {
    deck(id: $id) {
      name
      description
      id
      questions {
        id
        questionType
        standards {
          title
          id
        }
        richText
        tags {
          name
        }
        questionOptions {
          richText
          correct
          id
        }
      }
    }
  }
`;
