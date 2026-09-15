import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function DraftCard({ draftText }) {
  const [copied, setCopied] = useState(false);

  // Clean redundant prefix like "Draft Recommendation:" or "Recommendation:" if returned by model
  const cleanedText = draftText
    ? draftText.replace(/^(draft\s+)?(advisory\s+)?recommendation:\s*/i, '')
    : '';

  const handleCopy = () => {
    if (!cleanedText) return;
    navigator.clipboard.writeText(cleanedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="draft-card">
      <div className="draft-header">
        <div>
          <span className="section-tag" style={{ color: 'var(--primary-light)' }}>
            Advisory Recommendation
          </span>
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Review and adjust before sending to farmer
          </span>
        </div>
        <button
          type="button"
          className="btn-copy"
          onClick={handleCopy}
          title="Copy recommendation to clipboard"
        >
          {copied ? <Check size={13} color="var(--primary)" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy Draft'}
        </button>
      </div>

      <div className="draft-body">{cleanedText}</div>
    </div>
  );
}
