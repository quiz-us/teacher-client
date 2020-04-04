import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import faker from 'faker';

// The component AND the query need to be exported
import ClassRoster from './ClassRoster';
import { GET_STUDENTS } from '../../gql/queries/Student';

const {
  name: { firstName, lastName },
  internet: { email },
  random: { uuid },
} = faker;

const generateMocked = data => [
  {
    request: {
      query: GET_STUDENTS,
    },
    result: {
      data,
    },
  },
];

describe('<ClassRoster />', () => {
  let findByText;
  const mockedFirstName = firstName();
  beforeEach(() => {
    const mockedData = {
      students: [
        {
          firstName: mockedFirstName,
          lastName: lastName(),
          email: email(),
          id: 1,
          qrCode: uuid(),
        },
      ],
    };
    const mocks = generateMocked(mockedData);
    ({ findByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/class-manager/1']}>
          <Route exact path="/class-manager/1" component={ClassRoster} />
        </MemoryRouter>
      </MockedProvider>
    ));
  });

  it('renders without error', async () => {
    const result = await findByText(mockedFirstName);
    expect(result.nodeName).toEqual('TD');
  });
});
