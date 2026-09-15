import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorCard({ errorMsg, onRetry }) {
  if (errorMsg) {
    console.error('Triage Pipeline Error:', errorMsg);
  }

  return (
    <div className="error-card">
      <div className="error-icon">
        <AlertCircle size={26} />
      </div>
      <h3 className="error-title">⚠ Triage Analysis Failed</h3>
      <p className="error-msg">We couldn't process this report right now. Please try again.</p>
      <button type="button" className="btn-secondary" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}
