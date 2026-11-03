/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAgro } from '../context/AgroContext';
import {
  Thermometer,
  Droplets,
  Wind,
  Layers,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Bot,
  ArrowRight,
  TrendingUp,
  Fan,
  Activity,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { CROP_STANDARDS } from '../utils/agroRules';

export const DashboardView: React.FC = () => {
  const {
    zones,
    rovers,
    alerts,
    insights,
    setActiveTab,
    setSelectedZoneId,
    toggleAerationFan,
    dispatchRoverToZone,
  } = useAgro();

  // Aggregated facility metrics
  const totalZones = zones.length;
  const connectedRovers = rovers.length;
  const criticalZones = zones.filter((z) => z.status === 'critical').length;
  const warningZones = zones.filter((z) => z.status === 'warning').length;
  const normalZones = zones.filter((z) => z.status === 'normal').length;

  const avgTemp = (zones.reduce((acc, z) => acc + z.temp, 0) / totalZones).toFixed(1);
  const avgMoisture = (zones.reduce((acc, z) => acc + z.moisture, 0) / totalZones).toFixed(1);
  const avgHumidity = (zones.reduce((acc, z) => acc + z.humidity, 0) / totalZones).toFixed(1);
  const avgCo2 = Math.round(zones.reduce((acc, z) => acc + z.co2, 0) / totalZones);

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const primaryInsight = insights[0];

  // Calculate overall storage safety score (100 base)
  const healthScore = Math.max(
    30,
    100 - criticalZones * 25 - warningZones * 10
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Status & Quick Alerts */}
      <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg flex items-center justify-center ${
                criticalZones > 0
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {criticalZones > 0 ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <ShieldCheck className="w-7 h-7" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Facility Storage Health:{' '}
                  {criticalZones > 0
                    ? 'Attention Required (1 Critical Hotspot)'
                    : 'Stable & Secured'}
                </h1>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    criticalZones > 0
                      ? 'bg-red-100 text-red-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  Health Score: {healthScore}/100
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Central Head Unit synchronizing continuous telemetry from {connectedRovers} mobile Body Rovers across {totalZones} grain storage zones.
              </p>
            </div>
          </div>

          {/* Quick Metrics Counter */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-3 lg:pt-0 lg:pl-6 text-center">
            <div className="bg-[#fcfbf7] px-3 py-2 rounded-lg border border-[#e8e4d8]">
              <div className="text-lg font-bold text-emerald-700">{normalZones}</div>
              <div className="text-xs text-slate-500 font-medium">Healthy Zones</div>
            </div>
            <div className="bg-[#fcfbf7] px-3 py-2 rounded-lg border border-[#e8e4d8]">
              <div className="text-lg font-bold text-amber-600">{warningZones}</div>
              <div className="text-xs text-slate-500 font-medium">Warnings</div>
            </div>
            <div className="bg-[#fcfbf7] px-3 py-2 rounded-lg border border-[#e8e4d8]">
              <div className="text-lg font-bold text-red-600">{criticalZones}</div>
              <div className="text-xs text-slate-500 font-medium">Critical</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Cards (Temp, Moisture, Humidity, CO2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature */}
        <div className="bg-white rounded-xl border border-[#e6e2d6] p-4 shadow-sm hover:border-[#1e5234] transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-700">Average Temperature</span>
            <Thermometer className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{avgTemp}°C</span>
            <span className="text-xs text-slate-500">Range: 17.2°C – 28.2°C</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '62%' }} />
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>Target: &lt; 23.0°C</span>
            <span className="text-amber-600 font-medium">Hotspot detected in B2</span>
          </div>
        </div>

        {/* Grain Moisture */}
        <div className="bg-white rounded-xl border border-[#e6e2d6] p-4 shadow-sm hover:border-[#1e5234] transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-700">Grain Moisture Content</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{avgMoisture}%</span>
            <span className="text-xs text-slate-500">Safe Target: 11% – 13.5%</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '68%' }} />
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>Critical ceiling: 14.5%</span>
            <span className="text-red-600 font-medium">Zone B2 is 15.4%</span>
          </div>
        </div>

        {/* Headspace Humidity */}
        <div className="bg-white rounded-xl border border-[#e6e2d6] p-4 shadow-sm hover:border-[#1e5234] transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-700">Storage Relative Humidity</span>
            <Wind className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{avgHumidity}%</span>
            <span className="text-xs text-slate-500">Outdoor: 52% RH</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: '58%' }} />
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>Mold risk line: 70%</span>
            <span className="text-slate-600">Equilibrium OK</span>
          </div>
        </div>

        {/* Carbon Dioxide (CO2) */}
        <div className="bg-white rounded-xl border border-[#e6e2d6] p-4 shadow-sm hover:border-[#1e5234] transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-700">Grain Respiration (CO₂)</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{avgCo2} ppm</span>
            <span className="text-xs text-slate-500">Baseline: 450 ppm</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-700 h-1.5 rounded-full" style={{ width: '45%' }} />
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>Fermentation alert: 1100</span>
            <span className="text-red-600 font-medium">B2 Respiration High</span>
          </div>
        </div>
      </div>

      {/* Center Section: Crop Storage Health Matrix + AI Advisory Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Crop Storage Health Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Crop Health & Storage Zones</h2>
              <p className="text-xs text-slate-500">Real-time status of stored crops, stock tonnages, and rover assignments</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('monitoring')}
              className="text-xs font-semibold text-[#1e5234] hover:text-[#2e7d32] flex items-center gap-1"
            >
              <span>View All Sensors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-medium">
                  <th className="py-2.5 px-3">Zone & Crop</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3">Temp</th>
                  <th className="py-2.5 px-3">Moisture</th>
                  <th className="py-2.5 px-3">Health Status</th>
                  <th className="py-2.5 px-3">Aeration / Rover</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {zones.map((zone) => {
                  const std = CROP_STANDARDS[zone.crop];
                  return (
                    <tr
                      key={zone.id}
                      className={`hover:bg-[#fbf9f4] transition-colors ${
                        zone.status === 'critical' ? 'bg-red-50/40' : zone.status === 'warning' ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{zone.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {std.name} · {zone.variety}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">{zone.currentStockTonnes} T</span>
                        <div className="text-[10px] text-slate-400">of {zone.capacityTonnes} T cap</div>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        <span className={zone.temp > std.safeTempMax ? 'text-red-700 font-bold' : 'text-slate-800'}>
                          {zone.temp}°C
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        <span className={zone.moisture > std.idealMoistureMax ? 'text-red-700 font-bold' : 'text-slate-800'}>
                          {zone.moisture}%
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                            zone.status === 'critical'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : zone.status === 'warning'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {zone.status === 'critical' && <AlertOctagon className="w-3 h-3 text-red-600" />}
                          {zone.status === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          {zone.status === 'normal' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          <span className="capitalize">{zone.status}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-1 text-[11px]">
                          {zone.assignedRoverId ? (
                            <span className="text-slate-700 flex items-center gap-1 font-medium">
                              <Bot className="w-3 h-3 text-emerald-700" />
                              {zone.assignedRoverId}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">No rover pinned</span>
                          )}
                          <span className={zone.aerationFanActive ? 'text-emerald-700 font-bold flex items-center gap-1' : 'text-slate-400'}>
                            <Fan className={`w-3 h-3 ${zone.aerationFanActive ? 'animate-spin text-emerald-600' : ''}`} />
                            {zone.aerationFanActive ? 'Fan Active' : 'Fan Standby'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedZoneId(zone.id);
                            setActiveTab('map');
                          }}
                          className="px-2.5 py-1 text-xs rounded bg-white hover:bg-slate-100 border border-slate-300 font-medium text-slate-700 transition-colors shadow-2xs"
                        >
                          Locate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: AI Advisory & Hotspot Interventions */}
        <div className="bg-[#fcfbf7] rounded-xl border border-[#e6e2d6] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e4d8]">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#1e5234]" />
                <h2 className="text-sm font-bold text-slate-900">AgroGuard AI Recommendation</h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Live Engine
              </span>
            </div>

            {primaryInsight && (
              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center justify-between text-xs font-bold text-red-900">
                    <span>{primaryInsight.riskTitle}</span>
                    <span className="text-[10px] bg-red-200/80 px-1.5 py-0.5 rounded text-red-900">
                      Zone {primaryInsight.zoneId}
                    </span>
                  </div>
                  <p className="text-xs text-red-800 mt-1 leading-relaxed">
                    {primaryInsight.predictionSummary}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Recommended Corrective Action
                  </span>
                  <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-[#e6e2d6] whitespace-pre-line leading-relaxed">
                    {primaryInsight.recommendedAction}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-white/70 p-2.5 rounded border border-[#e8e4d8]">
                  <span className="font-semibold text-slate-700">Biological Rationale: </span>
                  {primaryInsight.scientificRationale.slice(0, 140)}...
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#e8e4d8] mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => toggleAerationFan('B2')}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Fan className="w-3.5 h-3.5" />
              <span>Toggle Zone B2 Aeration</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className="text-xs font-semibold text-[#1e5234] hover:underline"
            >
              Full AI Insights →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Connected Mobile Sensor Body Rovers */}
      <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Connected Sensor Body Rovers (Fleet Status)</h2>
            <p className="text-xs text-slate-500">Autonomous mobile units patrolling grain bulks and transmitting microclimate data</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('monitoring')}
            className="text-xs font-semibold text-[#1e5234] hover:text-[#2e7d32] flex items-center gap-1"
          >
            <span>Live Telemetry & Probe Controls</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rovers.map((rover) => {
            const currentZone = zones.find((z) => z.id === rover.currentZoneId);
            return (
              <div
                key={rover.id}
                className="bg-[#fcfbf7] rounded-lg border border-[#e6e2d6] p-3.5 flex flex-col justify-between hover:border-[#1e5234] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 font-mono">{rover.id}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                        rover.status === 'inspecting'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : rover.status === 'patrolling'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : rover.status === 'docked'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {rover.status}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-800 mt-1">{rover.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Position: <span className="font-medium text-slate-700">{currentZone?.name || rover.currentZoneId}</span>
                  </div>

                  {/* Battery & Signal */}
                  <div className="mt-3 space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Battery</span>
                      <span className="font-semibold text-slate-900">{rover.batteryPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          rover.batteryPct > 50
                            ? 'bg-emerald-600'
                            : rover.batteryPct > 20
                            ? 'bg-amber-500'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${rover.batteryPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>LoRa RSSI: {rover.signalDbm} dBm</span>
                      <span>Ping: {rover.lastPing}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#e8e4d8] flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 capitalize">
                    Module: <strong className="text-slate-700">{rover.installedModule.replace('_', ' ')}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedZoneId(rover.currentZoneId);
                      setActiveTab('map');
                    }}
                    className="text-xs text-[#1e5234] font-semibold hover:underline"
                  >
                    Track →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
