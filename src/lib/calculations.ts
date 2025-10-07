export interface EmpiricalDosingResult {
  totalSolidsGrams: number;
  fertilizerAGrams: number;
  fertilizerBGrams: number;
}
export const calculateEmpiricalDosing = (
  tankVolumeL: number,
  targetEC: number,
  ecToPpmFactor: number,
  abRatio: number
): EmpiricalDosingResult => {
  if (tankVolumeL <= 0 || targetEC <= 0) {
    return { totalSolidsGrams: 0, fertilizerAGrams: 0, fertilizerBGrams: 0 };
  }
  const totalPpm = targetEC * ecToPpmFactor; // mg/L
  const totalSolidsGrams = (totalPpm * tankVolumeL) / 1000; // convert mg to g
  // Ratio is A:B, so if ratio is 1, it's 1:1. Total parts = 1 + 1 = 2.
  // If ratio is 0.5, it's 1:0.5. Total parts = 1 + 0.5 = 1.5.
  const totalParts = 1 + abRatio;
  const fertilizerAGrams = totalSolidsGrams / totalParts;
  const fertilizerBGrams = (totalSolidsGrams * abRatio) / totalParts;
  return {
    totalSolidsGrams: parseFloat(totalSolidsGrams.toFixed(2)),
    fertilizerAGrams: parseFloat(fertilizerAGrams.toFixed(2)),
    fertilizerBGrams: parseFloat(fertilizerBGrams.toFixed(2)),
  };
};
export interface AcidDilutionResult {
  acidVolume: number;
  waterVolume: number;
}
export const calculateAcidDilution = (
  initialConcentration: number,
  targetConcentration: number,
  finalVolume: number
): AcidDilutionResult => {
  if (initialConcentration <= 0 || targetConcentration <= 0 || finalVolume <= 0 || targetConcentration >= initialConcentration) {
    return { acidVolume: 0, waterVolume: 0 };
  }
  // Using V1C1 = V2C2
  const acidVolume = (finalVolume * targetConcentration) / initialConcentration;
  const waterVolume = finalVolume - acidVolume;
  return {
    acidVolume: parseFloat(acidVolume.toFixed(2)),
    waterVolume: parseFloat(waterVolume.toFixed(2)),
  };
};
export interface Decision {
  status: 'OK' | 'WARN' | 'DANGER';
  message: string;
  action: string;
}
export const getDecisionHelperAdvice = (
  currentEC: number,
  currentPH: number,
  targetEC: { min: number; max: number },
  targetPH: { min: number; max: number },
  tankVolume: number,
  ecToPpmFactor: number,
  abRatio: number,
  phChangePerMlPerL: number
): Decision => {
  const ecMidpoint = (targetEC.min + targetEC.max) / 2;
  const phMidpoint = (targetPH.min + targetPH.max) / 2;
  // pH checks
  if (currentPH > targetPH.max) {
    const phDifference = currentPH - phMidpoint;
    const acidVolumeMl = (phDifference / phChangePerMlPerL) * (tankVolume / 100); // Assuming factor is per 100L
    return {
      status: 'WARN',
      message: `pH is high (${currentPH}).`,
      action: `Add approximately ${acidVolumeMl.toFixed(1)} mL of diluted acid. This is an estimate; add slowly and re-measure.`,
    };
  }
  if (currentPH < targetPH.min) {
    return {
      status: 'WARN',
      message: `pH is low (${currentPH}).`,
      action: 'pH is low. This is less common. Consider adding pH Up or performing a partial water change if it persists.',
    };
  }
  // EC checks
  if (currentEC < targetEC.min) {
    const ecDeficit = ecMidpoint - currentEC;
    const { fertilizerAGrams, fertilizerBGrams } = calculateEmpiricalDosing(tankVolume, ecDeficit, ecToPpmFactor, abRatio);
    return {
      status: 'WARN',
      message: `EC is low (${currentEC} mS/cm). Plants may be underfed.`,
      action: `Top up nutrients. Add ${fertilizerAGrams}g of Fertilizer A and ${fertilizerBGrams}g of Fertilizer B to reach target EC.`,
    };
  }
  if (currentEC > targetEC.max) {
    const waterToAdd = tankVolume * (currentEC / ecMidpoint - 1);
    return {
      status: 'DANGER',
      message: `EC is high (${currentEC} mS/cm). Risk of root burn.`,
      action: `Dilute with fresh water. Add approximately ${waterToAdd.toFixed(1)} L of fresh water to lower EC to the target range.`,
    };
  }
  // All OK
  return {
    status: 'OK',
    message: 'System parameters are within optimal ranges.',
    action: 'Monitor and maintain current levels. No immediate action required.',
  };
};

/**
 * Calculates the required amount of A/B fertilizer to reach a target EC,
 * considering the initial EC of the water.
 * @param totalVolumeL - The total volume of the solution in liters.
 * @param targetEC - The target electrical conductivity in ms/cm.
 * @param initialEC - The initial electrical conductivity of the water in ms/cm.
 * @param ecContributionPerGram - The EC contribution per gram of A/B fertilizer per liter of water (in ms/cm).
 * @returns The total grams of A/B fertilizer required (A and B combined).
 */
export function calculatePreciseDosing(
  totalVolumeL: number,
  targetEC: number,
  initialEC: number,
  ecContributionPerGram: number = 0.466
): number {
  if (targetEC <= initialEC || totalVolumeL <= 0) {
    return 0;
  }

  const requiredECIncrease = targetEC - initialEC;
  const gramsPerLiter = requiredECIncrease / ecContributionPerGram;
  const totalGrams = gramsPerLiter * totalVolumeL;

  return parseFloat(totalGrams.toFixed(2));
}

export interface TopUpResult {
  waterToAdd: number;
  fertilizerToAdd: number;
}

/**
 * Calculates the water and fertilizer needed to top up an existing nutrient solution to a target volume and EC.
 * @param currentVolumeL - The current volume of the nutrient solution in liters.
 * @param currentEC - The current EC of the nutrient solution in ms/cm.
 * @param targetVolumeL - The target volume of the solution in liters.
 * @param targetEC - The target EC of the solution in ms/cm.
 * @param waterEC - The EC of the water being used for topping up in ms/cm.
 * @param ecContributionPerGram - The EC contribution per gram of A/B fertilizer per liter of water (in ms/cm).
 * @returns An object containing the amount of water and total A/B fertilizer to add.
 */
export function calculateTopUpDosing(
  currentVolumeL: number,
  currentEC: number,
  targetVolumeL: number,
  targetEC: number,
  waterEC: number,
  ecContributionPerGram: number = 0.466
): TopUpResult {
  if (targetVolumeL <= currentVolumeL) {
    return { waterToAdd: 0, fertilizerToAdd: 0 }; // Cannot top up to a smaller or equal volume
  }

  // Step 1: Calculate the total "EC units" from fertilizer in the current solution.
  // Total EC units = V * EC. We subtract the water's contribution to isolate the fertilizer's contribution.
  const fertilizerEC_in_current = currentEC - waterEC;
  const fertilizerUnits_in_current = fertilizerEC_in_current * currentVolumeL;

  // Step 2: Calculate the total "EC units" required from fertilizer in the target solution.
  const fertilizerEC_in_target = targetEC - waterEC;
  const fertilizerUnits_in_target = fertilizerEC_in_target * targetVolumeL;

  // Step 3: Calculate the additional "EC units" needed from new fertilizer.
  const requiredFertilizerUnits = fertilizerUnits_in_target - fertilizerUnits_in_current;

  if (requiredFertilizerUnits <= 0) {
    // This means the diluted solution will already be at or above the target EC.
    // No fertilizer is needed, only water.
    return {
      waterToAdd: parseFloat((targetVolumeL - currentVolumeL).toFixed(2)),
      fertilizerToAdd: 0,
    };
  }

  // Step 4: Convert the required "EC units" back to grams of fertilizer.
  // Required Units = (grams / targetVolumeL) * ecContributionPerGram * targetVolumeL
  // Required Units = grams * ecContributionPerGram
  const fertilizerToAdd = requiredFertilizerUnits / ecContributionPerGram;

  return {
    waterToAdd: parseFloat((targetVolumeL - currentVolumeL).toFixed(2)),
    fertilizerToAdd: parseFloat(fertilizerToAdd.toFixed(2)),
  };
}