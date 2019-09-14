import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/styles';

import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { CurrentDeckContext } from '../../CurrentDeckContext';
import {
  QuestionFormProvider,
  QuestionFormContext
} from './QuestionFormContext';

// import CardsContainer from './CardsContainer';
// import parseError from '../../util/parseError';

import {
  UPDATE_QUESTION,
  GET_QUESTION,
  GET_QUESTIONS
} from '../../../queries/Question';

const useStyles = makeStyles({
  form: {
    width: '90%',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column'
  },
  formControl: {
    // width: '40%',
    marginBottom: '20px'
  },
  wideFormControl: {
    // width: '90%'
  },
  questionAnswerContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  submitButton: {
    width: '40%',
    margin: '0 auto'
  }
});

const useSelectStyles = makeStyles({
  root: {
    padding: '10px'
  },
  select: {
    '&:focus': {
      backgroundColor: 'transparent'
    }
  },
  errorMessage: {
    color: 'red'
  },
  header: {
    marginTop: '20px'
  }
});

// if deck is passed in as a prop, it means a deck already existed and that this
// is an update call:

const EditForm = ({
  open,
  setOpen,
  questionId,
  questionType,
  richText,
  standards,
  tags,
  questionOptions
}) => {
  const { state, dispatch } = useContext(QuestionFormContext);
  // dispatch({ type: 'update', questionType });
  console.log(state, dispatch);

  // const { currentDeck } = useContext(CurrentDeckContext);
  // const [deckName, setDeckName] = useState('');
  // const [deckDescription, setDeckDescription] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  // const [
  //   createDeck,
  //   { loading: createLoading, data: createData = {}, error: createError }
  // ] = useMutation(CREATE_DECK);
  // const [
  //   updateDeck,
  //   { loading: updateLoading, data: updateData = {}, error: updateError }
  // ] = useMutation(UPDATE_DECK);
  // useEffect(() => {
  //   if (isUpdate) {
  //     setDeckName(deck.name);
  //     setDeckDescription(deck.description);
  //   }
  // }, [deck, isUpdate]);

  // if (createData.createDeck || updateData.updateDeck) {
  //   return (
  //     <Redirect
  //       to={{
  //         pathname: '/'
  //       }}
  //     />
  //   );
  // }
  // MUTATION ERROR HANDLING:
  // let mutationError;
  // if (createError) {
  //   mutationError = parseError(createError);
  // } else if (updateError) {
  //   mutationError = parseError(updateError);
  // }

  // const currentDeckArr = Object.keys(currentDeck);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
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
  const classes = useStyles();
  const selectClasses = useSelectStyles();

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth='md'>
      <DialogTitle>Update Question</DialogTitle>
      <DialogContent>
        <Card>
          <form className={classes.form} onSubmit={handleSubmit}>
            {questionId}
            {/* <FormControl className={classes.formControl}>
              <InputLabel htmlFor='questionType-select'>
                Select Question Type
              </InputLabel>
              <Select
                value={questionType}
                onChange={handleQuestionTypeChange}
                classes={selectClasses}
                className={classes.select}
                inputProps={{
                  name: 'questionType',
                  id: 'questionType-select'
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
            </FormControl> */}
            {/* <FormControl className={classes.formControl}>
              <InputLabel htmlFor='standard-select'>Select Standard</InputLabel>
              <Select
                value={standardId}
                onChange={handleInputChange}
                classes={selectClasses}
                className={classes.select}
                inputProps={{
                  name: 'standardId',
                  id: 'standard-select'
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
            </FormControl> */}
            {/* <FormControl
              className={`${classes.formControl} ${classes.wideFormControl}`}
            >
              <TagsForm fetchTags={fetchTags} />
            </FormControl> */}
            {/* <QuestionAndAnswers classes={classes} key={questionAnswerId} /> */}
            {/* <Button
              className={classes.submitButton}
              type='submit'
              variant='contained'
              color='primary'
              data-testid='submit-button'
            >
              Submit
            </Button> */}
          </form>
          {/* <Dialog open={errorMessage !== ''} onClose={closeErrorMessage}>
            <DialogTitle>{errorMessage}</DialogTitle>
            <DialogActions>
              <Button onClick={closeErrorMessage} color='primary' autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog> */}
        </Card>
      </DialogContent>
      <DialogActions>
        {/* {createLoading && <span>Creating deck...</span>}
        {updateLoading && <span>Updating deck...</span>}
        {(errorMessage.length > 0 || mutationError) && (
          <span className={classes.errorMessage}>
            {errorMessage || mutationError}
          </span>
        )} */}

        <Button onClick={handleClose} color='secondary'>
          Go Back
        </Button>
        <Button onClick={handleSubmit} color='primary' autoFocus>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditForm;
