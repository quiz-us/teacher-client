import React from 'react';
import useForm from '../hooks/useForm';
import { makeStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';

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

const useStyles = makeStyles({
  submitContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px'
  }
});

const QuestionFilter = ({ onFilterUpdate }) => {
  const {
    data: { allStandards = [] },
    loading
  } = useQuery(GET_STANDARDS);

  const classes = useStyles();
  const { inputs, handleInputChange } = useForm({
    standard: '',
    tag: '',
    question: ''
  });

  const onSubmit = e => {
    e.preventDefault();
    onFilterUpdate(inputs);
  };
  return (
    <form onSubmit={onSubmit}>
      <FormControl fullWidth>
        <InputLabel htmlFor="questionStandard-select">Standards</InputLabel>
        <Select
          value={inputs.standard}
          onChange={handleInputChange}
          inputProps={{
            name: 'standard',
            id: 'questionStandard-select'
          }}
        >
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
          label="Tag"
          value={inputs.tag}
          name="tag"
          onChange={handleInputChange}
          margin="normal"
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          id="standard-name"
          label="Question"
          value={inputs.question}
          name="question"
          onChange={handleInputChange}
          margin="normal"
        />
      </FormControl>
      <div className={classes.submitContainer}>
        <Button type="submit" variant="contained" color="secondary">
          Search
        </Button>
      </div>
    </form>
  );
};

export default QuestionFilter;
