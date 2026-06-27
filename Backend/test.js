const FormData = require('form-data');
const fs = require('fs');
const http = require('http');

const form = new FormData();
form.append('selfDescription', 'Test description');
form.append('jobDescription', 'Test job');
// create a dummy file
fs.writeFileSync('dummy.pdf', 'dummy content');
form.append('resume', fs.createReadStream('dummy.pdf'));

const request = http.request({
  method: 'POST',
  host: 'localhost',
  port: 3000,
  path: '/api/interview/test',
  headers: form.getHeaders()
});

form.pipe(request);

request.on('response', function(res) {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});
