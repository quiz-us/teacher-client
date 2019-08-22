import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useButtonStyles = makeStyles({
  root: {
    cursor: 'pointer',
    color: ({ active }) => (active ? 'black' : '#aaa')
  }
});

export const Button = ({ active, ...props }) => {
  const classes = useButtonStyles({ active });
  return <span {...props} className={classes.root} />;
};

const useMenuStyles = makeStyles({
  menu: {
    '& > *': {
      display: 'inline-block'
    },
    '& > * + *': {
      marginLeft: '15px'
    },
    borderBottom: '2px solid gray',
    padding: '15px'
  }
});

export const Menu = ({ className, ...props }) => {
  const classes = useMenuStyles();
  return <div {...props} className={classes.menu} />;
};

const useToolbarStyles = makeStyles({
  toolbar: {
    position: 'relative',
    padding: '1px 18px 17px',
    margin: '0 -20px',
    borderBottom: '2px solid #eee',
    marginBottom: '20px'
  }
});

export const Toolbar = props => {
  const classes = useToolbarStyles();
  return <Menu {...props} className={classes.toolbar} />;
};
