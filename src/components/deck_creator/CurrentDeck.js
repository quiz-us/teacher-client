import React, { useContext, useState } from 'react';
import Confirmation from './Confirmation';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { CurrentDeckContext } from './CurrentDeckContext';
import CardsContainer from './CardsContainer';

/** @todo: make mobile friendly: https://material-ui.com/components/drawers/#responsive-drawer */

const useStyles = makeStyles({
  currentDeckContainer: {
    padding: '25px'
  },
  currentDeckHeader: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  submitButton: {
    height: '50px'
  }
});

const GET_DECK = gql`
  query getDeck($id: ID!) {
    deck(id: $id) {
      name
      description
      id
      questions {
        id
        questionType
        standards {
          title
        }
        questionNode
        tags {
          name
        }
        questionOptions {
          optionNode
          correct
          id
        }
      }
    }
  }
`;

// if a CurrentDeck has a deckId, then it means that the current deck is being
// edited. If it does not, it means it's being created:
const CurrentDeck = ({ deckId }) => {
  const { currentDeck, dispatch } = useContext(CurrentDeckContext);
  // if a current deck already exists (ie. when editing a deck):
  const { data = {} } = useQuery(GET_DECK, {
    variables: { id: deckId },
    fetchPolicy: 'network-only',
    skip: deckId === undefined,
    onCompleted: ({ deck: { questions } }) => {
      dispatch({ type: 'receiveCurrent', questions });
    },
    onError: error => {
      console.error(error);
    }
  });

  const isUpdate = data.deck !== undefined;

  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const currentDeckArr = Object.keys(currentDeck);
  return (
    <div className={classes.currentDeckContainer}>
      <div className={classes.currentDeckHeader}>
        <h3>{isUpdate ? data.deck.name : 'Current Deck'}</h3>
        {currentDeckArr.length > 0 && (
          <Button
            color="primary"
            variant="contained"
            onClick={() => setOpen(true)}
            className={classes.submitButton}
          >
            {isUpdate ? 'Update Deck' : 'Create Deck'}
          </Button>
        )}
      </div>
      <CardsContainer />
      <Confirmation open={open} setOpen={setOpen} deck={data.deck} />
    </div>
  );
};

export default CurrentDeck;
