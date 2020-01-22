import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import { CurrentDeckContext } from './CurrentDeckContext';
import Card from './Card';

const useStyles = makeStyles({
  cardsContainer: {
    overflow: 'scroll',
    height: '85vh',
    padding: '10px',
  },
  noCards: {
    margin: '40px 20px',
  },
});

export default ({ loading: cardsLoading }) => {
  const { currentDeck } = useContext(CurrentDeckContext);
  const classes = useStyles();
  const currentDeckArr = Object.keys(currentDeck.questions);

  const content = () => {
    if (cardsLoading) {
      return <LinearProgress />;
    }
    if (currentDeckArr.length) {
      return currentDeckArr.map(cardId => {
        const card = currentDeck.questions[cardId];
        return <Card removable key={`current-deck-${card.id}`} card={card} />;
      });
    }
    return (
      <div className={classes.noCards}>
        No cards in this deck yet. Create a question or search for existing ones
        to add to this deck!
      </div>
    );
  };

  return <div className={classes.cardsContainer}>{content()}</div>;
};
