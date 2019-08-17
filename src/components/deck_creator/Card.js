import React, { useState, useContext } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import { CurrentDeckContext } from './CurrentDeckContext';

const useStyles = makeStyles({
  root: {
    marginBottom: '20px'
  },
  actions: {
    justifyContent: 'center'
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
});

const DeckCard = ({ card, removable = null }) => {
  const { currentDeck, dispatch } = useContext(CurrentDeckContext);
  const {
    id,
    questionText,
    standards = [{}],
    tags = [],
    answerText = ''
  } = card;
  const [standard] = standards;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const actionText = expanded ? 'Hide Answer' : 'Show Answer';
  const updateCurrentDeck = () => {
    if (currentDeck[id]) {
      dispatch({ type: 'removeFromCurrent', id });
      // ({ [id]: _, ...updatedCurrentDeck } = currentDeck);
    } else {
      dispatch({ type: 'addToCurrent', card, id });
      // updatedCurrentDeck = Object.assign(currentDeck, { [id]: card });
    }
  };

  const removeFromCurrentDeck = () => {
    dispatch({ type: 'removeFromCurrent', id });
  };

  const controls = () => {
    if (!removable) {
      return (
        <FormControlLabel
          control={
            <Switch
              checked={inCurrentDeck}
              onChange={updateCurrentDeck}
              color="primary"
            />
          }
          label="In Current Deck"
        />
      );
    }
  };
  const inCurrentDeck = currentDeck[id] ? true : false;
  const action = removable ? (
    <IconButton onClick={removeFromCurrentDeck}>
      <DeleteIcon />
    </IconButton>
  ) : null;
  return (
    <Card className={classes.root}>
      <CardHeader
        action={action}
        title={questionText}
        subheader={`Standard: ${standard.title}`}
      />
      <CardContent>
        <div>{`Tags: ${tags.map(({ name }) => name).join(', ')}`} </div>
        {controls()}
      </CardContent>
      <CardActions className={classes.actions}>
        <IconButton
          onClick={() => setExpanded(!expanded)}
          aria-label={actionText}
        >
          <ExpandMoreIcon className={expanded ? classes.expandOpen : ''} />
        </IconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>{answerText}</CardContent>
      </Collapse>
    </Card>
  );
};

export default DeckCard;
