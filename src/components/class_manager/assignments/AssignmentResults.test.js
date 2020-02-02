import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';

// The component AND the query need to be exported
import AssignmentResults from './AssignmentResults';
import {
  GET_ASSIGNMENT_RESULTS,
  GET_ASSIGNMENT,
} from '../../gql/queries/Assignment';

const mocks = [
  {
    request: {
      query: GET_ASSIGNMENT,
      variables: {
        assignmentId: '1',
      },
    },
    result: {
      data: {
        teacherAssignment: {
          deck: {
            name: 'Test Deck',
            questions: [
              { id: 1, questionText: 'whoa' },
              { id: 2, questionText: 'yay' },
            ],
          },
          numQuestions: 2,
        },
      },
    },
  },
  {
    request: {
      query: GET_ASSIGNMENT_RESULTS,
      variables: {
        assignmentId: '1',
      },
    },
    result: {
      data: {
        assignmentResults: [
          {
            firstname: 'Joshua',
            lastname: 'Ling',
            studentId: 8,
            result: '2 / 5',
          },
        ],
      },
    },
  },
];
it('renders without error', async () => {
  const { findByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AssignmentResults match={{ params: { assignmentId: '1' } }} />
    </MockedProvider>
  );

  const result = await findByText('Joshua');
  expect(result.nodeName).toEqual('TD');
});
