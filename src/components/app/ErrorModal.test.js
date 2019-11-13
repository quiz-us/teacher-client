import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ErrorModal from './ErrorModal';

describe('<ErrorModal />', () => {
  let getByText, queryByText;

  it('renders null if there is no error', () => {
    ({ queryByText } = render(<ErrorModal error={undefined} />));
    expect(queryByText('Error Occured')).toBeNull();
  });

  it('parses the passed in error object and renders the message', async () => {
    const error = {
      message: 'Uh oh!',
    };
    ({ queryByText } = render(<ErrorModal error={error} />));
    expect(queryByText('Uh oh!')).not.toBeNull();
  });

  it('parses graphql errors and renders the message', async () => {
    const graphQLError = {
      graphQLErrors: [{ message: 'You done goofed!' }],
      message: 'Another error',
    };
    ({ queryByText } = render(<ErrorModal error={graphQLError} />));
    expect(queryByText('You done goofed!')).not.toBeNull();
    expect(queryByText('Another error')).toBeNull();
  });

  it('closes when you click close', async () => {
    const graphQLError = {
      graphQLErrors: [{ message: 'You done goofed!' }],
      message: 'Another error',
    };
    ({ queryByText, getByText } = render(<ErrorModal error={graphQLError} />));
    expect(queryByText('You done goofed!')).not.toBeNull();

    fireEvent.click(getByText('Close'));
    expect(queryByText('You done goofed!')).toBeNull();
  });
});
