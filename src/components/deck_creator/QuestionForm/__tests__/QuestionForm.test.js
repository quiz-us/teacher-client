import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from '@testing-library/react';
import QuestionForm from '../index';

jest.mock('slate-plain-serializer', () => {
  return {
    serialize: inputVal => {
      return inputVal;
    }
  };
});

// mock QuestionAndAnswers component because the RichTextEditor
// it renders depends on window functions that don't exist in test context:
jest.mock('./QuestionAndAnswers.js', () => () => {
  function handleChange(event) {}
  return <input onChange={handleChange} data-testid="question-rich-editor" />;
});

// https://www.polvara.me/posts/testing-a-custom-select-with-react-testing-library/
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

describe('<QuestionForm />', () => {
  const questionTypes = ['Multiple Choice', 'Free Response'];
  const standards = [
    { id: 1, name: 'Standard 1' },
    { id: 2, name: 'Standard 2' }
  ];
  const onSubmit = jest.fn();
  const mockFetchTags = jest
    .fn()
    .mockResolvedValue([{ label: 'American Samoa' }]);

  let getByTestId, getByText, getByPlaceholderText, debug;
  beforeEach(() => {
    ({ getByTestId, getByText, getByPlaceholderText, debug } = render(
      <QuestionForm
        onSubmit={onSubmit}
        standards={standards}
        questionTypes={questionTypes}
        fetchTags={mockFetchTags}
      />
    ));
  });
  afterEach(cleanup);
  test('can choose a question type', async () => {
    questionTypes.forEach(questionType => {
      fireEvent.change(getByTestId('questionType-select'), {
        target: { name: 'questionType', value: questionType }
      });
      expect(getByText(questionType)).toBeTruthy();
    });
  });

  test('can choose a standard', async () => {
    standards.forEach(({ name, id }) => {
      fireEvent.change(getByTestId('standard-select'), {
        target: { name: 'standard', value: id }
      });
      expect(getByText(name)).toBeTruthy();
    });
  });

  describe('<TagsForm/>', () => {
    test('autosuggests options based on input', async () => {
      // currently console logging warnings about using `act` because mock
      // function resolves a Promise. It seems that the fix is to wait for
      // React 16.9.0: https://github.com/testing-library/react-testing-library/issues/281
      fireEvent.change(getByPlaceholderText('Add one or more tag(s)'), {
        target: {
          value: 'a'
        }
      });
      const option = await waitForElement(() => getByText('American Samoa'));
      expect(option).toBeTruthy();
    });

    test('calls updateTags when input is chosen', async () => {
      fireEvent.change(getByPlaceholderText('Add one or more tag(s)'), {
        target: {
          value: 'a'
        }
      });
      const option = await waitForElement(() => getByText('American Samoa'));
      fireEvent.click(option);
      expect(getByTestId('mui-chip').textContent).toEqual('American Samoa');
    });
  });

  describe('submitting question form', () => {
    test('renders error modal if required fields are not filled', () => {
      fireEvent.click(getByTestId('submit-button'));
      expect(getByText("Please fill out 'Question Type'!")).toBeTruthy();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});