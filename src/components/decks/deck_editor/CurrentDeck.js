import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Badge from '@material-ui/core/Badge';
import blueGrey from '@material-ui/core/colors/blueGrey';
import Drawer from '@material-ui/core/Drawer';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';

import Confirmation from './Confirmation';
import { CurrentDeckContext } from '../CurrentDeckContext';
import CardsContainer from './CardsContainer';
import { GET_DECK } from '../../gql/queries/Deck';
import { DELETE_DECK } from '../../gql/mutations/Deck';
import { NotificationsContext } from '../../app/notifications/NotificationsContext';

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
  deckButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '35%',
  },
  heading: {
    width: '65%',
  },
}));

const CurrentDeckContainer = ({ history, deckId }) => {
  const { currentDeck, dispatch } = useContext(CurrentDeckContext);
  const { dispatch: dispatchNotify } = useContext(NotificationsContext);

  const { loading } = useQuery(GET_DECK, {
    fetchPolicy: 'network-only',
    variables: { id: deckId },
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

  const { questions, name } = currentDeck;
  const currentDeckArr = Object.keys(questions);

  const [mobileOpen, setMobileOpen] = useState(false);

  const headerComponent = () => (
    <div className={classes.toolbar}>
      <header>
        <h3 className={classes.heading}>{name || 'Current Deck'}</h3>
        <div className={classes.deckButtons}>
          <IconButton onClick={() => setOpen(true)}>
            <CreateIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              dispatchNotify({
                type: 'OPEN_CONFIRMATION',
                confirmation: {
                  func: deleteDeck,
                  message:
                    'Are you sure you want to delete this deck? This cannot be undone.',
                },
              });
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </header>
    </div>
  );

  const currentDeckComponent = () => (
    <React.Fragment>
      {headerComponent()}
      <Divider />
      <CardsContainer loading={loading} />
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
      <Confirmation open={open} setOpen={setOpen} history={history} />
    </React.Fragment>
  );
};

CurrentDeckContainer.propTypes = {
  history: PropTypes.object.isRequired,
  deckId: PropTypes.string,
};

export default CurrentDeckContainer;
