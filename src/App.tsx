/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AgroProvider, useAgro } from './context/AgroContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { LiveMonitoringView } from './components/LiveMonitoringView';
import { StorageMapView } from './components/StorageMapView';
import { AlertsView } from './components/AlertsView';
import { AiInsightsView } from './components/AiInsightsView';
import { CropSensorView } from './components/CropSensorView';
import { ReportsHistoryView } from './components/ReportsHistoryView';
import { SettingsView } from './components/SettingsView';
import { Cpu, Radio, ShieldCheck, ArrowRight } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useAgro();

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'monitoring' && <LiveMonitoringView />}
        {activeTab === 'map' && <StorageMapView />}
        {activeTab === 'alerts' && <AlertsView />}
        {activeTab === 'ai' && <AiInsightsView />}
        {activeTab === 'crops' && <CropSensorView />}
        {activeTab === 'reports' && <ReportsHistoryView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Clean Informational Footer showing the AGROGUARD Complete Workflow */}
      <footer className="bg-white border-t border-[#e2ddd0] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 font-mono">AGROGUARD</span>
              <span>· Autonomous Multi-Crop Storage Monitoring</span>
            </div>

            {/* Workflow steps */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
              <span className="text-emerald-800 font-semibold">1. Sensor Collection</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>2. Wireless Mesh</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>3. Data Processing</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-800 font-semibold">4. AI Risk Analysis</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>5. Location Alerts</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-800 font-semibold">6. Farmer Preventive Action</span>
            </div>

            <div className="text-[11px] text-slate-400">
              Central Head Unit v3.4 · 4 Connected Rovers
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AgroProvider>
      <MainContent />
    </AgroProvider>
  );
}
