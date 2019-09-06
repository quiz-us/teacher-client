import React, { useReducer } from 'react';

let reducer = (currentDeck, action) => {
  const { type, card, id, questions } = action;
  switch (type) {
    case 'addToCurrent':
      return { ...currentDeck, [id]: card };
    case 'receiveCurrent':
      const receivedDeck = {};
      questions.forEach(question => {
        receivedDeck[question.id] = question;
      });
      return receivedDeck;
    case 'removeFromCurrent':
      const { [id]: _, ...updatedCurrentDeck } = currentDeck;
      return updatedCurrentDeck;
    // case 'removeQuestion': 
    //   console.log("currentDeckContext: action", action)
    default:
      return;
  }
};
const initialState = {};
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
