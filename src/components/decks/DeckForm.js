import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';

import { CurrentDeckContext } from './CurrentDeckContext';

const DeckForm = ({ handleSubmit }) => {
  const { currentDeck, dispatch } = useContext(CurrentDeckContext);
  const { name, description } = currentDeck;
  const updateField = metaField => e =>
    dispatch({ type: 'updateMeta', metaField, metaValue: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    handleSubmit();
  };
  return (
    <form onSubmit={onSubmit} id="deck-form">
      <TextField
        autoFocus
        required
        value={name}
        onChange={updateField('name')}
        id="name"
        label="Deck Name"
        type="text"
        fullWidth
      />
      <TextField
        value={description}
        onChange={updateField('description')}
        id="description"
        label="Deck Description"
        type="text"
        fullWidth
      />
    </form>
  );
};

export default DeckForm;
