import React, { useContext } from 'react';
import { render, fireEvent } from '@testing-library/react';
import {
  NotificationsContext,
  NotificationsProvider,
} from './NotificationsContext';
import Notifications from './index';

let findByText, getByText;
describe('snacks', () => {
  it('renders snacks without error', async () => {
    const MockComponent = () => {
      const { dispatch } = useContext(NotificationsContext);
      const handleClick = () =>
        dispatch({
          type: 'PUSH_SNACK',
          snack: {
            message: 'Snack displayed!',
          },
        });
      return <button onClick={handleClick}>snack</button>;
    };
    ({ findByText, getByText } = render(
      <NotificationsProvider>
        <MockComponent />
        <Notifications />
      </NotificationsProvider>
    ));
    fireEvent.click(getByText('snack'));
    expect(await findByText('Snack displayed!')).toBeTruthy();
  });

  it('validate snack message properties', async () => {
    // temporarily suppress console error to clean up test logs:
    const originalError = console.error;
    console.error = jest.fn();
    const MockComponent = () => {
      const { dispatch } = useContext(NotificationsContext);
      const handleClick = () =>
        dispatch({
          type: 'PUSH_SNACK',
          snack: {
            message: '',
            severity: 'not-serious',
          },
        });
      return <button onClick={handleClick}>snack</button>;
    };
    ({ findByText, getByText } = render(
      <NotificationsProvider>
        <MockComponent />
        <Notifications />
      </NotificationsProvider>
    ));
    expect(() => fireEvent.click(getByText('snack'))).toThrow(Error);
    console.error = originalError;
  });
});

describe('confirmation', () => {
  const message = 'Confirmation displayed!';
  it('renders confirmation without error', async () => {
    const MockComponent = () => {
      const { dispatch } = useContext(NotificationsContext);
      const handleClick = () =>
        dispatch({
          type: 'OPEN_CONFIRMATION',
          confirmation: {
            message,
            func: () => {},
          },
        });
      return <button onClick={handleClick}>confirmation</button>;
    };

    ({ findByText, getByText } = render(
      <NotificationsProvider>
        <MockComponent />
        <Notifications />
      </NotificationsProvider>
    ));
    fireEvent.click(getByText('confirmation'));
    expect(await findByText(message)).toBeTruthy();
  });

  it('validate dialog action properties', async () => {
    // temporarily suppress console error to clean up test logs:
    const originalError = console.error;
    console.error = jest.fn();
    const MockComponent = () => {
      const { dispatch } = useContext(NotificationsContext);
      const handleClick = () =>
        dispatch({
          type: 'OPEN_CONFIRMATION',
          confirmation: {
            message,
          },
        });
      return <button onClick={handleClick}>confirmation</button>;
    };

    ({ findByText, getByText } = render(
      <NotificationsProvider>
        <MockComponent />
        <Notifications />
      </NotificationsProvider>
    ));
    expect(() => fireEvent.click(getByText('confirmation'))).toThrow(Error);
    console.error = originalError;
  });
});

describe('dialog', () => {
  const title = 'Dialog Title';
  const message = 'Dialog displayed!';

  it('renders dialog without error', async () => {
    const MockComponent = () => {
      const { dispatch } = useContext(NotificationsContext);
      const handleClick = () =>
        dispatch({
          type: 'OPEN_DIALOG',
          dialog: {
            title,
            message,
          },
        });
      return <button onClick={handleClick}>dialog</button>;
    };

    ({ findByText, getByText } = render(
      <NotificationsProvider>
        <MockComponent />
        <Notifications />
      </NotificationsProvider>
    ));
    fireEvent.click(getByText('dialog'));
    expect(await findByText(message)).toBeTruthy();
    expect(await findByText(title)).toBeTruthy();
  });

  it('validate dialog action properties', async () => {
    // temporarily suppress console error to clean up test logs:
    const originalError = console.error;
    console.error = jest.fn();
    const MockComponent = () => {
      const { dispatch } = useContext(NotificationsContext);
      const handleClick = () =>
        dispatch({
          type: 'OPEN_DIALOG',
          dialog: {
            title,
          },
        });
      return <button onClick={handleClick}>dialog</button>;
    };

    ({ findByText, getByText } = render(
      <NotificationsProvider>
        <MockComponent />
        <Notifications />
      </NotificationsProvider>
    ));

    expect(() => fireEvent.click(getByText('dialog'))).toThrow(Error);
    console.error = originalError;
  });
});
