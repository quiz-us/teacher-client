import React, { useReducer } from 'react';
import Schema from 'validate';

const initialState = {
  snacks: [], // snack notifications are processed through a queue
  dialog: {},
  confirmation: {},
};

const snackSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['success', 'warning', 'error', 'info'],
  },
  vertical: {
    type: String,
    enum: ['top', 'bottom'],
  },
  horizontal: {
    type: String,
    enum: ['left', 'center', 'right'],
  },
});

const dialogSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  maxWidth: {
    type: String,
    enum: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
});

const confirmationSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  func: {
    type: Function,
    required: true,
  },
  maxWidth: {
    type: String,
    enum: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
});

let reducer = (notifications, action) => {
  const { type, confirmation, dialog, snack } = action;
  switch (type) {
    case 'OPEN_CONFIRMATION': {
      const errors = confirmationSchema.validate(confirmation);
      if (errors.length) {
        throw Error(errors);
      }
      return { ...notifications, confirmation: confirmation };
    }
    case 'CLOSE_CONFIRMATION': {
      return { ...notifications, confirmation: {} };
    }
    case 'OPEN_DIALOG': {
      const errors = dialogSchema.validate(dialog);
      if (errors.length) {
        throw Error(errors);
      }
      return { ...notifications, dialog: dialog };
    }
    case 'CLOSE_DIALOG': {
      return { ...notifications, dialog: {} };
    }
    case 'PUSH_SNACK': {
      const errors = snackSchema.validate(snack);
      if (errors.length) {
        throw Error(errors);
      }
      const snacks = [...notifications.snacks, snack];
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
