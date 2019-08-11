import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const standardsQuery = gql`
  {
    standardsCharts {
      title
    }
  }
`;

export default () => {
  const { data } = useQuery(standardsQuery);
  return <div>{JSON.stringify(data)} Home page!!</div>;
};
