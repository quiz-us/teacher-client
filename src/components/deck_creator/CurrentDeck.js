import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Confirmation from './Confirmation';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import { CurrentDeckContext } from './CurrentDeckContext';
import CardsContainer from './CardsContainer';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Badge from '@material-ui/core/Badge';
import blueGrey from '@material-ui/core/colors/blueGrey';

/** @todo: make mobile friendly: https://material-ui.com/components/drawers/#responsive-drawer */

const useStyles = makeStyles(theme => ({
  currentDeckContainer: {
    width: '40%'
  },
  submitButton: {
    height: '40px'
  },
  drawer: {
    width: '70%',
    [theme.breakpoints.up('sm')]: {
      width: '30%',
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: '70%',
    [theme.breakpoints.up('sm')]: {
      width: '30%'
    }
  },
  toolbar: {
    ...theme.mixins.toolbar,
    '& header': {
      marginLeft: '20px',
      display: 'flex'
    }
  },
  openDrawerButton: {
    background: blueGrey[200]
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12
  }
}));

const GET_DECK = gql`
  query getDeck($id: ID!) {
    deck(id: $id) {
      name
      description
      id
      questions {
        id
        questionType
        standards {
          title
        }
        questionNode
        tags {
          name
        }
        questionOptions {
          optionNode
          correct
          id
        }
      }
    }
  }
`;

const DELETE_DECK = gql`
  mutation deleteDeck($deckId: ID!) {
    deleteDeck(deckId: $deckId) {
      name
    }
  }
`;

// if a CurrentDeck has a deckId, then it means that the current deck is being
// edited. If it does not, it means it's being created:

const Header = ({ deleteDeck, isUpdate, classes, data }) => {
  return (
    <div className={classes.toolbar}>
      <header>
        <h3>{isUpdate ? data.deck.name : 'Current Deck'}</h3>
        {isUpdate && (
          <IconButton
            onClick={e => {
              if (
                window.confirm(
                  'Are you sure you want to delete this deck? This cannot be undone.'
                )
              ) {
                deleteDeck();
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </header>
    </div>
  );
};

const CurrentDeck = ({
  deleteDeck,
  isUpdate,
  data,
  currentDeckArr,
  classes,
  setOpen
}) => {
  return (
    <React.Fragment>
      <Header
        deleteDeck={deleteDeck}
        isUpdate={isUpdate}
        data={data}
        classes={classes}
      />
      <Divider />
      <CardsContainer />
      {(isUpdate || currentDeckArr.length) > 0 && (
        <Button
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
          className={classes.submitButton}
        >
          {isUpdate ? 'Update Deck' : 'Create Deck'}
        </Button>
      )}
    </React.Fragment>
  );
};

const CurrentDeckContainer = ({ history, deckId }) => {
  const { currentDeck, dispatch } = useContext(CurrentDeckContext);
  // if a current deck already exists (ie. when editing a deck):
  const { data = {} } = useQuery(GET_DECK, {
    variables: { id: deckId },
    fetchPolicy: 'network-only',
    skip: deckId === undefined,
    onCompleted: ({ deck: { questions } }) => {
      dispatch({ type: 'receiveCurrent', questions });
    },
    onError: error => {
      console.error(error);
    }
  });

  const [deleteDeck] = useMutation(DELETE_DECK, {
    variables: { deckId },
    onCompleted: () => {
      history.push('/');
    }
  });

  const isUpdate = data.deck !== undefined;

  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const currentDeckArr = Object.keys(currentDeck);

  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <React.Fragment>
      <Hidden smUp>
        <Badge
          className={classes.badge}
          badgeContent={currentDeckArr.length}
          color="secondary"
        >
          <Button
            color="secondary"
            variant="contained"
            onClick={() => setMobileOpen(true)}
            className={classes.openDrawerButton}
          >
            See Deck
          </Button>
        </Badge>
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          anchor="right"
          className={classes.drawer}
        >
          <CurrentDeck
            deleteDeck={deleteDeck}
            isUpdate={isUpdate}
            data={data}
            currentDeckArr={currentDeckArr}
            classes={classes}
            setOpen={setOpen}
          />
        </Drawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          anchor="right"
          className={classes.drawer}
        >
          <CurrentDeck
            deleteDeck={deleteDeck}
            isUpdate={isUpdate}
            data={data}
            currentDeckArr={currentDeckArr}
            classes={classes}
            setOpen={setOpen}
          />
        </Drawer>
      </Hidden>
      <Confirmation open={open} setOpen={setOpen} deck={data.deck} />
    </React.Fragment>
  );
};

export default CurrentDeckContainer;
