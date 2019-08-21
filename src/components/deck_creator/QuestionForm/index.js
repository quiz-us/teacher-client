import React from "react";
import { QuestionFormProvider } from "./components/QuestionFormContext";
import Form from "./components/Form";

const QuestionForm = props => {
  return (
    <QuestionFormProvider>
      <Form {...props} />
    </QuestionFormProvider>
  );
};

export default QuestionForm;
