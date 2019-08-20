import React, { useState, useContext } from 'react';
import Card from '@material-ui/core/Card';
import { ReadOnly } from '@quiz-us/kit';
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
  },
  cardHeader: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  details: {
    marginTop: '10px'
  }
});

const DeckCard = ({ card, removable = null }) => {
  const { currentDeck, dispatch } = useContext(CurrentDeckContext);
  const {
    id,
    questionNode = '',
    questionText,
    standards = [{}],
    tags = [],
    questionOptions = [],
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
    if (removable) {
      return (
        <IconButton onClick={removeFromCurrentDeck}>
          <DeleteIcon />
        </IconButton>
      );
    }
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
  };
  const inCurrentDeck = currentDeck[id] ? true : false;

  return (
    <Card className={classes.root}>
      <CardContent>
        <div className={classes.cardHeader}>
          <h4>Question</h4>
          {controls()}
        </div>
        <ReadOnly value={JSON.parse(questionNode)} />
        <div className={classes.details}>
          <strong>Standard:</strong>
          {` ${standard.title}`}
        </div>
        <div className={classes.details}>
          <strong>Tags:</strong>
          {` ${tags.map(({ name }) => name).join(', ')}`}{' '}
        </div>
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
        <CardContent>
          {questionOptions.map(({ correct, optionNode }) => {
            console.log(JSON.parse(optionNode));
            return (
              <div>
                <h4>Answer</h4>
                <ReadOnly value={JSON.parse(optionNode)} />
              </div>
            );
          })}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default DeckCard;
