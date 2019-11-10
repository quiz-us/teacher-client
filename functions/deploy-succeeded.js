const https = require('https');

const options = {
  method: 'POST',
  hostname: 'circleci.com',
  path: `/api/v2/project/gh/quiz-us/quiz-us-tests/pipeline?circle-token=${process.env.CIRCLE_TOKEN}`
};

exports.handler = function(event, context, callback) {
  const { body } = event;
  const { published_deploy } = JSON.parse(body);
  console.log(published_deploy);
  console.log('BRANCH', published_deploy.branch);

  const req = https.request(options, res => {
    res.on('data', d => {
      process.stdout.write(d);
    });
  });

  req.on('error', e => {
    console.error(e);
  });

  req.write('');
  req.end();
};
