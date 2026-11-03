/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAgro } from '../context/AgroContext';
import {
  Settings,
  Bell,
  Clock,
  Fan,
  Radio,
  Save,
  Check,
  Shield,
  Smartphone,
  Cpu,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useAgro();

  const [patrolInterval, setPatrolInterval] = useState(settings.patrolIntervalMinutes);
  const [autoAeration, setAutoAeration] = useState(settings.autoAerationEnabled);
  const [moistureTrigger, setMoistureTrigger] = useState(settings.autoAerationMoistureTrigger);
  const [tempTrigger, setTempTrigger] = useState(settings.autoAerationTempTrigger);
  const [smsAlerts, setSmsAlerts] = useState(settings.smsAlerts);
  const [smsRecipient, setSmsRecipient] = useState(settings.smsRecipient);
  const [whatsappAlerts, setWhatsappAlerts] = useState(settings.whatsappAlerts);
  const [sirenRelay, setSirenRelay] = useState(settings.sirenRelayEnabled);
  const [meshFreq, setMeshFreq] = useState(settings.meshFrequency);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      patrolIntervalMinutes: patrolInterval,
      autoAerationEnabled: autoAeration,
      autoAerationMoistureTrigger: moistureTrigger,
      autoAerationTempTrigger: tempTrigger,
      smsAlerts,
      smsRecipient,
      whatsappAlerts,
      sirenRelayEnabled: sirenRelay,
      meshFrequency: meshFreq,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#1e5234]" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                System Settings & Automation Schedules
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure autonomous mobile rover patrol routes, automated fan triggers, and emergency notification relays.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Settings Saved Successfully!</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Autonomous Rover Patrol Schedule */}
        <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Autonomous Rover Patrol Schedule
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Patrol Routine Frequency:
              </label>
              <select
                value={patrolInterval}
                onChange={(e) => setPatrolInterval(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value={30}>Every 30 Minutes (High Risk / Active Hotspots)</option>
                <option value={60}>Every 1 Hour (Standard Autonomous Routine)</option>
                <option value={120}>Every 2 Hours (Energy Saving Mode)</option>
                <option value={240}>Every 4 Hours (Extended Deep Sleep)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Rovers undock automatically, traverse guide-tracks between grain bins, and take depth spear samples.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="font-semibold text-slate-700 block">
                Rover Battery & Docking Rules:
              </span>
              <div className="text-slate-600 space-y-1">
                <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>Auto-dock for charging threshold:</span>
                  <strong className="text-slate-800">20% Battery</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>Autonomous Spear Penetration Depth:</span>
                  <strong className="text-slate-800">Up to 3.2 Meters</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Automated Fan & Aeration Rules */}
        <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Fan className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Automated Aeration Fan Controls
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#fcfbf7] border border-[#e8e4d8]">
              <div>
                <span className="font-bold text-slate-900 block">
                  Enable Autonomous Aeration Trigger
                </span>
                <span className="text-[11px] text-slate-500">
                  Automatically start silo bottom fans when threshold is breached
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoAeration}
                onChange={(e) => setAutoAeration(e.target.checked)}
                className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
                aria-label="Enable autonomous aeration trigger"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">
                  Moisture Trigger Threshold:
                </span>
                <span className="font-mono font-bold text-slate-900">{moistureTrigger}%</span>
              </div>
              <input
                type="range"
                min="12.0"
                max="16.0"
                step="0.1"
                value={moistureTrigger}
                onChange={(e) => setMoistureTrigger(parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
                aria-label="Moisture Trigger Threshold"
              />
              <p className="text-[10px] text-slate-400">
                Fans engage if any grain zone moisture exceeds this value.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">
                  Temperature Rise Hotspot Trigger:
                </span>
                <span className="font-mono font-bold text-slate-900">{tempTrigger}°C</span>
              </div>
              <input
                type="range"
                min="20.0"
                max="32.0"
                step="0.5"
                value={tempTrigger}
                onChange={(e) => setTempTrigger(parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
                aria-label="Temperature Rise Hotspot Trigger"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Farmer Notification Relays */}
        <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Emergency Notification Relays
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Farmer Mobile Phone Number (SMS & WhatsApp):
              </label>
              <input
                type="tel"
                value={smsRecipient}
                onChange={(e) => setSmsRecipient(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 rounded"
                />
                <span className="font-medium">Send SMS alerts for Critical Hotspots & Damp Grain</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 rounded"
                />
                <span className="font-medium">Send Daily AgroGuard AI Summary over WhatsApp</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sirenRelay}
                  onChange={(e) => setSirenRelay(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 rounded"
                />
                <span className="font-medium">Trigger Warehouse Head Unit Audio Siren for Fire / Gas Emergency</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Central Head Gateway & LoRa Mesh Network */}
        <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Radio className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Central Head Unit & Mesh Network
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                LoRa Sub-GHz Frequency Band:
              </label>
              <select
                value={meshFreq}
                onChange={(e) => setMeshFreq(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="868.1 MHz (LoRa Sub-GHz)">868.1 MHz (EU/IN Industrial Standard)</option>
                <option value="915.0 MHz (US915 Band)">915.0 MHz (US/Americas Industrial Band)</option>
                <option value="433.0 MHz (Long Range Penetration)">433.0 MHz (Deep Concrete Silo Penetration)</option>
              </select>
            </div>

            <div className="p-3 rounded-lg bg-[#fcfbf7] border border-[#e8e4d8] space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Head Unit Firmware:</span>
                <strong className="text-slate-800 font-mono">v3.4.2-AG-OS (Secure)</strong>
              </div>
              <div className="flex justify-between">
                <span>Active Mesh Nodes:</span>
                <strong className="text-slate-800">4 Mobile Rovers + 1 Gateway</strong>
              </div>
              <div className="flex justify-between">
                <span>Cloud Sync Latency:</span>
                <strong className="text-emerald-700 font-mono">38 ms (4G LTE OK)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button Row */}
        <div className="lg:col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-md text-xs font-bold bg-[#1e5234] hover:bg-[#276a43] text-white flex items-center gap-2 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save System Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
