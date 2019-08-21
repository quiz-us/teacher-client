import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
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

const useStyles = makeStyles({
  errorMessage: {
    color: 'red'
  },
  header: {
    marginTop: '20px'
  }
});

export default function AlertDialog({ open, setOpen }) {
  const classes = useStyles();
  const { currentDeck } = useContext(CurrentDeckContext);
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [createDeck, { loading, data, error }] = useMutation(CREATE_DECK);
  console.log('DECK DATA', data);

  // MUTATION ERROR HANDLING:
  const mutationError = parseError(error);

  const currentDeckArr = Object.keys(currentDeck);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    setErrorMessage('');
    if (currentDeckArr.length && deckName) {
      const questionIds = Object.keys(currentDeck);
      createDeck({
        variables: {
          questionIds,
          name: deckName,
          description: deckDescription
        }
      });
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
      <DialogTitle>{'Create Deck'}</DialogTitle>
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
        {loading && <span>Creating deck...</span>}
        {(errorMessage.length > 0 || mutationError) && (
          <span className={classes.errorMessage}>
            {errorMessage || mutationError}
          </span>
        )}

        <Button onClick={handleClose} color="secondary">
          Go Back
        </Button>
        <Button onClick={handleSubmit} color="primary" autoFocus>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
