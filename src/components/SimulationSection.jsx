import React, { useState } from 'react';
import { Cpu, Key, CheckCircle, XCircle, RefreshCw, Copy, ShieldCheck, ShieldAlert, Zap, Lock, FileSpreadsheet, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function SimulationSection() {
  // MAC Input Configuration State
  const [algorithm, setAlgorithm] = useState('CBC-MAC');
  const [secretKey, setSecretKey] = useState('2b7e151628aed2a6abf7158809cf4f3c');
  const [message, setMessage] = useState('Transfer $5,000 to Account #98412');
  
  // Generation & Verification Results State
  const [macResult, setMacResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verifier State
  const [verMessage, setVerMessage] = useState('Transfer $5,000 to Account #98412');
  const [verExpectedMac, setVerExpectedMac] = useState('');
  const [verResult, setVerResult] = useState(null);
  const [verLoading, setVerLoading] = useState(false);

  // Eve Attack Simulator State
  const [aliceMsg, setAliceMsg] = useState('Pay $1,500 to Bob');
  const [aliceMac, setAliceMac] = useState('');
  const [eveTamperedMsg, setEveTamperedMsg] = useState('Pay $1,500 to Bob');
  const [eveTamperedMac, setEveTamperedMac] = useState('');
  const [bobResult, setBobResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Summary Table State
  const [summaryData, setSummaryData] = useState({
    message: '-',
    algorithm: '-',
    secretKey: '-',
    macTag: '-'
  });
  const [summaryUpdated, setSummaryUpdated] = useState(false);

  // Generate 128-bit Random Key
  const handleRandomKey = async () => {
    try {
      const res = await fetch('/api/mac/key-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ length: 32 })
      });
      const data = await res.json();
      if (data.secretKey) {
        setSecretKey(data.secretKey);
      }
    } catch (err) {
      setSecretKey(Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
    }
  };

  // Generate MAC Tag C(K, M)
  const handleGenerateMac = async () => {
    if (!secretKey || message === '') return;
    setLoading(true);
    try {
      const res = await fetch('/api/mac/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm,
          secretKey,
          message
        })
      });
      const data = await res.json();
      setMacResult(data);
      if (data.macHex) {
        setVerExpectedMac(data.macHex);
      }
    } catch (err) {
      setMacResult({ status: 'error', message: 'Failed to connect to backend server' });
    } finally {
      setLoading(false);
    }
  };

  // Verify MAC Tag
  const handleVerifyMac = async () => {
    if (!secretKey || !verExpectedMac) return;
    setVerLoading(true);
    try {
      const res = await fetch('/api/mac/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm,
          secretKey,
          message: verMessage,
          expectedMac: verExpectedMac
        })
      });
      const data = await res.json();
      setVerResult(data);
    } catch (err) {
      setVerResult({ status: 'error', message: 'Verification error' });
    } finally {
      setVerLoading(false);
    }
  };

  // Eve Attack Simulator Handlers
  const handleAliceSend = async () => {
    try {
      const res = await fetch('/api/mac/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, secretKey, message: aliceMsg })
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
        body: JSON.stringify({
          algorithm,
          secretKey,
          message: eveTamperedMsg,
          expectedMac: eveTamperedMac
        })
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

  const handleUpdateSummary = () => {
    setSummaryData({
      message: message,
      algorithm: algorithm,
      secretKey: secretKey,
      macTag: macResult?.macHex || '-'
    });
    setSummaryUpdated(true);
    setTimeout(() => setSummaryUpdated(false), 3000);
  };

  // Calculate Blocks Preview for Step 2
  const getBlocksPreview = () => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(message);
    const blocks = [];
    for (let i = 0; i < Math.max(1, bytes.length); i += 16) {
      const chunk = bytes.slice(i, i + 16);
      const hex = Array.from(chunk).map(b => b.toString(16).padStart(2, '0')).join('');
      blocks.push({ index: Math.floor(i / 16) + 1, hex, bytesCount: chunk.length });
    }
    return blocks;
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Message Authentication Code (MAC) Laboratory</h2>
        <p className="section-subtitle">Interactive 4-Step MAC Pipeline & Block Cipher Chaining (CBC-MAC / CMAC)</p>
      </div>

      {/* STEP 1: SETUP PARAMETERS (YELLOW CARD) */}
      <div className="vlab-card-yellow">
        <div className="step-title-badge">
          <span>🎨 Step 1: Configure Key (K) & Algorithm</span>
        </div>

        <div className="vlab-info-box">
          A Message Authentication Code (MAC) uses a shared symmetric secret key $K$ to generate a fixed-size tag $T = C(K, M)$. Select your MAC construction below:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label">Select MAC Construction</label>
            <select
              className="form-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="CBC-MAC">CBC-MAC (AES-128 Block Cipher Chaining)</option>
              <option value="CMAC">CMAC (NIST SP 800-38B Subkey K1/K2 Standard)</option>
              <option value="Keyed-MAC">Keyed-MAC (HmacSHA256 General Symmetric MAC)</option>
            </select>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label className="form-label" style={{ margin: 0 }}>Shared Secret Key (K)</label>
              <button
                type="button"
                onClick={handleRandomKey}
                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RefreshCw size={12} /> Auto-Generate 128-bit Key
              </button>
            </div>
            <input
              type="text"
              className="form-input code-font"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter 128-bit hex key..."
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Message Payload (M)</label>
          <textarea
            className="form-textarea code-font"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter plaintext message payload..."
          />
        </div>
      </div>

      {/* STEP 2: BLOCK PARTITIONING & PADDING (GREEN CARD) */}
      <div className="vlab-card-green">
        <div className="step-title-badge">
          <span>🧮 Step 2: Message Block Partitioning & Padding</span>
        </div>

        <div className="vlab-info-box-green">
          The input payload is split into 128-bit (16-byte) blocks ($P_1, P_2, \dots, P_n$). If the last block is under 16 bytes, PKCS7 or 100... bit padding is automatically applied.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {getBlocksPreview().map((blk) => (
            <div key={blk.index} style={{ background: 'white', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #a5d6a7' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#15803d', marginBottom: '6px' }}>
                Block #{blk.index} ({blk.bytesCount} bytes)
              </div>
              <div className="code-font" style={{ fontSize: '0.8rem', color: '#334155', wordBreak: 'break-all' }}>
                {blk.hex || '00'.repeat(16)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 3: MAC TAG GENERATION & BLOCK CHAINING VISUALIZER (GRAY CARD) */}
      <div className="vlab-card-gray">
        <div className="step-title-badge">
          <span>🎏 Step 3: MAC Tag Generation $C(K, M)$ & Block Chaining Visualizer</span>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            className="btn-primary"
            onClick={handleGenerateMac}
            disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
            Generate MAC Tag $C(K, M)$ via Java Security Engine
          </button>
        </div>

        {macResult && macResult.status === 'error' && (
          <div className="feedback-toast-error">
            ⚠️ {macResult.message || 'Error executing MAC tag generation.'}
          </div>
        )}

        {macResult && macResult.status === 'success' && (
          <div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '2px solid #0284c7', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Generated Authentication Tag ($T$)
                </h4>
                <span className="badge badge-success">
                  {macResult.algorithm} ({macResult.macLengthBits} bits)
                </span>
              </div>

              <div className="crypto-output-box" style={{ fontSize: '1.05rem', margin: 0 }}>
                <button className="copy-btn" onClick={() => copyToClipboard(macResult.macHex)}>
                  <Copy size={12} /> {copied ? 'Copied!' : 'Copy Tag'}
                </button>
                {macResult.macHex}
              </div>

              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#475569', display: 'flex', gap: '16px' }}>
                <span><strong>Execution Time:</strong> <code>{macResult.executionTimeMs} ms</code></span>
                <span><strong>Engine:</strong> Java Cipher Security Engine</span>
              </div>
            </div>

            {/* Block Chaining Breakdown Diagram */}
            {macResult.blocks && macResult.blocks.length > 0 && (
              <div>
                <h4 style={{ color: '#0f172a', marginBottom: '12px', fontSize: '1rem', fontWeight: 700 }}>
                  Block Chaining Execution Steps ($T_i = E_K(P_i \oplus T_{i-1})$):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {macResult.blocks.map((b) => (
                    <div key={b.index} style={{ background: '#0f172a', color: 'white', padding: '14px 18px', borderRadius: '8px', fontFamily: 'var(--font-code)', fontSize: '0.82rem' }}>
                      <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: 4 }}>
                        Block #{b.index}: Plain Block ($P_{b.index}$)
                      </div>
                      <div style={{ color: '#94a3b8' }}>Plain: {b.plainHex}</div>
                      <div style={{ color: '#fbbf24' }}>XOR Chained: {b.xorHex}</div>
                      <div style={{ color: '#4ade80', fontWeight: 700 }}>Cipher Output ($T_{b.index}$): {b.encHex}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* STEP 4: VERIFICATION & MITM ATTACK SIMULATOR (PINK CARD) */}
      <div className="vlab-card-pink">
        <div className="step-title-badge">
          <span>🎯 Step 4: Constant-Time Verification & MITM Attack Simulator</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <h4 style={{ color: '#0f172a', marginBottom: 12 }}>1. Receiver Payload & Tag Input</h4>
            <div className="form-group">
              <label className="form-label">Received Payload ($M$)</label>
              <input
                type="text"
                className="form-input code-font"
                value={verMessage}
                onChange={(e) => setVerMessage(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Received MAC Tag ($T$)</label>
              <input
                type="text"
                className="form-input code-font"
                value={verExpectedMac}
                onChange={(e) => setVerExpectedMac(e.target.value)}
                placeholder="Paste MAC tag to verify..."
              />
            </div>
            <button className="btn-vlab-pink" onClick={handleVerifyMac} disabled={verLoading}>
              <ShieldCheck size={16} /> Verify MAC Tag
            </button>
          </div>

          <div>
            <h4 style={{ color: '#dc2626', marginBottom: 12 }}>2. Active MITM Bit-Flip Simulator</h4>
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #f8bbd0' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 12 }}>
                Simulate Eve modifying message bits or MAC tag bits on the wire:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => setVerMessage(verMessage + ' (Altered)')}
                >
                  Tamper Message Payload (Modify Bits)
                </button>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => setVerExpectedMac(verExpectedMac.substring(0, verExpectedMac.length - 2) + 'ff')}
                >
                  Corrupt 1 Bit in MAC Tag
                </button>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => { setVerMessage(message); setVerExpectedMac(macResult?.macHex || ''); }}
                >
                  Reset Original Valid Payload & Tag
                </button>
              </div>
            </div>
          </div>
        </div>

        {verResult && verResult.status === 'success' && (
          <div className={verResult.isValid ? "feedback-toast-success" : "feedback-toast-error"}>
            {verResult.isValid ? (
              <div>
                <strong>🟢 VERIFICATION PASSED:</strong> The received MAC tag matches the computed tag. Payload authenticity & integrity guaranteed!
              </div>
            ) : (
              <div>
                <strong>🔴 VERIFICATION FAILED (TAMPERED):</strong> The received MAC tag does NOT match the payload. Message was altered in transit!
              </div>
            )}
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
              <td><strong>Message Payload</strong></td>
              <td><code>{summaryData.message}</code></td>
            </tr>
            <tr>
              <td><strong>MAC Algorithm</strong></td>
              <td><code>{summaryData.algorithm}</code></td>
            </tr>
            <tr>
              <td><strong>Secret Key (K)</strong></td>
              <td><code>{summaryData.secretKey}</code></td>
            </tr>
            <tr>
              <td><strong>Generated MAC Tag (T)</strong></td>
              <td><code>{summaryData.macTag}</code></td>
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
            ✅ Summary Table Updated with Current Experiment Parameters!
          </div>
        )}
      </div>
    </div>
  );
}
