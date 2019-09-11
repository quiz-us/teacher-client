import React, { useState, useContext } from 'react';
import gql from 'graphql-tag';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { ReadOnly } from '../editor';
import { CurrentDeckContext } from './CurrentDeckContext';
import { useMutation } from '@apollo/react-hooks';

import { GET_QUESTIONS } from './QuestionFilter';

const DELETE_QUESTION = gql`
  mutation deleteQuestion($questionId: ID!) {
    deleteQuestion(questionId: $questionId) {
      id
    }
  }
`;

const useStyles = makeStyles({
  root: {
    marginBottom: '20px'
  },
  actions: {
    justifyContent: 'center',
    padding: 0,
    height: '15px'
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  cardHeader: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  readOnly: {
    width: '100%'
  },
  details: {
    marginTop: '15px'
  },
  answerChoiceRow: {
    display: 'flex',
    marginTop: '10px'
  },
  correctnessIcon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '5px'
  }
});

const Answers = ({ questionOptions, classes }) => {
  return (
    <div>
      {questionOptions.map(({ correct, richText, id }) => {
        return (
          <div className={classes.answerChoiceRow} key={`answerChoice-${id}`}>
            <span className={classes.correctnessIcon}>
              {correct ? (
                <CheckIcon title='Correct Answer' />
              ) : (
                <ClearIcon title='Incorrect Answer' />
              )}
            </span>

            <div className={classes.readOnly}>
              <ReadOnly value={JSON.parse(richText)} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DeckCard = ({ card, removable = null, inputs, deletable = null }) => {
  const { currentDeck, dispatch } = useContext(CurrentDeckContext);
  const {
    id,
    questionType,
    richText = '',
    standards = [{}],
    tags = [],
    questionOptions = []
  } = card;
  const [standard] = standards;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const updateCache = (cache, { deleteQuestion: { id } }) => {
    //how to key into the cache without readQuery
    const { questions } = cache.readQuery({
      query: GET_QUESTIONS,
      variables: {
        standardId: inputs.standardId,
        keyWords: inputs.keyWords
        //emptyQuery? i assume we dont need it because we arent debouncing
      }
    });
    const updatedQuestions = questions.filter(question => question.id !== id);
    // const immutableAssignment = Map(questions);
    // // needs to be a deep clone in order to trigger parent UI update:
    // const updatedAssignment = immutableAssignment.toObject();
    // updatedAssignment.responses = updatedResponses;
    cache.writeQuery({
      query: GET_QUESTIONS,
      variables: {
        standardId: inputs.standardId,
        keyWords: inputs.keyWords
        //emptyQuery? i assume we dont need it because we arent debouncing
      },
      data: { questions: updatedQuestions }
    });
  };

  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    onCompleted: ({ deleteQuestion: { id } }) => {
      dispatch({ type: 'removeFromCurrent', id });
    },
    update: (cache, res) => {
      updateCache(cache, res.data);
    },
    onError: err => console.error(err)
  });

  const actionText = expanded ? 'Hide Answer' : 'Show Answer';
  const updateCurrentDeck = () => {
    if (currentDeck[id]) {
      dispatch({ type: 'removeFromCurrent', id });
    } else {
      dispatch({ type: 'addToCurrent', card, id });
    }
  };

  const removeFromCurrentDeck = () => {
    dispatch({ type: 'removeFromCurrent', id });
  };

  const handleDeleteDb = id => {
    deleteQuestion({
      variables: {
        questionId: id
      }
    });
  };

  const controls = () => {
    if (removable) {
      return (
        <IconButton onClick={removeFromCurrentDeck}>
          <ClearIcon />
        </IconButton>
      );
    }
    return (
      <FormControlLabel
        control={
          <Switch
            checked={inCurrentDeck}
            onChange={updateCurrentDeck}
            color='primary'
          />
        }
        label='In Current Deck'
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
        <CreateIcon onClick={() => alert('edit wip')} />
        {deletable ? (
          <DeleteForeverIcon onClick={() => handleDeleteDb(id)} />
        ) : (
          ''
        )}
        <ReadOnly value={JSON.parse(richText)} />

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

      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <h4>Answer</h4>
          <Answers classes={classes} questionOptions={questionOptions} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default DeckCard;
