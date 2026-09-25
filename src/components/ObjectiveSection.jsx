import React from 'react';
import { Flag, CheckCircle, Lock, Zap, Cpu } from 'lucide-react';

export default function ObjectiveSection() {
  const objectives = [
    {
      title: 'Master Symmetric Key MAC Tag Generation',
      desc: 'Understand how a shared secret key K enables symmetric authentication tag generation C(K, M) -> T.',
      icon: Lock
    },
    {
      title: 'Explore Block Cipher Chaining (CBC-MAC)',
      desc: 'Visualize block-by-block AES encryption and XOR feedback chaining across message blocks.',
      icon: Cpu
    },
    {
      title: 'Analyze NIST CMAC Subkey Derivation',
      desc: 'Learn how subkeys K1 and K2 protect against length extension and padding oracle vulnerabilities in CMAC.',
      icon: Zap
    },
    {
      title: 'Simulate Active Bit-Flip & Tamper Attacks',
      desc: 'Observe how constant-time verification detects altered payload bits and invalid authentication tags.',
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
