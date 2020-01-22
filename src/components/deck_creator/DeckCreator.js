import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { CurrentDeckProvider } from './CurrentDeckContext';
import QuestionFilter from './QuestionFilter';
import CurrentDeck from './CurrentDeck';
import CreateForm from './QuestionForm/CreateForm';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  firstContainer: {
    width: '70%',
    padding: '25px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  secondContainer: {
    width: '40%',
  },
  searchResults: {
    padding: '15px',
  },
  panel: {
    padding: '10px',
  },
}));

const DeckCreator = ({ match = { params: {} }, history, isUpdate }) => {
  const classes = useStyles();

  return (
    <CurrentDeckProvider>
      <div className={classes.root}>
        <Tabs className={classes.firstContainer}>
          <TabList>
            <Tab>Create Question</Tab>
            <Tab>Search Questions</Tab>
          </TabList>

          <TabPanel className={classes.panel}>
            <CreateForm />
          </TabPanel>
          <TabPanel className={classes.panel}>
            <QuestionFilter />
          </TabPanel>
        </Tabs>
        <CurrentDeck
          isUpdate={isUpdate}
          classes={classes}
          deckId={match.params.id}
          history={history}
        />
      </div>
    </CurrentDeckProvider>
  );
};

export default DeckCreator;
