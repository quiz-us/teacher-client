import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

import { CurrentDeckContext } from '../CurrentDeckContext';
import DeckForm from '../DeckForm';
import parseError from '../../../util/parseError';

import { UPDATE_DECK } from '../../gql/queries/Deck';

const useStyles = makeStyles({
  errorMessage: {
    color: 'red',
  },
  header: {
    marginTop: '20px',
  },
  dialogMessages: {
    minHeight: '20px',
  },
  dialogActionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '30px',
  },
  dialogButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

// if deck is passed in as a prop, it means a deck already existed and that this
// is an update call:
export default function Confirmation({ open, setOpen }) {
  const classes = useStyles();
  const { currentDeck } = useContext(CurrentDeckContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveDeck, { loading }] = useMutation(UPDATE_DECK, {
    onCompleted: () => {
      setOpen(false);
    },
    onError: err => setErrorMessage(parseError(err)),
  });

  const { name, description, id } = currentDeck;
  const handleSubmit = () => {
    setErrorMessage('');
    if (!name) {
      setErrorMessage('Please name your deck!');
    } else {
      const variables = {
        name,
        description,
        deckId: id,
      };
      saveDeck({ variables });
    }
  };

  const handleClose = () => {
    if (name.length) {
      // reset error message each time confirmation modal closes:
      setErrorMessage('');
      setOpen(false);
    } else {
      setErrorMessage('Please name your deck!');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
      <DialogTitle>Update Deck</DialogTitle>
      <DialogContent>
        <DeckForm handleSubmit={handleSubmit} />
      </DialogContent>
      <DialogActions>
        <div className={classes.dialogActionsContainer}>
          <div className={classes.dialogButtons}>
            <Button onClick={handleClose} color="secondary">
              Go Back
            </Button>
            <Button
              type="submit"
              form="deck-form"
              onClick={handleSubmit}
              color="primary"
            >
              Update
            </Button>
          </div>
          <div className={classes.dialogMessages}>
            {loading && <span>Loading...</span>}
            {errorMessage.length > 0 && (
              <span className={classes.errorMessage}>{errorMessage}</span>
            )}
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
}
