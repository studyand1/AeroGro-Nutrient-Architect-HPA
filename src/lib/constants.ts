import { GrowthStage } from "@/store/nutrientStore";
export const EC_TO_PPM_FACTOR = 700;
export const DEFAULT_GROWTH_STAGES: GrowthStage[] = [
  {
    name: "Seedling",
    ec: { min: 0.6, max: 0.8 },
    ph: { min: 5.5, max: 6.0 },
  },
  {
    name: "Vegetative",
    ec: { min: 1.2, max: 1.6 },
    ph: { min: 5.5, max: 6.0 },
  },
  {
    name: "Mature",
    ec: { min: 1.4, max: 1.8 },
    ph: { min: 5.8, max: 6.2 },
  },
];
export const DEFICIENCY_GUIDE_ITEMS = [
    {
        symptom: "Yellowing of older, lower leaves (chlorosis)",
        possibleCause: "Nitrogen (N) deficiency",
        action: "Ensure nitrate levels are adequate. Top up with a balanced A/B solution. Nitrogen is mobile, so plants move it from old to new growth."
    },
    {
        symptom: "Stunted growth, dark green or purplish discoloration on leaves",
        possibleCause: "Phosphorus (P) deficiency",
        action: "Check pH; P is less available at high pH. Ensure Fertilizer A (containing P2O5) is dosed correctly. Note that phosphoric acid used for pH down also adds P."
    },
    {
        symptom: "Yellowing/browning on leaf edges/tips, weak stems",
        possibleCause: "Potassium (K) deficiency",
        action: "Verify correct dosage of Fertilizer A (high in K2O). K is crucial for water regulation and enzyme activation."
    },
    {
        symptom: "Stunted growth, blossom end rot in fruiting plants, deformed new leaves",
        possibleCause: "Calcium (Ca) deficiency",
        action: "Ensure Fertilizer B (high in Ca) is used. Ca is immobile, so symptoms appear on new growth. Avoid excessive K, which can compete with Ca uptake."
    },
    {
        symptom: "Interveinal chlorosis (yellowing between veins) on older leaves",
        possibleCause: "Magnesium (Mg) deficiency",
        action: "Both Fertilizer A and B contain Mg. Check dosages. Mg is a core component of chlorophyll."
    },
    {
        symptom: "Interveinal chlorosis on new, young leaves",
        possibleCause: "Iron (Fe) deficiency",
        action: "Check pH; Iron is unavailable at high pH (>6.5). Ensure chelated iron (EDTA-Fe) is present in Fertilizer A. Iron is immobile."
    }
];