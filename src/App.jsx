import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AimSection from './components/AimSection';
import TheorySection from './components/TheorySection';
import ObjectiveSection from './components/ObjectiveSection';
import ProcedureSection from './components/ProcedureSection';
import SimulationSection from './components/SimulationSection';
import AssignmentSection from './components/AssignmentSection';
import ReferencesSection from './components/ReferencesSection';
import FeedbackSection from './components/FeedbackSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulation');
  const [javaStatus, setJavaStatus] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'online') {
          setJavaStatus(true);
        }
      })
      .catch(() => setJavaStatus(false));
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'aim':
        return <AimSection />;
      case 'theory':
        return <TheorySection />;
      case 'objective':
        return <ObjectiveSection />;
      case 'procedure':
        return <ProcedureSection />;
      case 'simulation':
        return <SimulationSection />;
      case 'assignment':
        return <AssignmentSection />;
      case 'references':
        return <ReferencesSection />;
      case 'feedback':
        return <FeedbackSection />;
      default:
        return <SimulationSection />;
    }
  };

  return (
    <div className="app-container">
      <Header javaStatus={javaStatus} />

      {/* Virtual Labs Breadcrumbs Bar */}
      <div className="breadcrumb-bar">
        <span className="breadcrumb-item">Computer Science and Engineering</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-item">Cryptography</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-item">Experiments</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-active">MAC Generator and Verifier</span>
      </div>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="content-viewport">
          {renderContent()}
        </main>
      </div>

      <footer className="vlab-footer">
        <p>© 2026 Virtual Labs - An Initiative of Ministry of Education under the National Mission on Education through ICT.</p>
        <p style={{ marginTop: 4, fontSize: '0.78rem', color: '#94a3b8' }}>
          Backend API Engine: Node.js Express & Java Security Module (<code>javax.crypto.Mac</code>)
        </p>
      </footer>
    </div>
  );
}
