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

import { ReadOnly } from '../../editor';
import { CurrentDeckContext } from '../CurrentDeckContext';
import EditForm from '../../questions/question_form/EditForm';

import { GET_QUESTIONS } from '../../gql/queries/Question';
import { DELETE_QUESTION } from '../../gql/mutations/Question';
import {
  ADD_QUESTION_TO_DECK,
  REMOVE_QUESTION_FROM_DECK,
} from '../../gql/mutations/Deck';
import { NotificationsContext } from '../../app/notifications/NotificationsContext';

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

  const { questions, id: deckId } = currentDeck;

  const {
    id: questionId,
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
  const { dispatch: dispatchNotify } = useContext(NotificationsContext);

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
    const updatedQuestions = questions.filter(
      question => question.id !== questionId
    );

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
    onCompleted: ({ deleteQuestion }) => {
      dispatch({ type: 'removeFromCurrent', questionId: deleteQuestion.id });
    },
    update: (cache, res) => {
      //needed to remove deleted question from search results
      removeQuestionFromCache(cache, res.data);
    },
    onError: err => console.error(err),
  });

  const [removeQuestionFromDeck] = useMutation(REMOVE_QUESTION_FROM_DECK, {
    onCompleted: ({ removeQuestionFromDeck: { question } }) => {
      dispatch({ type: 'removeFromCurrent', questionId: question.id });
      dispatchNotify({
        type: 'PUSH_SNACK',
        snack: {
          message: 'Question was removed from deck!',
          vertical: 'top',
        },
      });
    },
  });

  const [addQuestionToDeck] = useMutation(ADD_QUESTION_TO_DECK, {
    onCompleted: ({ addQuestionToDeck: { question } }) => {
      dispatch({ type: 'addToCurrent', card, questionId: question.id });
      dispatchNotify({
        type: 'PUSH_SNACK',
        snack: {
          message: 'Question was added to the deck!',
          vertical: 'top',
        },
      });
    },
  });

  const actionText = expanded ? 'Hide Answer' : 'Show Answer';

  const removeFromCurrentDeck = () => {
    removeQuestionFromDeck({ variables: { questionId, deckId } });
  };

  const updateCurrentDeck = () => {
    if (questions[questionId]) {
      removeFromCurrentDeck();
    } else {
      addQuestionToDeck({ variables: { questionId, deckId } });
    }
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
          <IconButton
            onClick={removeFromCurrentDeck}
            aria-label="Remove From Current Deck"
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <FormControlLabel
        control={
          <Switch
            checked={!!questions[questionId]}
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
                <IconButton
                  onClick={() => setOpen(true)}
                  aria-label="Edit Question Button"
                >
                  <CreateIcon />
                </IconButton>
              </Tooltip>
              {deletable ? (
                <Tooltip
                  title="Delete Question"
                  aria-label="Delete Question"
                  placement="top"
                >
                  <IconButton
                    onClick={() => handleDeleteDb(questionId)}
                    aria-label="Permanently Delete Question"
                  >
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
