const http = require('http');
const fs = require('fs');
const path = require('path');

async function testFullFlow() {
    const id = Date.now();
    const email = `test${id}@example.com`;
    const password = 'Password123';
    const username = `user${id}`;

    console.log(`--- Testing with email: ${email} ---`);

    // 1. Register
    const regRes = await makeRequest('/api/auth/register', 'POST', { username, email, password });
    console.log('Register Response:', regRes.statusCode, regRes.body);

    // 2. Login
    const loginRes = await makeRequest('/api/auth/login', 'POST', { email, password });
    console.log('Login Response:', loginRes.statusCode, loginRes.body);
    
    const token = loginRes.json.token;
    if (!token) {
        console.error('No token received!');
        return;
    }

    // 3. Generate Interview Report (Multipart)
    console.log('3. Generating Interview Report...');
    const resumePath = path.join(__dirname, 'resume.pdf');
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="selfDescription"\r\n\r\n`;
    body += `I am a hard working developer.\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="jobDescription"\r\n\r\n`;
    body += `We need a React developer who knows CSS.\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="resume"; filename="resume.pdf"\r\n`;
    body += `Content-Type: application/pdf\r\n\r\n`;
    
    const fileContent = fs.readFileSync(resumePath);
    const footer = `\r\n--${boundary}--\r\n`;
    
    const multipartBody = Buffer.concat([
        Buffer.from(body),
        fileContent,
        Buffer.from(footer)
    ]);

    const genOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/interview',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': multipartBody.length
        }
    };

    const genReq = http.request(genOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('GENERATE STATUS:', res.statusCode);
            console.log('GENERATE BODY:', data);
        });
    });

    genReq.on('error', e => console.error('Generate Error:', e));
    genReq.write(multipartBody);
    genReq.end();
}

function makeRequest(path, method, data) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                let json = {};
                try { json = JSON.parse(body); } catch(e) {}
                resolve({ statusCode: res.statusCode, body, json });
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

testFullFlow();
