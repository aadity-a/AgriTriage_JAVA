import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorCard({ errorMsg, onRetry }) {
  return (
    <div className="error-card">
      <div className="error-icon">
        <AlertCircle size={26} />
      </div>
      <h3 className="error-title">Triage Transmission Failed</h3>
      <p className="error-msg">{errorMsg || 'An error occurred while contacting the triage agent service.'}</p>
      <button type="button" className="btn-secondary" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}
