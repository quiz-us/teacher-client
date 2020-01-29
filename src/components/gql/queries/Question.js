import gql from 'graphql-tag';

export const GET_QUESTION = gql`
  query getQuestion($id: ID!) {
    question(id: $id) {
      id
      questionType
      questionText
      richText
      standards {
        id
        title
      }
      tags {
        id
        name
      }
      questionOptions {
        id
        correct
        richText
      }
    }
  }
`;

export const GET_QUESTIONS = gql`
  query getQuestions($standardId: ID, $keyWords: String) {
    questions(standardId: $standardId, keyWords: $keyWords) {
      questionText
      questionType
      richText
      id
      standards {
        id
        title
      }
      tags {
        id
        name
      }
      questionOptions {
        correct
        id
        richText
      }
    }
  }
`;
