/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAgro } from '../context/AgroContext';
import {
  LayoutDashboard,
  Activity,
  MapPin,
  Bell,
  Cpu,
  Layers,
  BarChart3,
  Settings,
  Radio,
  Wifi,
  Sparkles,
  Zap,
  RotateCcw,
  AlertTriangle,
  Menu,
  X,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    alerts,
    headUnitOnline,
    simulationActive,
    setSimulationActive,
    triggerAnomaly,
  } = useAgro();

  const [simMenuOpen, setSimMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
    { id: 'map', label: 'Storage Map', icon: MapPin },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
    },
    { id: 'ai', label: 'AI Insights', icon: Sparkles },
    { id: 'crops', label: 'Crop & Sensors', icon: Layers },
    { id: 'reports', label: 'Reports & History', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-[#0e2a1b] text-white border-b border-[#1b432d] sticky top-0 z-40 shadow-sm">
      {/* Top bar: System status & quick simulation tools */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2e7d32] border border-[#4caf50]/40 flex items-center justify-center shadow-inner">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white font-mono">
                  AGROGUARD
                </span>
                <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-[#16432b] text-[#a5d6a7] border border-[#2e7d32]">
                  Central Hub
                </span>
              </div>
              <p className="text-xs text-[#a3b899] hidden sm:block">
                Smart Autonomous Crop Storage Monitoring System
              </p>
            </div>
          </div>

          {/* Central status: Head Unit & Rovers */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-[#c2d6b8]">
            <div className="flex items-center gap-1.5 bg-[#143924] px-3 py-1.5 rounded-md border border-[#1e5234]">
              <span className={`w-2 h-2 rounded-full ${headUnitOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="font-medium text-white">Head Unit Gateway:</span>
              <span className="text-[#a5d6a7]">Online (LoRaWAN + 4G)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#143924] px-3 py-1.5 rounded-md border border-[#1e5234]">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>4 Mobile Rovers Active</span>
            </div>
          </div>

          {/* Right controls: Prototype Simulation Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setSimMenuOpen(!simMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-[#1d4d31] hover:bg-[#25633e] text-white border border-[#337a4e] transition-colors"
                aria-expanded={simMenuOpen}
                aria-label="Toggle simulation event controls"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Demo Scenarios</span>
                <span className="sm:hidden">Demo</span>
              </button>

              {simMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white text-slate-800 shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Prototype Testing Engine
                    </span>
                    <button
                      type="button"
                      onClick={() => setSimMenuOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                      aria-label="Close menu"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Inject realistic warehouse incidents to test AGROGUARD autonomous detection, alerts & AI advice:
                  </p>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        triggerAnomaly('hotspot');
                        setSimMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-between"
                    >
                      <span className="font-medium">1. Simulate Thermal Hotspot (B1)</span>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerAnomaly('moisture_spike');
                        setSimMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-between"
                    >
                      <span className="font-medium">2. Simulate Rain Ingress (A1)</span>
                      <Activity className="w-3.5 h-3.5 text-blue-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerAnomaly('pest_outbreak');
                        setSimMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-red-50 text-red-900 border border-red-200 flex items-center justify-between"
                    >
                      <span className="font-medium">3. Simulate Pest Influx (C1)</span>
                      <Zap className="w-3.5 h-3.5 text-red-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerAnomaly('reset');
                        setSimMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-between mt-2"
                    >
                      <span className="font-medium">Reset to Baseline Storage</span>
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Live Autonomous Ticker</span>
                    <button
                      type="button"
                      onClick={() => setSimulationActive(!simulationActive)}
                      className={`font-semibold ${simulationActive ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                      {simulationActive ? 'Active (4s loop)' : 'Paused'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-[#a3b899] hover:text-white hover:bg-[#143924]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1 border-t border-[#1b432d]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#215a37] text-white shadow-sm border border-[#388554]'
                    : 'text-[#c2d6b8] hover:text-white hover:bg-[#143924]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#a5d6a7]' : 'text-[#87a77b]'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-900">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1b432d] bg-[#0c2417] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-[#215a37] text-white'
                    : 'text-[#c2d6b8] hover:bg-[#143924]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#a5d6a7]" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-900">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-3 border-t border-[#1b432d] text-xs text-[#a3b899] flex items-center justify-between">
            <span>Head Unit Gateway: Online</span>
            <span>4 Rovers Operating</span>
          </div>
        </div>
      )}
    </header>
  );
};
