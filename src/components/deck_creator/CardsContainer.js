import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { CurrentDeckContext } from './CurrentDeckContext';
import Card from './Card';

const useStyles = makeStyles({
  cardsContainer: {
    overflow: 'scroll',
    height: '85vh',
    padding: '10px'
  },
  noCards: {
    margin: '40px 20px'
  }
});

export default () => {
  const { currentDeck } = useContext(CurrentDeckContext);
  const classes = useStyles();
  const currentDeckArr = Object.keys(currentDeck);
  return (
    <div className={classes.cardsContainer}>
      {currentDeckArr.length ? (
        currentDeckArr.map(cardId => {
          const card = currentDeck[cardId];
          return <Card removable key={`current-deck-${card.id}`} card={card} />;
        })
      ) : (
        <div className={classes.noCards}>
          No cards in this deck yet. Create a question or search for existing
          ones to add to this deck!
        </div>
      )}
    </div>
  );
};
