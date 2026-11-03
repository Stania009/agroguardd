/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CropType,
  ZoneData,
  RoverUnit,
  AlertItem,
  AiInsight,
  SystemSettings,
  SensorModuleType,
} from '../types/agro';
import { evaluateZoneHealth, generateAiDiagnosis, CROP_STANDARDS } from '../utils/agroRules';

interface AgroContextType {
  zones: ZoneData[];
  rovers: RoverUnit[];
  alerts: AlertItem[];
  insights: AiInsight[];
  settings: SystemSettings;
  headUnitOnline: boolean;
  simulationActive: boolean;
  activeTab: string;
  selectedZoneId: string | null;
  selectedCropFilter: CropType | 'all';
  setActiveTab: (tab: string) => void;
  setSelectedZoneId: (id: string | null) => void;
  setSelectedCropFilter: (crop: CropType | 'all') => void;
  setSimulationActive: (active: boolean) => void;
  dispatchRoverToZone: (roverId: string, targetZoneId: string) => void;
  toggleAerationFan: (zoneId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  swapRoverSensor: (roverId: string, newModule: SensorModuleType) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  triggerAnomaly: (type: 'hotspot' | 'moisture_spike' | 'pest_outbreak' | 'reset') => void;
}

const AgroContext = createContext<AgroContextType | undefined>(undefined);

const INITIAL_ZONES: ZoneData[] = [
  {
    id: 'A1',
    name: 'Bin A1 – North Silo',
    crop: 'rice',
    variety: 'IR-64 Long Grain Paddy',
    capacityTonnes: 350,
    currentStockTonnes: 320,
    temp: 21.4,
    humidity: 58.2,
    moisture: 12.8,
    co2: 520,
    spoilageGas: 8,
    pestActivity: 6,
    fireRisk: false,
    status: 'normal',
    assignedRoverId: 'BODY-01',
    aerationFanActive: false,
    lastUpdated: '12s ago',
    x: 20,
    y: 28,
  },
  {
    id: 'A2',
    name: 'Bin A2 – East Silo',
    crop: 'rice',
    variety: 'Pusa 1121 Basmati',
    capacityTonnes: 300,
    currentStockTonnes: 285,
    temp: 24.6,
    humidity: 68.5,
    moisture: 13.9,
    co2: 680,
    spoilageGas: 22,
    pestActivity: 14,
    fireRisk: false,
    status: 'warning',
    assignedRoverId: 'BODY-02',
    aerationFanActive: false,
    lastUpdated: '8s ago',
    x: 48,
    y: 28,
  },
  {
    id: 'B1',
    name: 'Bin B1 – Central Silo 1',
    crop: 'wheat',
    variety: 'Amber Durum Hard Wheat',
    capacityTonnes: 450,
    currentStockTonnes: 410,
    temp: 19.8,
    humidity: 53.0,
    moisture: 12.1,
    co2: 490,
    spoilageGas: 6,
    pestActivity: 4,
    fireRisk: false,
    status: 'normal',
    assignedRoverId: undefined,
    aerationFanActive: false,
    lastUpdated: '25s ago',
    x: 76,
    y: 28,
  },
  {
    id: 'B2',
    name: 'Bin B2 – Central Silo 2',
    crop: 'maize',
    variety: 'Pioneer Yellow Feed Maize',
    capacityTonnes: 400,
    currentStockTonnes: 390,
    temp: 28.2,
    humidity: 74.5,
    moisture: 15.4,
    co2: 1340,
    spoilageGas: 48,
    pestActivity: 36,
    fireRisk: false,
    status: 'critical',
    assignedRoverId: 'BODY-03',
    aerationFanActive: true,
    lastUpdated: 'Just now',
    x: 20,
    y: 72,
  },
  {
    id: 'C1',
    name: 'Vault C1 – South Bay',
    crop: 'pulses',
    variety: 'Desi Chickpeas & Split Red Lentils',
    capacityTonnes: 250,
    currentStockTonnes: 215,
    temp: 18.6,
    humidity: 49.0,
    moisture: 11.2,
    co2: 430,
    spoilageGas: 4,
    pestActivity: 2,
    fireRisk: false,
    status: 'normal',
    assignedRoverId: undefined,
    aerationFanActive: false,
    lastUpdated: '1m ago',
    x: 48,
    y: 72,
  },
  {
    id: 'C2',
    name: 'Vault C2 – West Reserve',
    crop: 'seeds',
    variety: 'High-Oleic Sunflower Seeds',
    capacityTonnes: 200,
    currentStockTonnes: 180,
    temp: 17.2,
    humidity: 44.0,
    moisture: 9.1,
    co2: 410,
    spoilageGas: 3,
    pestActivity: 1,
    fireRisk: false,
    status: 'normal',
    assignedRoverId: 'BODY-04',
    aerationFanActive: false,
    lastUpdated: '2m ago',
    x: 76,
    y: 72,
  },
];

const INITIAL_ROVERS: RoverUnit[] = [
  {
    id: 'BODY-01',
    name: 'Body 1 (Alpha Patrol)',
    currentZoneId: 'A1',
    status: 'patrolling',
    batteryPct: 86,
    signalDbm: -56,
    installedModule: 'spear_probe',
    firmwareVersion: 'v2.8.4',
    lastPing: '12s ago',
    totalPatrolKm: 18.4,
    activeErrors: [],
  },
  {
    id: 'BODY-02',
    name: 'Body 2 (Beta Acoustic)',
    currentZoneId: 'A2',
    status: 'sampling',
    batteryPct: 74,
    signalDbm: -62,
    installedModule: 'acoustic_pest',
    firmwareVersion: 'v2.8.4',
    lastPing: '8s ago',
    totalPatrolKm: 24.1,
    activeErrors: [],
  },
  {
    id: 'BODY-03',
    name: 'Body 3 (Gamma NDIR Hotspot)',
    currentZoneId: 'B2',
    status: 'inspecting',
    batteryPct: 92,
    signalDbm: -51,
    installedModule: 'multigas_ndir',
    firmwareVersion: 'v2.8.4',
    lastPing: 'Just now',
    totalPatrolKm: 34.6,
    activeErrors: [],
  },
  {
    id: 'BODY-04',
    name: 'Body 4 (Delta Optical)',
    currentZoneId: 'C2',
    status: 'docked',
    batteryPct: 100,
    signalDbm: -48,
    installedModule: 'optical_grade',
    firmwareVersion: 'v2.8.4',
    lastPing: '2m ago',
    totalPatrolKm: 12.0,
    activeErrors: [],
  },
];

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-101',
    zoneId: 'B2',
    roverId: 'BODY-03',
    severity: 'critical',
    type: 'temperature',
    title: 'Thermal Hotspot & High Moisture in Maize Silo',
    description: 'Core bulk temperature jumped to 28.2°C with grain moisture at 15.4% and CO₂ at 1,340 ppm. Severe risk of rapid fungal colonization.',
    detectedValue: '28.2°C / 15.4% / 1340 ppm',
    thresholdValue: 'Max Safe: 23.0°C / 14.0%',
    detectedAt: 'Today, 08:14 AM',
    recommendedAction: 'Keep primary high-volume aeration fan running; Body 3 commanded to probe deeper core perimeter.',
    status: 'active',
  },
  {
    id: 'ALT-102',
    zoneId: 'B2',
    roverId: 'BODY-03',
    severity: 'warning',
    type: 'pest',
    title: 'Acoustic Pest Index Spike',
    description: 'Body 2 acoustic insect microphone detected 36 micro-vibrations/hr (Maize Weevil Sitophilus zeamais acoustic signature).',
    detectedValue: '36 events/hr',
    thresholdValue: 'Threshold: 25 events/hr',
    detectedAt: 'Today, 07:50 AM',
    recommendedAction: 'Deploy localized pheromone trap and review grain sampling camera photos in Zone B2.',
    status: 'active',
  },
  {
    id: 'ALT-103',
    zoneId: 'A2',
    roverId: 'BODY-02',
    severity: 'warning',
    type: 'moisture',
    title: 'Moisture Boundary Drift in Basmati Rice',
    description: 'Grain moisture reached 13.9% with headspace relative humidity at 68.5%. Upper roof hatch seal may have condensation leak.',
    detectedValue: '13.9% Moisture (68.5% RH)',
    thresholdValue: 'Ideal Max: 13.5%',
    detectedAt: 'Today, 06:30 AM',
    recommendedAction: 'Engage low-velocity aeration fans in Zone A2 during dry daytime hours; inspect bin inspection hatch.',
    status: 'acknowledged',
  },
  {
    id: 'ALT-104',
    zoneId: 'B1',
    roverId: 'BODY-01',
    severity: 'info',
    type: 'moisture',
    title: 'Durum Wheat Stability Verified',
    description: 'Zone B1 passed autonomous multi-point spear probe inspection with uniform 12.1% moisture across all depths.',
    detectedValue: '12.1% Moisture / 19.8°C',
    thresholdValue: 'Safe Range: 11.5% - 13.0%',
    detectedAt: 'Yesterday, 04:15 PM',
    recommendedAction: 'No action required. Next scheduled autonomous rover inspection in 12 hours.',
    status: 'resolved',
  },
];

const INITIAL_INSIGHTS: AiInsight[] = [
  {
    id: 'INS-01',
    zoneId: 'B2',
    crop: 'maize',
    riskTitle: 'Imminent Hotspot Self-Heating (Maize)',
    riskLevel: 'critical',
    confidence: 96,
    predictionSummary: 'Without ongoing aeration, internal temperature is forecast to climb to 32°C within 36 hours due to thermophilic mold activity.',
    safeStorageLifeEstimate: 'Critical: 3 weeks remaining (was 40 weeks)',
    scientificRationale: 'At 15.4% grain moisture and 74.5% RH, equilibrium moisture content supports rapid vegetative growth of Aspergillus and Penicillium. Fungal respiration releases metabolic heat and water, creating an accelerating self-heating hotspot loop.',
    recommendedAction: '1. Keep forced-air bottom aeration active for 8 hours.\n2. Dispatch Body 3 for 3D temperature gradient mapping.\n3. Turn or transfer top 15% grain layer if temperature does not decline below 25°C by tomorrow morning.',
    impactIfIgnored: 'Estimated potential loss of $18,400 from grain caking, nutrient degradation, and mycotoxin rejection.',
  },
  {
    id: 'INS-02',
    zoneId: 'A2',
    crop: 'rice',
    riskTitle: 'Basmati Rice Yellowing & Breakage Risk',
    riskLevel: 'moderate',
    confidence: 88,
    predictionSummary: 'Moisture drift (13.9%) threatens premium aroma profile and increases kernel fissuring if subjected to rapid temperature changes.',
    safeStorageLifeEstimate: 'Moderate: 18 weeks safe storage',
    scientificRationale: 'Pusa 1121 Basmati grains are fragile. If grain moisture exceeds 13.5% at ambient temps above 24°C, enzymatic oxidation causes grain discoloration and milling loss of up to 8%.',
    recommendedAction: 'Initiate gentle 1.2 m³/min aeration with dry ambient air. Avoid high-heat drying to preserve delicate 2-acetyl-1-pyrroline aroma compounds.',
    impactIfIgnored: 'Downgrading from export-grade basmati to domestic broken stock ($120/Tonne price drop).',
  },
  {
    id: 'INS-03',
    zoneId: 'C1',
    crop: 'pulses',
    riskTitle: 'Optimal Preservation State (Chickpeas)',
    riskLevel: 'low',
    confidence: 98,
    predictionSummary: 'Low moisture (11.2%) and low temperature (18.6°C) maintain seed germination viability above 95%.',
    safeStorageLifeEstimate: 'Excellent: > 52 weeks safe storage',
    scientificRationale: 'Acoustic sensors indicate insect inactivity. Respiration rate is near baseline dormancy. CO₂ remains stable at 430 ppm.',
    recommendedAction: 'Maintain current sealed bin configuration. Autonomous rover scheduled for routine perimeter check every 48 hours.',
    impactIfIgnored: 'N/A – Crop condition is safe.',
  },
];

const INITIAL_SETTINGS: SystemSettings = {
  patrolIntervalMinutes: 60,
  autoAerationEnabled: true,
  autoAerationMoistureTrigger: 14.0,
  autoAerationTempTrigger: 24.5,
  smsAlerts: true,
  smsRecipient: '+1 (555) 392-4821',
  whatsappAlerts: true,
  sirenRelayEnabled: true,
  meshFrequency: '868.1 MHz (LoRa Sub-GHz)',
  cloudSyncIntervalSec: 15,
  ambientTempC: 22.8,
  ambientHumidityPct: 52.0,
};

export const AgroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zones, setZones] = useState<ZoneData[]>(INITIAL_ZONES);
  const [rovers, setRovers] = useState<RoverUnit[]>(INITIAL_ROVERS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [insights, setInsights] = useState<AiInsight[]>(INITIAL_INSIGHTS);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [headUnitOnline] = useState<boolean>(true);
  const [simulationActive, setSimulationActive] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedCropFilter, setSelectedCropFilter] = useState<CropType | 'all'>('all');

  // Simulation timer: updates live rovers, slight sensor telemetry fluctuations, and battery
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      // 1. Slightly jitter zone readings for realism
      setZones((prev) =>
        prev.map((zone) => {
          const tempJitter = (Math.random() - 0.5) * 0.1;
          const humidityJitter = (Math.random() - 0.5) * 0.2;
          const moistureJitter = (Math.random() - 0.5) * 0.05;
          const co2Jitter = Math.round((Math.random() - 0.5) * 6);

          // If aeration fan is active, gradually cool and dry zone
          let newTemp = zone.temp + tempJitter;
          let newMoist = zone.moisture + moistureJitter;
          if (zone.aerationFanActive) {
            newTemp = Math.max(18, newTemp - 0.08);
            newMoist = Math.max(11, newMoist - 0.03);
          }

          const evaluatedStatus = evaluateZoneHealth(
            zone.crop,
            newTemp,
            zone.humidity + humidityJitter,
            newMoist,
            zone.co2 + co2Jitter,
            zone.pestActivity,
            zone.spoilageGas,
            zone.fireRisk
          );

          return {
            ...zone,
            temp: parseFloat(newTemp.toFixed(1)),
            humidity: parseFloat((zone.humidity + humidityJitter).toFixed(1)),
            moisture: parseFloat(newMoist.toFixed(1)),
            co2: Math.max(350, zone.co2 + co2Jitter),
            status: evaluatedStatus,
            lastUpdated: 'Just now',
          };
        })
      );

      // 2. Rover movements / battery status
      setRovers((prev) =>
        prev.map((rover) => {
          if (rover.status === 'docked') {
            return {
              ...rover,
              batteryPct: Math.min(100, rover.batteryPct + 1),
              lastPing: 'Just now',
            };
          }
          // Slow battery discharge while patrolling/sampling
          return {
            ...rover,
            batteryPct: Math.max(15, rover.batteryPct - (Math.random() > 0.8 ? 1 : 0)),
            lastPing: 'Just now',
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [simulationActive]);

  const dispatchRoverToZone = useCallback((roverId: string, targetZoneId: string) => {
    setRovers((prev) =>
      prev.map((r) =>
        r.id === roverId
          ? {
              ...r,
              currentZoneId: targetZoneId,
              status: 'inspecting',
              lastPing: 'Just now',
            }
          : r
      )
    );

    setZones((prev) =>
      prev.map((z) => ({
        ...z,
        assignedRoverId: z.id === targetZoneId ? roverId : z.assignedRoverId === roverId ? undefined : z.assignedRoverId,
      }))
    );
  }, []);

  const toggleAerationFan = useCallback((zoneId: string) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === zoneId ? { ...z, aerationFanActive: !z.aerationFanActive } : z
      )
    );
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'acknowledged' } : a))
    );
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved' } : a))
    );
  }, []);

  const swapRoverSensor = useCallback((roverId: string, newModule: SensorModuleType) => {
    setRovers((prev) =>
      prev.map((r) => (r.id === roverId ? { ...r, installedModule: newModule } : r))
    );
  }, []);

  const updateSettings = useCallback((newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const triggerAnomaly = useCallback((type: 'hotspot' | 'moisture_spike' | 'pest_outbreak' | 'reset') => {
    if (type === 'reset') {
      setZones(INITIAL_ZONES);
      setAlerts(INITIAL_ALERTS);
      setRovers(INITIAL_ROVERS);
      return;
    }

    if (type === 'hotspot') {
      // Spike Zone B1 (Wheat) temperature to test sudden thermal runaway
      setZones((prev) =>
        prev.map((z) =>
          z.id === 'B1'
            ? {
                ...z,
                temp: 27.8,
                moisture: 14.8,
                co2: 1280,
                spoilageGas: 38,
                status: 'critical',
              }
            : z
        )
      );

      const newAlert: AlertItem = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        zoneId: 'B1',
        roverId: 'BODY-01',
        severity: 'critical',
        type: 'temperature',
        title: 'Thermal Spike Alert in Zone B1 (Wheat)',
        description: 'Zone B1 temperature rapidly climbed to 27.8°C with CO₂ spike to 1,280 ppm. Potential microbial respiration hotspot detected.',
        detectedValue: '27.8°C / 14.8% moisture',
        thresholdValue: 'Threshold: 22.0°C / 13.0%',
        detectedAt: 'Just now',
        recommendedAction: 'Engage Zone B1 aeration fans and dispatch Rover Body 1 to pinpoint hotspot depth.',
        status: 'active',
      };
      setAlerts((prev) => [newAlert, ...prev]);

      // Add AI diagnosis
      const diag = generateAiDiagnosis('B1', 'wheat', 27.8, 62, 14.8, 1280, 8);
      const newInsight: AiInsight = {
        id: `INS-${Date.now().toString().slice(-4)}`,
        zoneId: 'B1',
        crop: 'wheat',
        riskTitle: 'Rapid Heat Dissipation Required (Zone B1)',
        riskLevel: 'high',
        confidence: 93,
        predictionSummary: diag.summary,
        safeStorageLifeEstimate: 'Reduced to 6 weeks under thermal stress',
        scientificRationale: diag.rationale,
        recommendedAction: diag.recommendation,
        impactIfIgnored: 'Risk of grain kernel protein degradation and internal caking.',
      };
      setInsights((prev) => [newInsight, ...prev]);
    } else if (type === 'moisture_spike') {
      // Spike Zone A1 moisture
      setZones((prev) =>
        prev.map((z) =>
          z.id === 'A1'
            ? {
                ...z,
                moisture: 14.9,
                humidity: 78.0,
                status: 'critical',
              }
            : z
        )
      );
      const newAlert: AlertItem = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        zoneId: 'A1',
        roverId: 'BODY-01',
        severity: 'critical',
        type: 'moisture',
        title: 'Severe Moisture Ingress in Zone A1 (Paddy Rice)',
        description: 'Grain moisture spiked to 14.9% with 78% relative humidity. Immediate mold risk.',
        detectedValue: '14.9% Moisture (78% RH)',
        thresholdValue: 'Threshold: 13.5%',
        detectedAt: 'Just now',
        recommendedAction: 'Inspect external bin seams and initiate aeration immediately.',
        status: 'active',
      };
      setAlerts((prev) => [newAlert, ...prev]);
    } else if (type === 'pest_outbreak') {
      // Spike Zone C1 pest index
      setZones((prev) =>
        prev.map((z) =>
          z.id === 'C1'
            ? {
                ...z,
                pestActivity: 42,
                status: 'warning',
              }
            : z
        )
      );
      const newAlert: AlertItem = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        zoneId: 'C1',
        roverId: 'BODY-02',
        severity: 'warning',
        type: 'pest',
        title: 'Bruchid Beetle Acoustic Signature in Pulses Vault',
        description: 'Acoustic insect sensors registered 42 detection events/hour in Chickpeas vault.',
        detectedValue: '42 events/hr',
        thresholdValue: 'Safe: <15 events/hr',
        detectedAt: 'Just now',
        recommendedAction: 'Schedule CO₂ inert atmosphere flush or localized diatomaceous powder application.',
        status: 'active',
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  }, []);

  return (
    <AgroContext.Provider
      value={{
        zones,
        rovers,
        alerts,
        insights,
        settings,
        headUnitOnline,
        simulationActive,
        activeTab,
        selectedZoneId,
        selectedCropFilter,
        setActiveTab,
        setSelectedZoneId,
        setSelectedCropFilter,
        setSimulationActive,
        dispatchRoverToZone,
        toggleAerationFan,
        acknowledgeAlert,
        resolveAlert,
        swapRoverSensor,
        updateSettings,
        triggerAnomaly,
      }}
    >
      {children}
    </AgroContext.Provider>
  );
};

export function useAgro() {
  const context = useContext(AgroContext);
  if (!context) {
    throw new Error('useAgro must be used within an AgroProvider');
  }
  return context;
}
