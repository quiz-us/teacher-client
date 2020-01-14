import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import empty from 'is-empty';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import decamelize from 'decamelize';
import Plain from 'slate-plain-serializer';

import TagsForm from './TagsForm';
import { GET_STANDARDS } from '../../../queries/Standard';
import GlobalLoader from '../../../app/GlobalLoader';
import { QuestionFormContext } from './QuestionFormContext';
import { CurrentDeckContext } from '../../CurrentDeckContext';
import QuestionAndAnswers from './QuestionAndAnswers';

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
  loaderContainer: {
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
});

const questionTypes = ['Free Response', 'Multiple Choice'];

const Form = ({ handleSubmit, editMode, loading }) => {
  const { state, dispatch } = useContext(QuestionFormContext);
  const { dispatch: currentDeckDispatch } = useContext(CurrentDeckContext);
  const { loading: standardsLoading, data } = useQuery(GET_STANDARDS);
  const { questionType, standardId, answers, questionAnswerId } = state;

  const [errorMessage, setErrorMessage] = useState('');

  const classes = useStyles();
  const selectClasses = useSelectStyles();

  if (loading || standardsLoading) {
    return <GlobalLoader />;
  }

  const { allStandards = [] } = data;

  const closeErrorMessage = () => setErrorMessage('');

  const handleInputChange = e => {
    dispatch({
      type: 'update',
      name: e.target.name,
      value: e.target.value,
    });
  };

  const handleQuestionTypeChange = e => {
    const { value } = e.target;

    if (value === 'Free Response' && answers.length > 1) {
      if (
        window.confirm(
          'Changing to a Free Response question will clear your answer choices. Are you sure you want to continue?'
        )
      ) {
        handleInputChange(e);
        dispatch({ type: 'resetAnswerChoices' });
      }
    } else {
      handleInputChange(e);
    }
  };

  const validateAnswers = answers => {
    if (questionType === 'Multiple Choice' && answers.length <= 1) {
      return 'Multiple Choice questions should have more than 1 answer choice!';
    }
    for (let i = 0; i < answers.length; i += 1) {
      const option = answers[i].richText;
      const optionText = Plain.serialize(option);

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
        inputVal = Plain.serialize(inputVal);
      } else if (inputKey === 'answers') {
        const error = validateAnswers(inputVal);
        if (error) {
          setErrorMessage(error);
          return false;
        }
      }
      if (empty(inputVal)) {
        setErrorMessage(`Please fill out '${decamelize(inputKey, ' ')}'!`);
        return false;
      }
    }
    return true;
  };

  const onSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(state).then(({ data: { createQuestion } }) => {
        dispatch({
          type: 'resetForm',
        });
        currentDeckDispatch({
          type: 'addToCurrent',
          card: createQuestion,
          id: createQuestion.id,
        });
        window.scrollTo(0, 0);
      });
    }
  };

  return (
    <Card>
      <form className={classes.form} onSubmit={onSubmit}>
        {!editMode && (
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="questionType-select">
              Select Question Type
            </InputLabel>
            <Select
              value={questionType}
              onChange={handleQuestionTypeChange}
              classes={selectClasses}
              className={classes.select}
              inputProps={{
                name: 'questionType',
                id: 'questionType-select',
              }}
            >
              {questionTypes.map(type => {
                return (
                  <MenuItem
                    className={classes.menuItem}
                    key={type}
                    value={type}
                  >
                    {type}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}

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
        <QuestionAndAnswers classes={classes} key={questionAnswerId} />
        {loading ? (
          <div className={classes.loaderContainer}>
            <CircularProgress />
          </div>
        ) : (
          <Button
            className={classes.submitButton}
            type="submit"
            variant="contained"
            color="primary"
            data-testid="submit-button"
          >
            {editMode ? 'Update' : 'Submit'}
          </Button>
        )}
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
  );
};

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
};

export default Form;
