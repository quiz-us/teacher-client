import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import LogOut from '../auth/LogOut';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu';
import BuildIcon from '@material-ui/icons/Build';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { ReactComponent as Logo } from '../../assets/quizus.svg';
import { ReactComponent as SidebarLogo } from '../../assets/quizus-sidebar.svg';
import { useAuth0 } from '../../react-auth0-spa';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      marginRight: theme.spacing(1),
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
    },
  },
  white: {
    color: 'white',
  },
  list: {
    width: 250,
  },
  navHeader: {
    padding: '20px 20px',
  },
  logo: {
    width: 120,
    top: '3px',
    [theme.breakpoints.down('sm')]: {
      width: 100,
    },
    position: 'relative',
  },
  sideBarLogo: {
    width: 130,
    [theme.breakpoints.down('sm')]: {
      width: 120,
    },
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const { isAuthenticated, logout } = useAuth0();
  const [navOpen, setNavOpen] = useState(false);

  const sideNav = () => (
    <div className={classes.list} onClick={closeNav} onKeyDown={closeNav}>
      <div className={classes.navHeader}>
        <Link to="/">
          <SidebarLogo className={classes.sideBarLogo} />
        </Link>
      </div>
      <Divider />
      <List>
        <Link to="/decks/create">
          <ListItem button>
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary={'Deck Creator'} />
          </ListItem>
        </Link>
        <Link to="/class-manager">
          <ListItem button>
            <ListItemIcon>
              <FormatListBulletedIcon />
            </ListItemIcon>
            <ListItemText primary={'Class Manager'} />
          </ListItem>
        </Link>
        <Link to="/standards-manager">
          <ListItem button>
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary={'Standards Manager'} />
          </ListItem>
        </Link>
      </List>
    </div>
  );

  const openNav = () => setNavOpen(true);

  const closeNav = event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setNavOpen(false);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={openNav}
        >
          <MenuIcon />
        </IconButton>
        <Link to="/">
          <Logo className={classes.logo} />
        </Link>
        {isAuthenticated && <LogOut logout={logout} />}
      </Toolbar>
      <Drawer open={navOpen} onClose={closeNav}>
        {sideNav()}
      </Drawer>
    </AppBar>
  );
}
