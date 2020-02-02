import React, { useReducer } from 'react';

const initialState = {
  name: '',
  description: '',
  questions: {},
  id: '',
};

let reducer = (currentDeck, action) => {
  const { type, card, questionId, deck, metaField, metaValue } = action;
  switch (type) {
    case 'updateMeta':
      return { ...currentDeck, [metaField]: metaValue };
    case 'addToCurrent':
    case 'updateCard': {
      const questions = { ...currentDeck.questions, [questionId]: card };
      return { ...currentDeck, questions };
    }
    case 'receiveCurrent':
      const { questions, ...receivedDeck } = deck;
      receivedDeck.questions = {};
      questions.forEach(question => {
        receivedDeck.questions[question.id] = question;
      });
      return receivedDeck;
    case 'removeFromCurrent': {
      const { [questionId]: _, ...questions } = currentDeck.questions;
      return { ...currentDeck, questions };
    }
    case 'resetCurrentDeck': {
      return initialState;
    }
    default:
      return;
  }
};

const CurrentDeckContext = React.createContext(initialState);

function CurrentDeckProvider({ children }) {
  const [currentDeck, dispatch] = useReducer(reducer, initialState);
  return (
    <CurrentDeckContext.Provider value={{ currentDeck, dispatch }}>
      {children}
    </CurrentDeckContext.Provider>
  );
}
export { CurrentDeckContext, CurrentDeckProvider };
