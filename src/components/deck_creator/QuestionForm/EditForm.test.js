import React from 'react';
import Plain from 'slate-plain-serializer';

import { render } from '@testing-library/react';
import EditForm from './EditForm';

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
  let findByText;
  const props = {
    open: true,
    setOpen: jest.fn(),
    card: {
      id: '56',
      questionType: 'Free Response',
      standards: [
        {
          title: '8.5(C)',
          id: '14',
        },
      ],
      richText: Plain.deserialize('Original Text'),
      tags: [{ name: 'dummy tag' }],
      questionOptions: [
        {
          correct: true,
          richText: Plain.deserialize('Original Answer'),
          id: '154',
        },
      ],
    },
  };
  beforeEach(() => {
    ({ findByText } = render(<EditForm />));
  });
});
