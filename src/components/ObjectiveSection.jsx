import React from 'react';
import { Flag, CheckCircle, Lock, Zap, RefreshCw } from 'lucide-react';

export default function ObjectiveSection() {
  const objectives = [
    {
      title: 'Understand Shared Secret Authentication',
      desc: 'Learn how a shared symmetric secret key enables secure verification between sender and receiver without exposing plaintext keys.',
      icon: Lock
    },
    {
      title: 'Master HMAC Algorithms',
      desc: 'Explore different hashing backends including HMAC-SHA256, HMAC-SHA512, and HMAC-MD5.',
      icon: Zap
    },
    {
      title: 'Simulate Real-Time Message Tampering',
      desc: 'Observe how even a single bit change in the transmitted message or tag results in instant verification failure at the receiver.',
      icon: RefreshCw
    },
    {
      title: 'Analyze Cryptographic Execution Pipeline',
      desc: 'Inspect the two-pass hashing steps (Inner Pad ipad XOR and Outer Pad opad XOR) executed by Java javax.crypto.Mac.',
      icon: CheckCircle
    }
  ];

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Learning Objectives</h2>
        <p className="section-subtitle">Key outcomes and skills mastered upon completing this experiment</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {objectives.map((obj, idx) => {
          const Icon = obj.icon;
          return (
            <div key={idx} className="vlab-card" style={{ marginBottom: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Icon size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                {idx + 1}. {obj.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {obj.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
