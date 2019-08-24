import gql from 'graphql-tag';

export const GET_PERIODS = gql`
  query getPeriods {
    periods {
      name
      id
    }
  }
`;

export const CREATE_PERIOD = gql`
  mutation createPeriod($name: String!) {
    createPeriod(name: $name) {
      name
      id
    }
  }
`;
