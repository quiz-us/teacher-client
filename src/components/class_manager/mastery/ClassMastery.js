import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_PERIOD_SUMMARY } from '../../gql/queries/Period';
import GlobalLoader from '../../app/GlobalLoader';
import StickyColumnTable from '../../table/StickyColumnTable';

const columns = [
  {
    title: 'Standard',
    field: 'standard.title',
  },
  {
    title: 'Description',
    field: 'standard.description',
  },
  {
    title: 'Percent Correct',
    field: 'percentCorrect',
    type: 'numeric',
    defaultSort: 'desc',
  },
  {
    title: 'Num Correct',
    field: 'numCorrect',
    type: 'numeric',
  },
  {
    title: 'Num Attempts',
    field: 'numAttempts',
    type: 'numeric',
  },
];

const ClassMastery = ({ match }) => {
  const {
    params: { id },
  } = match;
  const { data, loading } = useQuery(GET_PERIOD_SUMMARY, {
    variables: { periodId: id },
  });

  if (loading) {
    return <GlobalLoader />;
  }
  return (
    <div>
      <StickyColumnTable
        columns={columns}
        data={data.periodStandardsSummary}
        options={{
          pageSize: 25,
          pageSizeOptions: [10, 25, 50],
        }}
        title="Class Mastery Data"
      />
    </div>
  );
};

export default ClassMastery;
