import React, { useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';
import { parseFormData } from './helper';

import Form from './Form';
import {
  QuestionFormProvider,
  QuestionFormContext,
} from './QuestionFormContext';
import { CurrentDeckContext } from '../../decks/CurrentDeckContext';
import { CREATE_QUESTION } from '../../../gql/mutations/Question';
import { ADD_QUESTION_TO_DECK } from '../../../gql/mutations/Deck';
import GlobalLoader from '../../app/GlobalLoader';
import { NotificationsContext } from '../../app/notifications/NotificationsContext';

const CreateForm = () => {
  const { dispatch } = useContext(QuestionFormContext);
  const { dispatch: dispatchNotify } = useContext(NotificationsContext);
  const { currentDeck, dispatch: currentDeckDispatch } = useContext(
    CurrentDeckContext
  );
  const [addQuestionToDeck, { loading: questionDeckLoading }] = useMutation(
    ADD_QUESTION_TO_DECK,
    {
      onCompleted: ({ addQuestionToDeck: { question } }) => {
        currentDeckDispatch({
          type: 'addToCurrent',
          card: question,
          questionId: question.id,
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
    }
  );

  const [createQuestion, { loading }] = useMutation(CREATE_QUESTION, {
    onCompleted: ({ createQuestion }) => {
      addQuestionToDeck({
        variables: { questionId: createQuestion.id, deckId: currentDeck.id },
      });
    },
  });

  if (loading || questionDeckLoading) {
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
