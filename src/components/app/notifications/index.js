import React, { useContext } from 'react';
import { NotificationsContext } from './NotificationsContext';
import Modal from '../Modal';
import NotificationSnackbar from './NotificationSnackbar';

const Notifications = () => {
  // const {
  //   notifications: { snack, dialog },
  // } = useContext(NotificationsContext);

  return (
    <React.Fragment>
      {/* TODO:  consider only conditionally rendering the elements if message is present: */}
      {/* TODO:  rename Modal into something more generic: */}
      {/* <Modal error={dialog} /> */}
      <NotificationSnackbar />
    </React.Fragment>
  );
};

export default Notifications;
