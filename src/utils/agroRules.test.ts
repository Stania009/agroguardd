/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CROP_STANDARDS,
  evaluateZoneHealth,
  calculateSafeStorageLifeWeeks,
  calculateFungalRiskPct,
  generateAiDiagnosis,
} from './agroRules';

test('CROP_STANDARDS defines valid baseline parameters for all 5 crops', () => {
  const crops = ['rice', 'wheat', 'maize', 'pulses', 'seeds'] as const;
  for (const crop of crops) {
    const std = CROP_STANDARDS[crop];
    assert.ok(std, `Crop ${crop} must have standards`);
    assert.ok(std.idealMoistureMin < std.idealMoistureMax);
    assert.ok(std.idealMoistureMax < std.criticalMoisture);
    assert.ok(std.safeTempMax < std.criticalTemp);
    assert.ok(std.safeCo2Max < std.criticalCo2);
    assert.ok(std.maxSafePestIndex > 0);
  }
});

test('evaluateZoneHealth returns normal under standard conditions', () => {
  const health = evaluateZoneHealth('wheat', 18, 55, 12.0, 500, 5, 5, false);
  assert.equal(health, 'normal');
});

test('evaluateZoneHealth returns warning when moisture exceeds ideal max', () => {
  const health = evaluateZoneHealth('wheat', 18, 55, 13.5, 500, 5, 5, false);
  assert.equal(health, 'warning');
});

test('evaluateZoneHealth returns critical when temperature or moisture passes critical thresholds', () => {
  const criticalTemp = evaluateZoneHealth('wheat', 27.5, 55, 12.0, 500, 5, 5, false);
  assert.equal(criticalTemp, 'critical');

  const criticalMoisture = evaluateZoneHealth('rice', 20, 60, 15.0, 500, 5, 5, false);
  assert.equal(criticalMoisture, 'critical');

  const fireHealth = evaluateZoneHealth('wheat', 20, 50, 12.0, 500, 0, 0, true);
  assert.equal(fireHealth, 'critical');
});

test('calculateSafeStorageLifeWeeks decreases when temperature and moisture rise', () => {
  const optimalWeeks = calculateSafeStorageLifeWeeks('maize', 18, 13.0);
  const stressedWeeks = calculateSafeStorageLifeWeeks('maize', 28, 15.5);
  assert.ok(
    stressedWeeks < optimalWeeks,
    `Stressed shelf life (${stressedWeeks}) should be significantly less than optimal (${optimalWeeks})`
  );
});

test('calculateFungalRiskPct scales proportionally with humidity and moisture', () => {
  const lowRisk = calculateFungalRiskPct('rice', 18, 50, 12.0);
  const highRisk = calculateFungalRiskPct('rice', 30, 80, 15.2);
  assert.ok(lowRisk < 25, `Low condition risk ${lowRisk} should be under 25%`);
  assert.ok(highRisk > 60, `High condition risk ${highRisk} should be above 60%`);
});

test('generateAiDiagnosis outputs actionable guidance when abnormal conditions exist', () => {
  const diagnosis = generateAiDiagnosis('B2', 'maize', 28.5, 75, 15.4, 1400, 35);
  assert.equal(diagnosis.status, 'critical');
  assert.ok(diagnosis.recommendation.length > 20);
  assert.ok(diagnosis.rationale.length > 20);
});
