import React, { useReducer } from 'react';

// TODO: think through whether or not we should make snack and dialog objects
// so that we can pass in more custom props like what kind of snack alert (ie. error vs info)
// or what kind of dialog (ie. just a message or a confirmation )

const initialState = {
  snacks: [], // snack notifications are processed through a queue
  dialog: {},
  confirmation: {
    message: '',
    fn: () => {},
  },
};

let reducer = (notifications, action) => {
  const { type } = action;
  switch (type) {
    case 'OPEN_DIALOG': {
      return { ...notifications, dialog: action.dialog };
    }
    case 'CLOSE_DIALOG': {
      return { ...notifications, dialog: {} };
    }
    case 'PUSH_SNACK': {
      const snacks = [...notifications.snacks, action.snack];
      return { ...notifications, snacks };
    }
    case 'SHIFT_SNACK': {
      // eslint-disable-next-line no-unused-vars
      const [removed, ...snacks] = notifications.snacks;
      return { ...notifications, snacks };
    }
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
