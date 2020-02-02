import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import QuestionFilter from './QuestionFilter';
import CurrentDeck from './CurrentDeck';
import CreateForm from '../../questions/question_form/CreateForm';

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

const DeckEditor = ({ match = { params: {} }, history }) => {
  const classes = useStyles();

  return (
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
        classes={classes}
        deckId={match.params.id}
        history={history}
      />
    </div>
  );
};

export default DeckEditor;
