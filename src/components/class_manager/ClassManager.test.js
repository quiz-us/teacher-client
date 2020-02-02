import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';

// The component AND the query need to be exported
import ClassManager from './ClassManager';
import { GET_PERIODS } from '../gql/queries/Period';

const generateMocked = data => [
  {
    request: {
      query: GET_PERIODS,
    },
    result: {
      data,
    },
  },
];

describe('<ClassManager />', () => {
  let findByText;
  beforeEach(() => {
    const mockedData = {
      periods: [
        {
          name: 'Period 1',
          id: 1,
        },
        {
          name: 'Period 2',
          id: 2,
        },
      ],
    };
    const mocks = generateMocked(mockedData);
    ({ findByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/class-manager']}>
          <Route path="/class-manager" component={ClassManager} />
        </MemoryRouter>
      </MockedProvider>
    ));
  });

  it('renders without error', async () => {
    const result = await findByText('Period 1');
    expect(result.nodeName).toEqual('SPAN');
  });

  it('renders without error when there are no created periods', async () => {
    const mockedData = {
      periods: [],
    };
    const mocks = generateMocked(mockedData);
    ({ findByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/class-manager']}>
          <Route path="/class-manager" component={ClassManager} />
        </MemoryRouter>
      </MockedProvider>
    ));
    const result = await findByText('Create your first class!');
    expect(result.nodeName).toEqual('DIV');
  });
});
