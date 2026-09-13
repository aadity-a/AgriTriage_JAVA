import React, { useEffect, useState } from 'react';
import { Sprout, Activity } from 'lucide-react';
import { checkHealth } from '../services/api';

export default function Header() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');

  useEffect(() => {
    async function verifyHealth() {
      const ok = await checkHealth();
      setIsOnline(ok);
    }
    verifyHealth();
    const timer = setInterval(verifyHealth, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="header">
      <div className="logo-group">
        <div className="logo-icon">
          <Sprout size={22} strokeWidth={2.4} />
        </div>
        <div className="logo-title">AgriTriage</div>
        <span className="logo-badge">AI</span>
      </div>

      <nav className="nav-pills">
        <button
          className={`pill-item ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('inbox')}
        >
          <Activity size={14} />
          Triage Inbox
        </button>
        <button
          className={`pill-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button
          className={`pill-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>

      <div className="system-status">
        <span className={`status-dot ${isOnline ? 'online' : ''}`}></span>
        <span>{isOnline ? 'SYSTEM ACTIVE' : 'CONNECTING...'}</span>
      </div>
    </header>
  );
}
