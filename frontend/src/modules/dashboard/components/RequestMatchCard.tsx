import React from 'react';
import { Shield, MapPin, Package } from 'lucide-react';

export interface RequestMatchData {
  organization: {
    id: string;
    name: string;
  };
  resourceLotId: string;
  availableQuantity: number;
  confidence: 'High' | 'Medium' | 'Low';
  mockDistance: number;
}

interface RequestMatchCardProps {
  match: RequestMatchData;
  onInitiateTransfer: (match: RequestMatchData) => void;
}

export const RequestMatchCard: React.FC<RequestMatchCardProps> = ({ match, onInitiateTransfer }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
          <Shield className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h4 className="text-white font-medium text-lg mb-1">{match.organization.name}</h4>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-slate-500" />
              {match.availableQuantity} available
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500" />
              ~{match.mockDistance} km away
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
              match.confidence === 'High' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              match.confidence === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-slate-500/10 text-slate-400 border-slate-500/20'
            }`}>
              {match.confidence} Match
            </span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onInitiateTransfer(match)}
        className="w-full md:w-auto px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
      >
        Request Transfer
      </button>
    </div>
  );
};
