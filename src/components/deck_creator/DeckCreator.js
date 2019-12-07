import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { makeStyles } from '@material-ui/core/styles';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { CurrentDeckProvider } from './CurrentDeckContext';
import QuestionFilter from './QuestionFilter';
import CurrentDeck from './CurrentDeck';
import QuestionForm from './QuestionForm';
import { GET_STANDARDS } from '../queries/Standard';
import GlobalLoader from '../app/GlobalLoader';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  firstContainer: {
    width: '70%',
    padding: '25px',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
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
}));

const DeckCreator = ({ match = { params: {} }, history }) => {
  const classes = useStyles();
  const { loading, data } = useQuery(GET_STANDARDS);

  if (loading) {
    return <GlobalLoader />;
  }

  const { allStandards = [] } = data;

  return (
    <CurrentDeckProvider>
      <div className={classes.root}>
        <Tabs className={classes.firstContainer}>
          <TabList>
            <Tab>Create Question</Tab>
            <Tab>Search Questions</Tab>
          </TabList>

          <TabPanel className={classes.panel}>
            <QuestionForm
              standardsLoading={loading}
              allStandards={allStandards}
            />
          </TabPanel>
          <TabPanel className={classes.panel}>
            <QuestionFilter
              standardsLoading={loading}
              allStandards={allStandards}
            />
          </TabPanel>
        </Tabs>
        <CurrentDeck
          classes={classes}
          deckId={match.params.id}
          history={history}
        />
      </div>
    </CurrentDeckProvider>
  );
};

export default DeckCreator;
