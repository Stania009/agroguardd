/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAgro } from '../context/AgroContext';
import {
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Bug,
  Flame,
  Radio,
  Send,
  Fan,
  Battery,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Bot,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react';
import { CROP_STANDARDS } from '../utils/agroRules';
import { CropType } from '../types/agro';

export const LiveMonitoringView: React.FC = () => {
  const {
    zones,
    rovers,
    dispatchRoverToZone,
    toggleAerationFan,
    setSelectedZoneId,
    setActiveTab,
  } = useAgro();

  const [selectedCrop, setSelectedCrop] = useState<CropType | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'warning_critical'>('all');
  const [activeDispatchRover, setActiveDispatchRover] = useState<string | null>(null);

  const filteredZones = zones.filter((z) => {
    if (selectedCrop !== 'all' && z.crop !== selectedCrop) return false;
    if (filterSeverity === 'warning_critical' && z.status === 'normal') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Mobile Rover Body Units Fleet Bar */}
      <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Live Monitoring: Mobile Rover Fleet & Telemetry
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Autonomous mobile Sensor Body Units actively navigating warehouse storage zones
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md font-semibold border border-emerald-200">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
              <span>4 Mobile Rovers Synchronized</span>
            </span>
          </div>
        </div>

        {/* 4 Rover Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {rovers.map((rover) => {
            const currentZone = zones.find((z) => z.id === rover.currentZoneId);
            return (
              <div
                key={rover.id}
                className="bg-[#fcfbf7] rounded-lg border border-[#e6e2d6] p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-[#1e5234]" />
                      {rover.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        rover.status === 'inspecting'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : rover.status === 'patrolling'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : rover.status === 'sampling'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {rover.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 mt-2">{rover.name}</h3>
                  <div className="text-xs text-slate-600 mt-0.5 flex items-center justify-between">
                    <span>Location:</span>
                    <span className="font-semibold text-emerald-900">
                      {currentZone?.name || `Zone ${rover.currentZoneId}`}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1">
                        <Battery className="w-3.5 h-3.5" />
                        Battery
                      </span>
                      <span className="font-semibold text-slate-800">{rover.batteryPct}%</span>
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
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#e8e4d8] text-[11px] space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Equipped Sensor:</span>
                      <span className="font-medium text-slate-800 capitalize">
                        {rover.installedModule.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Signal Mesh:</span>
                      <span className="text-slate-700">{rover.signalDbm} dBm (Strong)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Firmware / Ping:</span>
                      <span className="text-slate-500">{rover.firmwareVersion} · {rover.lastPing}</span>
                    </div>
                  </div>
                </div>

                {/* Rover Dispatch Drawer */}
                <div className="mt-4 pt-3 border-t border-[#e8e4d8]">
                  {activeDispatchRover === rover.id ? (
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold text-slate-700 block">
                        Select Destination Zone:
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {zones.map((z) => (
                          <button
                            key={z.id}
                            type="button"
                            onClick={() => {
                              dispatchRoverToZone(rover.id, z.id);
                              setActiveDispatchRover(null);
                            }}
                            className={`px-1.5 py-1 text-[10px] font-medium rounded border ${
                              z.id === rover.currentZoneId
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                            }`}
                          >
                            {z.id}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveDispatchRover(null)}
                        className="text-[10px] text-slate-400 hover:text-slate-600 block text-right w-full"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveDispatchRover(rover.id)}
                      className="w-full py-1.5 rounded text-xs font-semibold bg-white hover:bg-slate-100 text-[#1e5234] border border-[#1e5234]/40 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch to Zone</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar for Storage Zones */}
      <div className="bg-white rounded-xl border border-[#e6e2d6] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Filter Crop:</span>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'rice', 'wheat', 'maize', 'pulses', 'seeds'] as const).map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() => setSelectedCrop(crop)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedCrop === crop
                    ? 'bg-[#1e5234] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {crop === 'all' ? 'All Crops' : crop.charAt(0).toUpperCase() + crop.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setFilterSeverity(
                filterSeverity === 'all' ? 'warning_critical' : 'all'
              )
            }
            className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
              filterSeverity === 'warning_critical'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {filterSeverity === 'warning_critical'
              ? 'Showing: Warnings & Critical Only'
              : 'Show: All Zones'}
          </button>
        </div>
      </div>

      {/* Individual Real-Time Sensor Readings for Each Storage Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredZones.map((zone) => {
          const std = CROP_STANDARDS[zone.crop];
          const assignedRover = rovers.find((r) => r.id === zone.assignedRoverId);

          return (
            <div
              key={zone.id}
              className={`bg-white rounded-xl border p-5 shadow-sm flex flex-col justify-between transition-all ${
                zone.status === 'critical'
                  ? 'border-red-300 ring-2 ring-red-100'
                  : zone.status === 'warning'
                  ? 'border-amber-300'
                  : 'border-[#e6e2d6] hover:border-[#1e5234]'
              }`}
            >
              <div>
                {/* Card Title & Status Badge */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-slate-900">{zone.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          zone.status === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : zone.status === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {zone.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {std.name} ({zone.variety}) · Stock: {zone.currentStockTonnes} / {zone.capacityTonnes} T
                    </div>
                  </div>

                  {assignedRover && (
                    <span className="text-[10px] font-medium bg-[#1e5234] text-white px-2 py-1 rounded flex items-center gap-1 shadow-2xs">
                      <Bot className="w-3 h-3 text-emerald-300" />
                      {assignedRover.id}
                    </span>
                  )}
                </div>

                {/* 6 Key Sensor Readings (Temp, Moisture, Humidity, CO2, Spoilage Gases, Pest Activity) */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {/* Temperature */}
                  <div className="bg-[#fcfbf7] p-2.5 rounded-lg border border-[#e8e4d8]">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                        Temperature
                      </span>
                      <span className="text-[10px] text-slate-400">Max {std.safeTempMax}°C</span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span
                        className={`text-lg font-extrabold font-mono ${
                          zone.temp > std.safeTempMax ? 'text-red-600' : 'text-slate-900'
                        }`}
                      >
                        {zone.temp}°C
                      </span>
                      {zone.temp > std.safeTempMax && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded">High</span>
                      )}
                    </div>
                  </div>

                  {/* Grain Moisture */}
                  <div className="bg-[#fcfbf7] p-2.5 rounded-lg border border-[#e8e4d8]">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-600" />
                        Grain Moisture
                      </span>
                      <span className="text-[10px] text-slate-400">Ceil {std.criticalMoisture}%</span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span
                        className={`text-lg font-extrabold font-mono ${
                          zone.moisture > std.idealMoistureMax ? 'text-red-600' : 'text-slate-900'
                        }`}
                      >
                        {zone.moisture}%
                      </span>
                      {zone.moisture > std.idealMoistureMax && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded">Damp</span>
                      )}
                    </div>
                  </div>

                  {/* Relative Humidity */}
                  <div className="bg-[#fcfbf7] p-2.5 rounded-lg border border-[#e8e4d8]">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5 text-teal-600" />
                        Humidity (RH)
                      </span>
                      <span className="text-[10px] text-slate-400">Headspace</span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span
                        className={`text-lg font-extrabold font-mono ${
                          zone.humidity > 70 ? 'text-amber-600' : 'text-slate-900'
                        }`}
                      >
                        {zone.humidity}%
                      </span>
                      <span className="text-[10px] text-slate-400">Target &lt;65%</span>
                    </div>
                  </div>

                  {/* CO2 Respiration */}
                  <div className="bg-[#fcfbf7] p-2.5 rounded-lg border border-[#e8e4d8]">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-emerald-700" />
                        CO₂ Gas
                      </span>
                      <span className="text-[10px] text-slate-400">Max {std.safeCo2Max}</span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span
                        className={`text-lg font-extrabold font-mono ${
                          zone.co2 > std.safeCo2Max ? 'text-red-600' : 'text-slate-900'
                        }`}
                      >
                        {zone.co2} <span className="text-xs font-normal text-slate-500">ppm</span>
                      </span>
                    </div>
                  </div>

                  {/* Spoilage Gases (TVOC / Ethylene) */}
                  <div className="bg-[#fcfbf7] p-2.5 rounded-lg border border-[#e8e4d8]">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-600" />
                        Spoilage Gas
                      </span>
                      <span className="text-[10px] text-slate-400">TVOC / Ethylene</span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span
                        className={`text-lg font-extrabold font-mono ${
                          zone.spoilageGas > 25 ? 'text-red-600' : 'text-slate-900'
                        }`}
                      >
                        {zone.spoilageGas} <span className="text-xs font-normal text-slate-500">ppm</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Safe: &lt;20</span>
                    </div>
                  </div>

                  {/* Pest Activity Index */}
                  <div className="bg-[#fcfbf7] p-2.5 rounded-lg border border-[#e8e4d8]">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Bug className="w-3.5 h-3.5 text-amber-700" />
                        Pest Activity
                      </span>
                      <span className="text-[10px] text-slate-400">Acoustic Events</span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span
                        className={`text-lg font-extrabold font-mono ${
                          zone.pestActivity > std.maxSafePestIndex ? 'text-red-600' : 'text-slate-900'
                        }`}
                      >
                        {zone.pestActivity} <span className="text-xs font-normal text-slate-500">ev/hr</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Max {std.maxSafePestIndex}</span>
                    </div>
                  </div>
                </div>

                {/* Storage Health Assessment Note */}
                <div className="mt-4 p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <span className="font-semibold text-slate-700 whitespace-nowrap">Storage Agronomy:</span>
                  <span>{std.storageGuidelines}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleAerationFan(zone.id)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    zone.aerationFanActive
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  <Fan className={`w-3.5 h-3.5 ${zone.aerationFanActive ? 'animate-spin' : ''}`} />
                  <span>{zone.aerationFanActive ? 'Aeration Active' : 'Start Aeration'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedZoneId(zone.id);
                    setActiveTab('map');
                  }}
                  className="px-3 py-1.5 rounded text-xs font-semibold bg-white hover:bg-slate-100 text-[#1e5234] border border-[#1e5234]/40 transition-colors"
                >
                  Locate on Map →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
