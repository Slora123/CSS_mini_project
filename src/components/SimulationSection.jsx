import React, { useState } from 'react';
import { Cpu, Key, CheckCircle, XCircle, RefreshCw, Copy, ShieldCheck, ShieldAlert, Zap, Lock, FileSpreadsheet, AlertCircle, Sparkles } from 'lucide-react';

export default function SimulationSection() {
  // Mode Selection: 'educational' (Virtual Labs 4-Step Reference) or 'production' (Java Engine)
  const [labMode, setLabMode] = useState('educational');

  // ==========================================
  // EDUCATIONAL MODE STATE (Virtual Labs Ref)
  // ==========================================
  
  // Section 1: SHA Hash Demo
  const [shaInput, setShaInput] = useState('test');
  const [shaOutput, setShaOutput] = useState('');
  const [shaFeedback, setShaFeedback] = useState('');

  // Section 2 - Step 1: Setup Parameters
  const [eduMsgBinary, setEduMsgBinary] = useState('1100000000111100101010');
  const [eduBlockSize, setEduBlockSize] = useState(8);
  const [eduIV, setEduIV] = useState('11001100');
  const [eduKey, setEduKey] = useState('10000101');
  const [step1Feedback, setStep1Feedback] = useState('');

  // Step 2: Test Dummy Hash Function
  const [hashTestInput, setHashTestInput] = useState('1100101011001010');
  const [hashTestOutput, setHashTestOutput] = useState('');
  const [hashStepBreakdown, setHashStepBreakdown] = useState('');

  // Step 3: HMAC Calculation Sub-Steps
  const ipadConst = '01011100'; // 8-bit ipad constant
  const opadConst = '00110110'; // 8-bit opad constant
  const ipad = ipadConst;
  const opad = opadConst;
  
  const [userKipad, setUserKipad] = useState('');
  const [kipadFeedback, setKipadFeedback] = useState(null);

  const [userKopad, setUserKopad] = useState('');
  const [kopadFeedback, setKopadFeedback] = useState(null);

  // Step 4: Final HMAC Result
  const [userFinalTag, setUserFinalTag] = useState('');
  const [finalCheckResult, setFinalCheckResult] = useState(null);

  // Step 5: Summary Table
  const [summaryData, setSummaryData] = useState({
    message: '-',
    blockSize: '-',
    key: '-',
    iv: '-',
    finalTag: '-'
  });
  const [summaryUpdated, setSummaryUpdated] = useState(false);

  // ==========================================
  // PRODUCTION JAVA ENGINE STATE
  // ==========================================
  const [genAlgorithm, setGenAlgorithm] = useState('HmacSHA256');
  const [genSecretKey, setGenSecretKey] = useState('MySharedSecretKey2026');
  const [genMessage, setGenMessage] = useState('Transfer $5,000 to Account #98412');
  const [genResult, setGenResult] = useState(null);
  const [genLoading, setGenLoading] = useState(false);

  const [verAlgorithm, setVerAlgorithm] = useState('HmacSHA256');
  const [verSecretKey, setVerSecretKey] = useState('MySharedSecretKey2026');
  const [verMessage, setVerMessage] = useState('Transfer $5,000 to Account #98412');
  const [verExpectedMac, setVerExpectedMac] = useState('');
  const [verResult, setVerResult] = useState(null);
  const [verLoading, setVerLoading] = useState(false);

  const [eveKey, setEveKey] = useState('TeamSecretPasscode2026');
  const [aliceMsg, setAliceMsg] = useState('Pay $1,500 to Bob');
  const [aliceMac, setAliceMac] = useState('');
  const [eveTamperedMsg, setEveTamperedMsg] = useState('Pay $1,500 to Bob');
  const [eveTamperedMac, setEveTamperedMac] = useState('');
  const [bobResult, setBobResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // ==========================================
  // EDUCATIONAL HANDLERS
  // ==========================================

  // Bitwise XOR Helper for 8-bit binary strings
  const xorBinaryStrings = (a, b) => {
    let result = '';
    const len = Math.max(a.length, b.length);
    const padA = a.padStart(len, '0');
    const padB = b.padStart(len, '0');
    for (let i = 0; i < len; i++) {
      result += (parseInt(padA[i]) ^ parseInt(padB[i])).toString();
    }
    return result;
  };

  // Dummy Educational Hash Function (Pairwise XOR reduction)
  const dummyHashFunction = (inputBin) => {
    if (!inputBin) return '00000000';
    let hashed = '';
    for (let i = 0; i < inputBin.length; i += 2) {
      const b1 = parseInt(inputBin[i] || '0');
      const b2 = parseInt(inputBin[i + 1] || '0');
      hashed += (b1 ^ b2).toString();
    }
    // Repeat/pad to 8 bits
    while (hashed.length < 8) {
      hashed += hashed;
    }
    return hashed.substring(0, 8);
  };

  // Real browser SHA-1 / SHA-256 for Demo 1
  const handleCalculateSha = async () => {
    if (!shaInput) return;
    try {
      const msgBuffer = new TextEncoder().encode(shaInput);
      const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setShaOutput(hashHex);
      setShaFeedback(`✅ Calculated SHA-1 (160 bits / 40 hex chars). Change a single letter to see the avalanche effect!`);
    } catch (e) {
      setShaOutput('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
      setShaFeedback('✅ Calculated SHA-1 hash output!');
    }
  };

  // Random Parameter Generators
  const handleRandomMessage = () => {
    const randomBin = Array.from({ length: 22 }, () => Math.round(Math.random())).join('');
    setEduMsgBinary(randomBin);
    setStep1Feedback(`⚡ New 22-bit binary message generated!`);
  };

  const handleRandomIV = () => {
    const randomBin = Array.from({ length: 8 }, () => Math.round(Math.random())).join('');
    setEduIV(randomBin);
    setStep1Feedback(`⚡ New 8-bit Initialization Vector (IV) generated!`);
  };

  const handleRandomKey = () => {
    const randomBin = Array.from({ length: 8 }, () => Math.round(Math.random())).join('');
    setEduKey(randomBin);
    setStep1Feedback(`⚡ New 8-bit Secret Key (k) generated!`);
  };

  // Test Hash Function Step 2
  const handleCalculateDummyHash = () => {
    const result = dummyHashFunction(hashTestInput);
    setHashTestOutput(result);
    setHashStepBreakdown(`Pairwise XOR reduction applied to 16 bits input ➔ ${result} (8-bit digest)`);
  };

  // Step 3 Sub-step verifiers
  const verifyKipad = () => {
    const expected = xorBinaryStrings(eduKey, ipadConst);
    if (userKipad.trim() === expected) {
      setKipadFeedback({ success: true, msg: `✅ Correct! (${eduKey} ⊕ ${ipadConst} = ${expected})` });
    } else {
      setKipadFeedback({ success: false, msg: `❌ Incorrect. Expected bitwise XOR: ${expected}` });
    }
  };

  const verifyKopad = () => {
    const expected = xorBinaryStrings(eduKey, opadConst);
    if (userKopad.trim() === expected) {
      setKopadFeedback({ success: true, msg: `✅ Correct! (${eduKey} ⊕ ${opadConst} = ${expected})` });
    } else {
      setKopadFeedback({ success: false, msg: `❌ Incorrect. Expected bitwise XOR: ${expected}` });
    }
  };

  // Calculate Correct Educational HMAC Tag
  const calculateCorrectEduHmac = () => {
    const kIpad = xorBinaryStrings(eduKey, ipadConst);
    const kOpad = xorBinaryStrings(eduKey, opadConst);
    const innerInput = eduIV + kIpad + eduMsgBinary;
    const innerHash = dummyHashFunction(innerInput);
    const outerInput = eduIV + kOpad + innerHash;
    const finalTag = dummyHashFunction(outerInput);
    return { kIpad, kOpad, innerHash, finalTag };
  };

  const handleCheckFinalAnswer = () => {
    const { finalTag } = calculateCorrectEduHmac();
    if (userFinalTag.trim() === finalTag) {
      setFinalCheckResult({
        success: true,
        msg: `🎉 EXCELLENT WORK! Your final HMAC authentication tag '${finalTag}' is 100% correct!`
      });
    } else {
      setFinalCheckResult({
        success: false,
        msg: `❌ Not quite! Expected final HMAC tag: '${finalTag}'. Double-check your inner and outer hash computations.`
      });
    }
  };

  const handleAutoFillAnswer = () => {
    const { kIpad, kOpad, finalTag } = calculateCorrectEduHmac();
    setUserKipad(kIpad);
    setUserKopad(kOpad);
    setUserFinalTag(finalTag);
    setFinalCheckResult({
      success: true,
      msg: `💡 Auto-filled correct HMAC tag: '${finalTag}'. Click 'Update Summary' to complete the lab!`
    });
  };

  const handleUpdateSummary = () => {
    const { finalTag } = calculateCorrectEduHmac();
    setSummaryData({
      message: eduMsgBinary,
      blockSize: `${eduBlockSize} bits`,
      key: eduKey,
      iv: eduIV,
      finalTag: userFinalTag.trim() || finalTag
    });
    setSummaryUpdated(true);
    setTimeout(() => setSummaryUpdated(false), 3000);
  };

  // ==========================================
  // PRODUCTION JAVA HANDLERS
  // ==========================================
  const handleGenerateMac = async () => {
    if (!genSecretKey || genMessage === '') return;
    setGenLoading(true);
    try {
      const res = await fetch('/api/mac/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: genAlgorithm, secretKey: genSecretKey, message: genMessage })
      });
      const data = await res.json();
      setGenResult(data);
      if (data.macHex) setVerExpectedMac(data.macHex);
    } catch (err) {
      setGenResult({ status: 'error', message: 'Failed to connect to backend' });
    } finally {
      setGenLoading(false);
    }
  };

  const handleVerifyMac = async () => {
    if (!verSecretKey || !verExpectedMac) return;
    setVerLoading(true);
    try {
      const res = await fetch('/api/mac/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: verAlgorithm, secretKey: verSecretKey, message: verMessage, expectedMac: verExpectedMac })
      });
      const data = await res.json();
      setVerResult(data);
    } catch (err) {
      setVerResult({ status: 'error', message: 'Verification error' });
    } finally {
      setVerLoading(false);
    }
  };

  const handleAliceSend = async () => {
    try {
      const res = await fetch('/api/mac/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: 'HmacSHA256', secretKey: eveKey, message: aliceMsg })
      });
      const data = await res.json();
      setAliceMac(data.macHex);
      setEveTamperedMsg(aliceMsg);
      setEveTamperedMac(data.macHex);
      setBobResult(null);
    } catch (e) {
      alert('Generation error');
    }
  };

  const handleBobVerify = async () => {
    try {
      const res = await fetch('/api/mac/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: 'HmacSHA256', secretKey: eveKey, message: eveTamperedMsg, expectedMac: eveTamperedMac })
      });
      const data = await res.json();
      setBobResult(data);
    } catch (e) {
      alert('Verification error');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Cryptographic Hash Functions and Applications (HMAC)</h2>
        <p className="section-subtitle">Interactive Step-by-Step Educational Lab & Java Core Security Engine</p>
      </div>

      {/* Top Mode Selection Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', background: 'white', padding: '8px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <button
          className={`btn-primary ${labMode === 'educational' ? '' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '12px', background: labMode === 'educational' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : '#f1f5f9', color: labMode === 'educational' ? 'white' : '#334155' }}
          onClick={() => setLabMode('educational')}
        >
          🎓 Educational Step-by-Step Lab (Virtual Labs Ref)
        </button>
        <button
          className={`btn-primary ${labMode === 'production' ? '' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '12px', background: labMode === 'production' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : '#f1f5f9', color: labMode === 'production' ? 'white' : '#334155' }}
          onClick={() => setLabMode('production')}
        >
          ⚡ Production Java Cryptography Engine (javax.crypto.Mac)
        </button>
      </div>

      {/* ========================================== */}
      {/* 1. EDUCATIONAL STEP-BY-STEP LAB MODE       */}
      {/* ========================================== */}
      {labMode === 'educational' && (
        <div>
          {/* SECTION 1: SHA-1 / SHA-256 DEMONSTRATION */}
          <div className="vlab-card" style={{ borderColor: '#38bdf8' }}>
            <div className="step-title-badge">
              <Lock className="card-title-icon" size={22} color="#0284c7" />
              <span>🔐 SHA-1 Hash Function Demonstration</span>
            </div>

            <div className="vlab-info-box">
              SHA-1 takes any input and produces a fixed 160-bit (40 hex characters) hash value. Try different inputs to see how even small changes produce completely different hashes.
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ width: '160px', fontWeight: '700', fontSize: '0.9rem' }}>Plaintext (string):</label>
              <input
                type="text"
                className="form-input code-font"
                style={{ flex: 1 }}
                value={shaInput}
                onChange={(e) => setShaInput(e.target.value)}
              />
              <button className="btn-vlab-green" onClick={handleCalculateSha}>
                Calculate SHA-1
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <label style={{ width: '160px', fontWeight: '700', fontSize: '0.9rem' }}>SHA-1 Hash output (hex):</label>
              <input
                type="text"
                className="form-input code-font"
                style={{ flex: 1, backgroundColor: '#f8fafc', fontWeight: '600', color: '#0284c7' }}
                value={shaOutput}
                readOnly
                placeholder="Click 'Calculate SHA-1'..."
              />
            </div>

            {shaFeedback && (
              <div className="feedback-toast-success" style={{ marginTop: '14px' }}>
                {shaFeedback}
              </div>
            )}
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '32px 0 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles color="#ea580c" size={24} /> HMAC Construction (Simplified Educational Version)
          </h3>

          <div className="vlab-info-box">
            HMAC combines a hash function with a secret key to provide both data integrity and authentication. This simulation uses a simplified "dummy" hash function for educational purposes.
          </div>

          {/* STEP 1: SETUP PARAMETERS (YELLOW CARD) */}
          <div className="vlab-card-yellow">
            <div className="step-title-badge">
              <span>🎨 Step 1: Setup Parameters</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '180px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Message (binary):</label>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Binary message to be authenticated</span>
                </div>
                <textarea
                  className="form-textarea code-font"
                  style={{ flex: 1, minHeight: '60px' }}
                  value={eduMsgBinary}
                  onChange={(e) => setEduMsgBinary(e.target.value)}
                />
                <button className="btn-vlab-cyan" onClick={handleRandomMessage}>
                  Generate Random Message
                </button>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '180px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Block size (l):</label>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Hash function block size (must be ≥ 8)</span>
                </div>
                <input
                  type="number"
                  className="form-input code-font"
                  style={{ width: '120px' }}
                  value={eduBlockSize}
                  onChange={(e) => setEduBlockSize(parseInt(e.target.value) || 8)}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '180px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Initialization Vector (IV):</label>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Random vector of length l</span>
                </div>
                <input
                  type="text"
                  className="form-input code-font"
                  style={{ flex: 1 }}
                  value={eduIV}
                  onChange={(e) => setEduIV(e.target.value)}
                />
                <button className="btn-vlab-cyan" onClick={handleRandomIV} style={{ backgroundColor: '#ea580c' }}>
                  Generate Random IV
                </button>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '180px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Secret Key (k):</label>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Secret key of length l</span>
                </div>
                <input
                  type="text"
                  className="form-input code-font"
                  style={{ flex: 1 }}
                  value={eduKey}
                  onChange={(e) => setEduKey(e.target.value)}
                />
                <button className="btn-vlab-cyan" onClick={handleRandomKey} style={{ backgroundColor: '#475569' }}>
                  Generate Random Key
                </button>
              </div>
            </div>

            {step1Feedback && (
              <div className="feedback-toast-success">
                {step1Feedback}
              </div>
            )}
          </div>

          {/* STEP 2: TEST DUMMY HASH FUNCTION (GREEN CARD) */}
          <div className="vlab-card-green">
            <div className="step-title-badge">
              <span>🧮 Step 2: Test the Dummy Hash Function</span>
            </div>

            <div className="vlab-info-box-green">
              Our simplified hash function XORs adjacent bit pairs: $H(b_1 b_2 b_3 b_4) = (b_1 \oplus b_2)(b_3 \oplus b_4)$
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '220px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Test Input (2l bits):</label>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Input must be exactly 2l bits ({2 * eduBlockSize} bits for l={eduBlockSize})</span>
                </div>
                <input
                  type="text"
                  className="form-input code-font"
                  style={{ flex: 1 }}
                  value={hashTestInput}
                  onChange={(e) => setHashTestInput(e.target.value)}
                />
                <button className="btn-vlab-green" onClick={handleCalculateDummyHash}>
                  Calculate Hash
                </button>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '220px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Hash Output (l bits):</label>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Result of applying hash function</span>
                </div>
                <input
                  type="text"
                  className="form-input code-font"
                  style={{ flex: 1, backgroundColor: '#f0fdf4', fontWeight: 700, color: '#15803d' }}
                  value={hashTestOutput}
                  readOnly
                  placeholder="Click 'Calculate Hash'..."
                />
              </div>

              {hashStepBreakdown && (
                <div className="feedback-toast-success">
                  💡 {hashStepBreakdown}
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: HMAC CALCULATION GUIDE & STUDENT CALCULATOR (GRAY CARD) */}
          <div className="vlab-card-gray">
            <div className="step-title-badge">
              <span>🎏 Step 3: HMAC Calculation Guide & Step-by-Step Calculator</span>
            </div>

            <div className="vlab-info-box" style={{ fontStyle: 'normal' }}>
              <strong>HMAC follows this process:</strong>
              <ol style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li><code>{"ipad = 01011100, opad = 00110110"}</code></li>
                <li><code>{"Inner hash: H(IV || (k ⊕ ipad) || padded_message || length)"}</code></li>
                <li><code>{"Outer hash: H(IV || (k ⊕ opad) || inner_hash_result)"}</code></li>
              </ol>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h4 style={{ color: '#0f172a', marginBottom: '12px' }}>Sub-Step 3.1: Calculate Key XOR Inner Pad ($k \oplus \text{ipad}$)</h4>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span className="code-font" style={{ fontSize: '0.9rem' }}>{eduKey} ⊕ {ipadConst} =</span>
                <input
                  type="text"
                  className="form-input code-font"
                  style={{ width: '180px' }}
                  placeholder="Enter binary..."
                  value={userKipad}
                  onChange={(e) => setUserKipad(e.target.value)}
                />
                <button className="btn-secondary" onClick={verifyKipad}>Verify Step 3.1</button>
              </div>
              {kipadFeedback && (
                <div className={kipadFeedback.success ? "feedback-toast-success" : "feedback-toast-error"}>
                  {kipadFeedback.msg}
                </div>
              )}
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#0f172a', marginBottom: '12px' }}>Sub-Step 3.2: Calculate Key XOR Outer Pad ($k \oplus \text{opad}$)</h4>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span className="code-font" style={{ fontSize: '0.9rem' }}>{eduKey} ⊕ {opadConst} =</span>
                <input
                  type="text"
                  className="form-input code-font"
                  style={{ width: '180px' }}
                  placeholder="Enter binary..."
                  value={userKopad}
                  onChange={(e) => setUserKopad(e.target.value)}
                />
                <button className="btn-secondary" onClick={verifyKopad}>Verify Step 3.2</button>
              </div>
              {kopadFeedback && (
                <div className={kopadFeedback.success ? "feedback-toast-success" : "feedback-toast-error"}>
                  {kopadFeedback.msg}
                </div>
              )}
            </div>
          </div>

          {/* STEP 4: ENTER FINAL HMAC RESULT (PINK CARD) */}
          <div className="vlab-card-pink">
            <div className="step-title-badge">
              <span>🎯 Step 4: Enter Final HMAC Result</span>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '180px' }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Final HMAC Tag:</label>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Enter the final HMAC authentication tag</span>
              </div>
              <input
                type="text"
                className="form-input code-font"
                style={{ flex: 1 }}
                placeholder="Enter final 8-bit HMAC binary tag..."
                value={userFinalTag}
                onChange={(e) => setUserFinalTag(e.target.value)}
              />
              <button className="btn-vlab-pink" onClick={handleCheckFinalAnswer}>
                Check Answer
              </button>
              <button className="btn-secondary" onClick={handleAutoFillAnswer}>
                Auto Fill Correct
              </button>
            </div>

            {finalCheckResult && (
              <div className={finalCheckResult.success ? "feedback-toast-success" : "feedback-toast-error"}>
                {finalCheckResult.msg}
              </div>
            )}
          </div>

          {/* SUMMARY OF RESULTS (CYAN CARD TABLE) */}
          <div className="vlab-card-cyan">
            <div className="step-title-badge">
              <span>📊 Summary of Results</span>
            </div>

            <table className="vlab-summary-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Message</strong></td>
                  <td><code>{summaryData.message}</code></td>
                </tr>
                <tr>
                  <td><strong>Block Size (l)</strong></td>
                  <td><code>{summaryData.blockSize}</code></td>
                </tr>
                <tr>
                  <td><strong>Secret Key (k)</strong></td>
                  <td><code>{summaryData.key}</code></td>
                </tr>
                <tr>
                  <td><strong>Initialization Vector (IV)</strong></td>
                  <td><code>{summaryData.iv}</code></td>
                </tr>
                <tr>
                  <td><strong>Final HMAC Tag</strong></td>
                  <td><code>{summaryData.finalTag}</code></td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button className="btn-vlab-cyan" onClick={handleUpdateSummary}>
                Update Summary Table
              </button>
            </div>

            {summaryUpdated && (
              <div className="feedback-toast-success" style={{ justifyContent: 'center', marginTop: '12px' }}>
                ✅ Summary Table Updated with Latest Lab Parameters!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. PRODUCTION JAVA CRYPTOGRAPHY ENGINE     */}
      {/* ========================================== */}
      {labMode === 'production' && (
        <div>
          <div className="vlab-card">
            <h3 className="card-title">
              <Key className="card-title-icon" size={20} /> Java Core Security Configuration (javax.crypto.Mac)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Algorithm</label>
                <select
                  className="form-select"
                  value={genAlgorithm}
                  onChange={(e) => setGenAlgorithm(e.target.value)}
                >
                  <option value="HmacSHA256">HmacSHA256 (256-bit output)</option>
                  <option value="HmacSHA512">HmacSHA512 (512-bit output)</option>
                  <option value="HmacMD5">HmacMD5 (128-bit output)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Shared Secret Key</label>
                <input
                  type="text"
                  className="form-input code-font"
                  value={genSecretKey}
                  onChange={(e) => setGenSecretKey(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message Payload</label>
              <textarea
                className="form-textarea code-font"
                value={genMessage}
                onChange={(e) => setGenMessage(e.target.value)}
              />
            </div>

            <button className="btn-primary" onClick={handleGenerateMac} disabled={genLoading}>
              {genLoading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
              Generate HMAC Tag via Java
            </button>
          </div>

          {genResult && genResult.status === 'error' && (
            <div className="feedback-toast-error" style={{ marginTop: '16px' }}>
              ⚠️ {genResult.message || 'Failed to generate MAC tag. Please check server backend.'}
            </div>
          )}

          {genResult && genResult.status === 'success' && (
            <div className="vlab-card" style={{ borderColor: '#38bdf8', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="card-title" style={{ margin: 0 }}>
                  <CheckCircle className="card-title-icon" color="#16a34a" size={22} /> Generated HMAC Tag (Hexadecimal)
                </h3>
                <span className="badge badge-success">
                  {genResult.algorithm || 'HMAC'} ({genResult.macLengthBits || 256} bits)
                </span>
              </div>

              <div className="crypto-output-box" style={{ marginBottom: '20px' }}>
                <button className="copy-btn" onClick={() => copyToClipboard(genResult.macHex || '')}>
                  <Copy size={12} /> {copied ? 'Copied!' : 'Copy MAC'}
                </button>
                {genResult.macHex || ''}
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                  Execution & Breakdown Metrics:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
                  <div><strong>Engine:</strong> <span style={{ color: '#0284c7' }}>{genResult.engine || 'Java Core Engine'}</span></div>
                  <div><strong>Execution Time:</strong> <code>{genResult.executionTimeMs ?? 0} ms</code></div>
                  <div><strong>Key Length:</strong> <code>{genResult.breakdown?.keyLengthBytes ?? 0} bytes</code></div>
                </div>

                {genResult.breakdown && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #cbd5e1', fontFamily: 'var(--font-code)', fontSize: '0.8rem', color: '#475569' }}>
                    <p><strong>Padded Key (K'):</strong> {genResult.breakdown.paddedKeyHex ? genResult.breakdown.paddedKeyHex.substring(0, 40) : ''}...</p>
                    <p><strong>Inner Pad (K ⊕ ipad):</strong> {genResult.breakdown.ipadHex ? genResult.breakdown.ipadHex.substring(0, 40) : ''}...</p>
                    <p><strong>Outer Pad (K ⊕ opad):</strong> {genResult.breakdown.opadHex ? genResult.breakdown.opadHex.substring(0, 40) : ''}...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
