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
  const { loading, data } = useQuery(standardsQuery);
  console.log('loading', loading);
  console.log('data', data);
  return <div>{JSON.stringify(data)} Home page!!</div>;
};
