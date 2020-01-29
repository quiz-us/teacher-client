import gql from 'graphql-tag';

export const CREATE_PERIOD = gql`
  mutation createPeriod($name: String!) {
    createPeriod(name: $name) {
      name
      id
    }
  }
`;

export const EDIT_PERIOD = gql`
  mutation editPeriod($periodId: ID!, $name: String!) {
    editPeriod(periodId: $periodId, name: $name) {
      name
      id
    }
  }
`;

export const DELETE_PERIOD = gql`
  mutation($periodId: ID!) {
    deletePeriod(periodId: $periodId) {
      id
    }
  }
`;
