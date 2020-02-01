import React from 'react';
import NotificationSnackbar from './NotificationSnackbar';
import NotificationsDialog from './NotificationsDialog';

const Notifications = () => {
  // const {
  //   notifications: { snack, dialog },
  // } = useContext(NotificationsContext);

  return (
    <React.Fragment>
      <NotificationsDialog />
      <NotificationSnackbar />
    </React.Fragment>
  );
};

export default Notifications;
