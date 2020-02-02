import React from 'react';
import { Route } from 'react-router-dom';
import DeckEditor from './deck_editor/DeckEditor';
import DeckCreator from './DeckCreator';
import { CurrentDeckProvider } from './CurrentDeckContext';

export default ({ match }) => {
  return (
    <div>
      <CurrentDeckProvider>
        <Route exact path={`${match.path}/:id/edit`} component={DeckEditor} />
        <Route exact path={`${match.path}/create`} component={DeckCreator} />
      </CurrentDeckProvider>
    </div>
  );
};
