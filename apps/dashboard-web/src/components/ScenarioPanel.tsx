import { useState } from 'react';
import { postJson, type Substation } from '../lib/api';

const SCENARIOS = [
  { id: 'drone-survey', label: 'Drone Survey Findings', agent: 'gam-asset-image-analysis', hint: 'Imagery batch flagged 14 insulator anomalies on circuit T-44' },
  { id: 'vegetation-spike', label: 'Vegetation Encroachment', agent: 'gam-vegetation-management', hint: 'LiDAR shows 3 spans below clearance on OH-12 corridor' },
  { id: 'dga-spike', label: 'Transformer DGA Spike', agent: 'gam-transformer-failure-risk', hint: 'Acetylene rose 4× on bank TX-09 — investigate' },
  { id: 'thermal-breach', label: 'Thermal Breach Forecast', agent: 'gam-rating-breach-prediction', hint: 'Heat dome forecast → 6 lines projected over rating in 72h' },
  { id: 'overload-event', label: 'Live Overload', agent: 'gam-transformer-overload', hint: 'TX-22 at 138% nameplate, oil temp climbing' },
  { id: 'ug-cable-pd', label: 'UG Cable PD Trend', agent: 'gam-underground-cable-health', hint: 'PD on cable C-301 trending up — aging risk' },
  { id: 'inspection-batch', label: 'Inspection Backlog', agent: 'gam-inspection-prioritization', hint: '412 inspections pending — propose priority order' },
  { id: 'design-audit', label: 'Design QA Audit', agent: 'gam-overhead-line-design-qa', hint: 'Audit OH-line designs in past 12 months for code conformance' },
];

export function ScenarioPanel({ onRan, substations }: { onRan: () => void; substations: Substation[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [last, setLast] = useState<string>('');
  const sub = substations[0]?.substation_id ?? '';

  async function run(id: string) {
    setBusy(id); setLast('');
    try {
      const body: any = id === 'storm-outage' ? { substation_id: sub, feeder_index: 7 }
                       : id === 'theft'       ? { substation_id: sub, count: 3 }
                       : id === 'heat-wave'   ? {}
                       : { substation_id: sub };
      const r = await postJson<any>(`/api/scenarios/${id}`, body);
      setLast(`✓ ${id} → ${r.agent_dispatched ?? 'dispatched'}`);
      onRan();
    } catch (e: any) { setLast(`error: ${e.message}`); }
    finally { setBusy(null); }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-semibold tracking-wide">SCENARIOS</h2>
        <span className="text-xs text-slate-500">click to inject + auto-dispatch agent</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 flex-1 overflow-y-auto">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            disabled={!!busy}
            onClick={() => run(s.id)}
            className="text-left p-1.5 rounded-lg bg-grid-bg border border-grid-border hover:border-grid-accent disabled:opacity-50 transition group"
            title={s.hint}
          >
            <div className="text-xs font-medium text-grid-accent leading-tight">{busy === s.id ? '⏳' : s.label}</div>
            <div className="text-xs text-grid-info font-mono mt-0.5">→ {s.agent}</div>
            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.hint}</div>
          </button>
        ))}
      </div>
      {last && <div className="text-xs text-grid-ok mt-1 truncate font-mono">{last}</div>}
    </div>
  );
}
