import React from 'react';

import { useMutation } from '@apollo/react-hooks';
import Plain from 'slate-plain-serializer';

import Form from './Form';
import { QuestionFormProvider } from './QuestionFormContext';
import { CREATE_QUESTION } from '../../../queries/Question';

const CreateForm = () => {
  // IMPORTANT: cannot directly use the loading check in this component
  // because if we render something differently while loaindg here, it'll
  // unmount the whole component and cause for the QuestionFormProvider state
  // to reset
  const [createQuestion, { loading }] = useMutation(CREATE_QUESTION);

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

  return (
    <QuestionFormProvider>
      <Form handleSubmit={handleSubmit} loading={loading} />
    </QuestionFormProvider>
  );
};

CreateForm.propTypes = {};

export default CreateForm;
