import React from 'react';
import tableIcons from './TableIcons';
import MaterialTable from 'material-table';

export default props =>
  <MaterialTable
    options={{
      pageSize: 30,
      pageSizeOptions: [30, 50, 100]
    }}
    {...props}
    icons={tableIcons}
  />
