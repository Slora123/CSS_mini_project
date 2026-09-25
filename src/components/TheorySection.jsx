import React from 'react';
import { BookOpen, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export default function TheorySection() {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Cryptographic Theory: MAC & HMAC</h2>
        <p className="section-subtitle">Understanding Message Authentication Codes and RFC 2104 HMAC Construction</p>
      </div>

      <div className="vlab-card">
        <h3 className="card-title">
          <BookOpen className="card-title-icon" size={22} /> What is a Message Authentication Code (MAC)?
        </h3>
        <p style={{ color: '#334155', lineHeight: 1.8, marginBottom: '16px' }}>
          A <strong>Message Authentication Code (MAC)</strong>, often called a cryptographic checksum or tag, is a short piece of information used to authenticate a message — to confirm that the message came from the stated sender (authenticity) and has not been altered in transit (integrity).
        </p>
        <p style={{ color: '#334155', lineHeight: 1.8 }}>
          Unlike digital signatures based on asymmetric public-key cryptography (RSA, ECDSA), MAC algorithms use a <strong>shared secret key $K$</strong> known only to the sender (Alice) and the intended recipient (Bob).
        </p>
      </div>

      <div className="vlab-card">
        <h3 className="card-title">
          <Cpu className="card-title-icon" size={22} /> HMAC Mathematical Construction (RFC 2104)
        </h3>
        <p style={{ color: '#334155', lineHeight: 1.8, marginBottom: '16px' }}>
          HMAC (Hash-based Message Authentication Code) constructs a MAC tag using a cryptographic hash function $H$ (such as SHA-256 or SHA-512) combined with a secret key $K$.
        </p>

        <div className="crypto-output-box" style={{ textAlign: 'center', fontSize: '1.05rem', margin: '20px 0', padding: '20px' }}>
          HMAC(K, M) = H( (K ⊕ opad) || H( (K ⊕ ipad) || M ) )
        </div>

        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ color: '#0f172a', marginBottom: '12px' }}>Notation & Definitions:</h4>
          <ul style={{ paddingLeft: '20px', color: '#475569', lineHeight: 1.8 }}>
            <li><strong>$H$</strong>: Underlying cryptographic hash function (e.g., SHA-256 with 64-byte block size $B$).</li>
            <li><strong>$K$</strong>: Shared secret key. If length of $K$ is less than block size $B$, it is zero-padded. If greater, it is hashed first.</li>
            <li><strong>$\text{ipad}$</strong>: Inner pad string consisting of byte <code>0x36</code> repeated $B$ times.</li>
            <li><strong>$\text{opad}$</strong>: Outer pad string consisting of byte <code>0x5C</code> repeated $B$ times.</li>
            <li><strong>$\oplus$</strong>: Bitwise XOR operation.</li>
            <li><strong>$\parallel$</strong>: Byte concatenation operator.</li>
          </ul>
        </div>
      </div>

      <div className="vlab-card">
        <h3 className="card-title">
          <ShieldCheck className="card-title-icon" size={22} /> Comparison: MAC vs Digital Signature vs Hash
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', color: '#334155' }}>Security Property</th>
                <th style={{ padding: '12px 16px', color: '#334155' }}>Plain Hash (SHA-256)</th>
                <th style={{ padding: '12px 16px', color: '#0284c7' }}>MAC (HMAC)</th>
                <th style={{ padding: '12px 16px', color: '#334155' }}>Digital Signature (RSA)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Data Integrity</td>
                <td style={{ padding: '12px 16px', color: '#16a34a' }}>Yes (Detects corruption)</td>
                <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: '700' }}>Yes (Detects tampering)</td>
                <td style={{ padding: '12px 16px', color: '#16a34a' }}>Yes (Detects tampering)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Data Authentication</td>
                <td style={{ padding: '12px 16px', color: '#dc2626' }}>No (No key used)</td>
                <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: '700' }}>Yes (Requires secret key K)</td>
                <td style={{ padding: '12px 16px', color: '#16a34a' }}>Yes (Requires private key)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Non-Repudiation</td>
                <td style={{ padding: '12px 16px', color: '#dc2626' }}>No</td>
                <td style={{ padding: '12px 16px', color: '#dc2626' }}>No (Both parties hold K)</td>
                <td style={{ padding: '12px 16px', color: '#16a34a' }}>Yes (Only sender has private key)</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Computation Speed</td>
                <td style={{ padding: '12px 16px' }}>Extremely Fast</td>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0284c7' }}>Very Fast (Symmetric)</td>
                <td style={{ padding: '12px 16px' }}>Slower (Asymmetric RSA/ECC)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
