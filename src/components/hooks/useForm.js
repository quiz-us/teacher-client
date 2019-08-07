import { useState } from 'react';

const useForm = (defaultFormState, cb) => {
  const [inputs, setInputs] = useState(defaultFormState);
  const handleInputChange = event => {
    if (event.persist) {
      event.persist();
    }
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }));
  };
  return {
    handleInputChange,
    inputs
  };
};

export default useForm;
