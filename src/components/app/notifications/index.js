import React from 'react';
import NotificationSnackbar from './NotificationSnackbar';
import NotificationsDialog from './NotificationsDialog';
import NotificationsConfirmation from './NotificationsConfirmation';

const Notifications = () => {
  // const {
  //   notifications: { snack, dialog },
  // } = useContext(NotificationsContext);

  return (
    <React.Fragment>
      <NotificationsConfirmation />
      <NotificationsDialog />
      <NotificationSnackbar />
    </React.Fragment>
  );
};

export default Notifications;
