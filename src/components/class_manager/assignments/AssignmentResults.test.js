import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';

// The component AND the query need to be exported
import AssignmentResults from './AssignmentResults';
import {
  GET_ASSIGNMENT_RESULTS,
  GET_ASSIGNMENT
} from '../../queries/Assignment';

const mocks = [
  {
    request: {
      query: GET_ASSIGNMENT,
      variables: {
        assignmentId: 1
      }
    },
    result: {
      data: {
        teacherAssignment: {
          deck: {
            name: 'Test Deck',
            questions: [{ id: '1', questionText: 'What is symbol for Oxygen?' }]
          }
        }
      }
    }
  },
  {
    request: {
      query: GET_ASSIGNMENT_RESULTS,
      variables: {
        assignmentId: 1
      }
    },
    result: {
      data: {
        assignmentResults: [
          {
            fullname: 'Joshua Ling',
            answer: JSON.stringify([
              {
                questionId: 1,
                questionType: 'Free Response',
                questionText: 'What is symbol for Oxygen?',
                responseText: 'I am not sure',
                selfGrade: 1,
                mcCorrect: null
              }
            ])
          }
        ]
      }
    }
  }
];

it('renders without error', async () => {
  const { findByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AssignmentResults match={{ params: { assignmentId: 1 } }} />
    </MockedProvider>
  );

  const result = await findByText('Joshua Ling');
  expect(result.nodeName).toEqual('TD');
});
