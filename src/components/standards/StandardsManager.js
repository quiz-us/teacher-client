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

const StandardsManager = () => {
  const classes = useStyles();
  const [tableData, setTableData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const { loading } = useQuery(GET_STANDARDS_WITH_CATEGORIES, {
    onCompleted: ({ allStandards }) => {
      let processedCategories = {};
      const processedData = allStandards.map(
        ({ title, description, standardsCategory }) => {
          processedCategories[standardsCategory.id] = standardsCategory;
          return {
            standardsTitle: title,
            standardsDescription: description,
            category: standardsCategory.title,
          };
        }
      );
      processedCategories = Object.entries(processedCategories).map(
        ([_, cat]) => cat
      );
      setCategories(processedCategories);
      setTableData(processedData);
    },
  });
  if (loading) {
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
                <Button onClick={() => setOpen(true)} color="primary">
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
          data={tableData}
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
      />
    </div>
  );
};

export default StandardsManager;
