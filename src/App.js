import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { QuizUsTheme } from '@quiz-us/kit';
import Nav from './components/nav/Nav';
import Home from './components/home/Home';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/auth/Login';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <ThemeProvider theme={QuizUsTheme}>
        <Nav />
        <PrivateRoute exact path="/" component={Home} />
        <Route path="/login" component={Login} />
      </ThemeProvider>
    </Router>
  );
}

export default App;
