import Plain from 'slate-plain-serializer';

export const parseFormData = formData => {
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
  return {
    questionType: parsedFormData['questionType'],
    standardId: parsedFormData['standardId'],
    tags: parsedFormData['tags'],
    richText: JSON.stringify(parsedFormData['question'].toJSON()),
    questionPlaintext: parsedFormData['questionText'],
    questionOptions: parsedFormData['answers'].map(answer =>
      JSON.stringify(answer)
    ),
  };
};
