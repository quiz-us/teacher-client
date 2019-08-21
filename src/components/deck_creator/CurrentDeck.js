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

const CurrentDeck = ({ deckId }) => {
  const { currentDeck, dispatch } = useContext(CurrentDeckContext);
  // if a current deck already exists (ie. when editing a deck):
  useQuery(GET_DECK, {
    variables: { id: deckId },
    skip: deckId === undefined,
    onCompleted: ({ deck: { questions } }) => {
      dispatch({ type: 'receiveCurrent', questions });
    },
    onError: error => {
      console.error(error);
    }
  });

  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const currentDeckArr = Object.keys(currentDeck);
  return (
    <div className={classes.currentDeckContainer}>
      <div className={classes.currentDeckHeader}>
        <h3>Current Deck</h3>
        {currentDeckArr.length > 0 && (
          <Button
            color="primary"
            variant="contained"
            onClick={() => setOpen(true)}
            className={classes.submitButton}
          >
            Create Deck
          </Button>
        )}
      </div>
      <CardsContainer />
      <Confirmation open={open} setOpen={setOpen} />
    </div>
  );
};

export default CurrentDeck;
