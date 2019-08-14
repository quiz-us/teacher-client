import React, { useReducer } from 'react';

let reducer = (currentDeck, action) => {
  const { type, card, id } = action;
  switch (type) {
    case 'addToCurrent':
      return { ...currentDeck, [id]: card };
    case 'removeFromCurrent':
      const { [id]: _, ...updatedCurrentDeck } = currentDeck;
      return updatedCurrentDeck;
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
