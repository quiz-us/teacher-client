import React, { useContext } from 'react';
import { CurrentDeckContext } from './CurrentDeckContext';
import Card from './Card';

const CurrentDeck = ({ classes }) => {
  const { currentDeck } = useContext(CurrentDeckContext);
  return (
    <div
      className={`${classes.bottomContainer} ${classes.currentDeckContainer}`}
    >
      <h3>Current Deck</h3>
      {Object.keys(currentDeck).map(cardId => {
        const card = currentDeck[cardId];
        return <Card removable key={`current-deck-${card.id}`} card={card} />;
      })}
    </div>
  );
};

export default CurrentDeck;
