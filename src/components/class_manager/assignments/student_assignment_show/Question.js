import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import ReadOnly from '../../../editor/ReadOnly';

const useStyles = makeStyles({
  root: {
    marginBottom: '30px',
  },
});

const Question = ({ question }) => {
  const classes = useStyles();
  const { richText, questionType } = question;
  return (
    <div className={classes.root}>
      <h3>{`${questionType}`} Question</h3>
      <ReadOnly value={JSON.parse(richText)} />
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.shape({
    richText: PropTypes.string.isRequired,
    questionType: PropTypes.string.isRequired,
  }).isRequired,
};

export default Question;
