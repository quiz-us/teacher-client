import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import Nav from './components/nav/Nav';
import LogIn from './components/auth/LogIn';
import SignUp from './components/auth/SignUp';
import { createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import teal from '@material-ui/core/colors/teal';
import amber from '@material-ui/core/colors/amber';
import PrivateRoute from './components/PrivateRoute';
import MainRoutes from './components/MainRoutes';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: amber
  }
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Nav />
        <Switch>
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/signup" component={SignUp} />
          <PrivateRoute path="/" component={MainRoutes} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
