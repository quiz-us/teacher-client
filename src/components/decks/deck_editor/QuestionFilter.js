import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useDebouncedCallback } from 'use-debounce';
import { useLazyQuery } from '@apollo/react-hooks';

import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import useForm from '../../hooks/useForm';
import GlobalLoader from '../../app/GlobalLoader';
import CustomCard from './Card';
import { GET_STANDARDS } from '../../queries/Standard';

import { GET_QUESTIONS } from '../../queries/Question';

const useStyles = makeStyles({
  resultsContainer: {
    overflow: 'scroll',
    height: '60vh',
    padding: '10px',
  },
});

const QuestionFilter = () => {
  const classes = useStyles();
  const { inputs, handleInputChange } = useForm({
    standardId: '',
    keyWords: '',
  });
  const { loading: standardsLoading, data } = useQuery(GET_STANDARDS);

  const [
    getQuestions,
    { loading, data: { questions } = { questions: [] } },
  ] = useLazyQuery(GET_QUESTIONS);

  const [debouncedGetQuestions] = useDebouncedCallback(e => {
    getQuestions({ variables: filter(e) });
  }, 1000);

  if (standardsLoading) {
    return <GlobalLoader />;
  }

  const { allStandards = [] } = data;

  const filter = e => {
    return { ...inputs, [e.target.name]: e.target.value };
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
                id: 'questionStandard-select',
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
                <CustomCard
                  key={`search-${question.id}`}
                  card={question}
                  inputs={inputs}
                  deletable
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionFilter;
