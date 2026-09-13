import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ScoreMeter({ score, urgency, intent }) {
  const normalizedScore = Math.max(1, Math.min(10, score || 5));
  const radius = 32;
  const circumference = 2 * Math.PI * radius; // approx 201.06
  const offset = circumference - (normalizedScore / 10) * circumference;

  let urgencyType = 'medium';
  let badgeIcon = <AlertTriangle size={13} />;
  let strokeColor = 'var(--amber)';

  if (urgency === 'HIGH' || normalizedScore >= 8) {
    urgencyType = 'high';
    badgeIcon = <AlertCircle size={13} />;
    strokeColor = 'var(--red)';
  } else if (urgency === 'LOW' || normalizedScore <= 3) {
    urgencyType = 'low';
    badgeIcon = <CheckCircle2 size={13} />;
    strokeColor = 'var(--primary)';
  }

  return (
    <div className={`score-card ${urgencyType}`}>
      <div className="score-meta">
        <span className={`urgency-badge ${urgencyType}`}>
          {badgeIcon}
          {urgency || 'MEDIUM'} URGENCY
        </span>
        <div className="intent-label">{intent || 'Agricultural Query'}</div>
      </div>

      <div className="gauge-wrapper">
        <svg className="gauge-svg" viewBox="0 0 80 80">
          <circle
            className="gauge-track"
            cx="40"
            cy="40"
            r={radius}
          />
          <circle
            className="gauge-fill"
            cx="40"
            cy="40"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              stroke: strokeColor,
            }}
          />
        </svg>
        <div className="gauge-text">
          <span className="gauge-score">{normalizedScore}</span>
          <span className="gauge-sub">/10</span>
        </div>
      </div>
    </div>
  );
}
