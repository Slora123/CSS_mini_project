import React, { useState } from 'react';
import { MessageSquare, Star, Send } from 'lucide-react';

export default function FeedbackSection() {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Experiment Feedback</h2>
        <p className="section-subtitle">Help us improve Virtual Labs with your feedback and suggestions</p>
      </div>

      <div className="vlab-card">
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name / Institution</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Student / Educator, CSE Dept"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rate Experiment Experience</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    style={{ cursor: 'pointer' }}
                    fill={star <= rating ? '#fbbf24' : 'none'}
                    color={star <= rating ? '#fbbf24' : '#cbd5e1'}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Comments & Suggestions</label>
              <textarea
                className="form-textarea"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tell us what you learned or if you encountered any issues..."
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              <Send size={16} /> Submit Lab Feedback
            </button>
          </form>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#15803d', marginBottom: 8 }}>
              Thank You for Your Feedback!
            </h3>
            <p style={{ color: '#166534' }}>
              Your feedback has been recorded in the Virtual Labs repository.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
