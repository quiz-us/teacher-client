import gql from 'graphql-tag';

export const GET_PERIODS = gql`
  query getPeriods {
    periods {
      name
      id
    }
  }
`;

export const GET_PERIOD = gql`
  query getPeriod($periodId: ID!) {
    period(periodId: $periodId) {
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

export const GET_PERIOD_MASTERY = gql`
  query getPeriodMastery($periodId: ID!) {
    periodStandardsMastery(periodId: $periodId) {
      standard {
        title
        id
      }
      studentPerformance
    }
  }
`;
