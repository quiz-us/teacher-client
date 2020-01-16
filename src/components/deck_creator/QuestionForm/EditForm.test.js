import React from 'react';
import Plain from 'slate-plain-serializer';
import { MockedProvider } from '@apollo/react-testing';
import { render, fireEvent } from '@testing-library/react';

import EditForm from './EditForm';
import { GET_STANDARDS } from '../../queries/Standard';

// https://www.polvara.me/posts/testing-a-custom-select-with-react-testing-library/
jest.mock(
  '@material-ui/core/Select',
  () => ({ children, value, onChange, inputProps }) => {
    function handleChange(event) {
      onChange(event);
    }
    return (
      <div>
        <div>{`SELECTED: ${value}`}</div>
        <select
          data-testid={inputProps.id}
          value={value}
          onChange={handleChange}
        >
          {children.map(({ props: { children, value: optionVal } }) => {
            return (
              <option key={optionVal} value={optionVal}>
                {children}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
);

const originalStandard = {
  title: '8.5(C)',
  id: '14',
  description: 'This was the originally selected standard.',
};

const updatedStandard = {
  title: 'Updated Standard',
  description: 'This is the standard we want to update to.',
  id: '100',
};

const mocks = [
  {
    request: {
      query: GET_STANDARDS,
    },
    result: {
      data: {
        allStandards: [updatedStandard, originalStandard],
      },
    },
  },
];

describe('<EditForm />', () => {
  // stubs:
  beforeAll(() => {
    window.getSelection = () => {
      return {
        removeAllRanges: () => {},
      };
    };
  });
  let testLib;
  const props = {
    open: true,
    setOpen: jest.fn(),
    card: {
      id: '56',
      questionType: 'Free Response',
      standards: [
        {
          title: originalStandard.title,
          id: originalStandard.id,
        },
      ],
      richText: JSON.stringify(Plain.deserialize('Original Text')),
      tags: [{ name: 'dummy tag' }],
      questionOptions: [
        {
          correct: true,
          richText: JSON.stringify(Plain.deserialize('Original Answer')),
          id: '154',
        },
      ],
    },
  };
  beforeEach(() => {
    testLib = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditForm {...props} />
      </MockedProvider>
    );
  });

  it('renders with the initialState', async () => {
    const { findByText } = testLib;
    const question = await findByText('Original Text');
    expect(question).toBeTruthy();

    const answer = await findByText('Original Answer');
    expect(answer).toBeTruthy();

    const tag = await findByText('dummy tag');
    expect(tag).toBeTruthy();

    const standard = await findByText(
      `${originalStandard.title}:${originalStandard.description}`
    );
    expect(standard).toBeTruthy();
  });

  it('updates standard', async () => {
    const { queryByText, findByTestId } = testLib;
    const standardSelect = await findByTestId('standard-select');
    fireEvent.change(standardSelect, {
      target: { name: 'standardId', value: updatedStandard.id },
    });
    expect(queryByText(`SELECTED: ${originalStandard.id}`)).toBeNull();
    expect(queryByText(`SELECTED: ${updatedStandard.id}`)).toBeTruthy();
  });
});
