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

export const CREATE_DECK = gql`
  mutation createDeck(
    $questionIds: [ID!]!
    $name: String!
    $description: String
  ) {
    createDeck(
      questionIds: $questionIds
      name: $name
      description: $description
    ) {
      name
    }
  }
`;

export const UPDATE_DECK = gql`
  mutation updateDeck(
    $deckId: ID!
    $questionIds: [ID!]!
    $name: String!
    $description: String
  ) {
    updateDeck(
      deckId: $deckId
      questionIds: $questionIds
      name: $name
      description: $description
    ) {
      name
    }
  }
`;

export const DELETE_DECK = gql`
  mutation deleteDeck($deckId: ID!) {
    deleteDeck(deckId: $deckId) {
      name
    }
  }
`;
