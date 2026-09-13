import React from 'react';
import { Send, RotateCcw } from 'lucide-react';
import SampleQueries from './SampleQueries';

export default function TriageInput({
  message,
  setMessage,
  senderName,
  setSenderName,
  senderEmail,
  setSenderEmail,
  onSubmit,
  onClear,
  isLoading,
}) {
  const handleSelectPreset = (presetMsg, presetSender) => {
    setMessage(presetMsg);
    if (presetSender) {
      setSenderName(presetSender);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    onSubmit();
  };

  return (
    <div className="glass-panel">
      <div className="panel-header">
        <h2 className="panel-title">Describe the Field Issue</h2>
        <p className="panel-subtitle">
          Submit farmer issues, pest observations, or field reports for reactive AI triage.
        </p>
      </div>

      <SampleQueries onSelectPreset={handleSelectPreset} />

      <form className="input-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="msg-area">
            Farmer Communication <span style={{ color: 'var(--red)' }}>*</span>
          </label>
          <textarea
            id="msg-area"
            className="form-textarea"
            rows={5}
            placeholder={`Paste or type the incoming farmer/field communication here...\n\nExample: My wheat crop in Vidisha district is showing yellow patches since last Tuesday. Farmer ID: F-2847. Please advise urgently.`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="sender-name">Sender / Farmer Name</label>
            <input
              id="sender-name"
              className="form-input"
              type="text"
              placeholder="e.g. Harpreet Singh"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sender-email">Email / Phone (Optional)</label>
            <input
              id="sender-email"
              className="form-input"
              type="text"
              placeholder="e.g. harpreet@example.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClear}
            disabled={isLoading || (!message && !senderName && !senderEmail)}
          >
            <RotateCcw size={14} style={{ display: 'inline', marginRight: 6 }} />
            Reset
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !message.trim()}
          >
            <Send size={15} />
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>
    </div>
  );
}
