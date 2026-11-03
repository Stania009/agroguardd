/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAgro } from '../context/AgroContext';
import {
  BarChart3,
  Calendar,
  Download,
  FileText,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  ShieldCheck,
  Clock,
  Printer,
} from 'lucide-react';

interface HistoryPoint {
  time: string;
  temp: number;
  moisture: number;
  humidity: number;
  co2: number;
}

const HISTORY_24H: HistoryPoint[] = [
  { time: '00:00', temp: 19.2, moisture: 12.4, humidity: 54, co2: 480 },
  { time: '04:00', temp: 18.8, moisture: 12.3, humidity: 56, co2: 490 },
  { time: '08:00', temp: 20.1, moisture: 12.5, humidity: 59, co2: 520 },
  { time: '12:00', temp: 23.4, moisture: 13.1, humidity: 62, co2: 680 },
  { time: '16:00', temp: 24.8, moisture: 13.4, humidity: 64, co2: 740 },
  { time: '20:00', temp: 22.1, moisture: 12.9, humidity: 58, co2: 610 },
  { time: 'Now', temp: 21.4, moisture: 12.8, humidity: 58, co2: 540 },
];

const HISTORY_7D: HistoryPoint[] = [
  { time: 'Mon', temp: 19.5, moisture: 12.2, humidity: 52, co2: 470 },
  { time: 'Tue', temp: 20.2, moisture: 12.3, humidity: 54, co2: 490 },
  { time: 'Wed', temp: 21.8, moisture: 12.6, humidity: 58, co2: 530 },
  { time: 'Thu', temp: 23.5, moisture: 13.0, humidity: 65, co2: 640 },
  { time: 'Fri', temp: 25.1, moisture: 13.6, humidity: 68, co2: 820 },
  { time: 'Sat', temp: 23.0, moisture: 13.2, humidity: 61, co2: 690 },
  { time: 'Sun', temp: 21.4, moisture: 12.8, humidity: 58, co2: 540 },
];

const HISTORY_30D: HistoryPoint[] = [
  { time: 'Wk 1', temp: 18.6, moisture: 12.0, humidity: 50, co2: 450 },
  { time: 'Wk 2', temp: 19.4, moisture: 12.2, humidity: 52, co2: 470 },
  { time: 'Wk 3', temp: 22.8, moisture: 12.9, humidity: 60, co2: 590 },
  { time: 'Wk 4', temp: 21.4, moisture: 12.8, humidity: 58, co2: 540 },
];

export const ReportsHistoryView: React.FC = () => {
  const { alerts, zones } = useAgro();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [activeMetric, setActiveMetric] = useState<'temp' | 'moisture' | 'humidity'>('temp');
  const [showExportModal, setShowExportModal] = useState(false);

  const dataset =
    timeRange === '24h' ? HISTORY_24H : timeRange === '7d' ? HISTORY_7D : HISTORY_30D;

  // Compute SVG chart points
  const values = dataset.map((d) => d[activeMetric]);
  const minVal = Math.min(...values) * 0.92;
  const maxVal = Math.max(...values) * 1.08;
  const chartHeight = 180;
  const chartWidth = 560;

  const points = dataset
    .map((d, index) => {
      const x = (index / (dataset.length - 1)) * (chartWidth - 40) + 20;
      const val = d[activeMetric];
      const y = chartHeight - ((val - minVal) / (maxVal - minVal || 1)) * (chartHeight - 40) - 20;
      return `${x},${y}`;
    })
    .join(' ');

  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved' || a.status === 'acknowledged');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#1e5234]" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Reports & Historical Trend Analytics
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Long-term telemetric storage graphs, aeration event records, and farmer compliance audits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold bg-[#1e5234] hover:bg-[#276a43] text-white transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Historical Telemetry Graphs Section */}
      <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Storage Microclimate Telemetry History
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated readings across all mobile rovers and fixed silo thermistors
            </p>
          </div>

          {/* Time range switcher */}
          <div className="flex items-center gap-1 bg-[#fcfbf7] p-1 rounded-lg border border-[#e8e4d8]">
            {(['24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  timeRange === r
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === '24h' ? '24 Hours' : r === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveMetric('temp')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
              activeMetric === 'temp'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Core Temperature (°C)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('moisture')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
              activeMetric === 'moisture'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Grain Moisture Content (%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('humidity')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
              activeMetric === 'humidity'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Relative Humidity (% RH)</span>
          </button>
        </div>

        {/* Clean Responsive SVG Chart */}
        <div className="bg-[#fcfbf7] rounded-xl border border-[#e8e4d8] p-4">
          <div className="flex justify-between items-center text-xs font-mono text-slate-500 mb-2">
            <span>
              Metric: <strong className="text-slate-900 uppercase">{activeMetric}</strong>
            </span>
            <span>
              Peak: {Math.max(...values).toFixed(1)} · Low: {Math.min(...values).toFixed(1)}
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 select-none"
            >
              {/* Grid lines */}
              <line x1="20" y1="30" x2={chartWidth - 20} y2="30" stroke="#e2ddd0" strokeDasharray="4 4" />
              <line x1="20" y1="90" x2={chartWidth - 20} y2="90" stroke="#e2ddd0" strokeDasharray="4 4" />
              <line x1="20" y1="150" x2={chartWidth - 20} y2="150" stroke="#e2ddd0" strokeDasharray="4 4" />

              {/* Smooth curve / polyline */}
              <polyline
                fill="none"
                stroke={activeMetric === 'temp' ? '#15803d' : activeMetric === 'moisture' ? '#2563eb' : '#0d9488'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />

              {/* Data points */}
              {dataset.map((d, index) => {
                const x = (index / (dataset.length - 1)) * (chartWidth - 40) + 20;
                const val = d[activeMetric];
                const y = chartHeight - ((val - minVal) / (maxVal - minVal || 1)) * (chartHeight - 40) - 20;
                return (
                  <g key={d.time}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#ffffff"
                      stroke={activeMetric === 'temp' ? '#15803d' : activeMetric === 'moisture' ? '#2563eb' : '#0d9488'}
                      strokeWidth="2.5"
                    />
                    <text
                      x={x}
                      y={y - 8}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#334155"
                      fontFamily="monospace"
                    >
                      {val.toFixed(1)}
                    </text>
                    <text
                      x={x}
                      y={chartHeight - 4}
                      fontSize="10"
                      textAnchor="middle"
                      fill="#64748b"
                      fontFamily="sans-serif"
                    >
                      {d.time}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Weekly Storage Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#e6e2d6] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Grain Protected</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">1,800 Tonnes</div>
          <div className="mt-1 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>98.6% within safe moisture range</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e6e2d6] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Estimated Loss Prevented</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">$34,500 USD</div>
          <div className="mt-1 text-xs text-slate-500">
            Based on early hotspot cooling & pest detection
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e6e2d6] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Autonomous Rover Patrols</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">142 Patrols</div>
          <div className="mt-1 text-xs text-slate-500">
            Completed without human intervention
          </div>
        </div>
      </div>

      {/* Previous Alerts, Affected Zones & Corrective Actions Table */}
      <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Historical Alert Log & Corrective Action Audit
            </h2>
            <p className="text-xs text-slate-500">
              Complete chronological audit of detected grain storage anomalies and farmer responses
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-medium">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Zone & Crop</th>
                <th className="py-2.5 px-3">Incident Description</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Corrective Action Undertaken</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.map((item) => (
                <tr key={item.id} className="hover:bg-[#fcfbf7]">
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-slate-600">
                    {item.detectedAt}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    Zone {item.zoneId}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">{item.title}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{item.description}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.severity === 'critical'
                          ? 'bg-red-100 text-red-900'
                          : item.severity === 'warning'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 text-[11px] max-w-sm">
                    {item.recommendedAction}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'acknowledged'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">
                  AgroGuard Compliance & Storage Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>Facility:</strong> AgroGuard Grain Hub #01 (Main Terminal)
              </p>
              <p>
                <strong>Generated:</strong> {new Date().toLocaleDateString()} at{' '}
                {new Date().toLocaleTimeString()}
              </p>
              <p>
                <strong>Total Stock Monitored:</strong> 1,800 Tonnes (Rice, Wheat, Maize, Pulses, Seeds)
              </p>
              <p>
                <strong>Storage Compliance:</strong> Meets ISO 6322 / FAO Agricultural Storage Standards.
              </p>
              <div className="p-3 rounded bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs">
                ✅ Report generated with encrypted digital signature from Central Head Gateway Unit. Suitable for agricultural insurance underwriters and export grain phytosanitary verification.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('AgroGuard Official Audit Report downloaded successfully (PDF & CSV package).');
                  setShowExportModal(false);
                }}
                className="px-3.5 py-1.5 rounded-md text-xs font-bold bg-[#1e5234] hover:bg-[#276a43] text-white flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF & CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
