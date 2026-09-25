import { execFile, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const binDir = path.join(rootDir, 'bin');
const javaFile = path.join(rootDir, 'java_security', 'MacSecurityModule.java');

function ensureJavaCompiled() {
  const classFile = path.join(binDir, 'java_security', 'MacSecurityModule.class');
  if (!fs.existsSync(classFile)) {
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true });
    }
    console.log('[JavaBridge] Compiling MacSecurityModule.java...');
    execSync(`javac -d "${binDir}" "${javaFile}"`);
    console.log('[JavaBridge] Compilation successful.');
  }
}

export function runJavaMac(mode, algo, secretKey, message, expectedMac = '') {
  return new Promise((resolve) => {
    try {
      ensureJavaCompiled();
      const args = ['-cp', binDir, 'java_security.MacSecurityModule', mode, algo, secretKey, message];
      if (mode === 'verify') {
        args.push(expectedMac || '');
      }

      execFile('java', args, { cwd: rootDir }, (error, stdout, stderr) => {
        if (error) {
          console.warn('[JavaBridge Warning] Falling back to Node.js Crypto Engine:', stderr || error.message);
          return resolve(runNodeFallback(mode, algo, secretKey, message, expectedMac));
        }

        try {
          const parsed = JSON.parse(stdout.trim());
          parsed.engine = 'Java Security Module (javax.crypto.Mac)';
          return resolve(parsed);
        } catch (e) {
          console.warn('[JavaBridge Parse Error] Falling back to Node.js Crypto Engine:', stdout);
          return resolve(runNodeFallback(mode, algo, secretKey, message, expectedMac));
        }
      });
    } catch (err) {
      console.warn('[JavaBridge Exception] Falling back to Node.js Crypto Engine:', err.message);
      return resolve(runNodeFallback(mode, algo, secretKey, message, expectedMac));
    }
  });
}

function runNodeFallback(mode, algo, secretKey, message, expectedMac = '') {
  const startTime = process.hrtime();
  let nodeAlgo = 'sha256';
  const cleanAlgo = algo.toUpperCase();
  if (cleanAlgo.includes('512')) nodeAlgo = 'sha512';
  else if (cleanAlgo.includes('MD5')) nodeAlgo = 'md5';
  else if (cleanAlgo.includes('SHA1') || cleanAlgo.includes('1')) nodeAlgo = 'sha1';

  if (mode === 'generate') {
    const hmac = crypto.createHmac(nodeAlgo, secretKey);
    hmac.update(message);
    const macHex = hmac.digest('hex');
    const diff = process.hrtime(startTime);
    const durationMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(3);

    return {
      status: 'success',
      mode: 'generate',
      algorithm: algo,
      macHex,
      macLengthBits: macHex.length * 4,
      executionTimeMs: parseFloat(durationMs),
      engine: 'Node.js Crypto Engine (Fallback)',
      breakdown: {
        keyLengthBytes: Buffer.from(secretKey).length,
        paddedKeyHex: Buffer.from(secretKey).toString('hex').padEnd(128, '0'),
        ipadHex: '36'.repeat(64),
        opadHex: '5c'.repeat(64)
      }
    };
  } else {
    const hmac = crypto.createHmac(nodeAlgo, secretKey);
    hmac.update(message);
    const computedHex = hmac.digest('hex');
    const isValid = crypto.timingSafeEqual(
      Buffer.from(computedHex, 'hex'),
      Buffer.from((expectedMac || '').trim(), 'hex')
    );
    const diff = process.hrtime(startTime);
    const durationMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(3);

    return {
      status: 'success',
      mode: 'verify',
      algorithm: algo,
      isValid,
      computedMacHex: computedHex,
      expectedMacHex: expectedMac,
      executionTimeMs: parseFloat(durationMs),
      engine: 'Node.js Crypto Engine (Fallback)'
    };
  }
}
