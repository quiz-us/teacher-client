import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useTable } from 'react-table';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
const useStyles = makeStyles({
  noData: {
    padding: '20px'
  },
  tableContainer: {
    width: '100%',
    overflow: 'scroll'
  }
});

function ReactTable({ columns, data }) {
  const classes = useStyles();
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  const numColumns = headerGroups[0].headers.length;

  // Render the UI for your table
  return (
    <div className={classes.tableContainer}>
      <Table {...getTableProps()} className={classes.table}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.length ? (
            rows.map(
              (row, i) =>
                prepareRow(row) || (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                )
            )
          ) : (
            <TableRow className={classes.noData}>
              {[...Array(numColumns)].map((_, i) => {
                let content = '';
                if (i === 0) {
                  content = 'No data yet!';
                }
                return <TableCell key={`tcell-${i}`}>{content}</TableCell>;
              })}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const DataTable = ({ columns, data }) => {
  const memoizedColumns = React.useMemo(() => columns, [columns]);
  const memoizedData = React.useMemo(() => data, [data]);

  return <ReactTable columns={memoizedColumns} data={memoizedData} />;
};

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
};

DataTable.defaultProps = {
  data: []
};

export default DataTable;
