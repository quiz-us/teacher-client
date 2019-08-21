import React from 'react';
import { makeStyles } from '@material-ui/styles';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import DeckDisplay from './DeckDisplay';
import PrivateRoute from '../PrivateRoute';
import DeckCreator from '../deck_creator/DeckCreator';

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
    padding: '30px'
  },
  deckContainer: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

const Home = () => {
  const classes = useStyles();
  const { data: { decks } = {} } = useQuery(GET_DECKS);
  return (
    <div className={classes.root}>
      <h3>Your Decks:</h3>
      <div className={classes.deckContainer}>
        {decks ? (
          decks.map(deck => (
            <DeckDisplay deck={deck} key={`deckKey-${deck.id}`} />
          ))
        ) : (
          <div>
            You currently have no decks. Go <Link to="/deck-creator">here</Link>{' '}
            to create your first deck!
          </div>
        )}
      </div>
    </div>
  );
};

export default () => {
  return (
    <div>
      <PrivateRoute exact path="/" component={Home} />
      <PrivateRoute exact path="/deck-creator" component={DeckCreator} />
    </div>
  );
};
