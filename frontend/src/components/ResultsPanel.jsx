import React from 'react';
import ScoreMeter from './ScoreMeter';
import EntityGrid from './EntityGrid';
import DraftCard from './DraftCard';

export default function ResultsPanel({ result }) {
  if (!result) return null;

  const {
    urgency,
    urgency_score,
    intent,
    summary,
    entities,
    draft_response,
    processing_time_ms,
  } = result;

  return (
    <div className="results-container">
      <ScoreMeter
        score={urgency_score}
        urgency={urgency}
        intent={intent}
      />

      <div className="summary-card">
        <div className="section-tag">Executive Summary</div>
        <p className="summary-text">{summary}</p>
      </div>

      <EntityGrid entities={entities} />

      <DraftCard draftText={draft_response} />

      <div className="telemetry-row">
        <span>Processing: {processing_time_ms}ms</span>
        <span>Model: llama-3.1-8b-instant</span>
        <span>Engine: Spring Boot 3</span>
      </div>
    </div>
  );
}
