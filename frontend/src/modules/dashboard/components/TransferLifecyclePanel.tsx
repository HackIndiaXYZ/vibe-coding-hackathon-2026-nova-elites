import React from 'react';
import { Check, Truck, Package, Clock, X } from 'lucide-react';

interface TransferLifecyclePanelProps {
  status: string;
}

export const TransferLifecyclePanel: React.FC<TransferLifecyclePanelProps> = ({ status }) => {
  const steps = [
    { key: 'PENDING', label: 'Requested', icon: Clock },
    { key: 'ACCEPTED', label: 'Accepted', icon: Check },
    { key: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
    { key: 'COMPLETED', label: 'Delivered', icon: Package }
  ];

  if (status === 'CANCELLED') {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
          <X className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-red-400 font-medium">Transfer Cancelled</h4>
          <p className="text-sm text-red-500/70">This transfer was cancelled and inventory reservations have been released.</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.key === status);
  
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <h3 className="text-lg font-medium text-white mb-6">Lifecycle Status</h3>
      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500" 
            style={{ width: `${Math.max(0, currentStepIndex) * (100 / (steps.length - 1))}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 bg-slate-900/80 px-2 py-1 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                isCompleted ? 'bg-indigo-500 border-indigo-500 text-white' :
                isCurrent ? 'bg-slate-900 border-indigo-500 text-indigo-400' :
                'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium uppercase tracking-wider ${
                isCompleted || isCurrent ? 'text-white' : 'text-slate-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
