/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAgro } from '../context/AgroContext';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle,
  Thermometer,
  Droplets,
  Bug,
  Flame,
  Activity,
  ShieldAlert,
  Clock,
  MapPin,
  Bot,
  Fan,
  Check,
  Filter,
  Send,
  MessageSquare,
  Volume2,
} from 'lucide-react';
import { AlertSeverity, AlertType } from '../types/agro';

export const AlertsView: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    dispatchRoverToZone,
    toggleAerationFan,
    setSelectedZoneId,
    setActiveTab,
  } = useAgro();

  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'temperature':
        return Thermometer;
      case 'moisture':
        return Droplets;
      case 'pest':
        return Bug;
      case 'gas':
        return Activity;
      case 'fire':
        return Flame;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Alert Counters & Notification Relays */}
      <div className="bg-white rounded-xl border border-[#e6e2d6] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#1e5234]" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Alerts & Automated Incident Center
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-sensor anomaly alerts: High moisture, thermal rise, pest acoustic activity, fungal spores, and gas leakage.
            </p>
          </div>

          {/* Broadcast Relays */}
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1.5 rounded-md border border-emerald-200 font-medium">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>SMS Relay: Active</span>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1.5 rounded-md border border-emerald-200 font-medium">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hub Siren: Armed</span>
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700">Severity:</span>
            <div className="flex gap-1">
              {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors capitalize ${
                    severityFilter === sev
                      ? 'bg-[#1e5234] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Status:</span>
            <div className="flex gap-1">
              {(['all', 'active', 'resolved'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors capitalize ${
                    statusFilter === st
                      ? 'bg-[#1e5234] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e6e2d6] p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching alerts</h3>
            <p className="text-xs text-slate-500 mt-1">
              All grain silos and monitoring parameters are currently operating within safe thresholds.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);

            let sevStyle = {
              badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              border: 'border-[#e6e2d6]',
              bg: 'bg-white',
              iconColor: 'text-emerald-700',
            };

            if (alert.severity === 'critical') {
              sevStyle = {
                badge: 'bg-red-100 text-red-900 border-red-300 font-bold',
                border: 'border-red-300 ring-2 ring-red-100',
                bg: 'bg-red-50/20',
                iconColor: 'text-red-700',
              };
            } else if (alert.severity === 'warning') {
              sevStyle = {
                badge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
                border: 'border-amber-300',
                bg: 'bg-amber-50/15',
                iconColor: 'text-amber-700',
              };
            }

            return (
              <div
                key={alert.id}
                className={`rounded-xl border p-5 shadow-sm transition-all ${sevStyle.border} ${sevStyle.bg}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Alert Details */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-lg border ${
                        alert.severity === 'critical'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : alert.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${sevStyle.badge}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {alert.id}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                          Zone {alert.zoneId}
                        </span>
                        {alert.roverId && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs text-slate-600 flex items-center gap-1">
                              <Bot className="w-3.5 h-3.5 text-[#1e5234]" />
                              Detected by {alert.roverId}
                            </span>
                          </>
                        )}
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {alert.detectedAt}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{alert.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                        {alert.description}
                      </p>

                      {/* Reading vs Threshold box */}
                      <div className="inline-flex items-center gap-3 bg-[#fcfbf7] px-3 py-1.5 rounded-md border border-[#e8e4d8] text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-sans">DETECTED VALUE</span>
                          <strong className="text-red-700">{alert.detectedValue}</strong>
                        </div>
                        <div className="border-l border-slate-200 pl-3">
                          <span className="text-[10px] text-slate-400 block font-sans">SAFE LIMIT</span>
                          <span className="text-slate-700">{alert.thresholdValue}</span>
                        </div>
                      </div>

                      {/* Recommended action box */}
                      <div className="p-3 rounded-lg bg-[#fcfbf7] border border-[#e8e4d8] text-xs text-slate-700 max-w-3xl">
                        <span className="font-bold text-emerald-950 block mb-0.5">
                          Recommended Farmer Action:
                        </span>
                        <span>{alert.recommendedAction}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
                    {alert.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    {alert.status !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleAerationFan(alert.zoneId)}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 flex items-center justify-center gap-1.5"
                    >
                      <Fan className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Toggle Zone Fan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedZoneId(alert.zoneId);
                        setActiveTab('map');
                      }}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-100 text-[#1e5234] border border-[#1e5234]/40 flex items-center justify-center gap-1.5"
                    >
                      <span>Locate on Map →</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
