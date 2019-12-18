import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';

// The component AND the query need to be exported
import ClassMastery from './ClassMastery';
import { GET_PERIOD_SUMMARY } from '../../queries/Period';

const mocks = [
  {
    request: {
      query: GET_PERIOD_SUMMARY,
      variables: {
        periodId: 1,
      },
    },
    result: {
      data: {
        periodStandardsSummary: [
          {
            standard: {
              title: 'Standard Title 1',
              description: 'Standard Description 1',
            },
            numCorrect: 0,
            numAttempts: 0,
            percentCorrect: 0,
          },
        ],
      },
    },
  },
];

it('renders without error', async () => {
  const { findByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ClassMastery match={{ params: { id: 1 } }} />
    </MockedProvider>
  );

  const result = await findByText('Standard Title 1');
  expect(result.nodeName).toEqual('TD');
});
