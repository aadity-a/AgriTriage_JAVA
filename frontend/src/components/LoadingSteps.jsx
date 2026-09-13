import React, { useEffect, useState } from 'react';
import { ShieldAlert, Cpu, Database, FileText } from 'lucide-react';

const STEPS = [
  { id: 0, title: 'Message Preprocessing', desc: 'Sanitizing input and tokenizing communication', icon: Database },
  { id: 1, title: 'Urgency & Intent Classification', desc: 'Evaluating severity score and primary domain intent', icon: ShieldAlert },
  { id: 2, title: 'Named Entity Recognition (NER)', desc: 'Extracting farmer ID, crop types, locations & timestamps', icon: Cpu },
  { id: 3, title: 'Drafting Actionable Response', desc: 'Synthesizing agronomic response and executive summary', icon: FileText },
];

export default function LoadingSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 850);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-panel">
      {STEPS.map((step, idx) => {
        const IconComponent = step.icon;
        let statusClass = '';
        if (idx === currentStep) statusClass = 'active';
        else if (idx < currentStep) statusClass = 'done';

        return (
          <div key={step.id} className={`step-card ${statusClass}`}>
            <div className="step-indicator">
              <IconComponent size={14} />
            </div>
            <div className="step-info">
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
