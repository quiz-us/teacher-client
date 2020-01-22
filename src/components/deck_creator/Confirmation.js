import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

import { CurrentDeckContext } from './CurrentDeckContext';
import CardsContainer from './CardsContainer';
import parseError from '../../util/parseError';

import { CREATE_DECK, UPDATE_DECK } from '../queries/Deck';

const useStyles = makeStyles({
  errorMessage: {
    color: 'red',
  },
  header: {
    marginTop: '20px',
  },
});

// if deck is passed in as a prop, it means a deck already existed and that this
// is an update call:
export default function Confirmation({ open, setOpen, isUpdate }) {
  const classes = useStyles();
  const { currentDeck } = useContext(CurrentDeckContext);
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [
    createDeck,
    { loading: createLoading, data: createData = {}, error: createError },
  ] = useMutation(CREATE_DECK);
  const [
    updateDeck,
    { loading: updateLoading, data: updateData = {}, error: updateError },
  ] = useMutation(UPDATE_DECK);
  useEffect(() => {
    if (isUpdate) {
      setDeckName(currentDeck.name);
      setDeckDescription(currentDeck.description);
    }
  }, [currentDeck, isUpdate]);

  if (createData.createDeck || updateData.updateDeck) {
    return (
      <Redirect
        to={{
          pathname: '/',
        }}
      />
    );
  }
  // MUTATION ERROR HANDLING:
  let mutationError;
  if (createError) {
    mutationError = parseError(createError);
  } else if (updateError) {
    mutationError = parseError(updateError);
  }

  const currentDeckArr = Object.keys(currentDeck.questions);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    setErrorMessage('');
    if (currentDeckArr.length && deckName) {
      const variables = {
        questionIds: currentDeckArr,
        name: deckName,
        description: deckDescription,
        deckId: currentDeck.id,
      };
      if (isUpdate) {
        updateDeck({ variables });
      } else {
        createDeck({ variables });
      }
    } else {
      if (!currentDeckArr.length) {
        setErrorMessage('Your deck needs cards!');
      } else if (!deckName) {
        setErrorMessage('Please name your deck!');
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
      <DialogTitle>{isUpdate ? 'Update Deck' : 'Create Deck'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          value={deckName}
          onChange={e => setDeckName(e.target.value)}
          id="name"
          label="Deck Name"
          type="text"
          fullWidth
        />
        <TextField
          value={deckDescription}
          onChange={e => setDeckDescription(e.target.value)}
          id="description"
          label="Deck Description"
          type="text"
          fullWidth
        />
        <h4 className={classes.header}>Cards currently in this deck:</h4>
        <CardsContainer />
      </DialogContent>
      <DialogActions>
        {createLoading && <span>Creating deck...</span>}
        {updateLoading && <span>Updating deck...</span>}
        {(errorMessage.length > 0 || mutationError) && (
          <span className={classes.errorMessage}>
            {errorMessage || mutationError}
          </span>
        )}

        <Button onClick={handleClose} color="secondary">
          Go Back
        </Button>
        <Button onClick={handleSubmit} color="primary" autoFocus>
          {isUpdate ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
