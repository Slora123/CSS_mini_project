import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React Error Boundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '40px auto', background: '#fef2f2', border: '2px solid #fecaca', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ color: '#dc2626', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <AlertCircle size={48} />
          </div>
          <h2 style={{ color: '#991b1b', marginBottom: '12px', fontSize: '1.4rem' }}>
            Something went wrong while rendering this component.
          </h2>
          <p style={{ color: '#7f1d1d', fontSize: '0.9rem', marginBottom: '20px', fontFamily: 'monospace', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #fca5a5' }}>
            {this.state.error?.toString() || 'Unknown React Runtime Error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#dc2626', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} /> Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
