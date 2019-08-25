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
