import React, { useReducer } from 'react';

// TODO: think through whether or not we should make snack and dialog objects
// so that we can pass in more custom props like what kind of snack alert (ie. error vs info)
// or what kind of dialog (ie. just a message or a confirmation )

const initialState = {
  snack: {
    message: '',
    severity: 'success',
    vertical: 'bottom',
    horizontal: 'center',
  },
  dialog: {
    message: '',
  },
  confirmation: {
    message: '',
    fn: () => {},
  },
};

let reducer = (notifications, action) => {
  const { type } = action;
  switch (type) {
    case 'SET_SNACK':
      const updatedSnack = { ...notifications.snack, ...action.snack };
      return { ...notifications, snack: updatedSnack };
    case 'RESET_SNACK':
      return { ...notifications, snack: initialState.snack };
    default:
      return;
  }
};

const NotificationsContext = React.createContext(initialState);

function NotificationsProvider({ children }) {
  const [notifications, dispatch] = useReducer(reducer, initialState);
  return (
    <NotificationsContext.Provider value={{ notifications, dispatch }}>
      {children}
    </NotificationsContext.Provider>
  );
}
export { NotificationsContext, NotificationsProvider };
