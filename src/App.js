import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import Nav from './components/nav/Nav';
import LogIn from './components/auth/LogIn';
import { createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import teal from '@material-ui/core/colors/teal';
import amber from '@material-ui/core/colors/amber';
import PrivateRoute from './components/PrivateRoute';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import MainRoutes from './components/MainRoutes';
import CssBaseline from '@material-ui/core/CssBaseline';
import Notifications from './components/app/notifications';
import { useAuth0 } from './react-auth0-spa';
import GlobalLoader from './components/app/GlobalLoader';

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: amber,
  },
});

const App = () => {
  const { loading } = useAuth0();
  if (loading) {
    return <GlobalLoader />;
  }
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Nav />
          <Switch>
            <Route exact path="/login" component={LogIn} />
            {/* <Route exact path="/signup" component={SignUp} /> */}
            <PrivateRoute path="/" component={MainRoutes} />
          </Switch>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
      <Notifications />
    </Router>
  );
};

export default App;
