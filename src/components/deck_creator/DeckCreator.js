import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import QuestionFilter from './QuestionFilter';
import CustomCard from './Card';
import { CurrentDeckProvider } from './CurrentDeckContext';
import CurrentDeck from './CurrentDeck';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
  const [cardsSearch, updateCardsSearch] = useState([]);
  const [currentDeck, setCurrentDeck] = useState({});
  const [filterOpen, setFilterOpen] = useState(true);
  const toggleFilterOpen = () => {
    setFilterOpen(!filterOpen);
  };

  const handleCurrentDeckChange = updatedDeck => {
    setCurrentDeck(updatedDeck);
  };
  const onFilterUpdate = async inputs => {
    const { data } = await onQuery(inputs);
    updateCardsSearch(data);
  };
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
              <Card>
                {filterOpen && (
                  <CardContent>
                    <QuestionFilter onFilterUpdate={onFilterUpdate} />
                  </CardContent>
                )}
                <CardActions className={classes.actions}>
                  <IconButton onClick={toggleFilterOpen}>
                    <ExpandMoreIcon
                      className={filterOpen ? classes.expandOpen : ''}
                    />
                  </IconButton>
                </CardActions>
              </Card>
              <div className={classes.searchResults}>
                <h3>Search Results</h3>
                {cardsSearch.map(card => {
                  return (
                    <CustomCard
                      key={`search-${card.id}`}
                      card={card}
                      currentDeck={currentDeck}
                      handleCurrentDeckChange={handleCurrentDeckChange}
                    />
                  );
                })}
              </div>
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
