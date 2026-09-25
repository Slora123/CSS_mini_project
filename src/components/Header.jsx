import React from 'react';
import { Star, ShieldCheck, Bug, Award } from 'lucide-react';

export default function Header({ javaStatus }) {
  return (
    <header className="vlab-header">
      <div className="header-left">
        <a href="#" className="vlab-logo">
          <div className="vlab-logo-icon">
            <ShieldCheck size={28} />
          </div>
          <div className="vlab-title-group">
            <h1>Virtual Labs</h1>
            <p>An MoE Govt of India Initiative</p>
          </div>
        </a>
      </div>

      <div className="header-right">
        <div className="rating-stars" title="Virtual Lab Rating: 5/5 Stars">
          <Star size={16} fill="#fbbf24" color="#fbbf24" />
          <Star size={16} fill="#fbbf24" color="#fbbf24" />
          <Star size={16} fill="#fbbf24" color="#fbbf24" />
          <Star size={16} fill="#fbbf24" color="#fbbf24" />
          <Star size={16} fill="#fbbf24" color="#fbbf24" />
        </div>

        <div className="badge badge-info" style={{ textTransform: 'none', fontSize: '0.78rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: javaStatus ? '#22c55e' : '#eab308' }}></span>
          {javaStatus ? 'Core: Java javax.crypto.Mac' : 'Core: Node Crypto Engine'}
        </div>

        <button className="btn-header btn-rate" onClick={() => alert('Thank you for rating Virtual Labs!')}>
          Rate Me
        </button>
        <button className="btn-header btn-bug" onClick={() => alert('Bug Report Portal: No active bugs reported.')}>
          <Bug size={14} /> Report a Bug
        </button>
      </div>
    </header>
  );
}
