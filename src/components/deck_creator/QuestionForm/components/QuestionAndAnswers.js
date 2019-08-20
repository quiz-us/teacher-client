import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import { RichTextEditor } from "../../index";
import { QuestionFormContext } from "./QuestionFormContext";
// import { RED } from "../../theme/colors";

const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const useStyles = makeStyles({
  addButton: {
    width: "35px",
    margin: "10px auto"
  },
  mcControls: {
    position: "relative"
  },
  correctCheckbox: {
    marginLeft: "10px"
  },
  deleteButton: {
    right: 0,
    position: "absolute",
    color: 'red'
  }
});

const QuestionAndAnswers = ({ classes }) => {
  let componentClasses = useStyles();

  const { state, dispatch } = useContext(QuestionFormContext);
  const { questionType, answers } = state;

  const updateAnswers = updated => {
    dispatch({
      type: "update",
      name: "answers",
      value: updated
    });
  };

  const updateAllAnswers = index => {
    return updatedVal => {
      const updated = [...answers];
      updated[index].value = updatedVal;
      updateAnswers(updated);
    };
  };

  const addAnswerChoice = e => {
    dispatch({
      type: "addAnswerChoice"
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
      updated[index].isCorrect = checked;
      if (checked) {
        updated = updated.map((answer, i) => {
          if (i !== index) {
            answer.isCorrect = false;
          }
          return answer;
        });
      }
      updateAnswers(updated);
    };
  };

  const answer = () => {
    if (questionType === "Multiple Choice") {
      return (
        <React.Fragment>
          {answers.map(({ value, answerId, isCorrect }, i) => {
            if (i > 25) {
              throw Error(
                "You've added more answer choices than the allowed amount of 26!"
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
                        checked={isCorrect}
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
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
                {/* <RichTextEditor
                  initialValue={value}
                  updateParentState={updateAllAnswers(i)}
                  key={answerId} // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
                /> */}
              </div>
            );
          })}
          <IconButton
            color="secondary"
            onClick={addAnswerChoice}
            title="add answer"
            className={componentClasses.addButton}
          >
            <AddCircleIcon />
          </IconButton>
        </React.Fragment>
      );
    }
    // return answers.map(({ value, answerId }, i) => {
    //   return (
    //     <RichTextEditor
    //       key={answerId}
    //       initialValue={value}
    //       updateParentState={updateAllAnswers(i)}
    //     />
    //   );
    // });
  };
  return (
    <div className={classes.questionAnswerContainer}>
      <FormControl
        className={`${classes.formControl} ${classes.wideFormControl}`}
      >
        <h3>Question: </h3>
        {/* <RichTextEditor
          updateParentState={value =>
            dispatch({ type: "update", name: "question", value })
          }
        /> */}
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
  classes: PropTypes.object.isRequired
};

export default QuestionAndAnswers;
