exports.handler = function(event, context, callback) {
  const { body } = event;
  console.log(body);
};
