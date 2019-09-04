import gql from 'graphql-tag';

export const CREATE_ASSIGNMENTS = gql`
  mutation createAssignments(
    $due: DateTime!
    $periodIds: [ID!]!
    $deckId: ID!
    $instructions: String
  ) {
    createAssignments(
      due: $due
      periodIds: $periodIds
      deckId: $deckId
      instructions: $instructions
    ) {
      deck {
        id
        name
      }
      period {
        id
        name
      }
      id
    }
  }
`;

export const GET_CLASS_ASSIGNMENTS = gql`
  query getClassASsignments($periodId: ID!) {
    periodAssignments(periodId: $periodId) {
      id
      instructions
      due
      deck {
        name
        description
      }
    }
  }
`;
