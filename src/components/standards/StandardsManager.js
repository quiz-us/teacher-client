import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from '@apollo/react-hooks';
import TextField from '@material-ui/core/TextField';
import MaterialTable from '../table/MaterialTable';
import { NotificationsContext } from '../app/notifications/NotificationsContext';
import { GET_STANDARDS_WITH_CATEGORIES } from '../../gql/queries/Standard';
import { GET_STANDARDS_CATEGORIES } from '../../gql/queries/StandardsCategory';
import { DELETE_STANDARD, EDIT_STANDARD } from '../../gql/mutations/Standard';
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
    editable: 'never',
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
  const { dispatch } = useContext(NotificationsContext);
  const [standards, setStandards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const onError = () => {
    dispatch({
      type: 'PUSH_SNACK',
      snack: {
        message: 'Something went wrong. Please try again!',
        severity: 'error',
        vertical: 'top',
      },
    });
  };
  const [deleteStandard] = useMutation(DELETE_STANDARD, {
    update: (cache, res) => {
      const { id, title } = res.data.deleteStandard;
      dispatch({
        type: 'PUSH_SNACK',
        snack: {
          message: `Standard '${title}' was successfully deleted!`,
          vertical: 'top',
        },
      });
      const { allStandards } = cache.readQuery({
        query: GET_STANDARDS_WITH_CATEGORIES,
      });

      const updatedStandards = allStandards.filter(
        standard => standard.id !== id
      );

      cache.writeQuery({
        query: GET_STANDARDS_WITH_CATEGORIES,
        data: { allStandards: updatedStandards },
      });

      setStandards(updatedStandards.map(mapStandards));
    },
    onError,
  });
  const [editStandard] = useMutation(EDIT_STANDARD, {
    update: (cache, res) => {
      const { id, title } = res.data.editStandard;
      const { allStandards } = cache.readQuery({
        query: GET_STANDARDS_WITH_CATEGORIES,
      });

      const updatedStandards = allStandards.map(standard => {
        if (standard.id === id) {
          return res.data.editStandard;
        }
        return standard;
      });

      cache.writeQuery({
        query: GET_STANDARDS_WITH_CATEGORIES,
        data: { allStandards: updatedStandards },
      });

      const mappedStandards = updatedStandards.map(mapStandards);
      setStandards(mappedStandards);
      dispatch({
        type: 'PUSH_SNACK',
        snack: {
          message: `Standard '${title}' was successfully edited!`,
          vertical: 'top',
        },
      });
    },
    onError,
  });
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
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                const {
                  standardsTitle: newTitle,
                  standardsDescription: newDescription,
                } = newData;
                const {
                  standardsTitle: oldTitle,
                  standardsDescription: oldDescription,
                } = oldData;
                if (
                  oldTitle === newTitle &&
                  newDescription === oldDescription
                ) {
                  resolve();
                }
                editStandard({
                  variables: {
                    id: oldData.id,
                    title: newTitle,
                    description: newDescription,
                  },
                })
                  .then(() => resolve())
                  .catch(error => reject(error));
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                const confirmation = {
                  type: 'OPEN_CONFIRMATION',
                  confirmation: {
                    message:
                      'Are you sure you want to delete this standard? This cannot be undone.',
                    func: () => {
                      deleteStandard({ variables: { id: oldData.id } })
                        .then(() => {
                          resolve();
                        })
                        .catch(error => reject(error));
                    },
                    cancelFunc: () => {
                      resolve();
                    },
                  },
                };
                dispatch(confirmation);
              }),
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
