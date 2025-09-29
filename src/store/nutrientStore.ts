import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { DEFAULT_GROWTH_STAGES, EC_TO_PPM_FACTOR } from '@/lib/constants';
export interface Fertilizer {
  totalN: number;
  nitrateN: number;
  p2o5: number;
  k2o: number;
  mgO: number;
  ca: number;
  s: number;
  fe: number;
  mn: number;
  zn: number;
  cu: number;
  b: number;
  mo: number;
}
export interface GrowthStage {
  name: string;
  ec: { min: number; max: number };
  ph: { min: number; max: number };
}
export interface NutrientState {
  fertilizerA: Fertilizer;
  fertilizerB: Fertilizer;
  growthStages: GrowthStage[];
  ecToPpmFactor: number;
  abRatio: number;
  currentEC: number;
  currentPH: number;
  tankVolume: number;
  phChangePerMlPerL: number; // New state for pH correction factor
}
export interface NutrientActions {
  setFertilizerA: (fertilizer: Partial<Fertilizer>) => void;
  setFertilizerB: (fertilizer: Partial<Fertilizer>) => void;
  setGrowthStage: (index: number, stage: GrowthStage) => void;
  setEcToPpmFactor: (factor: number) => void;
  setAbRatio: (ratio: number) => void;
  setCurrentEC: (ec: number) => void;
  setCurrentPH: (ph: number) => void;
  setTankVolume: (volume: number) => void;
  setPhChangePerMlPerL: (factor: number) => void; // New action
}
const initialFertilizerA: Fertilizer = {
  totalN: 15, nitrateN: 8, p2o5: 8, k2o: 30, mgO: 3, ca: 0, s: 0,
  fe: 0.5, mn: 0.2, zn: 0.2, cu: 0.01, b: 0.1, mo: 0.01,
};
const initialFertilizerB: Fertilizer = {
  totalN: 13, nitrateN: 13, p2o5: 0, k2o: 0, mgO: 6, ca: 16, s: 0,
  fe: 0, mn: 0, zn: 0, cu: 0, b: 0, mo: 0,
};
export const useNutrientStore = create<NutrientState & NutrientActions>()(
  persist(
    immer((set) => ({
      // State
      fertilizerA: initialFertilizerA,
      fertilizerB: initialFertilizerB,
      growthStages: DEFAULT_GROWTH_STAGES,
      ecToPpmFactor: EC_TO_PPM_FACTOR,
      abRatio: 1,
      currentEC: 1.4,
      currentPH: 6.3,
      tankVolume: 100,
      phChangePerMlPerL: 0.1, // Default value for the new factor
      // Actions
      setFertilizerA: (fertilizer) => set((state) => {
        state.fertilizerA = { ...state.fertilizerA, ...fertilizer };
      }),
      setFertilizerB: (fertilizer) => set((state) => {
        state.fertilizerB = { ...state.fertilizerB, ...fertilizer };
      }),
      setGrowthStage: (index, stage) => set((state) => {
        if (state.growthStages[index]) {
          state.growthStages[index] = stage;
        }
      }),
      setEcToPpmFactor: (factor) => set({ ecToPpmFactor: factor }),
      setAbRatio: (ratio) => set({ abRatio: ratio }),
      setCurrentEC: (ec) => set({ currentEC: ec }),
      setCurrentPH: (ph) => set({ currentPH: ph }),
      setTankVolume: (volume) => set({ tankVolume: volume }),
      setPhChangePerMlPerL: (factor) => set({ phChangePerMlPerL: factor }),
    })),
    {
      name: 'aerogro-nutrient-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);