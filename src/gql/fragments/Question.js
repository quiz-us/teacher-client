import gql from 'graphql-tag';

export const QUESTION_ATTRIBUTES = gql`
  fragment questionAttributes on Question {
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
`;
