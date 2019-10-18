import React, { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_PERIOD_MASTERY } from '../../queries/Period';
import { GET_STUDENTS } from '../../queries/Student';
import GlobalLoader from '../../app/GlobalLoader';
import MaterialTable from 'material-table';
import tableIcons from '../../table/TableIcons';

const generateColumns = (data = {}) => {
  const columns = [
    {
      title: 'Standards',
      field: 'standard'
    }
  ];
  if (!data.students) {
    return columns;
  }

  data.students.forEach(({ firstName, lastName, id }) => {
    columns.push({
      title: `${firstName} ${lastName}`,
      field: id
    });
  });

  return columns;
};

const generateData = (data = {}) => {
  const parsedData = [];
  if (data.periodStandardsMastery) {
    data.periodStandardsMastery.forEach(({ standard, studentPerformance }) => {
      const parsedPerformance = {};
      const performanceObj = JSON.parse(studentPerformance);
      Object.keys(performanceObj).forEach(studentId => {
        const performance = performanceObj[studentId];
        parsedPerformance[studentId] = performance;
      });

      parsedData.push({
        standard: standard.title,
        ...parsedPerformance
      });
    });
  }
  return parsedData;
};

const ClassMastery = ({ match }) => {
  const {
    params: { id }
  } = match;
  const { data: studentData, loading: studentLoading } = useQuery(
    GET_STUDENTS,
    {
      variables: { periodId: id }
    }
  );
  const { data, loading } = useQuery(GET_PERIOD_MASTERY, {
    variables: { periodId: id }
  });
  const parsedData = useMemo(() => generateData(data), [data]);
  const columns = useMemo(() => generateColumns(studentData), [studentData]);
  if (loading || studentLoading) {
    return <GlobalLoader />;
  }
  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={columns}
        data={parsedData}
        options={{
          pageSize: 25,
          pageSizeOptions: [25, 50, 100]
        }}
        title="Mastery Data"
      />
    </div>
  );
};

export default ClassMastery;