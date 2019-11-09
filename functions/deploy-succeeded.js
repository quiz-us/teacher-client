const https = require('https');

const options = {
  method: 'POST',
  hostname: 'circleci.com',
  path: `/api/v2/project/gh/quiz-us/quiz-us-tests/pipeline?circle-token=${process.env.CIRCLE_TOKEN}`
};

exports.handler = function(event, context, callback) {
  console.log(event);

  const req = https.request(options, res => {
    res.on('data', d => {
      console.log('response:', d);
    });
  });

  req.on('error', e => {
    console.error(e);
  });

  req.write('');
  req.end();
};
