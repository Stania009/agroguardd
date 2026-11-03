/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CropType, CropThreshold, ZoneHealth } from '../types/agro';

export const CROP_STANDARDS: Record<CropType, CropThreshold> = {
  rice: {
    crop: 'rice',
    name: 'Paddy Rice',
    category: 'Cereal Grain',
    idealMoistureMin: 12.0,
    idealMoistureMax: 13.5,
    criticalMoisture: 14.5,
    safeTempMax: 24.0,
    criticalTemp: 28.0,
    safeCo2Max: 650,
    criticalCo2: 1100,
    maxSafePestIndex: 20,
    safeStorageLifeMonths: 12,
    marketPricePerTonne: 420,
    storageGuidelines: 'Maintain moisture strictly below 14% to prevent Aspergillus flavus fungal growth and yellowing.',
    aerationNotes: 'Aerate with dry ambient air (relative humidity < 65%) during early mornings.',
  },
  wheat: {
    crop: 'wheat',
    name: 'Durum Wheat',
    category: 'Cereal Grain',
    idealMoistureMin: 11.5,
    idealMoistureMax: 13.0,
    criticalMoisture: 14.0,
    safeTempMax: 22.0,
    criticalTemp: 26.0,
    safeCo2Max: 700,
    criticalCo2: 1200,
    maxSafePestIndex: 18,
    safeStorageLifeMonths: 18,
    marketPricePerTonne: 310,
    storageGuidelines: 'Watch for grain borer and flour beetle multiplication when temperatures exceed 22°C.',
    aerationNotes: 'Equalize bin temperature profiles to prevent internal convection moisture condensation.',
  },
  maize: {
    crop: 'maize',
    name: 'Yellow Maize (Corn)',
    category: 'Coarse Grain',
    idealMoistureMin: 12.5,
    idealMoistureMax: 14.0,
    criticalMoisture: 15.0,
    safeTempMax: 23.0,
    criticalTemp: 27.5,
    safeCo2Max: 750,
    criticalCo2: 1300,
    maxSafePestIndex: 25,
    safeStorageLifeMonths: 10,
    marketPricePerTonne: 260,
    storageGuidelines: 'High respiration potential. Rapid heating can occur if moisture pockets exceed 15%.',
    aerationNotes: 'High-volume bottom-up aeration fans required to break core grain mass heat spots.',
  },
  pulses: {
    crop: 'pulses',
    name: 'Chickpeas & Lentils',
    category: 'Legumes',
    idealMoistureMin: 10.0,
    idealMoistureMax: 12.0,
    criticalMoisture: 13.0,
    safeTempMax: 20.0,
    criticalTemp: 25.0,
    safeCo2Max: 600,
    criticalCo2: 1000,
    maxSafePestIndex: 15,
    safeStorageLifeMonths: 15,
    marketPricePerTonne: 780,
    storageGuidelines: 'Extremely vulnerable to pulse beetle (Callosobruchus). Requires airtight or CO2-enriched storage.',
    aerationNotes: 'Gentle low-velocity aeration to avoid seed coat cracking and moisture absorption.',
  },
  seeds: {
    crop: 'seeds',
    name: 'Sunflower & Oilseeds',
    category: 'Oilseeds',
    idealMoistureMin: 8.0,
    idealMoistureMax: 9.5,
    criticalMoisture: 10.5,
    safeTempMax: 18.0,
    criticalTemp: 23.0,
    safeCo2Max: 550,
    criticalCo2: 950,
    maxSafePestIndex: 15,
    safeStorageLifeMonths: 9,
    marketPricePerTonne: 640,
    storageGuidelines: 'High oil content leads to oxidative rancidity and spontaneous heating if damp.',
    aerationNotes: 'Strict cooling regime; aerate to keep grain bulk temperature under 18°C.',
  },
};

/**
 * Evaluates the health status of a grain storage zone based on real-time sensors
 */
export function evaluateZoneHealth(
  crop: CropType,
  temp: number,
  humidity: number,
  moisture: number,
  co2: number,
  pestActivity: number,
  spoilageGas: number = 0,
  fireRisk: boolean = false
): ZoneHealth {
  if (fireRisk) return 'critical';

  const std = CROP_STANDARDS[crop] || CROP_STANDARDS.wheat;

  // Critical conditions
  if (
    moisture >= std.criticalMoisture ||
    temp >= std.criticalTemp ||
    co2 >= std.criticalCo2 ||
    pestActivity >= std.maxSafePestIndex * 2 ||
    spoilageGas >= 45
  ) {
    return 'critical';
  }

  // Warning conditions
  if (
    moisture > std.idealMoistureMax ||
    temp > std.safeTempMax ||
    co2 > std.safeCo2Max ||
    pestActivity > std.maxSafePestIndex ||
    humidity > 70 ||
    spoilageGas >= 20
  ) {
    return 'warning';
  }

  return 'normal';
}

/**
 * Calculates safe storage life in estimated weeks remaining
 */
export function calculateSafeStorageLifeWeeks(
  crop: CropType,
  temp: number,
  moisture: number
): number {
  const std = CROP_STANDARDS[crop] || CROP_STANDARDS.wheat;
  const baseWeeks = std.safeStorageLifeMonths * 4.3;

  // Temperature acceleration factor (rate doubles roughly every 5°C above standard)
  const tempDiff = Math.max(0, temp - std.safeTempMax);
  const tempFactor = Math.pow(1.5, tempDiff / 3);

  // Moisture acceleration factor
  const moistureDiff = Math.max(0, moisture - std.idealMoistureMax);
  const moistureFactor = Math.pow(1.8, moistureDiff);

  const totalDegradation = tempFactor * moistureFactor;
  const remainingWeeks = Math.max(1, Math.round(baseWeeks / totalDegradation));
  return Math.min(Math.round(baseWeeks), remainingWeeks);
}

/**
 * Calculates Fungal and Mycotoxin risk percentage (0 to 100%)
 */
export function calculateFungalRiskPct(
  crop: CropType,
  temp: number,
  humidity: number,
  moisture: number
): number {
  const std = CROP_STANDARDS[crop] || CROP_STANDARDS.wheat;

  let risk = 5; // baseline benign spore risk

  // Moisture impact
  if (moisture > std.criticalMoisture) {
    risk += 45;
  } else if (moisture > std.idealMoistureMax) {
    risk += 25;
  }

  // Humidity impact (relative humidity equilibrium)
  if (humidity >= 75) {
    risk += 35;
  } else if (humidity >= 65) {
    risk += 15;
  }

  // Temperature impact (optimal mold growth 25°C - 35°C)
  if (temp >= 25 && temp <= 38) {
    risk += 20;
  } else if (temp > std.safeTempMax) {
    risk += 10;
  }

  return Math.min(100, Math.max(0, Math.round(risk)));
}

/**
 * Generates an automated AI diagnosis & actionable recommendation
 */
export function generateAiDiagnosis(
  zoneId: string,
  crop: CropType,
  temp: number,
  humidity: number,
  moisture: number,
  co2: number,
  pestActivity: number
) {
  const std = CROP_STANDARDS[crop] || CROP_STANDARDS.wheat;
  const status = evaluateZoneHealth(crop, temp, humidity, moisture, co2, pestActivity);

  const reasons: string[] = [];
  const recommendations: string[] = [];

  if (moisture > std.idealMoistureMax) {
    reasons.push(
      `Grain moisture is ${moisture.toFixed(1)}% (safe target: ${std.idealMoistureMin}%-${std.idealMoistureMax}%).`
    );
    recommendations.push(
      `Engage Zone ${zoneId} aeration fans for 4-6 hours during dry night or low-RH morning air.`
    );
  }

  if (temp > std.safeTempMax) {
    reasons.push(
      `Core temperature elevated at ${temp.toFixed(1)}°C (threshold: ${std.safeTempMax}°C), indicating microbial respiration.`
    );
    recommendations.push(
      `Dispatch mobile rover to take deep spear measurements at 1.5m and 3m depths to pinpoint hotspot core.`
    );
  }

  if (pestActivity > std.maxSafePestIndex) {
    reasons.push(
      `Acoustic sensor detected ${pestActivity} micro-vibration events/hr, signaling active insect feeding.`
    );
    recommendations.push(
      `Inspect grain surface in Zone ${zoneId} and schedule localized biological or phosphine fumigation.`
    );
  }

  if (co2 > std.safeCo2Max) {
    reasons.push(
      `CO₂ accumulation at ${co2} ppm exceeds safe ceiling (${std.safeCo2Max} ppm), pointing to localized fermentation.`
    );
    recommendations.push(
      `Exhaust air headspace and inspect lower bin cone for wet grain compaction.`
    );
  }

  if (reasons.length === 0) {
    return {
      status,
      summary: `Storage conditions for ${std.name} in Zone ${zoneId} are optimal.`,
      recommendation: 'Maintain standard autonomous patrol routine. Keep silo sealed against external moisture ingress.',
      rationale: `Moisture (${moisture}%), temperature (${temp}°C), and CO₂ (${co2}ppm) remain securely within safe thresholds for ${std.name}.`,
    };
  }

  return {
    status,
    summary: reasons.join(' '),
    recommendation: recommendations.join(' '),
    rationale: `When moisture exceeds ${std.idealMoistureMax}% or temperature exceeds ${std.safeTempMax}°C, grain equilibrium moisture content (EMC) shifts, creating micro-climates where mold (Aspergillus) and insects thrive exponentially.`,
  };
}
