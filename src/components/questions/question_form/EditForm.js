import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Value } from 'slate';

import { useMutation } from '@apollo/react-hooks';
import { parseFormData } from './helper';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import Form from './Form';
import { QuestionFormProvider } from './QuestionFormContext';
import { CurrentDeckContext } from '../../decks/CurrentDeckContext';
import { UPDATE_QUESTION } from '../../../gql/mutations/Question';
import GlobalLoader from '../../app/GlobalLoader';

const UpdateForm = ({ open, setOpen, card }) => {
  const { dispatch: currentDeckDispatch } = useContext(CurrentDeckContext);
  const handleClose = () => setOpen(false);

  const [updateQuestion, { loading }] = useMutation(UPDATE_QUESTION, {
    onCompleted: ({ updateQuestion }) => {
      currentDeckDispatch({
        type: 'updateCard',
        card: updateQuestion,
        questionId: updateQuestion.id,
      });
      handleClose();
    },
  });

  if (loading) {
    return <GlobalLoader />;
  }

  const handleSubmit = formData => {
    return updateQuestion({
      variables: {
        ...parseFormData(formData),
        id: card.id,
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
      <DialogTitle>Update Question</DialogTitle>
      <DialogContent>
        <Form handleSubmit={handleSubmit} editMode={true} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  card: PropTypes.object.isRequired,
};

const UpdateFormContainer = props => {
  const {
    card: { questionType, standards, tags, richText, questionOptions },
  } = props;

  const initialState = {
    questionType,
    standardId: standards[0].id,
    tags: tags.map(({ name }) => name),
    question: Value.fromJSON(JSON.parse(richText)),
    answers: questionOptions.map(({ richText, correct, id }) => ({
      answerId: `${id}-answerId`,
      correct,
      id: id,
      richText: Value.fromJSON(JSON.parse(richText)),
    })),
  };
  return (
    <QuestionFormProvider initialState={initialState}>
      <UpdateForm {...props} />
    </QuestionFormProvider>
  );
};

UpdateFormContainer.propTypes = {
  card: PropTypes.shape({
    questionType: PropTypes.string.isRequired,
    standards: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    richText: PropTypes.string.isRequired,
    questionOptions: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};
export default UpdateFormContainer;
