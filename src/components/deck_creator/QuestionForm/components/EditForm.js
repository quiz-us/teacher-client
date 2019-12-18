import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { useQuery, useMutation } from '@apollo/react-hooks';
import Plain from 'slate-plain-serializer';
import empty from 'is-empty';

import { Value } from 'slate';

import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import InputLabel from '@material-ui/core/InputLabel';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';

import TagsForm from './TagsForm';
import QuestionAndAnswers from './QuestionAndAnswers';
import decamelize from '../../../util/decamelize';

import { CurrentDeckContext } from '../../CurrentDeckContext';
import {
  QuestionFormProvider,
  QuestionFormContext,
} from './QuestionFormContext';

import { GET_STANDARDS } from '../../../queries/Standard';
import { UPDATE_QUESTION } from '../../../queries/Question';

const useStyles = makeStyles({
  form: {
    width: '90%',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    // width: '40%',
    marginBottom: '20px',
  },
  wideFormControl: {
    // width: '90%'
  },
  questionAnswerContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  submitButton: {
    width: '40%',
    margin: '0 auto',
  },
});

const useSelectStyles = makeStyles({
  root: {
    padding: '10px',
  },
  select: {
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
  errorMessage: {
    color: 'red',
  },
  header: {
    marginTop: '20px',
  },
});

const EditForm = ({ open, questionId, setOpen, inputs }) => {
  const { state, dispatch } = useContext(QuestionFormContext);
  const { dispatch: currentDeckDispatch } = useContext(CurrentDeckContext);

  const { questionType, standardId, answers } = state;
  const [errorMessage, setErrorMessage] = useState('');

  // maybe todo: change fetch policy?
  const {
    loading: standardsLoading,
    data: { allStandards = [] } = { allStandards: [] },
  } = useQuery(GET_STANDARDS);

  const [updateQuestion, { createQuestionLoading }] = useMutation(
    UPDATE_QUESTION,
    {
      onCompleted: ({ updateQuestion }) => {
        handleClose();
        currentDeckDispatch({
          type: 'addToCurrent',
          id: updateQuestion.id,
          card: updateQuestion,
        });
      },
    }
  );

  const classes = useStyles();
  const selectClasses = useSelectStyles();

  const closeErrorMessage = () => setErrorMessage('');

  const handleClose = () => setOpen(false);

  const onSubmit = formData => {
    updateQuestion({
      variables: {
        id: questionId,
        questionType: formData['questionType'],
        standardId: formData['standardId'],
        tags: formData['tags'],
        richText: JSON.stringify(formData['question']),
        questionPlaintext: formData['questionText'],
        questionOptions: formData['answers'].map(answer =>
          JSON.stringify(answer)
        ),
      },
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      const formData = {
        ...state,
        questionText: Plain.serialize(state.question),
        answers: answers.map(answer => {
          return {
            ...answer,

            // When a form is created, if field is edttied,
            // it's richText becomes an instance of a Slate Value

            // When a formed is editted, if a field is editted,
            // it's richText also becomes an instance of a Slate Value.
            // However, when a teacher
            optionText: Plain.serialize(Value.create(answer.richText)),
          };
        }),
      };
      onSubmit(formData);
      console.log('formData', formData);
    }
    // setErrorMessage('');
    // if (currentDeckArr.length && deckName) {
    //   const questionIds = Object.keys(currentDeck);
    //   const variables = {
    //     questionIds,
    //     name: deckName,
    //     description: deckDescription,
    //     deckId: deck.id
    //   };
    //   if (isUpdate) {
    //     updateDeck({ variables });
    //   } else {
    //     createDeck({ variables });
    //   }
    // } else {
    //   if (!currentDeckArr.length) {
    //     setErrorMessage('Your deck needs cards!');
    //   } else if (!deckName) {
    //     setErrorMessage('Please name your deck!');
    //   }
    // }
  };

  const handleInputChange = e => {
    dispatch({
      type: 'update',
      name: e.target.name,
      value: e.target.value,
    });
  };

  //todo make validateAnswers and validateForm into utility functions for all Forms
  const validateAnswers = answers => {
    if (questionType === 'Multiple Choice' && answers.length <= 1) {
      return 'Multiple Choice questions should have more than 1 answer choice!';
    }
    for (let i = 0; i < answers.length; i += 1) {
      const option = answers[i].richText;
      const slateValue = Value.create(option);
      const optionText = Plain.serialize(slateValue);

      if (empty(optionText)) {
        return 'Please make sure there are no empty answer(s)!';
      }
    }
    return null;
  };

  const validateForm = () => {
    const inputKeys = Object.keys(state);
    for (let i = 0; i < inputKeys.length; i += 1) {
      const inputKey = inputKeys[i];
      let inputVal = state[inputKey];
      if (inputKey === 'question') {
        const slateValue = Value.create(inputVal);
        inputVal = Plain.serialize(slateValue);
      } else if (inputKey === 'answers') {
        const error = validateAnswers(inputVal);
        if (error) {
          setErrorMessage(error);
          return false;
        }
      }
      if (empty(inputVal)) {
        setErrorMessage(`Please fill out '${decamelize(inputKey)}'!`);
        return false;
      }
    }
    return true;
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
      <DialogTitle>Update Question</DialogTitle>
      <DialogContent>
        <Card>
          <form className={classes.form} onSubmit={handleSubmit}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="standard-select">Select Standard</InputLabel>
              <Select
                value={standardId}
                onChange={handleInputChange}
                classes={selectClasses}
                className={classes.select}
                inputProps={{
                  name: 'standardId',
                  id: 'standard-select',
                }}
              >
                {standardsLoading && <div>Loading...</div>}
                {allStandards.map(standard => {
                  return (
                    <MenuItem
                      className={classes.menuItem}
                      key={standard.id}
                      value={standard.id}
                    >
                      {standard.title}:{standard.description}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl
              className={`${classes.formControl} ${classes.wideFormControl}`}
            >
              <TagsForm />
            </FormControl>
            <QuestionAndAnswers classes={classes} key={questionId} />
            {/* {loading} */}
          </form>
          <Dialog open={errorMessage !== ''} onClose={closeErrorMessage}>
            <DialogTitle>{errorMessage}</DialogTitle>
            <DialogActions>
              <Button onClick={closeErrorMessage} color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </DialogContent>
      <DialogActions>
        {/* {createLoading && <span>Creating deck...</span>} */}
        {/* {updateLoading && <span>Updating deck...</span>} */}
        {/* {(errorMessage.length > 0 || mutationError) && (
          <span className={classes.errorMessage}>
            {errorMessage || mutationError}
          </span>
        )} */}

        <Button onClick={handleClose} color="secondary">
          Go Back
        </Button>
        <Button onClick={handleSubmit} color="primary" autoFocus>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default props => {
  const {
    card: { questionType, standards, tags, richText, questionOptions, id },
  } = props;
  const initialState = {
    questionType,
    standardId: standards[0].id,
    tags: tags.map(({ name }) => name),
    question: JSON.parse(richText),
    answers: questionOptions.map(({ richText, correct, id }) => ({
      answerId: `${id}-answerId`,
      correct,
      id: id,
      richText: JSON.parse(richText),
    })),
  };
  return (
    <QuestionFormProvider initialState={initialState}>
      <EditForm {...props} questionId={id} />
    </QuestionFormProvider>
  );
};

EditForm.propTypes = {
  open: PropTypes.bool.isRequired,
  questionId: PropTypes.string.isRequired,
  card: PropTypes.shape({
    questionText: PropTypes.string,
    questionType: PropTypes.string,
    richText: PropTypes.string,
    id: PropTypes.string,
    questionOptions: PropTypes.array,
    standards: PropTypes.array,
    tags: PropTypes.array,
  }),
  setOpen: PropTypes.func,
  inputs: PropTypes.shape({
    keyWords: PropTypes.string,
    standardId: PropTypes.string,
  }),
};
