import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';

// The component AND the query need to be exported
import MainRoutes from './MainRoutes';
import { GET_COURSES } from '../gql/queries/Course';

const mocks = [
  {
    request: {
      query: GET_COURSES,
    },
    result: {
      data: {
        courses: [],
      },
    },
  },
];

describe('<MainRoutes />', () => {
  let findByText;
  beforeEach(() => {
    ({ findByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MainRoutes />
      </MockedProvider>
    ));
  });

  it('renders create course form if no courses exist', async () => {
    const result = await findByText(
      'Welcome to Quiz Us! Please create a course.'
    );
    expect(result.nodeName).toEqual('P');
  });
});
