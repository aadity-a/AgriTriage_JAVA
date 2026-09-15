import React, { useEffect, useState } from 'react';
import { Sprout } from 'lucide-react';
import { checkHealth } from '../services/api';

export default function Header({ uiState = 'idle' }) {
  const [isOnline, setIsOnline] = useState(true);

  const verifyHealth = async () => {
    const ok = await checkHealth();
    setIsOnline(ok);
  };

  useEffect(() => {
    verifyHealth();
    const timer = setInterval(verifyHealth, 10000);
    return () => clearInterval(timer);
  }, []);

  // Compute status display based on connectivity and triage lifecycle
  let statusText = 'AGENT ONLINE';
  let dotClass = 'online';

  if (!isOnline) {
    statusText = 'OFFLINE';
    dotClass = 'offline';
  } else if (uiState === 'loading') {
    statusText = 'ANALYZING';
    dotClass = 'analyzing';
  } else if (uiState === 'results') {
    statusText = 'ANALYSIS READY';
    dotClass = 'ready';
  } else {
    statusText = 'AGENT ONLINE';
    dotClass = 'online';
  }

  return (
    <header className="header">
      <div className="logo-group">
        <div className="logo-icon">
          <Sprout size={22} strokeWidth={2.4} />
        </div>
        <div className="logo-title">AgriTriage</div>
        <span className="logo-badge">AI</span>
      </div>

      <div className="system-status">
        <span className={`status-dot ${dotClass}`}></span>
        <span>{statusText}</span>
      </div>
    </header>
  );
}
