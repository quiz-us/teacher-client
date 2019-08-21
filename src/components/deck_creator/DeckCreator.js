import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { makeStyles } from '@material-ui/styles';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { CurrentDeckProvider } from './CurrentDeckContext';
import QuestionFilter from './QuestionFilter';
import CurrentDeck from './CurrentDeck';
import QuestionForm from './QuestionForm';

const GET_STANDARDS = gql`
  {
    allStandards {
      title
      description
      id
    }
  }
`;

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    height: '100vh'
  },
  firstContainer: {
    width: '60%',
    padding: '25px',
    borderRight: '1px solid #E0E0E0'
  },
  secondContainer: {
    width: '40%'
  },
  searchResults: {
    padding: '15px'
  },
  panel: {
    padding: '10px'
  }
});

const DeckCreator = ({ match = { params: {} } }) => {
  const classes = useStyles();
  const {
    loading: standardsLoading,
    data: { allStandards = [] } = {}
  } = useQuery(GET_STANDARDS);

  return (
    <CurrentDeckProvider>
      <div className={classes.root}>
        <div className={classes.firstContainer}>
          <Tabs>
            <TabList>
              <Tab>Create Question</Tab>
              <Tab>Search Questions</Tab>
            </TabList>

            <TabPanel className={classes.panel}>
              <QuestionForm
                standardsLoading={standardsLoading}
                allStandards={allStandards}
              />
            </TabPanel>
            <TabPanel className={classes.panel}>
              <QuestionFilter
                standardsLoading={standardsLoading}
                allStandards={allStandards}
              />
            </TabPanel>
          </Tabs>
        </div>
        <div className={classes.secondContainer}>
          <CurrentDeck classes={classes} deckId={match.params.id} />
        </div>
      </div>
    </CurrentDeckProvider>
  );
};

export default DeckCreator;
