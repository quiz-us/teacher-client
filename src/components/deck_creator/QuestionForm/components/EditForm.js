import React from 'react';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import Plain from 'slate-plain-serializer';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import Form from './Form';
import { QuestionFormProvider } from './QuestionFormContext';
import GlobalLoader from '../../../app/GlobalLoader';
import { UPDATE_QUESTION } from '../../../queries/Question';

const UpdateForm = ({ open, setOpen, card }) => {
  const [updateQuestion, { loading }] = useMutation(UPDATE_QUESTION);

  if (loading) {
    return <GlobalLoader />;
  }

  const handleSubmit = formData => {
    const parsedFormData = {
      ...formData,
      questionText: Plain.serialize(formData.question),
      answers: formData.answers.map(answer => {
        return {
          ...answer,
          optionText: Plain.serialize(answer.richText),
        };
      }),
    };

    return updateQuestion({
      variables: {
        questionType: parsedFormData['questionType'],
        standardId: parsedFormData['standardId'],
        tags: parsedFormData['tags'],
        richText: JSON.stringify(parsedFormData['question'].toJSON()),
        questionPlaintext: parsedFormData['questionText'],
        questionOptions: parsedFormData['answers'].map(answer =>
          JSON.stringify(answer)
        ),
      },
    });
  };

  const handleClose = () => setOpen(false);

  const { questionType, standards, tags, richText, questionOptions, id } = card;
  const initialState = {
    questionType,
    standardId: standards[0].id,
    tags: tags.map(({ name }) => name),
    question: JSON.parse(richText),
    answers: questionOptions.map(({ richText, correct, id }) => ({
      answerId: `${id}-answerId`,
      correct,
      id: id,
      richText: JSON.parse(richText),
    })),
  };

  return (
    <QuestionFormProvider initialState={initialState}>
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
    </QuestionFormProvider>
  );
};

UpdateForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  card: PropTypes.shape({
    questionType: PropTypes.string.isRequired,
    standards: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    richText: PropTypes.string.isRequired,
    questionOptions: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default UpdateForm;
