import React, { useState } from 'react';
import { FileCheck, Award, CheckCircle2, XCircle, HelpCircle, Lightbulb } from 'lucide-react';

export default function AssignmentSection() {
  const questions = [
    {
      id: 1,
      q: 'What is the main purpose of a Message Authentication Code (MAC)?',
      options: [
        'A. To encrypt a message so nobody can read it',
        'B. To verify that a message is authentic and has not been changed (Integrity & Origin)',
        'C. To compress a large file into a smaller size',
        'D. To generate a random password'
      ],
      correct: 1,
      reason: 'A MAC uses a secret key to generate a unique tag. This tag proves two things: 1) The message came from a trusted sender who holds the secret key (Data Origin Authentication), and 2) The message content was not tampered with during transmission (Data Integrity).'
    },
    {
      id: 2,
      q: 'What kind of cryptographic key is used in a MAC?',
      options: [
        'A. A shared secret key known by both sender and receiver (Symmetric Key)',
        'B. A public key available to everyone on the internet',
        'C. No key at all',
        'D. A new random key generated for every single word'
      ],
      correct: 0,
      reason: 'MAC is a symmetric key system. Both the sender (Alice) and receiver (Bob) share the exact same secret key K. Alice uses K to generate the MAC tag, and Bob uses the same K to verify it.'
    },
    {
      id: 3,
      q: 'What happens if an attacker alters even 1 letter in a message protected by a MAC?',
      options: [
        'A. Nothing, the MAC tag stays valid',
        'B. The receiver\'s MAC verification will FAIL and detect the tampering',
        'C. The secret key is automatically deleted',
        'D. The message automatically fixes itself'
      ],
      correct: 1,
      reason: 'Cryptographic MAC functions have an avalanche effect: changing even a single bit in the message payload produces a completely different MAC tag. When the receiver calculates the MAC, the mismatch immediately alerts them to the attack.'
    },
    {
      id: 4,
      q: 'Why is a secret key needed for a MAC, instead of just using a plain hash function (like SHA-256)?',
      options: [
        'A. Plain hash functions are too slow',
        'B. Without a secret key, an attacker could modify the message and calculate a new valid hash themselves',
        'C. Plain hash functions cannot process text messages',
        'D. Plain hashes only work on numbers'
      ],
      correct: 1,
      reason: 'Anyone can compute a plain hash H(M) because no key is required. If an attacker changes message M to M\', they could simply compute H(M\') to fool the receiver. A MAC requires the secret key K, which the attacker does not possess!'
    },
    {
      id: 5,
      q: 'In CBC-MAC (Cipher Block Chaining MAC), how are long messages processed?',
      options: [
        'A. The message is split into blocks, and each block is chained with the previous block\'s output',
        'B. The whole message is deleted',
        'C. Each block is encrypted with a completely different secret key',
        'D. Only the first block of the message is checked'
      ],
      correct: 0,
      reason: 'CBC-MAC divides a long message into fixed 128-bit blocks. Each block is XORed with the encrypted output of the previous block before AES encryption. The final block output becomes the authentication tag, protecting all blocks together.'
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

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Self-Assessment Quiz & Assignment</h2>
        <p className="section-subtitle">Test your understanding of Message Authentication Codes (MAC) with instant explanations</p>
      </div>

      <div className="vlab-card">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isUserCorrect = answers[q.id] === q.correct;

          return (
            <div
              key={q.id}
              style={{
                marginBottom: '28px',
                paddingBottom: '24px',
                borderBottom: idx < questions.length - 1 ? '1px solid #e2e8f0' : 'none'
              }}
            >
              <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} color="#0284c7" /> Q{idx + 1}. {q.q}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === optIdx;
                  const isCorrectOpt = q.correct === optIdx;
                  let btnStyle = {
                    padding: '12px 18px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    background: 'white',
                    textAlign: 'left',
                    cursor: submitted ? 'default' : 'pointer',
                    fontSize: '0.92rem',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  };

                  if (isSelected && !submitted) {
                    btnStyle.borderColor = '#0284c7';
                    btnStyle.background = '#f0f9ff';
                    btnStyle.fontWeight = '600';
                  }

                  if (submitted) {
                    if (isCorrectOpt) {
                      btnStyle.borderColor = '#22c55e';
                      btnStyle.background = '#f0fdf4';
                      btnStyle.color = '#15803d';
                      btnStyle.fontWeight = '700';
                    } else if (isSelected && !isCorrectOpt) {
                      btnStyle.borderColor = '#ef4444';
                      btnStyle.background = '#fef2f2';
                      btnStyle.color = '#b91c1c';
                      btnStyle.fontWeight = '600';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      style={btnStyle}
                      onClick={() => !submitted && handleSelect(q.id, optIdx)}
                    >
                      <span>{opt}</span>
                      {submitted && isCorrectOpt && <CheckCircle2 size={18} color="#16a34a" />}
                      {submitted && isSelected && !isCorrectOpt && <XCircle size={18} color="#dc2626" />}
                    </button>
                  );
                })}
              </div>

              {/* Display Reason for Correct Answer upon Submit */}
              {submitted && (
                <div style={{ marginTop: '14px', background: '#e0f2fe', borderLeft: '4px solid #0284c7', padding: '14px 18px', borderRadius: '6px' }}>
                  <div style={{ color: '#0369a1', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Lightbulb size={16} /> Reason for Correct Answer:
                  </div>
                  <p style={{ color: '#0c4a6e', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {q.reason}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {!submitted ? (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
          >
            <FileCheck size={20} /> Submit Quiz Answers & View Reasons
          </button>
        ) : (
          <div>
            <div style={{ background: '#f0f9ff', padding: '24px', borderRadius: '12px', border: '2px solid #bae6fd', textAlign: 'center', marginBottom: '16px' }}>
              <Award size={42} color="#0284c7" style={{ marginBottom: 8 }} />
              <h3 style={{ fontSize: '1.4rem', color: '#0369a1', fontWeight: 800 }}>
                Your Score: {score} / {questions.length} ({((score / questions.length) * 100).toFixed(0)}%)
              </h3>
              <p style={{ color: '#0c4a6e', marginTop: 6, fontSize: '0.95rem' }}>
                {score === questions.length
                  ? '🌟 Perfect Score! You have a crystal clear understanding of Message Authentication Codes (MAC)!'
                  : 'Great effort! Review the detailed reasons above to master MAC concepts.'}
              </p>
            </div>

            <button className="btn-secondary" onClick={handleReset} style={{ width: '100%', padding: '12px' }}>
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
