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

export const GET_PERIOD_SUMMARY = gql`
  query getPeriodSummary($periodId: ID!) {
    periodStandardsSummary(periodId: $periodId) {
      standard {
        title
        description
      }
      numCorrect
      numAttempts
      percentCorrect
    }
  }
`;
