import React, { useState, useContext, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import DeckForm from './DeckForm';
import { CREATE_DECK } from '../gql/mutations/Deck';
import parseError from '../../util/parseError';
import GlobalLoader from '../app/GlobalLoader';
import { CurrentDeckContext } from './CurrentDeckContext';

const useStyles = makeStyles(() => ({
  root: {
    margin: '20px',
  },
  submitButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '15px',
  },
  errorMessage: {
    color: 'red',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '15px',
  },
}));

const DeckCreator = ({ history }) => {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState('');
  const { currentDeck, dispatch } = useContext(CurrentDeckContext);

  useEffect(() => {
    dispatch({ type: 'resetCurrentDeck' });
  }, [dispatch]);

  const [saveDeck, { loading }] = useMutation(CREATE_DECK, {
    onCompleted: ({ createDeck }) => {
      history.push(`/decks/${createDeck.id}/edit`);
    },
    onError: err => setErrorMessage(parseError(err)),
  });

  const handleSubmit = () => {
    const { name, description } = currentDeck;
    saveDeck({
      variables: {
        name,
        description,
      },
    });
  };

  if (loading) {
    return <GlobalLoader />;
  }
  return (
    <div className={classes.root}>
      <h2>Create a New Deck</h2>
      <DeckForm handleSubmit={handleSubmit} />
      <div className={classes.submitButtonContainer}>
        <Button
          form="deck-form"
          type="submit"
          color="primary"
          variant="contained"
        >
          Create Deck
        </Button>
      </div>
      <div className={classes.errorMessage}>{errorMessage}</div>
    </div>
  );
};

export default DeckCreator;
