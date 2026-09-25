import React from 'react';
import { Target, CheckCircle2, Shield, Key } from 'lucide-react';

export default function AimSection() {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Message Authentication Code (MAC)</h2>
        <p className="section-subtitle">Experiment 04: Generation & Verification of MAC using Shared Secret Keys</p>
      </div>

      <div className="vlab-card">
        <h3 className="card-title">
          <Target className="card-title-icon" size={22} /> Primary Experiment Aim
        </h3>
        <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8 }}>
          The aim of this experiment is to generate and verify a <strong>Message Authentication Code (MAC)</strong> for an arbitrary message using a shared secret key, and observe how cryptographic hash functions (such as <code>HMAC-SHA256</code>, <code>HMAC-SHA512</code>, and <code>HMAC-MD5</code>) guarantee message integrity and data origin authentication.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
          <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0369a1', fontWeight: '700', marginBottom: '8px' }}>
              <Shield size={20} /> Data Origin Authentication
            </div>
            <p style={{ fontSize: '0.9rem', color: '#0c4a6e' }}>
              Confirming that the message was created by a party who holds the shared secret key $K$.
            </p>
          </div>

          <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#15803d', fontWeight: '700', marginBottom: '8px' }}>
              <CheckCircle2 size={20} /> Data Integrity Verification
            </div>
            <p style={{ fontSize: '0.9rem', color: '#14532d' }}>
              Detecting any unauthorized modifications, bit flips, or tampering introduced during transmission across an insecure channel.
            </p>
          </div>

          <div style={{ background: '#fff7ed', padding: '20px', borderRadius: '10px', border: '1px solid #fed7aa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c2410c', fontWeight: '700', marginBottom: '8px' }}>
              <Key size={20} /> Symmetric Security Model
            </div>
            <p style={{ fontSize: '0.9rem', color: '#7c2d12' }}>
              Utilizing a shared secret key $K$ known exclusively to the sender (Alice) and receiver (Bob).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
