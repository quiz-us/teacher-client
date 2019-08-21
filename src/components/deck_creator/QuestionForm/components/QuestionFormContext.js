import React, { useReducer } from "react";
import crypto from "crypto";

const generateAnswerId = () => crypto.randomBytes(20).toString("hex");

const defaultAnswer = (isCorrect = false) => ({
  value: undefined,
  isCorrect,
  answerId: generateAnswerId()
});

let reducer = (state, action) => {
  const { type, name, value } = action;
  switch (type) {
    case "update":
      return { ...state, [name]: value };
    case "addAnswerChoice":
      return {
        ...state,

        answers: [...state.answers, defaultAnswer(false)]
      };
    case "resetAnswerChoices":
      return {
        ...state,
        answers: [defaultAnswer(true)]
      };
    default:
      return;
  }
};
const initialState = {
  questionType: "Multiple Choice",
  standardId: "",
  tags: [],
  question: {},
  answers: [defaultAnswer(true)]
};
const QuestionFormContext = React.createContext(initialState);

function QuestionFormProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <QuestionFormContext.Provider value={{ state, dispatch }}>
      {children}
    </QuestionFormContext.Provider>
  );
}
export { QuestionFormContext, QuestionFormProvider };
