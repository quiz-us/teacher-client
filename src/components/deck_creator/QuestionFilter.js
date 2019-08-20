import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import useForm from '../hooks/useForm';
import { makeStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useLazyQuery } from '@apollo/react-hooks';
import Card from '@material-ui/core/Card';
import CustomCard from './Card';
import CardContent from '@material-ui/core/CardContent';

// get all the standards for current teacher/standards map
//
const GET_STANDARDS = gql`
  {
    allStandards {
      title
      description
      id
    }
  }
`;

const GET_QUESTIONS = gql`
  query getQuestions($standardId: ID, $keyWords: String, $emptyQuery: Boolean) {
    questions(
      standardId: $standardId
      keyWords: $keyWords
      emptyQuery: $emptyQuery
    ) {
      questionText
      questionType
      questionNode
      id
      standards {
        title
      }
      tags {
        name
      }

      questionOptions {
        optionNode
        correct
        id
      }
    }
  }
`;

const useStyles = makeStyles({
  resultsContainer: {
    overflow: 'scroll',
    height: '60vh',
    padding: '10px'
  }
});

const QuestionFilter = () => {
  const classes = useStyles();
  const { inputs, handleInputChange } = useForm({
    standardId: '',
    keyWords: ''
  });
  const { data: { allStandards = [] } = {} } = useQuery(GET_STANDARDS);
  const [
    getQuestions,
    { loading, data: { questions } = { questions: [] } }
  ] = useLazyQuery(GET_QUESTIONS);
  console.log('whats questions', questions);

  const [debouncedGetQuestions] = useDebouncedCallback(e => {
    getQuestions({ variables: filter(e) });
  }, 1000);

  const filter = e => {
    const newFilter = { ...inputs, [e.target.name]: e.target.value };
    if (Object.values(newFilter).some(input => input !== '')) {
      return newFilter;
    } else {
      return {
        ...newFilter,
        emptyQuery: true
      };
    }
  };

  const onStandardChange = e => {
    handleInputChange(e);
    getQuestions({ variables: filter(e) });
  };

  const onKeyWordChange = e => {
    handleInputChange(e);
    debouncedGetQuestions(e);
  };

  return (
    <div>
      <Card>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel htmlFor="questionStandard-select">Standards</InputLabel>
            <Select
              value={inputs.standardId}
              onChange={onStandardChange}
              inputProps={{
                name: 'standardId',
                id: 'questionStandard-select'
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {allStandards.map(({ title, description, id }) => {
                return (
                  <MenuItem key={title} value={id}>
                    {`${title}: ${description}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              id="standard-name"
              label="Key Word(s)"
              value={inputs.keyWords}
              name="keyWords"
              onChange={onKeyWordChange}
              margin="normal"
            />
          </FormControl>
        </CardContent>
      </Card>
      <div className={classes.searchResults}>
        <h3>Search Results</h3>
        <div className={classes.resultsContainer}>
          {loading ? (
            <div>Loading results...</div>
          ) : (
            questions.map(question => {
              return (
                <CustomCard key={`search-${question.id}`} card={question} />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionFilter;
