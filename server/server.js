import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { runJavaMac } from './javaRunner.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'MAC Generator & Verifier API is running',
    timestamp: new Date().toISOString(),
    javaEngine: 'Available (javax.crypto.Mac)'
  });
});

// Generate Random Secret Key
app.post('/api/mac/key-generate', (req, res) => {
  const { length = 32 } = req.body;
  const secretKey = crypto.randomBytes(length / 2).toString('hex');
  res.json({
    status: 'success',
    secretKey,
    lengthBits: length * 8
  });
});

// Generate MAC Tag
app.post('/api/mac/generate', async (req, res) => {
  const { algorithm = 'HmacSHA256', secretKey, message } = req.body;

  if (!secretKey || message === undefined || message === null) {
    return res.status(400).json({
      status: 'error',
      message: 'Both secretKey and message are required.'
    });
  }

  try {
    const result = await runJavaMac('generate', algorithm, secretKey, message);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate MAC: ' + err.message
    });
  }
});

// Verify MAC Tag
app.post('/api/mac/verify', async (req, res) => {
  const { algorithm = 'HmacSHA256', secretKey, message, expectedMac } = req.body;

  if (!secretKey || message === undefined || !expectedMac) {
    return res.status(400).json({
      status: 'error',
      message: 'secretKey, message, and expectedMac are all required for verification.'
    });
  }

  try {
    const result = await runJavaMac('verify', algorithm, secretKey, message, expectedMac);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to verify MAC: ' + err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` MAC Security Server listening on http://localhost:${PORT}`);
  console.log(` Java Cryptography Core Bridge active.`);
  console.log(`====================================================`);
});
