import React, { useReducer } from 'react';

// TODO: think through whether or not we should make snack and dialog objects
// so that we can pass in more custom props like what kind of snack alert (ie. error vs info)
// or what kind of dialog (ie. just a message or a confirmation )

const initialState = {
  snack: '',
  dialog: '',
};

let reducer = (notifications, action) => {
  const { type, ...payload } = action;
  switch (type) {
    case 'update':
      return { ...notifications, ...payload };
    case 'clear':
      return initialState;
    default:
      return;
  }
};

const NotificationsContext = React.createContext(initialState);

function NotificationsProvider({ children }) {
  const [notifications, dispatch] = useReducer(reducer, initialState);
  return (
    <NotificationsContext.Provider value={{ currentDeck, dispatch }}>
      {children}
    </NotificationsContext.Provider>
  );
}
export { NotificationsContext, NotificationsProvider };
