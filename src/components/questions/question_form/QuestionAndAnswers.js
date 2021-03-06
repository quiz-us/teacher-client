import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { RichTextEditor } from '../../editor';
import Plain from 'slate-plain-serializer';

import { QuestionFormContext } from './QuestionFormContext';
// import { RED } from "../../theme/colors";

const ALPHABET = [...'ABCDEFGHIJ'];

const useStyles = makeStyles({
  addButton: {
    margin: '20px auto',
  },
  mcControls: {
    position: 'relative',
  },
  correctCheckbox: {
    marginLeft: '10px',
  },
  deleteButton: {
    right: 0,
    position: 'absolute',
  },
});

const QuestionAndAnswers = ({ classes }) => {
  let componentClasses = useStyles();

  const { state, dispatch } = useContext(QuestionFormContext);
  const { questionType, answers, question } = state;

  const updateAnswers = updated => {
    dispatch({
      type: 'update',
      name: 'answers',
      value: updated,
    });
  };

  const updateAllAnswers = index => {
    return updatedVal => {
      const updated = [...answers];
      updated[index].richText = updatedVal;
      updateAnswers(updated);
    };
  };

  const addAnswerChoice = e => {
    dispatch({
      type: 'addAnswerChoice',
    });
  };

  const deleteAnswerChoice = index => {
    return e => {
      e.preventDefault();
      const updated = answers.filter((_, i) => {
        return index !== i;
      });
      updateAnswers(updated);
    };
  };

  const handleCorrectAnswer = index => {
    return e => {
      const { checked } = e.target;
      let updated = [...answers];
      updated[index].correct = checked;
      if (checked) {
        updated = updated.map((answer, i) => {
          if (i !== index) {
            answer.correct = false;
          }
          return answer;
        });
      }
      updateAnswers(updated);
    };
  };

  const answer = () => {
    if (questionType === 'Multiple Choice') {
      return (
        <React.Fragment>
          {answers.map(({ richText, answerId, correct }, i) => {
            if (i > 10) {
              throw Error(
                "You've added more answer choices than the allowed amount of 10!"
              );
            }
            return (
              <div key={answerId}>
                <div className={componentClasses.mcControls}>
                  {ALPHABET[i]}.
                  <FormControlLabel
                    className={componentClasses.correctCheckbox}
                    control={
                      <Checkbox
                        onChange={handleCorrectAnswer(i)}
                        checked={correct}
                        value={i}
                        color="primary"
                      />
                    }
                    label="Correct Answer"
                  />
                  <IconButton
                    className={componentClasses.deleteButton}
                    onClick={deleteAnswerChoice(i)}
                    title="delete answer"
                    aria-label="Delete Answer Choice"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
                <RichTextEditor
                  initialValue={richText}
                  key={answerId} // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
                  updateParentState={updateAllAnswers(i)}
                />
              </div>
            );
          })}
          <Button
            className={componentClasses.addButton}
            variant="contained"
            color="secondary"
            onClick={addAnswerChoice}
          >
            Add Answer Choice
          </Button>
        </React.Fragment>
      );
    }
    return answers.map(({ richText, answerId }, i) => {
      return (
        <RichTextEditor
          key={answerId}
          initialValue={richText}
          updateParentState={updateAllAnswers(i)}
        />
      );
    });
  };
  return (
    <div className={classes.questionAnswerContainer}>
      <FormControl
        className={`${classes.formControl} ${classes.wideFormControl}`}
      >
        <h3>Question: </h3>
        <RichTextEditor
          initialValue={
            Object.keys(question).length === 0
              ? Plain.deserialize('')
              : question
          }
          updateParentState={value =>
            dispatch({ type: 'update', name: 'question', value })
          }
        />
      </FormControl>
      <FormControl
        className={`${classes.formControl} ${classes.wideFormControl}`}
      >
        <h3>Answer: </h3>
        {answer()}
      </FormControl>
    </div>
  );
};

QuestionAndAnswers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default QuestionAndAnswers;
