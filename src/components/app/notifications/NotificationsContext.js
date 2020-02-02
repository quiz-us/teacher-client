import React, { useReducer } from 'react';
import Schema from 'validate';

const initialState = {
  snacks: {
    queue: [], // snack notifications are processed through a queue
    snack: {},
    open: false,
  },
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

const processSnacks = snacks => {
  const updatedSnacks = { ...snacks };

  if (updatedSnacks.queue.length > 0) {
    updatedSnacks.snack = updatedSnacks.queue.shift();
    updatedSnacks.open = true;
  }
  return updatedSnacks;
};

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

      let updatedSnacks = {
        ...notifications.snacks,
        queue: [
          ...notifications.snacks.queue,
          { ...snack, key: new Date().getTime() },
        ],
      };

      if (notifications.snacks.open) {
        updatedSnacks.open = false;
      } else {
        updatedSnacks = processSnacks(updatedSnacks);
      }

      return { ...notifications, snacks: updatedSnacks };
    }
    case 'UPDATE_SNACK_QUEUE': {
      return { ...notifications, snacks: processSnacks(notifications.snacks) };
    }
    case 'CLOSE_SNACK': {
      return {
        ...notifications,
        snacks: { ...notifications.snacks, open: false },
      };
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
