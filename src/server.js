// server.js
const express = require('express');
const cors = require('cors');

const { spawn } = require('child_process');
const app = express();
const port = 3001;

app.use(express.json());

app.post('/run-python', (req, res) => {
  const { content } = req.body;
  const pythonProcess = spawn('python', ['./components/1.py', content]);

  let output = '';

  pythonProcess.stdout.on('data', (data) => {
    output = data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    res.json({ output });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});