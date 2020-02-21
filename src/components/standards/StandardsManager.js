import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import TextField from '@material-ui/core/TextField';
import MaterialTable from '../table/MaterialTable';
import { GET_STANDARDS_WITH_CATEGORIES } from '../gql/queries/Standard';
import { GET_STANDARDS_CATEGORIES } from '../gql/queries/StandardsCategory';
import GlobalLoader from '../app/GlobalLoader';
import CategoriesManager from './CategoriesManager';
import StandardsForm from './StandardsForm';

const useStyles = makeStyles({
  header: {
    margin: '20px',
  },
  tableContainer: {
    margin: '20px',
  },
});

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

export const mapStandards = ({ title, description, standardsCategory, id }) => {
  return {
    id,
    standardsTitle: title,
    standardsDescription: description,
    category: standardsCategory.title,
  };
};

const StandardsManager = () => {
  const classes = useStyles();
  const [standards, setStandards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
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
      <StandardsForm
        categories={categories}
        setOpen={setOpen}
        setStandards={setStandards}
      />
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
