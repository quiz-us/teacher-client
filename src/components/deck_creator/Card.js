import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';

import Card from '@material-ui/core/Card';
import Tooltip from '@material-ui/core/Tooltip';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { ReadOnly } from '../editor';
import { CurrentDeckContext } from './CurrentDeckContext';
import EditForm from './QuestionForm/EditForm';

import { GET_QUESTIONS, DELETE_QUESTION } from '../queries/Question';

const useStyles = makeStyles({
  root: {
    marginBottom: '20px',
  },
  actions: {
    justifyContent: 'center',
    padding: 0,
    height: '15px',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  cardHeader: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderText: {
    paddingRight: '10px',
  },
  readOnly: {
    width: '100%',
  },
  details: {
    marginTop: '15px',
  },
  answerChoiceRow: {
    display: 'flex',
    marginTop: '10px',
  },
  correctnessIcon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '5px',
  },
});

const Answers = ({ questionOptions, classes }) => {
  return (
    <div>
      {questionOptions.map(({ correct, richText, id }) => {
        return (
          <div className={classes.answerChoiceRow} key={`answerChoice-${id}`}>
            <span className={classes.correctnessIcon}>
              {correct ? (
                <CheckIcon title="Correct Answer" />
              ) : (
                <ClearIcon title="Incorrect Answer" />
              )}
            </span>

            <div className={classes.readOnly}>
              <ReadOnly
                key={`${id}-${richText}`}
                value={JSON.parse(richText)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

Answers.propTypes = {
  questionOptions: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};

const DeckCard = ({ card, removable, inputs, deletable }) => {
  const { currentDeck, dispatch } = useContext(CurrentDeckContext);

  const {
    id,
    questionType,
    richText = '',
    standards = [{}],
    tags = [],
    questionOptions = [],
  } = card;
  const [standard] = standards;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);

  const removeQuestionFromCache = (cache, { deleteQuestion: { id } }) => {
    //read what is currently in the cache for GET_QUESTIONS query
    const { questions } = cache.readQuery({
      query: GET_QUESTIONS,
      variables: {
        standardId: inputs.standardId,
        keyWords: inputs.keyWords,
      },
    });

    // remove the deleted question
    const updatedQuestions = questions.filter(question => question.id !== id);

    // write the GET_QUESTIONS without the deleted question
    cache.writeQuery({
      query: GET_QUESTIONS,
      variables: {
        standardId: inputs.standardId,
        keyWords: inputs.keyWords,
      },
      data: { questions: updatedQuestions },
    });
  };

  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    onCompleted: ({ deleteQuestion: { id } }) => {
      dispatch({ type: 'removeFromCurrent', id });
    },
    update: (cache, res) => {
      //needed to remove deleted question from search results
      removeQuestionFromCache(cache, res.data);
    },
    onError: err => console.error(err),
  });

  const actionText = expanded ? 'Hide Answer' : 'Show Answer';
  const updateCurrentDeck = () => {
    if (currentDeck.questions[id]) {
      dispatch({ type: 'removeFromCurrent', id });
    } else {
      dispatch({ type: 'addToCurrent', card, id });
    }
  };

  const removeFromCurrentDeck = () => {
    dispatch({ type: 'removeFromCurrent', id });
  };

  const handleDeleteDb = id => {
    const confirmMessage = () =>
      window.confirm(
        'Are you sure you want to delete this question permanently?'
      );
    if (!confirmMessage()) return null;

    deleteQuestion({
      variables: {
        questionId: id,
      },
    });
  };

  const controls = () => {
    if (removable) {
      return (
        <Tooltip
          title="Remove From Deck"
          aria-label="Remove From Deck"
          placement="top"
        >
          <IconButton onClick={removeFromCurrentDeck}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <FormControlLabel
        control={
          <Switch
            checked={!!currentDeck.questions[id]}
            onChange={updateCurrentDeck}
            color="primary"
          />
        }
        label="In Current Deck"
      />
    );
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <div className={classes.cardHeader}>
          <div className={classes.cardHeaderLeft}>
            <h3 className={classes.cardHeaderText}>Question</h3>
            <div>
              <Tooltip
                title="Edit Question"
                aria-label="Edit Question"
                placement="top"
              >
                <IconButton onClick={() => setOpen(true)}>
                  <CreateIcon />
                </IconButton>
              </Tooltip>
              {deletable ? (
                <Tooltip
                  title="Delete Question"
                  aria-label="Delete Question"
                  placement="top"
                >
                  <IconButton onClick={() => handleDeleteDb(id)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                ''
              )}
            </div>
          </div>
          {controls()}
        </div>
        <ReadOnly key={card.richText} value={JSON.parse(richText)} />

        <div className={classes.details}>
          <strong>Standard:</strong>
          {` ${standard.title}`}
        </div>
        <div className={classes.details}>
          <strong>Type:</strong>
          {` ${questionType}`}
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
          <h3>Answer</h3>
          <Answers classes={classes} questionOptions={questionOptions} />
        </CardContent>
      </Collapse>
      {open && <EditForm open={open} setOpen={setOpen} card={card} />}
    </Card>
  );
};

DeckCard.propTypes = {
  card: PropTypes.object.isRequired,
  removable: PropTypes.bool.isRequired,
  deletable: PropTypes.bool.isRequired,
  inputs: PropTypes.object,
};

DeckCard.defaultProps = {
  removable: false,
  deletable: false,
};

export default DeckCard;
