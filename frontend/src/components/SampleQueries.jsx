import React from 'react';
import { Bug, Droplets, HelpCircle, Wrench } from 'lucide-react';

const PRESETS = [
  {
    id: 'pest',
    label: 'Pest Attack',
    icon: Bug,
    msg: 'Farmer ID: F-8921. Yellow rust observed on wheat crops in block 4, Ludhiana district. Leaves turning yellow-brown and powdery. Spreading rapidly since yesterday. Need urgent advice.',
    sender: 'Harpreet Singh',
  },
  {
    id: 'flood',
    label: 'Flooding',
    icon: Droplets,
    msg: 'Emergency! Heavy rainfall caused flash flooding in paddy fields at village Rampur, Bihar. Over 10 acres submerged since 14th August. Water not receding.',
    sender: 'Ram Kumar',
  },
  {
    id: 'general',
    label: 'General Query',
    icon: HelpCircle,
    msg: 'Hello, could you share the recommended sowing dates for mustard crop in Rajasthan for the upcoming Rabi season? Also looking for subsidized seed varieties.',
    sender: 'Kailash Meena',
  },
  {
    id: 'irrigation',
    label: 'Drip Irrigation',
    icon: Wrench,
    msg: 'Account: AGR-3341. Our drip irrigation lateral lines in polyhouse unit 2 have low pressure and multiple emitters are clogged with mineral deposits. Need descaling protocol.',
    sender: 'Suresh Patel',
  },
];

export default function SampleQueries({ onSelectPreset }) {
  return (
    <div className="presets-section">
      <div className="presets-label">⚡ Quick Presets</div>
      <div className="presets-grid">
        {PRESETS.map((p) => {
          const IconComponent = p.icon;
          return (
            <button
              key={p.id}
              className="preset-chip"
              onClick={() => onSelectPreset(p.msg, p.sender)}
              type="button"
            >
              <IconComponent size={14} />
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
