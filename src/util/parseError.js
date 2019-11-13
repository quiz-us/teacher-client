export default error => {
  if (!error) {
    return '';
  }
  const { graphQLErrors = [], message = undefined } = error;
  let mutationError = message;
  if (graphQLErrors.length) {
    mutationError = graphQLErrors[0].message;
  }
  return mutationError;
};
