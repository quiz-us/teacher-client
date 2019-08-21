import React, { useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CurrentDeckContext } from './CurrentDeckContext';
import CardsContainer from './CardsContainer';
import parseError from '../../util/parseError';

const CREATE_DECK = gql`
  mutation createDeck(
    $questionIds: [ID!]!
    $name: String!
    $description: String
  ) {
    createDeck(
      questionIds: $questionIds
      name: $name
      description: $description
    ) {
      name
    }
  }
`;

const UPDATE_DECK = gql`
  mutation updateDeck(
    $deckId: ID!
    $questionIds: [ID!]!
    $name: String!
    $description: String
  ) {
    updateDeck(
      deckId: $deckId
      questionIds: $questionIds
      name: $name
      description: $description
    ) {
      name
    }
  }
`;

const useStyles = makeStyles({
  errorMessage: {
    color: 'red'
  },
  header: {
    marginTop: '20px'
  }
});

// if deck is passed in as a prop, it means a deck already existed and that this
// is an update call:
export default function Confirmation({ open, setOpen, deck = {} }) {
  const isUpdate = deck.name !== undefined;
  const classes = useStyles();
  const { currentDeck } = useContext(CurrentDeckContext);
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [
    createDeck,
    { loading: createLoading, data: createData = {}, error: createError }
  ] = useMutation(CREATE_DECK);
  const [
    updateDeck,
    { loading: updateLoading, data: updateData = {}, error: updateError }
  ] = useMutation(UPDATE_DECK);
  useEffect(() => {
    if (isUpdate) {
      setDeckName(deck.name);
      setDeckDescription(deck.description);
    }
  }, [deck, isUpdate]);

  if (createData.createDeck || updateData.updateDeck) {
    return (
      <Redirect
        to={{
          pathname: '/'
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

  const currentDeckArr = Object.keys(currentDeck);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    setErrorMessage('');
    if (currentDeckArr.length && deckName) {
      const questionIds = Object.keys(currentDeck);
      const variables = {
        questionIds,
        name: deckName,
        description: deckDescription,
        deckId: deck.id
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
    <Dialog open={open} onClose={handleClose}>
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
