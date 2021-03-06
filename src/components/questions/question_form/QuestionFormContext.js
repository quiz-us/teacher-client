import React, { useReducer } from 'react';
import crypto from 'crypto';
import Plain from 'slate-plain-serializer';

const generateRandomId = () => crypto.randomBytes(20).toString('hex');

const defaultAnswer = (correct = false) => ({
  richText: Plain.deserialize(''),
  correct,
  answerId: generateRandomId(),
});

const generateDefaultState = () => ({
  questionType: 'Free Response',
  standardId: '',
  tags: [],
  question: {},
  answers: [defaultAnswer(true)],
  questionAnswerId: generateRandomId(),
});

let reducer = (state, action) => {
  const { type, name, value } = action;
  switch (type) {
    case 'resetForm':
      return {
        // would need to regenerate instead of using existing because
        // answer's random key needs to be regenerated:
        ...generateDefaultState(),
        questionType: state.questionType,
        standardId: state.standardId,
      };
    case 'update':
      return { ...state, [name]: value };
    case 'addAnswerChoice':
      return {
        ...state,

        answers: [...state.answers, defaultAnswer(false)],
      };
    case 'resetAnswerChoices':
      return {
        ...state,
        answers: [defaultAnswer(true)],
      };
    default:
      return;
  }
};

const QuestionFormContext = React.createContext();

const defaultState = generateDefaultState();

function QuestionFormProvider({ children, initialState = defaultState }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <QuestionFormContext.Provider value={{ state, dispatch }}>
      {children}
    </QuestionFormContext.Provider>
  );
}
export { QuestionFormContext, QuestionFormProvider, generateRandomId };
