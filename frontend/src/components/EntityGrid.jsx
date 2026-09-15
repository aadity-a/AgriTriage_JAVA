import React from 'react';

export default function EntityGrid({ entities }) {
  if (!entities) return null;

  const { crop_type, location, dates = [], issue_keywords = [] } = entities;

  return (
    <div className="entities-grid">
      <div className="entity-card">
        <span className="entity-key">Target Crop</span>
        <div className="entity-tags">
          {crop_type ? (
            <span className="tag-badge">{crop_type}</span>
          ) : (
            <span className="tag-empty">Not detected</span>
          )}
        </div>
      </div>

      <div className="entity-card">
        <span className="entity-key">Location / Zone</span>
        <div className="entity-tags">
          {location ? (
            <span className="tag-badge">{location}</span>
          ) : (
            <span className="tag-empty">Not detected</span>
          )}
        </div>
      </div>

      <div className="entity-card">
        <span className="entity-key">Dates / Timelines</span>
        <div className="entity-tags">
          {dates.length > 0 ? (
            dates.map((d, i) => <span key={i} className="tag-badge">{d}</span>)
          ) : (
            <span className="tag-empty">None referenced</span>
          )}
        </div>
      </div>

      <div className="entity-card entity-card-full">
        <span className="entity-key">Detected Issues</span>
        <div className="entity-tags">
          {issue_keywords.length > 0 ? (
            issue_keywords.map((kw, i) => (
              <span key={i} className="tag-badge" style={{ background: 'rgba(56, 189, 248, 0.12)', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#7dd3fc' }}>
                {kw}
              </span>
            ))
          ) : (
            <span className="tag-empty">None detected</span>
          )}
        </div>
      </div>
    </div>
  );
}
