import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function DraftCard({ draftText }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!draftText) return;
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="draft-card">
      <div className="draft-header">
        <span className="section-tag" style={{ color: 'var(--primary-light)' }}>
          Recommended Response Draft
        </span>
        <button
          type="button"
          className="btn-copy"
          onClick={handleCopy}
          title="Copy response to clipboard"
        >
          {copied ? <Check size={13} color="var(--primary)" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy Draft'}
        </button>
      </div>

      <div className="draft-body">{draftText}</div>
    </div>
  );
}
