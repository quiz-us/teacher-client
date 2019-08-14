import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { QuizUsTheme } from '@quiz-us/kit';
import Nav from './components/nav/Nav';
import Home from './components/home/Home';
import LogIn from './components/auth/LogIn';
import SignUp from './components/auth/SignUp';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <ThemeProvider theme={QuizUsTheme}>
        <Nav />
        <Route path="/" component={Home} />
        <Route path="/login" component={LogIn} />
        <Route path="/signup" component={SignUp} />
      </ThemeProvider>
    </Router>
  );
}

export default App;
