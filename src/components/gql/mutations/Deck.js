import gql from 'graphql-tag';

export const CREATE_DECK = gql`
  mutation createDeck($name: String!, $description: String) {
    createDeck(name: $name, description: $description) {
      name
      id
    }
  }
`;

export const UPDATE_DECK = gql`
  mutation updateDeck($deckId: ID!, $name: String!, $description: String) {
    updateDeck(deckId: $deckId, name: $name, description: $description) {
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
