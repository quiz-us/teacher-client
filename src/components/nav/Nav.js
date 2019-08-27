import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu';
import BuildIcon from '@material-ui/icons/Build';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import { ReactComponent as Logo } from '../../assets/quizus.svg';
import { ReactComponent as SidebarLogo } from '../../assets/quizus-sidebar.svg';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  white: {
    color: 'white'
  },
  list: {
    width: 250
  },
  navHeader: {
    padding: '10px 20px'
  },
  logo: {
    width: 150
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const [navOpen, setNavOpen] = useState(false);

  const sideNav = () => (
    <div className={classes.list} onClick={closeNav} onKeyDown={closeNav}>
      <h3 className={classes.navHeader}>
        <Link to="/">
          <SidebarLogo className={classes.logo} />
        </Link>
      </h3>
      <Divider />
      <List>
        <Link to="/deck-creator">
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
        <Typography variant="h6" className={classes.title}>
          <Link to="/">
            <Logo className={classes.logo} />
          </Link>
        </Typography>
      </Toolbar>
      <Drawer open={navOpen} onClose={closeNav}>
        {sideNav()}
      </Drawer>
    </AppBar>
  );
}
