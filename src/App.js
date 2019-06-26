import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { QuizUsTheme, QuestionForm } from '@quiz-us/kit';

const standards = [
  { id: 1, name: '6.5A' },
  { id: 2, name: '8.5A' },
  { id: 3, name: '8.8A' }
];

const questionTypes = ['Free Response'];

function App() {
  return (
    <ThemeProvider theme={QuizUsTheme}>
      <QuestionForm standards={standards} questionTypes={questionTypes} />
    </ThemeProvider>
  )
}

export default App;
