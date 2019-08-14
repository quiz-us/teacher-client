import React, { useState, useRef, useLayoutEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import QuestionFilter from './QuestionFilter';
import CustomCard from './Card';
import { CurrentDeckProvider } from './CurrentDeckContext';
import CurrentDeck from './CurrentDeck';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100vh'
  },
  filtersContainer: {
    position: 'fixed',
    width: '100%'
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  drawerPaper: {
    padding: '20px'
  },
  placeholder: {
    height: ({ heights = {} }) => `${heights.placeholder}px`,
    width: '100%'
  },
  cardsContainer: {
    display: 'flex',
    height: ({ heights = {} }) =>
      `${heights.deckCreator - heights.placeholder}px`
  },
  bottomContainer: {
    padding: '0 20px',
    width: '50%',
    overflow: 'scroll'
  },
  resultsContainer: {},
  currentDeckContainer: {
    borderLeft: '1px solid #E0E0E0'
  },
  footerActions: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%'
  },
  footerAction: {
    width: '50%',
    borderRadius: 0,
    borderLeft: '1px solid #E0E0E0'
  }
});

const StyledPlaceholder = props => {
  const classes = useStyles(props);
  return <div className={classes.placeholder} {...props} />;
};

const StyledCardContainers = props => {
  const classes = useStyles(props);
  return (
    <div className={classes.cardsContainer} {...props}>
      {props.children}
    </div>
  );
};

const DeckCreator = ({ onQuery }) => {
  const classes = useStyles();
  const [cardsSearch, updateCardsSearch] = useState([]);
  const [currentDeck, setCurrentDeck] = useState({});
  const [filterOpen, setFilterOpen] = useState(true);
  const [heights, setHeights] = useState({
    placeholder: 0,
    deckCreator: 0
  });
  const filtersContainerRef = useRef(null);
  const deckCreatorRef = useRef(null);
  useLayoutEffect(() => {
    setHeights({
      placeholder: filtersContainerRef.current.clientHeight,
      deckCreator: deckCreatorRef.current.clientHeight
    });
  }, [filterOpen]);

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
      <div className={classes.root} ref={deckCreatorRef}>
        <AppBar ref={filtersContainerRef}>
          <Card>
            <CardHeader title="Question Filter" />
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
        </AppBar>

        <StyledPlaceholder heights={heights} />
        <StyledCardContainers heights={heights}>
          <div
            className={`${classes.bottomContainer} ${classes.resultsContainer}`}
          >
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
          <CurrentDeck classes={classes} />
        </StyledCardContainers>
        <div className={classes.footerActions}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.footerAction}
          >
            Create New Question
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.footerAction}
          >
            Save Deck
          </Button>
        </div>
      </div>
    </CurrentDeckProvider>
  );
};

export default DeckCreator;
