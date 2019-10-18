import gql from 'graphql-tag';

export const GET_QUESTIONS = gql`
  query getQuestions($standardId: ID, $keyWords: String, $emptyQuery: Boolean) {
    questions(
      standardId: $standardId
      keyWords: $keyWords
      emptyQuery: $emptyQuery
    ) {
      questionText
      questionType
      richText
      id
      standards {
        title
      }
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
`;

export const DELETE_QUESTION = gql`
  mutation deleteQuestion($questionId: ID!) {
    deleteQuestion(questionId: $questionId) {
      id
    }
  }
`;