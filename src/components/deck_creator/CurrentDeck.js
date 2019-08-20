import React, { useContext, useState } from 'react';
import Confirmation from './Confirmation';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
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

const CurrentDeck = () => {
  const { currentDeck } = useContext(CurrentDeckContext);
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
