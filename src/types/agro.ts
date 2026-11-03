/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CropType = 'rice' | 'wheat' | 'maize' | 'pulses' | 'seeds';

export type ZoneHealth = 'normal' | 'warning' | 'critical';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertType = 'moisture' | 'temperature' | 'pest' | 'fungal' | 'gas' | 'fire';

export type RoverStatus = 'patrolling' | 'inspecting' | 'docked' | 'sampling';

export type SensorModuleType =
  | 'spear_probe'       // Deep grain spear temperature & moisture
  | 'acoustic_pest'      // Ultrasonic & acoustic insect activity
  | 'optical_grade'      // Grain color, weevil detection & mold
  | 'multigas_ndir';     // CO2, Phosphine, Ethylene, TVOC

export interface CropThreshold {
  crop: CropType;
  name: string;
  category: string;
  idealMoistureMin: number; // e.g. 11.5%
  idealMoistureMax: number; // e.g. 13.5%
  criticalMoisture: number; // e.g. 14.5%
  safeTempMax: number;      // e.g. 24°C
  criticalTemp: number;     // e.g. 28°C
  safeCo2Max: number;       // e.g. 700 ppm
  criticalCo2: number;      // e.g. 1200 ppm
  maxSafePestIndex: number; // 0-100 scale, >25 is warning
  safeStorageLifeMonths: number;
  marketPricePerTonne: number; // USD / Tonne
  storageGuidelines: string;
  aerationNotes: string;
}

export interface ZoneData {
  id: string; // 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'
  name: string;
  crop: CropType;
  variety: string;
  capacityTonnes: number;
  currentStockTonnes: number;
  temp: number;          // °C
  humidity: number;      // % RH
  moisture: number;      // % grain moisture
  co2: number;           // ppm
  spoilageGas: number;   // ppm (TVOC / Ethylene)
  pestActivity: number;  // 0-100 activity index
  fireRisk: boolean;
  status: ZoneHealth;
  assignedRoverId?: string;
  aerationFanActive: boolean;
  lastUpdated: string;
  x: number;             // Map coordinate %
  y: number;
}

export interface RoverUnit {
  id: string;            // 'BODY-01'
  name: string;
  currentZoneId: string;
  status: RoverStatus;
  batteryPct: number;
  signalDbm: number;     // -40 to -90 dBm
  installedModule: SensorModuleType;
  firmwareVersion: string;
  lastPing: string;
  totalPatrolKm: number;
  activeErrors: string[];
}

export interface AlertItem {
  id: string;
  zoneId: string;
  roverId?: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  description: string;
  detectedValue: string;
  thresholdValue: string;
  detectedAt: string;
  recommendedAction: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface AiInsight {
  id: string;
  zoneId: string;
  crop: CropType;
  riskTitle: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number; // e.g. 94%
  predictionSummary: string;
  safeStorageLifeEstimate: string;
  scientificRationale: string;
  recommendedAction: string;
  impactIfIgnored: string;
}

export interface SystemSettings {
  patrolIntervalMinutes: number;
  autoAerationEnabled: boolean;
  autoAerationMoistureTrigger: number;
  autoAerationTempTrigger: number;
  smsAlerts: boolean;
  smsRecipient: string;
  whatsappAlerts: boolean;
  sirenRelayEnabled: boolean;
  meshFrequency: string;
  cloudSyncIntervalSec: number;
  ambientTempC: number;
  ambientHumidityPct: number;
}
