import React from 'react';

import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from '@testing-library/react';
import QuestionForm from '../index';

jest.mock('slate-plain-serializer', () => {
  return {
    serialize: inputVal => {
      return inputVal;
    },
  };
});

jest.mock('../components/QuestionAndAnswers.js', () => () => {
  function handleChange(event) {}
  return <input onChange={handleChange} data-testid="question-rich-editor" />;
});

jest.mock(
  '@material-ui/core/Select',
  () => ({ children, value, onChange, inputProps }) => {
    function handleChange(event) {
      onChange(event);
    }
    return (
      <select data-testid={inputProps.id} value={value} onChange={handleChange}>
        {children.map(({ props: { children, value } }) => (
          <option key={value} value={value}>
            {children}
          </option>
        ))}
      </select>
    );
  }
);

describe('<EditForm />', () => {
  const questionTypes = ['Multiple Choice', 'Free Response'];
  const standards = [
    { id: 1, name: 'Standard 1' },
    { id: 2, name: 'Standard 2' },
  ];
  it('fake test, true is true', () => {
    expect(true).toBeTruthy();
  });
});
