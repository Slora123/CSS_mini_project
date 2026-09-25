import React, { useState } from 'react';
import { FileCheck, CheckCircle2, XCircle, Award } from 'lucide-react';

export default function AssignmentSection() {
  const questions = [
    {
      id: 1,
      q: 'What cryptographic property does a Message Authentication Code (MAC) guarantee?',
      options: [
        'A. Confidentiality only',
        'B. Data Origin Authentication and Data Integrity',
        'C. Non-repudiation and Public-key Encryption',
        'D. Key distribution security'
      ],
      correct: 1,
      explanation: 'MAC algorithms use a shared secret key to provide both data integrity (detecting tampering) and origin authentication (confirming sender identity).'
    },
    {
      id: 2,
      q: 'In HMAC construction (RFC 2104), what are the byte constants for ipad and opad?',
      options: [
        'A. ipad = 0xAA, opad = 0x55',
        'B. ipad = 0x00, opad = 0xFF',
        'C. ipad = 0x36, opad = 0x5C',
        'D. ipad = 0x12, opad = 0x34'
      ],
      correct: 2,
      explanation: 'RFC 2104 defines inner pad ipad = 0x36 repeated B times, and outer pad opad = 0x5C repeated B times.'
    },
    {
      id: 3,
      q: 'Why is plain hash H(M) insufficient for message authentication?',
      options: [
        'A. Plain hash is too slow',
        'B. Anyone can recompute H(M\') for an altered message M\' since no key is involved',
        'C. Hash functions are not deterministic',
        'D. Plain hashes only work on ASCII characters'
      ],
      correct: 1,
      explanation: 'Without a secret key, an attacker can modify the message payload M to M\' and calculate H(M\'), fooling the receiver.'
    },
    {
      id: 4,
      q: 'Why must MAC tag verification use constant-time byte comparison (e.g., MessageDigest.isEqual)?',
      options: [
        'A. To speed up execution on multi-core processors',
        'B. To prevent timing-attack side-channel vulnerabilities',
        'C. To save memory bandwidth',
        'D. Because Java strings are immutable'
      ],
      correct: 1,
      explanation: 'Standard string comparisons exit early on the first mismatched byte, allowing attackers to guess MAC tags byte-by-byte by measuring response times.'
    }
  ];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) s++;
    });
    setScore(s);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Self-Assessment Quiz & Assignment</h2>
        <p className="section-subtitle">Test your understanding of Cryptographic Message Authentication Codes</p>
      </div>

      <div className="vlab-card">
        {questions.map((q, idx) => (
          <div key={q.id} style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: idx < questions.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
            <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '12px' }}>
              Q{idx + 1}. {q.q}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {q.options.map((opt, optIdx) => {
                const isSelected = answers[q.id] === optIdx;
                const isCorrect = q.correct === optIdx;
                let btnStyle = {
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  background: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                };

                if (isSelected) {
                  btnStyle.borderColor = '#0284c7';
                  btnStyle.background = '#f0f9ff';
                  btnStyle.fontWeight = '600';
                }

                if (submitted) {
                  if (isCorrect) {
                    btnStyle.borderColor = '#22c55e';
                    btnStyle.background = '#f0fdf4';
                    btnStyle.color = '#15803d';
                  } else if (isSelected && !isCorrect) {
                    btnStyle.borderColor = '#ef4444';
                    btnStyle.background = '#fef2f2';
                    btnStyle.color = '#b91c1c';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    style={btnStyle}
                    onClick={() => !submitted && handleSelect(q.id, optIdx)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#475569', background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                💡 <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}

        {!submitted ? (
          <button className="btn-primary" onClick={handleSubmit}>
            <FileCheck size={18} /> Submit Quiz Answers
          </button>
        ) : (
          <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '10px', border: '1px solid #bae6fd', textAlign: 'center' }}>
            <Award size={36} color="#0284c7" style={{ marginBottom: 8 }} />
            <h3 style={{ fontSize: '1.3rem', color: '#0369a1' }}>
              Your Quiz Score: {score} / {questions.length} ({((score / questions.length) * 100).toFixed(0)}%)
            </h3>
            <p style={{ color: '#0c4a6e', marginTop: 4 }}>
              {score === questions.length ? '🌟 Excellent! You have mastered MAC & HMAC cryptography principles!' : 'Good effort! Review the Theory section to improve your score.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
