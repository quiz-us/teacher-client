import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { CurrentDeckContext } from './CurrentDeckContext';
import Card from './Card';

/** @todo: make mobile friendly: https://material-ui.com/components/drawers/#responsive-drawer */

const useStyles = makeStyles({
  currentDeckContainer: {
    padding: '25px'
  }
});

const CurrentDeck = () => {
  const { currentDeck } = useContext(CurrentDeckContext);
  const classes = useStyles();
  return (
    <div className={`${classes.currentDeckContainer}`}>
      <h3>Current Deck</h3>
      {Object.keys(currentDeck).map(cardId => {
        const card = currentDeck[cardId];
        return <Card removable key={`current-deck-${card.id}`} card={card} />;
      })}
    </div>
  );
};

export default CurrentDeck;
