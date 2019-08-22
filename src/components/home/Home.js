import React from 'react';
import { makeStyles } from '@material-ui/styles';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import DeckDisplay from './DeckDisplay';
import DecksContainer from '../decks/DecksContainer';
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
    margin: '20px auto',
    flexWrap: 'wrap',
    width: '85%'
  },
  link: {
    color: 'blue',
    textDecoration: 'underline'
  }
});

const Home = () => {
  const classes = useStyles();
  const { loading, data: { decks } = {} } = useQuery(GET_DECKS, {
    fetchPolicy: 'network-only'
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className={classes.root}>
      <div className={classes.deckContainer}>
        {decks && decks.length ? (
          decks.map(deck => (
            <DeckDisplay deck={deck} key={`deckKey-${deck.id}`} />
          ))
        ) : (
          <div>
            You currently have no decks. Go{' '}
            <Link className={classes.link} to="/deck-creator">
              here
            </Link>{' '}
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
      <PrivateRoute path="/decks" component={DecksContainer} />
      <PrivateRoute exact path="/deck-creator" component={DeckCreator} />
    </div>
  );
};
