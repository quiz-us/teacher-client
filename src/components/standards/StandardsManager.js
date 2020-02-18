import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import MaterialTable from '../table/MaterialTable';
import { GET_STANDARDS_WITH_CATEGORIES } from '../gql/queries/Standard';
import { GET_STANDARDS_CATEGORIES } from '../gql/queries/StandardsCategory';
import GlobalLoader from '../app/GlobalLoader';
import CategoriesManager from './CategoriesManager';

const useStyles = makeStyles(theme => ({
  header: {
    margin: '20px',
  },
  tableContainer: {
    margin: '20px',
  },
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
    minWidth: 120,
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

const columns = [
  {
    title: 'Category',
    field: 'category',
    defaultGroupOrder: 0,
  },
  {
    title: 'Standards Title',
    field: 'standardsTitle',
    grouping: false,
  },
  {
    title: 'Standards Description',
    field: 'standardsDescription',
    grouping: false,
    editComponent: props => (
      <TextField
        label="Standards Description"
        type="text"
        name="standardsDescription"
        multiline
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    ),
  },
];

export const mapStandards = ({ title, description, standardsCategory }) => {
  return {
    standardsTitle: title,
    standardsDescription: description,
    category: standardsCategory.title,
  };
};

const StandardsManager = () => {
  const classes = useStyles();
  const [standards, setStandards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(true);
  const { loading: categoriesLoading } = useQuery(GET_STANDARDS_CATEGORIES, {
    onCompleted: ({ standardsCategoryIndex }) => {
      setCategories(standardsCategoryIndex);
    },
  });
  const { loading } = useQuery(GET_STANDARDS_WITH_CATEGORIES, {
    onCompleted: ({ allStandards }) => {
      const processedData = allStandards.map(mapStandards);
      setStandards(processedData);
    },
  });
  if (loading || categoriesLoading) {
    return <GlobalLoader />;
  }
  return (
    <div>
      <h2 className={classes.header}>Standards Manager</h2>
      <Card className={classes.standardsFormContainer}>
        <form className={classes.standardsForm}>
          <FormControl className={classes.selectFormControl}>
            <InputLabel id="category">Category</InputLabel>
            <Select labelId="category" labelWidth={100}>
              {categories.map(({ title, id }) => (
                <MenuItem value={id} key={title + id}>
                  {title}
                </MenuItem>
              ))}
              <MenuItem>
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
            className={classes.field}
            type="text"
            name="standardsTitle"
          />
          <TextField
            label="Standards Description"
            className={classes.field}
            type="text"
            name="standardsDescription"
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
      <div className={classes.tableContainer}>
        <MaterialTable
          title="All Standards"
          columns={columns}
          data={standards}
          options={{
            grouping: true,
          }}
          editable={{
            onRowUpdate: (newData, oldData) => {},
            onRowDelete: oldData => {},
          }}
        />
      </div>
      <CategoriesManager
        open={open}
        handleClose={() => setOpen(false)}
        categories={categories}
        setCategories={setCategories}
        setStandards={setStandards}
      />
    </div>
  );
};

export default StandardsManager;
