import React from 'react';
import { Target, BookOpen, Flag, ListOrdered, Cpu, FileCheck, BookMarked, MessageSquare } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'aim', label: 'Aim', icon: Target },
    { id: 'theory', label: 'Theory', icon: BookOpen },
    { id: 'objective', label: 'Objective', icon: Flag },
    { id: 'procedure', label: 'Procedure', icon: ListOrdered },
    { id: 'simulation', label: 'Simulation', icon: Cpu },
    { id: 'assignment', label: 'Assignment', icon: FileCheck },
    { id: 'references', label: 'References', icon: BookMarked },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare }
  ];

  return (
    <aside className="vlab-sidebar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`sidebar-tab ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon className="sidebar-icon" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
