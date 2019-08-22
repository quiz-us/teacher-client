import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import Nav from './components/nav/Nav';
import Home from './components/home/Home';
import LogIn from './components/auth/LogIn';
import SignUp from './components/auth/SignUp';
import { createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import teal from '@material-ui/core/colors/teal';
import amber from '@material-ui/core/colors/amber';

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
        <Nav />
        <Route path="/" component={Home} />
        <Route path="/login" component={LogIn} />
        <Route path="/signup" component={SignUp} />
      </ThemeProvider>
    </Router>
  );
}

export default App;
