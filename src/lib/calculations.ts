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