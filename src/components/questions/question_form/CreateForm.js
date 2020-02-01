import React, { useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';
import { parseFormData } from './helper';

import Form from './Form';
import {
  QuestionFormProvider,
  QuestionFormContext,
} from './QuestionFormContext';
import { CurrentDeckContext } from '../../decks/CurrentDeckContext';
import { CREATE_QUESTION } from '../../gql/mutations/Question';
import GlobalLoader from '../../app/GlobalLoader';
import { NotificationsContext } from '../../app/notifications/NotificationsContext';

const CreateForm = () => {
  const { dispatch } = useContext(QuestionFormContext);
  const { dispatch: dispatchNotify } = useContext(NotificationsContext);
  const { dispatch: currentDeckDispatch } = useContext(CurrentDeckContext);
  const [createQuestion, { loading }] = useMutation(CREATE_QUESTION, {
    onCompleted: ({ createQuestion }) => {
      // TODO: dispatch api call to add card to current deck
      // and then on success, dispatch reducer call to add to current:
      currentDeckDispatch({
        type: 'addToCurrent',
        card: createQuestion,
        questionId: createQuestion.id,
      });
      dispatchNotify({
        type: 'PUSH_SNACK',
        snack: {
          message: 'New question was added to the deck!',
        },
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
    return createQuestion({
      variables: parseFormData(formData),
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
