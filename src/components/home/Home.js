import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import DeckDisplay from './DeckDisplay';
import DeckAssigner from '../decks/DeckAssigner';
import GlobalLoader from '../app/GlobalLoader';

const GET_DECKS = gql`
  {
    decks {
      id
      name
      description
    }
  }
`;

const useStyles = makeStyles({
  root: {
    padding: '30px',
  },
  deckContainer: {
    display: 'flex',
    margin: '20px auto',
    flexWrap: 'wrap',
    width: '85%',
  },
  link: {
    color: 'blue',
    textDecoration: 'underline',
  },
});

const Home = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState({});
  const { loading, data } = useQuery(GET_DECKS, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <GlobalLoader />;
  }

  const { decks = {} } = data;
  const openAssigner = (deck) => {
    return () => {
      setOpen(true);
      setSelectedDeck(deck);
    };
  };

  const closeAssigner = () => {
    setOpen(false);
    setSelectedDeck({});
  };

  return (
    <div className={classes.root}>
      <div className={classes.deckContainer}>
        {decks && decks.length > 0 ? (
          decks.map((deck) => (
            <DeckDisplay
              openAssigner={openAssigner(deck)}
              deck={deck}
              key={`deckKey-${deck.id}`}
            />
          ))
        ) : (
          <p>
            Check out{' '}
            <a
              href="https://info.quizus.org/"
              className={classes.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              the guide
            </a>{' '}
            to get started!
          </p>
        )}
      </div>
      <DeckAssigner
        open={open}
        closeAssigner={closeAssigner}
        selectedDeck={selectedDeck}
      />
    </div>
  );
};

export default Home;
