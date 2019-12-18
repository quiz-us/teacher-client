import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import faker from 'faker';

// The component AND the query need to be exported
import StudentMastery from './StudentMastery';
import { GET_PERIOD_MASTERY } from '../../queries/Period';
import { GET_STUDENTS } from '../../queries/Student';

const {
  name: { firstName, lastName },
  random: { number },
  internet: { email },
  random: { uuid, alphaNumeric },
} = faker;

const studentId = number().toString();
const mastery = number();
const mockedFirstName = firstName();
const mockedLastName = lastName();
const standardId = number();
const standardTitle = alphaNumeric();

const mocks = [
  {
    request: {
      query: GET_PERIOD_MASTERY,
      variables: {
        periodId: 1,
      },
    },
    result: {
      data: {
        periodStandardsMastery: [
          {
            standard: {
              title: standardTitle,
              id: standardId,
            },
            studentPerformance: JSON.stringify({
              [studentId]: mastery,
            }),
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_STUDENTS,
      variables: {
        periodId: 1,
      },
    },
    result: {
      data: {
        students: [
          {
            id: studentId,
            firstName: mockedFirstName,
            lastName: mockedLastName,
            email: email(),
            qrCode: uuid(),
          },
        ],
      },
    },
  },
];

it('renders without error', async () => {
  const { findByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <StudentMastery match={{ params: { id: 1 } }} />
    </MockedProvider>
  );

  const result = await findByText(`${mockedFirstName} ${mockedLastName}`);
  expect(result.nodeName).toEqual('DIV');

  const standardResult = await findByText(standardTitle);
  expect(standardResult.nodeName).toEqual('TD');
});
