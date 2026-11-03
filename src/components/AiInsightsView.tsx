/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAgro } from '../context/AgroContext';
import {
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  BrainCircuit,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Fan,
  Droplets,
  Thermometer,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { CROP_STANDARDS, calculateFungalRiskPct, calculateSafeStorageLifeWeeks } from '../utils/agroRules';
import { CropType } from '../types/agro';

export const AiInsightsView: React.FC = () => {
  const { zones, insights, toggleAerationFan, setSelectedZoneId, setActiveTab } = useAgro();

  // Interactive What-if Risk Simulator State
  const [simCrop, setSimCrop] = useState<CropType>('rice');
  const [simTemp, setSimTemp] = useState<number>(26);
  const [simMoisture, setSimMoisture] = useState<number>(14.2);
  const [simHumidity, setSimHumidity] = useState<number>(72);

  const simFungalRisk = calculateFungalRiskPct(simCrop, simTemp, simHumidity, simMoisture);
  const simSafeWeeks = calculateSafeStorageLifeWeeks(simCrop, simTemp, simMoisture);
  const simStd = CROP_STANDARDS[simCrop];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                AI Spoilage Risk Engine & Transparent Decision Analysis
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Agronomic machine learning analyzing psychrometric equilibrium, respiration kinetics, and acoustic pest patterns.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-[#fcfbf7] px-3 py-1.5 rounded-lg border border-[#e8e4d8]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Multi-Factor Spoilage Model: Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Spoilage Risks & Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-time Spoilage Risk Assessments */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Active Crop Risk Evaluations & Predictions</span>
          </h2>

          {insights.map((insight) => {
            const relatedZone = zones.find((z) => z.id === insight.zoneId);
            const std = CROP_STANDARDS[insight.crop];

            let badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-200';
            let borderStyle = 'border-[#e6e2d6]';
            if (insight.riskLevel === 'critical') {
              badgeColor = 'bg-red-100 text-red-900 border-red-300 font-bold';
              borderStyle = 'border-red-300 ring-2 ring-red-100';
            } else if (insight.riskLevel === 'high' || insight.riskLevel === 'moderate') {
              badgeColor = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
              borderStyle = 'border-amber-300';
            }

            return (
              <div
                key={insight.id}
                className={`bg-white rounded-xl border p-5 shadow-sm space-y-4 transition-all ${borderStyle}`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900">
                        {insight.riskTitle}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${badgeColor}`}>
                        {insight.riskLevel} Risk
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Target: Zone {insight.zoneId} ({std.name}) · AI Model Confidence: {insight.confidence}%
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-700 bg-[#fcfbf7] px-3 py-1.5 rounded border border-[#e8e4d8]">
                    {insight.safeStorageLifeEstimate}
                  </div>
                </div>

                {/* Spoilage Prediction Summary */}
                <div className="p-3.5 rounded-lg bg-[#fcfbf7] border border-[#e8e4d8] text-xs text-slate-800 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">
                    Risk Forecast & Timeline:
                  </span>
                  {insight.predictionSummary}
                </div>

                {/* Transparent Explanation: Why AI Made this Decision */}
                <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Scientific & Biological Rationale (Why AI Decided This):</span>
                  </div>
                  <p className="leading-relaxed text-emerald-900/90">
                    {insight.scientificRationale}
                  </p>
                </div>

                {/* Farmer Recommended Action */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Recommended Preventive Action:
                  </span>
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {insight.recommendedAction}
                  </div>
                </div>

                {/* Impact If Ignored Note */}
                <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200 flex items-center justify-between">
                  <span>
                    <strong>Financial & Quality Consequence: </strong>
                    {insight.impactIfIgnored}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAerationFan(insight.zoneId)}
                    className="px-3.5 py-1.5 rounded-md text-xs font-bold bg-[#1e5234] hover:bg-[#276a43] text-white flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Fan className="w-3.5 h-3.5" />
                    <span>Execute Zone {insight.zoneId} Aeration</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedZoneId(insight.zoneId);
                      setActiveTab('map');
                    }}
                    className="text-xs font-semibold text-[#1e5234] hover:underline flex items-center gap-1"
                  >
                    <span>View Microclimate on Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Interactive Farmer What-If Risk Simulator */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>Interactive Risk Simulator</span>
          </h2>

          <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Crop Spoilage What-If Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust weather, humidity, and temperature parameters to test how long your crop will remain safe before mold or heating occurs.
              </p>
            </div>

            {/* Select Crop */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Select Crop Type:</label>
              <select
                value={simCrop}
                onChange={(e) => setSimCrop(e.target.value as CropType)}
                className="w-full text-xs rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="rice">Paddy Rice (Ideal: &lt;13.5%)</option>
                <option value="wheat">Durum Wheat (Ideal: &lt;13.0%)</option>
                <option value="maize">Yellow Maize (Ideal: &lt;14.0%)</option>
                <option value="pulses">Chickpeas & Pulses (Ideal: &lt;12.0%)</option>
                <option value="seeds">Oilseeds & Sunflower (Ideal: &lt;9.5%)</option>
              </select>
            </div>

            {/* Slider 1: Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-emerald-700" />
                  Bulk Temperature
                </span>
                <span className="font-mono font-bold text-slate-900">{simTemp}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="38"
                step="0.5"
                value={simTemp}
                onChange={(e) => setSimTemp(parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
                aria-label="Bulk Temperature slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10°C (Cold)</span>
                <span>Safe Ceiling: {simStd.safeTempMax}°C</span>
                <span>38°C (Hot)</span>
              </div>
            </div>

            {/* Slider 2: Grain Moisture */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-600" />
                  Grain Moisture Content
                </span>
                <span className="font-mono font-bold text-slate-900">{simMoisture.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="8"
                max="20"
                step="0.1"
                value={simMoisture}
                onChange={(e) => setSimMoisture(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
                aria-label="Grain Moisture slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>8% (Dry)</span>
                <span>Ceiling: {simStd.criticalMoisture}%</span>
                <span>20% (Wet)</span>
              </div>
            </div>

            {/* Slider 3: Relative Humidity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Storage Relative Humidity</span>
                <span className="font-mono font-bold text-slate-900">{simHumidity}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                step="1"
                value={simHumidity}
                onChange={(e) => setSimHumidity(parseInt(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
                aria-label="Relative Humidity slider"
              />
            </div>

            {/* Simulated AI Output Card */}
            <div className="mt-4 p-4 rounded-lg bg-[#fcfbf7] border border-[#e8e4d8] space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Simulated AI Prognosis
              </div>

              {/* Fungal Mold Risk Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Fungal & Mold Risk Index:</span>
                  <span
                    className={`font-bold ${
                      simFungalRisk > 50
                        ? 'text-red-700'
                        : simFungalRisk > 25
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    {simFungalRisk}% ({simFungalRisk > 50 ? 'High' : simFungalRisk > 25 ? 'Moderate' : 'Low'})
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      simFungalRisk > 50
                        ? 'bg-red-600'
                        : simFungalRisk > 25
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${simFungalRisk}%` }}
                  />
                </div>
              </div>

              {/* Estimated Safe Shelf Life */}
              <div className="p-2.5 rounded bg-white border border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-600">Safe Storage Life:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {simSafeWeeks} Weeks ({Math.round(simSafeWeeks / 4.3)} Months)
                </span>
              </div>

              {/* Advisory note */}
              <p className="text-[11px] text-slate-500 italic">
                {simFungalRisk > 50
                  ? '⚠️ High risk of mycotoxin accumulation. Aeration fans must be activated immediately to drop moisture below critical limit.'
                  : simFungalRisk > 25
                  ? '⚡ Moderate warning. Monitor closely; prepare aeration schedule during dry night air.'
                  : '✅ Safe conditions. Bulk grain equilibrium will remain stable under current storage protocols.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
