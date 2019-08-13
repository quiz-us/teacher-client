import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_STANDARDS = gql`
  {
    standardsCharts {
      title
    }
  }
`;

export default () => {
  const { data } = useQuery(GET_STANDARDS);

  return <div>{JSON.stringify(data)} Home page!!</div>;
};
