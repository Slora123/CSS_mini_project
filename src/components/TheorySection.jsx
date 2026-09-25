import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Key, Lock } from 'lucide-react';

export default function TheorySection() {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Cryptographic Theory: Message Authentication Codes (MAC)</h2>
        <p className="section-subtitle">Understanding Symmetric Keyed MAC, CBC-MAC, and CMAC (NIST SP 800-38B)</p>
      </div>

      <div className="vlab-card">
        <h3 className="card-title">
          <BookOpen className="card-title-icon" size={22} /> What is a Message Authentication Code (MAC)?
        </h3>
        <p style={{ color: '#334155', lineHeight: 1.8, marginBottom: '16px' }}>
          A <strong>Message Authentication Code (MAC)</strong>, also known as a cryptographic tag or checksum, is a symmetric key cryptographic algorithm that takes an arbitrary-length message payload $M$ and a shared secret key $K$, and produces a fixed-size authentication tag $T$:
        </p>

        <div className="crypto-output-box" style={{ textAlign: 'center', fontSize: '1.1rem', margin: '16px 0', padding: '16px' }}>
          {"Tag T = MAC(K, M)"}
        </div>

        <p style={{ color: '#334155', lineHeight: 1.8 }}>
          Only parties who possess the secret key $K$ can compute or verify the tag $T$. If an adversary modifies even 1 bit of $M$ or $T$, the receiver's verification algorithm returns <code>INVALID</code>.
        </p>
      </div>

      <div className="vlab-card">
        <h3 className="card-title">
          <Cpu className="card-title-icon" size={22} /> Block-Cipher Based MAC Constructions
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '16px' }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ color: '#0f172a', marginBottom: '10px', fontSize: '1.05rem', fontWeight: 700 }}>
              1. CBC-MAC (Cipher Block Chaining MAC)
            </h4>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '12px' }}>
              CBC-MAC uses a block cipher (such as AES) in Cipher Block Chaining mode. The message $M$ is divided into 128-bit blocks $P_1, P_2, \dots, P_n$. Each block is XORed with the previous cipher block before encryption:
            </p>
            <div className="code-font" style={{ background: '#0f172a', color: '#38bdf8', padding: '10px', borderRadius: '6px', fontSize: '0.82rem' }}>
              {"T_0 = 0 (Initialization Vector)\n"}
              {"T_i = E_K( P_i ⊕ T_{i-1} )\n"}
              {"Final Tag T = T_n"}
            </div>
          </div>

          <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
            <h4 style={{ color: '#15803d', marginBottom: '10px', fontSize: '1.05rem', fontWeight: 700 }}>
              2. CMAC (NIST SP 800-38B Standard)
            </h4>
            <p style={{ color: '#14532d', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '12px' }}>
              CMAC fixes the security limitations of raw CBC-MAC for variable-length messages by generating two 128-bit subkeys ($K_1$ and $K_2$) from the primary key $K$ using Galois field finite field multiplication:
            </p>
            <div className="code-font" style={{ background: '#0f172a', color: '#4ade80', padding: '10px', borderRadius: '6px', fontSize: '0.82rem' }}>
              {"L = E_K(0^128)\n"}
              {"K1 = L << 1 (XOR 0x87 if MSB=1)\n"}
              {"Last Block = P_n ⊕ K1 (or K2 if padded)"}
            </div>
          </div>
        </div>
      </div>

      <div className="vlab-card">
        <h3 className="card-title">
          <ShieldCheck className="card-title-icon" size={22} /> Security Properties: MAC vs Digital Signature vs Hash
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', color: '#334155' }}>Security Mechanism</th>
                <th style={{ padding: '12px 16px', color: '#334155' }}>Key Used</th>
                <th style={{ padding: '12px 16px', color: '#0284c7' }}>Data Integrity</th>
                <th style={{ padding: '12px 16px', color: '#0284c7' }}>Authentication</th>
                <th style={{ padding: '12px 16px', color: '#334155' }}>Non-Repudiation</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Cryptographic Hash (SHA-256)</td>
                <td style={{ padding: '12px 16px', color: '#dc2626' }}>None</td>
                <td style={{ padding: '12px 16px', color: '#16a34a' }}>Yes (Detects accidental noise)</td>
                <td style={{ padding: '12px 16px', color: '#dc2626' }}>No</td>
                <td style={{ padding: '12px 16px', color: '#dc2626' }}>No</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f0f9ff' }}>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0284c7' }}>MAC (CBC-MAC / CMAC)</td>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0284c7' }}>Shared Secret Key $K$</td>
                <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: '700' }}>Yes (Detects active tampering)</td>
                <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: '700' }}>Yes (Shared key holder)</td>
                <td style={{ padding: '12px 16px', color: '#dc2626' }}>No (Both hold $K$)</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Digital Signature (RSA/ECDSA)</td>
                <td style={{ padding: '12px 16px' }}>Asymmetric (Private/Public)</td>
                <td style={{ padding: '12px 16px', color: '#16a34a' }}>Yes</td>
                <td style={{ padding: '12px 16px', color: '#16a34a' }}>Yes</td>
                <td style={{ padding: '12px 16px', color: '#16a34a' }}>Yes (Only sender holds Private Key)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
