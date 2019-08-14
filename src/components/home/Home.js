import React from 'react';
import { Route } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import DeckCreator from '../deck_creator/DeckCreator';

export default () => {
  return (
    <div>
      <Route exact path="/" component={() => <h2>Welcome to Quiz Us</h2>} />
      <PrivateRoute exact path="/deck-creator" component={DeckCreator} />
    </div>
  );
};
