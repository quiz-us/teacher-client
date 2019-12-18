import React, { useMemo } from 'react';
import MaterialTable from './MaterialTable';
import cloneDeep from 'lodash.clonedeep';

const processColumns = columns => {
  const columnsDup = cloneDeep(columns);

  const cellStyle = {
    backgroundColor: '#039be5',
    color: '#FFF',
    position: 'sticky',
    left: 0,
  };
  const headerStyle = {
    backgroundColor: '#039be5',
    position: 'sticky',
    left: 0,
    zIndex: 11,
  };

  columnsDup[0] = {
    cellStyle,
    headerStyle,
    ...columnsDup[0],
  };

  return columnsDup;
};

export default props => {
  const { columns, ...tableProps } = props;
  const updatedColumns = useMemo(() => processColumns(columns), [columns]);
  return <MaterialTable columns={updatedColumns} {...tableProps} />;
};
