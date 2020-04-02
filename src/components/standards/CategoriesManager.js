import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { useMutation } from '@apollo/react-hooks';
import { NotificationsContext } from '../app/notifications/NotificationsContext';
import {
  CREATE_STANDARDS_CATEGORY,
  EDIT_STANDARDS_CATEGORY,
  DELETE_STANDARDS_CATEGORY,
} from '../../gql/mutations/StandardsCategory';
import { GET_STANDARDS_WITH_CATEGORIES } from '../../gql/queries/Standard';
import MaterialTable from '../table/MaterialTable';
import Modal from '../app/Modal';
import { mapStandards } from './StandardsManager';

const CategoriesManager = ({
  categories,
  setCategories,
  setStandards,
  open,
  handleClose,
}) => {
  const [createStandardsCategory] = useMutation(CREATE_STANDARDS_CATEGORY);
  const [editStandardsCategory] = useMutation(EDIT_STANDARDS_CATEGORY, {
    update: (cache, res) => {
      const { id, title } = res.data.editStandardsCategory;
      const { allStandards } = cache.readQuery({
        query: GET_STANDARDS_WITH_CATEGORIES,
      });

      const updatedStandards = allStandards.filter(standard => {
        if (standard.standardsCategory.id !== id) {
          return {
            ...standard,
            category: title,
          };
        }
        return standard;
      });

      cache.writeQuery({
        query: GET_STANDARDS_WITH_CATEGORIES,
        data: { allStandards: updatedStandards },
      });

      setStandards(updatedStandards.map(mapStandards));
    },
  });
  const [deleteStandardsCategory] = useMutation(DELETE_STANDARDS_CATEGORY, {
    update: (cache, res) => {
      const { id } = res.data.deleteStandardsCategory;
      const { allStandards } = cache.readQuery({
        query: GET_STANDARDS_WITH_CATEGORIES,
      });

      const updatedStandards = allStandards.filter(
        standard => standard.standardsCategory.id !== id
      );

      cache.writeQuery({
        query: GET_STANDARDS_WITH_CATEGORIES,
        data: { allStandards: updatedStandards },
      });

      setStandards(updatedStandards.map(mapStandards));
    },
  });
  const { dispatch } = useContext(NotificationsContext);
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      maxWidth="xl"
      title="Edit Standards Categories"
    >
      <MaterialTable
        title="All Categories"
        columns={[
          {
            title: 'Category Title',
            field: 'title',
          },
          {
            title: 'Category Description',
            field: 'description',
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
        ]}
        data={categories}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              const { title, description } = newData;
              createStandardsCategory({
                variables: { title, description },
              })
                .then(({ data: { createStandardsCategory: newCategory } }) => {
                  setCategories([...categories, newCategory]);
                  dispatch({
                    type: 'PUSH_SNACK',
                    snack: {
                      message: `New category '${newCategory.title}' added!`,
                      vertical: 'top',
                    },
                  });
                  resolve();
                })
                .catch(error => {
                  dispatch({
                    type: 'PUSH_SNACK',
                    snack: {
                      message: 'Something went wrong. Please try again!',
                      severity: 'error',
                      vertical: 'top',
                    },
                  });
                  reject(error);
                });
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              const { title: newTitle, description: newDescription } = newData;
              const { title: oldTitle, description: oldDescription } = oldData;
              if (oldTitle === newTitle && newDescription === oldDescription) {
                resolve();
              }

              editStandardsCategory({
                variables: {
                  id: oldData.id,
                  title: newTitle,
                  description: newDescription,
                },
              })
                .then(({ data: { editStandardsCategory: editedCategory } }) => {
                  const updatedCategories = categories.map(category => {
                    if (category.id === editedCategory.id) {
                      return editedCategory;
                    }
                    return category;
                  });

                  setCategories(updatedCategories);
                  dispatch({
                    type: 'PUSH_SNACK',
                    snack: {
                      message: `Category '${newData.title}' was updated!`,
                      vertical: 'top',
                    },
                  });
                  resolve();
                })
                .catch(error => {
                  dispatch({
                    type: 'PUSH_SNACK',
                    snack: {
                      message: 'Something went wrong. Please try again!',
                      severity: 'error',
                      vertical: 'top',
                    },
                  });
                  reject(error);
                });
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              dispatch({
                type: 'OPEN_CONFIRMATION',
                confirmation: {
                  message:
                    'WARNING: Deleting this category will delete the category AND all of its associated standards. Are you sure you want to delete this category?',
                  func: () => {
                    deleteStandardsCategory({ variables: { id: oldData.id } })
                      .then(
                        ({
                          data: { deleteStandardsCategory: deletedCategory },
                        }) => {
                          setCategories(
                            categories.filter(
                              category => category.id !== deletedCategory.id
                            )
                          );
                          dispatch({
                            type: 'PUSH_SNACK',
                            snack: {
                              message: `Category '${oldData.title}' and all of its associated standards were successfully deleted!`,
                              vertical: 'top',
                            },
                          });
                          resolve();
                        }
                      )
                      .catch(error => {
                        dispatch({
                          type: 'PUSH_SNACK',
                          snack: {
                            message: 'Something went wrong. Please try again!',
                            severity: 'error',
                            vertical: 'top',
                          },
                        });
                        reject(error);
                      });
                  },
                  cancelFunc: () => {
                    resolve();
                  },
                },
              });
            }),
        }}
      />
    </Modal>
  );
};

export default CategoriesManager;
