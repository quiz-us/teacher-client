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
      id
      richText
      questionType
      standards {
        title
        id
      }
      questionOptions {
        id
        question {
          id
        }
        questionId
        correct
        richText
        optionText
      }
      questionText
      tags {
        id
        name
      }
    }
  }
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
