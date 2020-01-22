import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Badge from '@material-ui/core/Badge';
import blueGrey from '@material-ui/core/colors/blueGrey';
import Drawer from '@material-ui/core/Drawer';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';

import Confirmation from './Confirmation';
import { CurrentDeckContext } from './CurrentDeckContext';
import CardsContainer from './CardsContainer';
import { GET_DECK, DELETE_DECK } from '../queries/Deck';

const useStyles = makeStyles(theme => ({
  currentDeckContainer: {
    width: '40%',
  },
  submitButton: {
    height: '40px',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  drawer: {
    width: '70%',
    [theme.breakpoints.up('sm')]: {
      width: '30%',
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: '70%',
    [theme.breakpoints.up('sm')]: {
      width: '30%',
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
    '& header': {
      marginLeft: '20px',
      display: 'flex',
    },
  },
  openDrawerButton: {
    background: blueGrey[200],
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
}));

const Header = ({ deleteDeck, isUpdate, classes, deckName }) => {
  return (
    <div className={classes.toolbar}>
      <header>
        <h3>{isUpdate ? deckName : 'Current Deck'}</h3>
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

Header.propTypes = {
  deleteDeck: PropTypes.func,
  isUpdate: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  deckName: PropTypes.string,
};

const CurrentDeckContainer = ({ history, deckId, isUpdate }) => {
  const { currentDeck, dispatch } = useContext(CurrentDeckContext);
  // if a current deck already exists (ie. when editing a deck):
  const { loading } = useQuery(GET_DECK, {
    variables: { id: deckId },
    fetchPolicy: 'network-only',
    skip: deckId === undefined,
    onCompleted: ({ deck }) => {
      dispatch({ type: 'receiveCurrent', deck });
    },
    onError: error => {
      console.error(error);
    },
  });

  const [deleteDeck] = useMutation(DELETE_DECK, {
    variables: { deckId },
    onCompleted: () => {
      history.push('/');
    },
  });

  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const currentDeckArr = Object.keys(currentDeck.questions);

  const [mobileOpen, setMobileOpen] = useState(false);

  const currentDeckComponent = () => (
    <React.Fragment>
      <Header
        deleteDeck={deleteDeck}
        isUpdate={isUpdate}
        deckName={currentDeck.name}
        classes={classes}
      />
      <Divider />
      <CardsContainer loading={loading} />
      {!isUpdate && (
        <Button
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
          className={classes.submitButton}
        >
          Create Deck
        </Button>
      )}
    </React.Fragment>
  );

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
            paper: classes.drawerPaper,
          }}
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          anchor="right"
          className={classes.drawer}
        >
          {currentDeckComponent()}
        </Drawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          anchor="right"
          className={classes.drawer}
        >
          {currentDeckComponent()}
        </Drawer>
      </Hidden>
      {!isUpdate && (
        <Confirmation open={open} setOpen={setOpen} isUpdate={isUpdate} />
      )}
    </React.Fragment>
  );
};

CurrentDeckContainer.propTypes = {
  history: PropTypes.object.isRequired,
  deckId: PropTypes.string,
  isUpdate: PropTypes.bool,
};

export default CurrentDeckContainer;
