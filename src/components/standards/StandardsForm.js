import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import useForm from '../hooks/useForm';
import { NotificationsContext } from '../app/notifications/NotificationsContext';
import { mapStandards } from './StandardsManager';
import { CREATE_STANDARD } from '../../gql/mutations/Standard';
import { GET_STANDARDS_WITH_CATEGORIES } from '../../gql/queries/Standard';

const useStyles = makeStyles((theme) => ({
  standardsForm: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  selectFormControl: {
    marginRight: theme.spacing(5),
    width: 225,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
    },
  },
  field: {
    marginRight: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
    },
  },
  standardsFormContainer: {
    margin: '20px',
    padding: '20px',
  },
  createButton: {
    [theme.breakpoints.down('sm')]: {
      marginTop: '25px',
    },
  },
  editCategoriesButton: {
    width: '100%',
  },
}));

const StandardsForm = ({ setOpen, setStandards, categories }) => {
  const classes = useStyles();
  const { dispatch } = useContext(NotificationsContext);
  const { inputs, handleInputChange, resetForm } = useForm({
    categoryId: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    if (inputs.categoryId.length === 0 && categories[0]) {
      handleInputChange({
        target: {
          name: 'categoryId',
          value: categories[0].id,
        },
      });
    }
  }, [categories, handleInputChange, inputs.categoryId.length]);

  const [createStandard] = useMutation(CREATE_STANDARD, {
    onCompleted: (data) => {
      // display success snackbar:
      dispatch({
        type: 'PUSH_SNACK',
        snack: {
          message: `Category '${data.createStandard.title}' was created!`,
          vertical: 'top',
        },
      });

      resetForm();
    },
    update: (cache, res) => {
      const { allStandards } = cache.readQuery({
        query: GET_STANDARDS_WITH_CATEGORIES,
      });

      const updatedStandards = [...allStandards, res.data.createStandard];
      cache.writeQuery({
        query: GET_STANDARDS_WITH_CATEGORIES,
        data: { allStandards: updatedStandards },
      });
      setStandards(updatedStandards.map(mapStandards));
    },
  });

  const { categoryId, title, description } = inputs;

  const onSubmit = (e) => {
    e.preventDefault();
    const formNotFilled = Object.keys(inputs).some(
      (inputKey) => inputs[inputKey] === ''
    );
    if (formNotFilled) {
      dispatch({
        type: 'PUSH_SNACK',
        snack: {
          message: `All fiields are required!`,
          vertical: 'top',
          severity: 'error',
        },
      });
      return;
    }
    createStandard({ variables: inputs });
  };

  return (
    <Card className={classes.standardsFormContainer}>
      <form className={classes.standardsForm} onSubmit={onSubmit}>
        <FormControl className={classes.selectFormControl}>
          <InputLabel id="category">Category</InputLabel>
          <Select
            labelId="category"
            labelWidth={100}
            value={categoryId}
            name="categoryId"
            onChange={handleInputChange}
          >
            {categories.map(({ title, id }) => (
              <MenuItem value={id} key={title + id}>
                {title}
              </MenuItem>
            ))}
            <MenuItem value="" key="edit-button">
              <Button
                className={classes.editCategoriesButton}
                onClick={() => setOpen(true)}
                color="primary"
              >
                Edit Categories
              </Button>
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Standards Title"
          required
          value={title}
          onChange={handleInputChange}
          className={classes.field}
          type="text"
          name="title"
        />
        <TextField
          label="Standards Description"
          required
          className={classes.field}
          value={description}
          onChange={handleInputChange}
          type="text"
          name="description"
          multiline
        />
        <Button
          className={classes.createButton}
          type="submit"
          color="secondary"
          variant="contained"
        >
          Create
        </Button>
      </form>
    </Card>
  );
};

StandardsForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
  setStandards: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

export default StandardsForm;
