import React from 'react';
import { Route } from 'react-router-dom';
import DeckCreator from '../deck_creator/DeckCreator';

export default ({ match }) => {
  return (
    <div>
      <Route exact path={`${match.path}/:id/edit`} component={DeckCreator} />
    </div>
  );
};
