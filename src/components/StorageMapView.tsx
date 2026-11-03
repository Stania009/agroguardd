/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAgro } from '../context/AgroContext';
import {
  MapPin,
  Bot,
  Fan,
  Thermometer,
  Droplets,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Send,
  Zap,
  Info,
  Layers,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { CROP_STANDARDS } from '../utils/agroRules';

export const StorageMapView: React.FC = () => {
  const {
    zones,
    rovers,
    selectedZoneId,
    setSelectedZoneId,
    dispatchRoverToZone,
    toggleAerationFan,
    setActiveTab,
  } = useAgro();

  const [activeRoverToDispatch, setActiveRoverToDispatch] = useState<string>('BODY-01');

  // Currently inspected zone (defaults to selected or first critical/warning zone)
  const currentInspectZoneId =
    selectedZoneId ||
    zones.find((z) => z.status === 'critical')?.id ||
    zones[0].id;

  const activeZone = zones.find((z) => z.id === currentInspectZoneId) || zones[0];
  const activeStd = CROP_STANDARDS[activeZone.crop];
  const assignedRover = rovers.find((r) => r.id === activeZone.assignedRoverId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#1e5234]" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Grain Warehouse Storage Map & Rover Positions
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Interactive 2D spatial layout of grain storage bins, silos, and mobile sensor rover patrol positions.
            </p>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600 shadow-2xs" />
              <span>Healthy</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-800">
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500 shadow-2xs" />
              <span>Warning</span>
            </span>
            <span className="flex items-center gap-1.5 text-red-800">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-red-600 animate-pulse shadow-2xs" />
              <span>Critical Hotspot</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Map Layout: 2D Spatial Grid + Right Telemetry Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouse Visual Canvas (2 Cols) */}
        <div className="lg:col-span-2 bg-[#f4f1ea] rounded-xl border border-[#ded8cb] p-6 shadow-inner relative flex flex-col justify-between min-h-[500px]">
          {/* Top Warehouse Legend & Building Blueprint Markers */}
          <div className="flex items-center justify-between pb-3 border-b border-[#ded8cb] text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-800">FACILITY-01 (MAIN GRAIN TERMINAL)</span>
              <span>· Total Capacity: 2,400 Tonnes</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
              <span>HEAD GATEWAY: TOWER #1</span>
              <span>LORA MESH: OK</span>
            </div>
          </div>

          {/* Central Grid of Warehouse Storage Zones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
            {zones.map((zone) => {
              const std = CROP_STANDARDS[zone.crop];
              const isSelected = zone.id === currentInspectZoneId;
              const hasRover = rovers.find((r) => r.currentZoneId === zone.id);

              let statusBorder = 'border-emerald-300 bg-emerald-50/60 hover:bg-emerald-50';
              let badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-200';
              if (zone.status === 'critical') {
                statusBorder =
                  'border-red-400 bg-red-50 hover:bg-red-100/70 ring-4 ring-red-200 animate-pulse';
                badgeColor = 'bg-red-200 text-red-900 border-red-300';
              } else if (zone.status === 'warning') {
                statusBorder =
                  'border-amber-400 bg-amber-50/80 hover:bg-amber-100/70 ring-2 ring-amber-100';
                badgeColor = 'bg-amber-100 text-amber-900 border-amber-200';
              }

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all relative flex flex-col justify-between min-h-[170px] ${statusBorder} ${
                    isSelected ? 'shadow-md scale-[1.02]' : ''
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedZoneId(zone.id);
                  }}
                  aria-label={`Storage Zone ${zone.name}, status ${zone.status}`}
                >
                  <div>
                    {/* Zone ID and Status */}
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base font-mono text-slate-900">
                        {zone.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeColor}`}
                      >
                        {zone.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800 mt-1">{zone.name}</div>
                    <div className="text-[11px] text-slate-600">
                      {std.name} · {zone.currentStockTonnes} T
                    </div>

                    {/* Sensor Micro-Values */}
                    <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                      <div className="bg-white/80 p-1 rounded border border-black/5">
                        <span className="text-[10px] text-slate-400 block">TEMP</span>
                        <span className={zone.temp > std.safeTempMax ? 'text-red-700 font-bold' : 'text-slate-800'}>
                          {zone.temp}°C
                        </span>
                      </div>
                      <div className="bg-white/80 p-1 rounded border border-black/5">
                        <span className="text-[10px] text-slate-400 block">MOISTURE</span>
                        <span className={zone.moisture > std.idealMoistureMax ? 'text-red-700 font-bold' : 'text-slate-800'}>
                          {zone.moisture}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rover Indicator Tag & Aeration Status */}
                  <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-[11px]">
                    {hasRover ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-900 bg-white/90 px-2 py-0.5 rounded-md border border-emerald-300 shadow-2xs">
                        <Bot className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                        <span>{hasRover.id}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px] italic">No rover</span>
                    )}

                    {zone.aerationFanActive && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-white/90 px-1.5 py-0.5 rounded border border-emerald-200">
                        <Fan className="w-3 h-3 animate-spin text-emerald-600" />
                        <span>Fan ON</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Docking & Charging Bay Blueprint */}
          <div className="pt-3 border-t border-[#ded8cb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Docking Station & LoRa Gateway:</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-[11px]">
                Charging Bay 1–4 (North Wall)
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Click any zone above to inspect live telemetry & command rovers
            </div>
          </div>
        </div>

        {/* Right Panel: Selected Zone Telemetry & Command Dispatcher */}
        <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Zone Inspector
                </span>
                <h2 className="text-lg font-bold text-slate-900">{activeZone.name}</h2>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded uppercase ${
                  activeZone.status === 'critical'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : activeZone.status === 'warning'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {activeZone.status}
              </span>
            </div>

            {/* Crop Info */}
            <div className="mt-4 p-3 rounded-lg bg-[#fcfbf7] border border-[#e8e4d8] space-y-1">
              <div className="text-xs font-bold text-slate-900">{activeStd.name}</div>
              <div className="text-[11px] text-slate-600">
                Variety: {activeZone.variety} · Capacity: {activeZone.capacityTonnes} Tonnes
              </div>
              <div className="text-[11px] text-slate-500">
                Current Stock: <strong className="text-slate-800">{activeZone.currentStockTonnes} Tonnes</strong> ({Math.round((activeZone.currentStockTonnes / activeZone.capacityTonnes) * 100)}% filled)
              </div>
            </div>

            {/* Live Telemetry Breakdown */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-emerald-600" />
                  Core Temperature
                </span>
                <span
                  className={`font-mono font-bold ${
                    activeZone.temp > activeStd.safeTempMax ? 'text-red-700' : 'text-slate-900'
                  }`}
                >
                  {activeZone.temp}°C{' '}
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Max: {activeStd.safeTempMax}°C)
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  Grain Moisture
                </span>
                <span
                  className={`font-mono font-bold ${
                    activeZone.moisture > activeStd.idealMoistureMax ? 'text-red-700' : 'text-slate-900'
                  }`}
                >
                  {activeZone.moisture}%{' '}
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Ceiling: {activeStd.criticalMoisture}%)
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Headspace Humidity</span>
                <span className="font-mono font-bold text-slate-900">{activeZone.humidity}% RH</span>
              </div>

              <div className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600">CO₂ Respiration</span>
                <span className="font-mono font-bold text-slate-900">{activeZone.co2} ppm</span>
              </div>

              <div className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Pest Acoustic Activity</span>
                <span className="font-mono font-bold text-slate-900">{activeZone.pestActivity} events/hr</span>
              </div>

              <div className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Spoilage Gas (TVOC)</span>
                <span className="font-mono font-bold text-slate-900">{activeZone.spoilageGas} ppm</span>
              </div>
            </div>

            {/* Aeration Fan Controls */}
            <div className="mt-4 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Bottom-Up Aeration Fan</span>
                  <span className="text-[11px] text-emerald-800">
                    {activeZone.aerationFanActive ? 'Currently running at 100% capacity' : 'System idle / auto-ready'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAerationFan(activeZone.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeZone.aerationFanActive
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  <Fan className={`w-3.5 h-3.5 ${activeZone.aerationFanActive ? 'animate-spin' : ''}`} />
                  <span>{activeZone.aerationFanActive ? 'Stop Fan' : 'Start Fan'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Dispatch Mobile Rover Section */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              Dispatch Mobile Body Rover to Zone {activeZone.id}
            </span>
            <div className="flex gap-2">
              <select
                value={activeRoverToDispatch}
                onChange={(e) => setActiveRoverToDispatch(e.target.value)}
                className="w-full text-xs rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                aria-label="Select Rover to dispatch"
              >
                {rovers.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.installedModule.replace('_', ' ')}) - {r.batteryPct}%
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => dispatchRoverToZone(activeRoverToDispatch, activeZone.id)}
                className="px-3.5 py-1.5 rounded-md text-xs font-bold bg-[#1e5234] hover:bg-[#286b44] text-white flex items-center gap-1.5 whitespace-nowrap transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Autonomous rover will navigate warehouse track and insert spear probe upon arrival.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
