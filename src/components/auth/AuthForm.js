import React from 'react';
import Card from '@material-ui/core/Card';

import { Link } from 'react-router-dom';
import useAuthFormStyles from './AuthFormStyles';

const Header = props => <h3 {...props}>{props.headertext}</h3>;

const customizedTemplate = {
  signup: {
    headertext: 'Sign Up',
    LinkComponent: props => (
      <div {...props}>
        Already have an account? Log in{' '}
        <Link className="link" to="/login">
          here
        </Link>
      </div>
    )
  },
  login: {
    headertext: 'Log In',
    LinkComponent: props => (
      <div {...props}>
        New to Quiz Us? Sign up{' '}
        <Link className="link" to="/signup">
          here
        </Link>
      </div>
    )
  }
};

const customize = type => {
  return customizedTemplate[type];
};

export default ({ children, type }) => {
  const classes = useAuthFormStyles();
  const { headertext } = customize(type);
  return (
    <div className={classes.root}>
      <Card className={classes.formContainer}>
        <Header className={classes.header} headertext={headertext} />
        {children}
        {/* <LinkComponent className={classes.helpText} /> */}
      </Card>
    </div>
  );
};
