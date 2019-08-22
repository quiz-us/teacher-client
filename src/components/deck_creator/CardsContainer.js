import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { CurrentDeckContext } from './CurrentDeckContext';
import Card from './Card';

const useStyles = makeStyles({
  cardsContainer: {
    overflow: 'scroll',
    height: '80vh',
    padding: '10px'
  }
});

export default () => {
  const { currentDeck } = useContext(CurrentDeckContext);
  const classes = useStyles();
  const currentDeckArr = Object.keys(currentDeck);
  return (
    <div className={classes.cardsContainer}>
      {currentDeckArr.map(cardId => {
        const card = currentDeck[cardId];
        return <Card removable key={`current-deck-${card.id}`} card={card} />;
      })}
    </div>
  );
};
