import gql from 'graphql-tag';

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

export const GET_ASSIGNMENT_RESULTS = gql`
  query getAssignmentsResults($assignmentId: ID!) {
    assignmentResults(assignmentId: $assignmentId) {
      firstname
      lastname
      studentId
      result
    }
  }
`;

export const GET_STUDENT_ASSIGNMENT_RESULTS = gql`
  query($studentId: ID!, $assignmentId: ID!) {
    studentAssignmentResults(
      studentId: $studentId
      assignmentId: $assignmentId
    ) {
      id
      richText
      questionType
      responses {
        createdAt
        id
        questionOption {
          richText
        }
        responseText
        mcCorrect
        selfGrade
      }
    }
  }
`;

export const GET_ASSIGNMENT = gql`
  query getAssignment($assignmentId: ID!) {
    teacherAssignment(assignmentId: $assignmentId) {
      deck {
        name
        questions {
          id
          questionText
        }
      }
      numQuestions
    }
  }
`;
