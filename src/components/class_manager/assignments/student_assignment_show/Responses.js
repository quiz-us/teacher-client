import React from 'react';
import PropTypes from 'prop-types';
import Plain from 'slate-plain-serializer';
import { makeStyles } from '@material-ui/styles';
import ReadOnly from '../../../editor/ReadOnly';

const useStyles = makeStyles({
  answersContainer: {
    padding: '0 15px',
  },
  textarea: {
    width: '100%',
  },
});

const Answer = ({ response: { responseText, questionOption, id } }) => {
  const value = responseText
    ? Plain.deserialize(responseText)
    : JSON.parse(questionOption.richText);

  return <ReadOnly key={`response-${id}`} value={value} />;
};

Answer.propTypes = {
  response: PropTypes.shape({
    responseText: PropTypes.string,
    questionOption: PropTypes.object,
    id: PropTypes.string,
  }).isRequired,
};

const Responses = ({ responses }) => {
  const classes = useStyles();
  return (
    <div>
      <h3>Response(s)</h3>
      {responses.length ? (
        responses.map((response, i) => {
          const { mcCorrect, selfGrade, id } = response;
          let result = mcCorrect ? 'CORRECT' : 'WRONG';

          if (Number.isInteger(selfGrade)) {
            result = `Self-Grade: ${selfGrade}`;
          }

          return (
            <div
              className={classes.answersContainer}
              key={`student-responses-${id}`}
            >
              <h4>{`Attempt #${i + 1} (${result})`}</h4>
              <Answer response={response} />
            </div>
          );
        })
      ) : (
        <div>No response yet</div>
      )}
    </div>
  );
};

Responses.propTypes = {
  responses: PropTypes.arrayOf(
    PropTypes.shape({
      mcCorrect: PropTypes.bool,
      selfGrade: PropTypes.number,
      id: PropTypes.string,
    })
  ).isRequired,
};

export default Responses;
