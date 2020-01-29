import React, { useContext } from 'react';
import { NotificationsContext } from './NotificationsContext';
import ErrorModal from './ErrorModal';
import Snackbar from './Snackbar';

const Notifications = () => {
  const {
    notifications: { snack, dialog },
  } = useContext(NotificationsContext);

  return (
    <React.Fragment>
      {/* TODO:  consider only conditionally rendering the elements if message is present: */}
      {/* TODO:  rename ErrorModal into something more generic: */}
      <ErrorModal error={dialog} />
      <Snackbar message={snack} />
    </React.Fragment>
  );
};

export default Notifications;
