import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import gql from "graphql-tag";

import QuestionFilter from './QuestionFilter';
import { CurrentDeckProvider } from './CurrentDeckContext';
import CurrentDeck from './CurrentDeck';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import QuestionForm from './QuestionForm';
import { useQuery, useApolloClient } from "@apollo/react-hooks";

const GET_STANDARDS = gql`
  {
    allStandards {
      title
      description
      id
    }
  }
`;

const GET_TAGS = gql`
  {
    tags {
      id
      name
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

const questionTypes = ["Free Response", "Multiple Choice"];

const onSubmit = formData => {
  console.log(JSON.stringify(formData, 2));
  // alert(JSON.stringify(formData, 2));
};

const DeckCreator = ({ onQuery }) => {
  const classes = useStyles();
  const { data: { allStandards = [] } = {} } = useQuery(GET_STANDARDS);
  const { data: { allTags = [] } = {} } = useQuery(GET_TAGS);



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
              <QuestionForm
                standards={allStandards}
                questionTypes={questionTypes}
                onSubmit={onSubmit}
                // fetchTags={() => allTags}
              />
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
