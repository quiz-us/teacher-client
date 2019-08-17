import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import QuestionFilter from './QuestionFilter';
import { CurrentDeckProvider } from './CurrentDeckContext';
import CurrentDeck from './CurrentDeck';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    height: '100vh'
  },
  firstContainer: {
    width: '60%',
    padding: '5px',
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

const DeckCreator = ({ onQuery }) => {
  const classes = useStyles();

  return (
    <CurrentDeckProvider>
      <div className={classes.root}>
        <div className={classes.firstContainer}>
          <Tabs>
            <TabList>
              <Tab>Search Questions</Tab>
              <Tab>Create Question</Tab>
            </TabList>

            <TabPanel className={classes.panel}>
              <QuestionFilter />
            </TabPanel>
            <TabPanel className={classes.panel}>
              <h2>Question Form Goes here</h2>
            </TabPanel>
          </Tabs>
        </div>
        <div className={classes.secondContainer}>
          <CurrentDeck classes={classes} />
        </div>
      </div>
    </CurrentDeckProvider>
  );
};

export default DeckCreator;
