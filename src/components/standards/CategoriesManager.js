import React from 'react';
import MaterialTable from '../table/MaterialTable';
import Modal from '../app/Modal';

const CategoriesManager = ({ categories }) => {
  return (
    <Modal
      open={true}
      handleClose={() => {}}
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
          },
        ]}
        data={categories}
        editable={{
          onRowAdd: (newData, oldData) => {},
          onRowUpdate: (newData, oldData) => {},
          onRowDelete: oldData => {},
        }}
      />
    </Modal>
  );
};

export default CategoriesManager;
