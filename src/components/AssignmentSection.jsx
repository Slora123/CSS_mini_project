import React, { useState } from 'react';
import { FileCheck, Award } from 'lucide-react';

export default function AssignmentSection() {
  const questions = [
    {
      id: 1,
      q: 'What cryptographic guarantee does a Message Authentication Code (MAC) provide?',
      options: [
        'A. Confidentiality of plaintext messages',
        'B. Data Integrity and Origin Authentication',
        'C. Non-repudiation and Public-key Signatures',
        'D. Key Exchange Protocol'
      ],
      correct: 1,
      explanation: 'A MAC tag guarantees both data integrity (detecting alterations) and origin authentication (verifying sender identity).'
    },
    {
      id: 2,
      q: 'In CBC-MAC, how are message blocks chained together?',
      options: [
        'A. Each block is encrypted independently',
        'B. Each block is XORed with the previous cipher block before encryption',
        'C. Each block is hashed using SHA-1',
        'D. Each block is encrypted with a different secret key'
      ],
      correct: 1,
      explanation: 'CBC-MAC uses Cipher Block Chaining where T_i = E_K(P_i XOR T_{i-1}).'
    },
    {
      id: 3,
      q: 'How does NIST CMAC (NIST SP 800-38B) improve security over raw CBC-MAC?',
      options: [
        'A. By using two derived subkeys (K1 and K2) for the final block',
        'B. By compressing the key size to 64 bits',
        'C. By removing the block cipher',
        'D. By making the output non-deterministic'
      ],
      correct: 0,
      explanation: 'CMAC derives subkeys K1 and K2 using finite field multiplication to prevent length extension attacks on variable-length messages.'
    },
    {
      id: 4,
      q: 'Why must MAC verification use constant-time byte comparison (e.g. MessageDigest.isEqual)?',
      options: [
        'A. To speed up multi-core processing',
        'B. To prevent timing side-channel attacks',
        'C. To save memory overhead',
        'D. Because Java strings are immutable'
      ],
      correct: 1,
      explanation: 'Standard string comparisons return early on mismatched bytes, allowing attackers to guess MAC tags byte-by-byte via timing measurements.'
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
        <p className="section-subtitle">Test your knowledge of Message Authentication Codes (MAC)</p>
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
              Your Score: {score} / {questions.length} ({((score / questions.length) * 100).toFixed(0)}%)
            </h3>
            <p style={{ color: '#0c4a6e', marginTop: 4 }}>
              {score === questions.length ? '🌟 Excellent! You have mastered MAC algorithms & block cipher chaining!' : 'Good effort! Review the Theory section to improve your score.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
