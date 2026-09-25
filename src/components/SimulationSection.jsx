import React, { useState } from 'react';
import { Cpu, Key, CheckCircle, XCircle, RefreshCw, Copy, ShieldCheck, ShieldAlert, ArrowRight, Zap } from 'lucide-react';

export default function SimulationSection() {
  const [activeSubTab, setActiveSubTab] = useState('generator');

  // Generator State
  const [genAlgorithm, setGenAlgorithm] = useState('HmacSHA256');
  const [genSecretKey, setGenSecretKey] = useState('MySharedSecretKey2026');
  const [genMessage, setGenMessage] = useState('Transfer $5,000 to Account #98412');
  const [genResult, setGenResult] = useState(null);
  const [genLoading, setGenLoading] = useState(false);

  // Verifier State
  const [verAlgorithm, setVerAlgorithm] = useState('HmacSHA256');
  const [verSecretKey, setVerSecretKey] = useState('MySharedSecretKey2026');
  const [verMessage, setVerMessage] = useState('Transfer $5,000 to Account #98412');
  const [verExpectedMac, setVerExpectedMac] = useState('');
  const [verResult, setVerResult] = useState(null);
  const [verLoading, setVerLoading] = useState(false);

  // Eve Simulator State
  const [eveKey, setEveKey] = useState('TeamSecretPasscode2026');
  const [aliceMsg, setAliceMsg] = useState('Pay $1,500 to Bob');
  const [aliceMac, setAliceMac] = useState('');
  const [eveTamperedMsg, setEveTamperedMsg] = useState('Pay $1,500 to Bob');
  const [eveTamperedMac, setEveTamperedMac] = useState('');
  const [bobResult, setBobResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Generate Key Handler
  const handleRandomKey = async () => {
    try {
      const res = await fetch('/api/mac/key-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ length: 32 })
      });
      const data = await res.json();
      if (data.secretKey) {
        setGenSecretKey(data.secretKey);
        setVerSecretKey(data.secretKey);
      }
    } catch (err) {
      setGenSecretKey(Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
    }
  };

  // Generate MAC Handler
  const handleGenerateMac = async () => {
    if (!genSecretKey || genMessage === '') return;
    setGenLoading(true);
    try {
      const res = await fetch('/api/mac/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm: genAlgorithm,
          secretKey: genSecretKey,
          message: genMessage
        })
      });
      const data = await res.json();
      setGenResult(data);
      if (data.macHex) {
        setVerExpectedMac(data.macHex);
      }
    } catch (err) {
      setGenResult({ status: 'error', message: 'Failed to connect to backend' });
    } finally {
      setGenLoading(false);
    }
  };

  // Verify MAC Handler
  const handleVerifyMac = async () => {
    if (!verSecretKey || !verExpectedMac) return;
    setVerLoading(true);
    try {
      const res = await fetch('/api/mac/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm: verAlgorithm,
          secretKey: verSecretKey,
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

  // Eve Simulator Steps
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
        body: JSON.stringify({
          algorithm: 'HmacSHA256',
          secretKey: eveKey,
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

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Interactive MAC Laboratory</h2>
        <p className="section-subtitle">Real-time Java Cryptography Execution for MAC Generation, Verification & MITM Simulation</p>
      </div>

      <div className="sim-tabs">
        <button
          className={`sim-tab-btn ${activeSubTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('generator')}
        >
          <Zap size={18} /> MAC Generator
        </button>
        <button
          className={`sim-tab-btn ${activeSubTab === 'verifier' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('verifier')}
        >
          <ShieldCheck size={18} /> MAC Verifier
        </button>
        <button
          className={`sim-tab-btn ${activeSubTab === 'tamper' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('tamper')}
        >
          <ShieldAlert size={18} /> Eve MITM Attack Simulator
        </button>
      </div>

      {/* SUB-TAB 1: MAC GENERATOR */}
      {activeSubTab === 'generator' && (
        <div>
          <div className="vlab-card">
            <h3 className="card-title">
              <Key className="card-title-icon" size={20} /> Input Configuration
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Select Cryptographic Hash Algorithm</label>
                <select
                  className="form-select"
                  value={genAlgorithm}
                  onChange={(e) => setGenAlgorithm(e.target.value)}
                >
                  <option value="HmacSHA256">HmacSHA256 (256-bit output - Recommended)</option>
                  <option value="HmacSHA512">HmacSHA512 (512-bit output - High Security)</option>
                  <option value="HmacMD5">HmacMD5 (128-bit output - Legacy)</option>
                  <option value="HmacSHA1">HmacSHA1 (160-bit output)</option>
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
                    <RefreshCw size={12} /> Auto-Generate Key
                  </button>
                </div>
                <input
                  type="text"
                  className="form-input code-font"
                  value={genSecretKey}
                  onChange={(e) => setGenSecretKey(e.target.value)}
                  placeholder="Enter secret key..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message Payload (M)</label>
              <textarea
                className="form-textarea code-font"
                value={genMessage}
                onChange={(e) => setGenMessage(e.target.value)}
                placeholder="Enter plaintext message to sign..."
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleGenerateMac}
              disabled={genLoading}
            >
              {genLoading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
              Generate MAC Tag (via Java Core)
            </button>
          </div>

          {genResult && genResult.status === 'success' && (
            <div className="vlab-card" style={{ borderColor: '#38bdf8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="card-title" style={{ margin: 0 }}>
                  <CheckCircle className="card-title-icon" color="#16a34a" size={22} /> Generated MAC Tag (Hexadecimal)
                </h3>
                <span className="badge badge-success">
                  {genResult.algorithm} ({genResult.macLengthBits} bits)
                </span>
              </div>

              <div className="crypto-output-box" style={{ marginBottom: '20px' }}>
                <button className="copy-btn" onClick={() => copyToClipboard(genResult.macHex)}>
                  <Copy size={12} /> {copied ? 'Copied!' : 'Copy MAC'}
                </button>
                {genResult.macHex}
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                  Execution & Breakdown Metrics:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
                  <div><strong>Engine:</strong> <span style={{ color: '#0284c7' }}>{genResult.engine}</span></div>
                  <div><strong>Execution Time:</strong> <code>{genResult.executionTimeMs} ms</code></div>
                  <div><strong>Key Length:</strong> <code>{genResult.breakdown?.keyLengthBytes} bytes</code></div>
                </div>

                {genResult.breakdown && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #cbd5e1', fontFamily: 'var(--font-code)', fontSize: '0.8rem', color: '#475569' }}>
                    <p><strong>Padded Key ($K'$):</strong> {genResult.breakdown.paddedKeyHex?.substring(0, 40)}...</p>
                    <p><strong>Inner Pad ($K \oplus \text{ipad}$):</strong> {genResult.breakdown.ipadHex?.substring(0, 40)}...</p>
                    <p><strong>Outer Pad ($K \oplus \text{opad}$):</strong> {genResult.breakdown.opadHex?.substring(0, 40)}...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: MAC VERIFIER */}
      {activeSubTab === 'verifier' && (
        <div>
          <div className="vlab-card">
            <h3 className="card-title">
              <ShieldCheck className="card-title-icon" size={20} /> Verification Input
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Algorithm</label>
                <select
                  className="form-select"
                  value={verAlgorithm}
                  onChange={(e) => setVerAlgorithm(e.target.value)}
                >
                  <option value="HmacSHA256">HmacSHA256</option>
                  <option value="HmacSHA512">HmacSHA512</option>
                  <option value="HmacMD5">HmacMD5</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Shared Secret Key (K)</label>
                <input
                  type="text"
                  className="form-input code-font"
                  value={verSecretKey}
                  onChange={(e) => setVerSecretKey(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Received Message Payload (M)</label>
              <textarea
                className="form-textarea code-font"
                value={verMessage}
                onChange={(e) => setVerMessage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Received MAC Tag (Hex)</label>
              <input
                type="text"
                className="form-input code-font"
                value={verExpectedMac}
                onChange={(e) => setVerExpectedMac(e.target.value)}
                placeholder="Paste MAC tag to verify..."
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleVerifyMac}
              disabled={verLoading}
            >
              <ShieldCheck size={18} /> Verify MAC Authenticity
            </button>
          </div>

          {verResult && verResult.status === 'success' && (
            <div className="vlab-card" style={{ borderColor: verResult.isValid ? '#22c55e' : '#ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {verResult.isValid ? (
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={32} />
                  </div>
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <XCircle size={32} />
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: verResult.isValid ? '#15803d' : '#b91c1c' }}>
                    {verResult.isValid ? 'VERIFICATION SUCCESSFUL (AUTHENTIC)' : 'VERIFICATION FAILED (TAMPERED / INVALID)'}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.95rem', marginTop: '4px' }}>
                    {verResult.isValid
                      ? 'The calculated MAC matches the provided tag perfectly. The message originates from a trusted key holder and was not tampered with.'
                      : 'The calculated MAC does NOT match the provided tag. The message content has been altered or the secret key is invalid.'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '20px', background: '#0f172a', borderRadius: '8px', padding: '16px', fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'var(--font-code)' }}>
                <div><strong>Computed MAC: </strong> <span style={{ color: '#38bdf8' }}>{verResult.computedMacHex}</span></div>
                <div style={{ marginTop: 6 }}><strong>Received MAC: </strong> <span style={{ color: verResult.isValid ? '#4ade80' : '#f87171' }}>{verResult.expectedMacHex}</span></div>
                <div style={{ marginTop: 6, color: '#94a3b8' }}><strong>Constant-Time Compare: </strong> <code>MessageDigest.isEqual()</code> executed in <code>{verResult.executionTimeMs} ms</code></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: EVE ATTACK SIMULATOR */}
      {activeSubTab === 'tamper' && (
        <div>
          <div className="vlab-card">
            <h3 className="card-title">
              <ShieldAlert className="card-title-icon" size={20} /> Man-in-the-Middle (MITM) Tampering Simulation
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '20px' }}>
              Simulate an active adversary (Eve) intercepting the transmitted message and MAC tag on an insecure network channel between Alice and Bob.
            </p>

            {/* Network Channel Diagram */}
            <div className="network-flow">
              <div className="node-box">
                <div style={{ fontWeight: 800, color: '#0284c7' }}>Alice (Sender)</div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>Holds Secret Key $K$</p>
              </div>

              <div className="channel-line">
                <div className="packet-pill">Insecure Channel</div>
              </div>

              <div className="node-box eve">
                <div style={{ fontWeight: 800, color: '#dc2626' }}>Eve (Attacker)</div>
                <p style={{ fontSize: '0.78rem', color: '#991b1b', marginTop: 4 }}>Interceptors & Modifies</p>
              </div>

              <div className="channel-line">
                <div className="packet-pill">Insecure Channel</div>
              </div>

              <div className="node-box">
                <div style={{ fontWeight: 800, color: '#16a34a' }}>Bob (Receiver)</div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>Verifies with Key $K$</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
              <div>
                <h4 style={{ color: '#0f172a', marginBottom: 12 }}>1. Alice's Setup & Signature</h4>
                <div className="form-group">
                  <label className="form-label">Alice's Message</label>
                  <input
                    type="text"
                    className="form-input code-font"
                    value={aliceMsg}
                    onChange={(e) => setAliceMsg(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Shared Key $K$</label>
                  <input
                    type="text"
                    className="form-input code-font"
                    value={eveKey}
                    onChange={(e) => setEveKey(e.target.value)}
                  />
                </div>
                <button className="btn-secondary" onClick={handleAliceSend}>
                  Alice Signs & Transmits
                </button>
              </div>

              {aliceMac && (
                <div>
                  <h4 style={{ color: '#dc2626', marginBottom: 12 }}>2. Eve Intercepts & Alters</h4>
                  <div className="form-group">
                    <label className="form-label">Altered Message (by Eve)</label>
                    <input
                      type="text"
                      className="form-input code-font"
                      value={eveTamperedMsg}
                      onChange={(e) => setEveTamperedMsg(e.target.value)}
                      style={{ borderColor: '#f87171' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem' }}
                      onClick={() => setEveTamperedMsg('Pay $15,000 to Bob')}
                    >
                      Tamper Amount ($1,500 ➔ $15,000)
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem' }}
                      onClick={() => setEveTamperedMac(eveTamperedMac.substring(0, eveTamperedMac.length - 2) + 'ff')}
                    >
                      Corrupt 1 Bit in MAC Tag
                    </button>
                  </div>
                  <button className="btn-primary" onClick={handleBobVerify}>
                    3. Bob Verifies Transmitted Data
                  </button>
                </div>
              )}
            </div>

            {bobResult && (
              <div style={{ marginTop: '24px', padding: '20px', borderRadius: '8px', background: bobResult.isValid ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${bobResult.isValid ? '#bbf7d0' : '#fecaca'}` }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: bobResult.isValid ? '#15803d' : '#b91c1c', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {bobResult.isValid ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  Bob's Verification Verdict: {bobResult.isValid ? 'ACCEPTED' : 'REJECTED & TAMPER ALERT!'}
                </h4>
                <p style={{ marginTop: 8, fontSize: '0.9rem', color: bobResult.isValid ? '#14532d' : '#7f1d1d' }}>
                  {bobResult.isValid
                    ? 'Eve did not tamper with the payload or MAC. Bob successfully authenticates Alice!'
                    : 'Bob computed HMAC with the shared key and detected a mismatch! Eve\'s tampering attack was completely thwarted by HMAC integrity.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
