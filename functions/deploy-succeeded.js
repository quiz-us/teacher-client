const https = require('https');

const options = { method: 'POST' };

exports.handler = function(event, context, callback) {
  const { branch } = event;

  console.log(event);
  console.log('BRANCH IS', branch);

  https.request(
    'https://hooks.zapier.com/hooks/catch/5702449/o2hqohr/',
    options,
    res => console.log('RESPONSE WAS', res)
  );
};
