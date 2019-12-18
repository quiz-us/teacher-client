import React from 'react';
import tableIcons from './TableIcons';
import MaterialTable from 'material-table';

export default props => {
  const { options = {} } = props;
  return (
    <MaterialTable
      options={{
        ...options,
        pageSize: 20,
        pageSizeOptions: [10, 20, 50],
      }}
      {...props}
      icons={tableIcons}
    />
  );
};
