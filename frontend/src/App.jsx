import React, { useState } from 'react';
import Header from './components/Header';
import TriageInput from './components/TriageInput';
import LoadingSteps from './components/LoadingSteps';
import ResultsPanel from './components/ResultsPanel';
import ErrorCard from './components/ErrorCard';
import { triageMessage } from './services/api';
import { ShieldQuestion } from 'lucide-react';

export default function App() {
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [endpoint, setEndpoint] = useState('/api/triage');

  const [uiState, setUiState] = useState('idle'); // 'idle' | 'loading' | 'results' | 'error'
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTriage = async () => {
    if (!message.trim()) return;

    setUiState('loading');
    setErrorMessage('');

    try {
      const data = await triageMessage({
        message,
        senderName,
        senderEmail,
        endpoint,
      });
      setResult(data);
      setUiState('results');
    } catch (err) {
      console.error('Triage failed:', err);
      setErrorMessage(err.message || 'Unknown error occurred');
      setUiState('error');
    }
  };

  const handleClear = () => {
    setMessage('');
    setSenderName('');
    setSenderEmail('');
    setUiState('idle');
    setResult(null);
    setErrorMessage('');
  };

  return (
    <>
      <div className="bg-grid"></div>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <div className="app-container">
        <Header />

        <main className="main-grid">
          {/* Left Column: Input Form & Presets */}
          <section>
            <TriageInput
              message={message}
              setMessage={setMessage}
              senderName={senderName}
              setSenderName={setSenderName}
              senderEmail={senderEmail}
              setSenderEmail={setSenderEmail}
              endpoint={endpoint}
              setEndpoint={setEndpoint}
              onSubmit={handleTriage}
              onClear={handleClear}
              isLoading={uiState === 'loading'}
            />
          </section>

          {/* Right Column: Dynamic Intelligence Panel */}
          <section className="glass-panel">
            <div className="panel-header">
              <h2 className="panel-title">Triage Intelligence Matrix</h2>
              <p className="panel-subtitle">
                {uiState === 'loading' && 'Autonomous triage pipeline processing in progress...'}
                {uiState === 'results' && 'Diagnostic evaluation, entity extraction & response synthesized.'}
                {uiState === 'error' && 'Execution error during triage pipeline invocation.'}
                {uiState === 'idle' && 'Real-time telemetry and structured diagnostic analysis will appear here.'}
              </p>
            </div>

            {uiState === 'idle' && (
              <div className="idle-state">
                <div className="idle-icon">
                  <ShieldQuestion size={32} />
                </div>
                <h3 className="idle-title">Awaiting Input</h3>
                <p className="idle-desc">
                  Select a quick preset or paste an incoming communication to evaluate urgency and extract field entities.
                </p>
              </div>
            )}

            {uiState === 'loading' && <LoadingSteps />}

            {uiState === 'results' && <ResultsPanel result={result} />}

            {uiState === 'error' && (
              <ErrorCard errorMsg={errorMessage} onRetry={handleTriage} />
            )}
          </section>
        </main>
      </div>
    </>
  );
}
