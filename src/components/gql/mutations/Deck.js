import gql from 'graphql-tag';
import { QUESTION_ATTRIBUTES } from '../fragments/Question';

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

export const ADD_QUESTION_TO_DECK = gql`
  mutation($deckId: ID!, $questionId: ID!) {
    addQuestionToDeck(deckId: $deckId, questionId: $questionId) {
      question {
        ...questionAttributes
      }
    }
  }
  ${QUESTION_ATTRIBUTES}
`;

export const REMOVE_QUESTION_FROM_DECK = gql`
  mutation($deckId: ID!, $questionId: ID!) {
    removeQuestionFromDeck(deckId: $deckId, questionId: $questionId) {
      question {
        id
      }
    }
  }
`;
