import gql from 'graphql-tag';
import { QUESTION_ATTRIBUTES } from '../fragments/Question';

export const CREATE_QUESTION = gql`
  mutation createQuestion(
    $questionType: String!
    $standardId: ID!
    $tags: [String!]
    $richText: String!
    $questionPlaintext: String!
    $questionOptions: [String!]
  ) {
    createQuestion(
      questionType: $questionType
      standardId: $standardId
      tags: $tags
      richText: $richText
      questionPlaintext: $questionPlaintext
      questionOptions: $questionOptions
    ) {
      ...questionAttributes
    }
  }
  ${QUESTION_ATTRIBUTES}
`;

export const UPDATE_QUESTION = gql`
  mutation updateQuestion(
    $id: ID!
    $standardId: ID
    $tags: [String!]
    $richText: String
    $questionPlaintext: String
    $questionOptions: [String!]
  ) {
    updateQuestion(
      id: $id
      standardId: $standardId
      tags: $tags
      richText: $richText
      questionPlaintext: $questionPlaintext
      questionOptions: $questionOptions
    ) {
      id
      questionType
      standards {
        id
        title
      }
      questionText
      richText
      tags {
        id
        name
      }
      questionOptions {
        id
        correct
        optionText
        richText
      }
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation deleteQuestion($questionId: ID!) {
    deleteQuestion(questionId: $questionId) {
      id
    }
  }
`;
