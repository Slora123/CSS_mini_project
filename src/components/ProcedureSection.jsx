import React from 'react';
import { ListOrdered, Key, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ProcedureSection() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Configure Secret Key & Select MAC Algorithm',
      desc: 'Enter a 128-bit secret key K (or click Auto-Generate) and choose your algorithm: CBC-MAC (AES-128), CMAC (NIST SP 800-38B), or General Keyed MAC.',
      icon: Key
    },
    {
      step: 'Step 2',
      title: 'Inspect Message Block Partitioning & Padding',
      desc: 'Observe how the payload is split into 128-bit blocks (P1, P2, ... Pn) and padded using PKCS7 or 100... bit padding.',
      icon: Cpu
    },
    {
      step: 'Step 3',
      title: 'Execute MAC Tag Generation C(K, M)',
      desc: 'Click "Generate MAC Tag". The Java Security Engine executes block-by-block XOR encryption and produces the hexadecimal tag T.',
      icon: CheckCircle2
    },
    {
      step: 'Step 4',
      title: 'Constant-Time Verification & Active Tampering Simulation',
      desc: 'Verify payload authenticity in constant-time or use the MITM Attack Simulator to modify message bits and test tamper detection.',
      icon: ShieldAlert
    }
  ];

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Experiment Procedure</h2>
        <p className="section-subtitle">Follow these step-by-step instructions to execute the MAC simulation</p>
      </div>

      <div className="vlab-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} style={{ display: 'flex', gap: '20px', paddingBottom: idx < steps.length - 1 ? '24px' : '0', borderBottom: idx < steps.length - 1 ? '1px dashed #cbd5e1' : 'none' }}>
                <div style={{ background: '#ea580c', color: 'white', fontWeight: 800, padding: '10px 16px', borderRadius: '8px', height: 'fit-content', fontSize: '0.85rem' }}>
                  {s.step}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={18} color="#0284c7" /> {s.title}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
