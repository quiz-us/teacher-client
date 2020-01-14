import React, { useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';
import Plain from 'slate-plain-serializer';

import Form from './Form';
import {
  QuestionFormProvider,
  QuestionFormContext,
} from './QuestionFormContext';
import { CurrentDeckContext } from '../CurrentDeckContext';
import { CREATE_QUESTION } from '../../queries/Question';
import GlobalLoader from '../../app/GlobalLoader';

const CreateForm = () => {
  const { dispatch } = useContext(QuestionFormContext);
  const { dispatch: currentDeckDispatch } = useContext(CurrentDeckContext);
  const [createQuestion, { loading }] = useMutation(CREATE_QUESTION, {
    onCompleted: ({ createQuestion }) => {
      currentDeckDispatch({
        type: 'addToCurrent',
        card: createQuestion,
        id: createQuestion.id,
      });
      dispatch({
        type: 'resetForm',
      });
      window.scrollTo(0, 0);
    },
  });

  if (loading) {
    return <GlobalLoader />;
  }

  const handleSubmit = formData => {
    const parsedFormData = {
      ...formData,
      questionText: Plain.serialize(formData.question),
      answers: formData.answers.map(answer => {
        return {
          ...answer,
          optionText: Plain.serialize(answer.richText),
        };
      }),
    };

    return createQuestion({
      variables: {
        questionType: parsedFormData['questionType'],
        standardId: parsedFormData['standardId'],
        tags: parsedFormData['tags'],
        richText: JSON.stringify(parsedFormData['question'].toJSON()),
        questionPlaintext: parsedFormData['questionText'],
        questionOptions: parsedFormData['answers'].map(answer =>
          JSON.stringify(answer)
        ),
      },
    });
  };

  return <Form handleSubmit={handleSubmit} />;
};

const CreateFormContainer = () => (
  <QuestionFormProvider>
    <CreateForm />
  </QuestionFormProvider>
);

export default CreateFormContainer;
