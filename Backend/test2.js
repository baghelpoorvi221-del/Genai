const fs = require('fs');
fs.writeFileSync('dummy.pdf', 'dummy content');

const form = new FormData();
form.append('selfDescription', 'Test description');
form.append('jobDescription', 'Test job');
const blob = new Blob(['dummy content'], { type: 'application/pdf' });
form.append('resume', blob, 'dummy.pdf');

fetch('http://localhost:3000/api/interview/test', {
    method: 'POST',
    // Don't set Content-Type header with FormData, fetch does it with boundary
    body: form,
    headers: {
        'Authorization': `Bearer test_token`
    } // wait, /test route doesn't have authMiddleware
})
.then(res => res.text())
.then(data => console.log('Response:', data))
.catch(err => console.error('Fetch error:', err));
