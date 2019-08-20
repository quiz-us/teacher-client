// using example from: https://material-ui.com/components/autocomplete/#downshift
import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import Downshift from "downshift";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import { QuestionFormContext } from "./QuestionFormContext";

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        "data-testid": "tags-form",
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
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
    selectedItem
  } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired
};

function DownshiftMultiple(props) {
  const { classes, fetchTags } = props;
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { state, dispatch } = useContext(QuestionFormContext);
  const { tags } = state;

  function getSuggestions(input) {
    const inputValue = input.trim().toLowerCase();
    fetchTags(inputValue).then(tags => {
      setSuggestions(tags);
    });
  }

  function handleInputChange(event) {
    const input = event.target.value;
    setInputValue(input);
    getSuggestions(input);
  }

  function updateTags(updatedTags) {
    dispatch({
      type: "update",
      name: "tags",
      value: updatedTags
    });
  }

  function handleChange(item) {
    let newSelectedItem = [...tags];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue("");
    updateTags(newSelectedItem);
  }

  function handleKeyDown(event) {
    if (tags.length && !inputValue.length && event.key === "Backspace") {
      updateTags(tags.slice(0, tags.length - 1));
    }
  }

  const handleDelete = item => () => {
    const newSelectedItem = [...tags];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    updateTags(newSelectedItem);
  };

  return (
    <Downshift
      id="downshift-multiple"
      inputValue={inputValue}
      onChange={handleChange}
      selectedItem={tags}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        isOpen,
        selectedItem: selectedItem2,
        highlightedIndex
      }) => {
        const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
          onKeyDown: handleKeyDown,
          placeholder: "Add one or more tag(s)"
        });

        return (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              label: "Tags",
              InputLabelProps: getLabelProps(),
              InputProps: {
                startAdornment: tags.map(item => (
                  <Chip
                    key={item}
                    tabIndex={-1}
                    data-testid="mui-chip"
                    label={item}
                    className={classes.chip}
                    onDelete={handleDelete(item)}
                  />
                )),
                onBlur,
                onChange: event => {
                  handleInputChange(event);
                  onChange(event);
                },
                onFocus
              },
              inputProps
            })}

            {isOpen ? (
              <Paper className={classes.paper} square>
                {suggestions.map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem: selectedItem2
                  })
                )}
              </Paper>
            ) : null}
          </div>
        );
      }}
    </Downshift>
  );
}

DownshiftMultiple.propTypes = {
  classes: PropTypes.object.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  inputRoot: {
    flexWrap: "wrap"
  },
  inputInput: {
    width: "auto",
    flexGrow: 1
  },
  divider: {
    height: theme.spacing(2)
  }
}));

const TagForm = props => {
  const classes = useStyles();
  const { updateTags, fetchTags } = props;
  return (
    <div className={classes.root}>
      <DownshiftMultiple
        classes={classes}
        updateTags={updateTags}
        fetchTags={fetchTags}
      />
    </div>
  );
};

TagForm.propTypes = {
  fetchTags: PropTypes.func.isRequired
};

export default TagForm;
