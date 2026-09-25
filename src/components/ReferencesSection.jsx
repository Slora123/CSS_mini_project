import React from 'react';
import { BookMarked, ExternalLink } from 'lucide-react';

export default function ReferencesSection() {
  const references = [
    {
      title: 'RFC 2104: HMAC - Keyed-Hashing for Message Authentication',
      authors: 'H. Krawczyk, M. Bellare, R. Canetti',
      year: '1997',
      link: 'https://datatracker.ietf.org/doc/html/rfc2104'
    },
    {
      title: 'NIST FIPS PUB 198-1: The Keyed-Hash Message Authentication Code (HMAC)',
      authors: 'National Institute of Standards and Technology (NIST)',
      year: '2008',
      link: 'https://csrc.nist.gov/publications/detail/fips/198/1/final'
    },
    {
      title: 'Cryptography and Network Security: Principles and Practice (7th Edition)',
      authors: 'William Stallings',
      year: '2017',
      link: 'https://www.pearson.com'
    },
    {
      title: 'Java Cryptography Architecture (JCA) Reference Guide - javax.crypto.Mac',
      authors: 'Oracle Java Documentation',
      year: '2024',
      link: 'https://docs.oracle.com/en/java/javase/21/security/java-cryptography-architecture-jca-reference-guide.html'
    }
  ];

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">References & Standards</h2>
        <p className="section-subtitle">Official cryptographic RFC specifications and academic publications</p>
      </div>

      <div className="vlab-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {references.map((ref, idx) => (
            <div key={idx} style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>
                  [{idx + 1}] {ref.title}
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {ref.authors} ({ref.year})
                </p>
              </div>
              <a href={ref.link} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                View Spec <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
