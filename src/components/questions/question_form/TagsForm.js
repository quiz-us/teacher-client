// using example from: https://material-ui.com/components/autocomplete/#downshift
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

import { QuestionFormContext } from './QuestionFormContext';

const TAG_SEARCH = gql`
  query tagSearch($string: String) {
    tagSearch(string: $string) {
      name
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing(2),
  },
}));

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        'data-testid': 'tags-form',
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestionProps) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    tags,
  } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (tags || '').indexOf(suggestion.label) > -1;
  return (
    <MenuItem
      {...itemProps}
      key={suggestion.name}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.name}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function DownshiftMultiple(props) {
  const { classes } = props;
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useContext(QuestionFormContext);
  const { tags } = state;
  const { data } = useQuery(TAG_SEARCH, {
    variables: { string: inputValue },
    skip: inputValue === '', // don't query for tags in the beginning with empty string
  });

  useEffect(() => {
    if (data && data.tagSearch) {
      setSuggestions(data.tagSearch);
    }
  }, [inputValue, data]);

  function handleInputChange(event) {
    const input = event.target.value;
    if (input && !isOpen) {
      setIsOpen(true);
    }
    setInputValue(input);
  }

  function updateTags(updatedTags) {
    dispatch({
      type: 'update',
      name: 'tags',
      value: updatedTags,
    });
  }

  function handleChange(item) {
    const parsedItem = item.trim().toLowerCase();
    let newSelectedItem = [...tags];
    if (newSelectedItem.indexOf(parsedItem) === -1) {
      newSelectedItem = [...newSelectedItem, parsedItem];
    }
    setInputValue('');
    setIsOpen(false);
    updateTags(newSelectedItem);
  }

  function handleKeyDown(event) {
    if (tags.length && !inputValue.length && event.key === 'Backspace') {
      updateTags(tags.slice(0, tags.length - 1));
    }
  }

  const handleDelete = (item) => () => {
    const newSelectedItem = [...tags];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    updateTags(newSelectedItem);
  };

  return (
    <Downshift
      id="downshift-multiple"
      inputValue={inputValue}
      onChange={handleChange}
      defaultHighlightedIndex={0}
    >
      {({ getInputProps, getItemProps, getLabelProps, highlightedIndex }) => {
        const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
          onKeyDown: handleKeyDown,
          placeholder: 'Add one or more tag(s)',
        });

        return (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              label: 'Tags (optional)',
              InputLabelProps: getLabelProps(),
              InputProps: {
                startAdornment: tags.map((item) => (
                  <Chip
                    key={item}
                    tabIndex={-1}
                    data-testid="mui-chip"
                    label={item}
                    className={classes.chip}
                    onDelete={handleDelete(item)}
                  />
                )),
                onBlur: () => {
                  setIsOpen(false);
                  if (inputValue) {
                    handleChange(inputValue);
                  }
                },
                onChange: (event) => {
                  handleInputChange(event);
                  onChange(event);
                },
                onFocus: () => {
                  setIsOpen(true);
                },
              },
              inputProps,
            })}

            {isOpen ? (
              <Paper className={classes.paper} square>
                {suggestions.map((suggestion, index) => {
                  return renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.name }),
                    highlightedIndex,
                    tags,
                  });
                })}
                {inputValue &&
                  !suggestions.some(
                    (suggestion) => suggestion.name === inputValue
                  ) &&
                  renderSuggestion({
                    suggestion: { name: inputValue, label: inputValue },
                    index: suggestions.length,
                    itemProps: getItemProps({ item: inputValue }),
                    highlightedIndex,
                    tags,
                  })}
              </Paper>
            ) : null}
          </div>
        );
      }}
    </Downshift>
  );
}
DownshiftMultiple.propTypes = {
  classes: PropTypes.object.isRequired,
};

const TagForm = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <DownshiftMultiple classes={classes} />
    </div>
  );
};

TagForm.propTypes = {};

export default TagForm;
