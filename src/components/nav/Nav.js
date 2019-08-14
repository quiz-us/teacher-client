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
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  list: {
    width: 250
  },
  navHeader: {
    padding: '10px 20px'
  },
  link: {
    color: 'black',
    textDecoration: 'none'
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const [navOpen, setNavOpen] = useState(false);

  const sideNav = () => (
    <div className={classes.list} onClick={closeNav} onKeyDown={closeNav}>
      <h3 className={classes.navHeader}>Quiz Us</h3>
      <Divider />
      <List>
        <ListItem button>
          <Link className={classes.link} to="/deck-creator">
            <ListItemText primary={'Deck Creator'} />
          </Link>
        </ListItem>
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
    <div className={classes.root}>
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
            Quiz Us
          </Typography>
        </Toolbar>
        <Drawer open={navOpen} onClose={closeNav}>
          {sideNav()}
        </Drawer>
      </AppBar>
    </div>
  );
}
