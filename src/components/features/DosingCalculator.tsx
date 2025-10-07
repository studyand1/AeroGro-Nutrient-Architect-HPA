import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNutrientStore } from "@/store/nutrientStore";
import { calculateEmpiricalDosing, calculatePreciseDosing, calculateTopUpDosing } from "@/lib/calculations";
import { Calculator, FlaskConical, Beaker, Droplets, Plus, ChevronsRight } from "lucide-react";

interface PreciseDosingState {
  currentEC: number;
  currentVolume: number;
  targetVolume: number;
  targetEC: number;
  waterEC: number;
  ecContributionPerGram: number;
}

interface PreciseResult {
  waterToAdd: number;
  totalFertilizer: number;
  fertilizerA: number;
  fertilizerB: number;
}

export function DosingCalculator() {
  const { tankVolume, setTankVolume, growthStages, ecToPpmFactor, abRatio } = useNutrientStore();
  const [selectedStageIndex, setSelectedStageIndex] = useState<string>("1");
  const [result, setResult] = useState<{ a: number; b: number } | null>(null);

  const [preciseState, setPreciseState] = useState<PreciseDosingState>({
    currentEC: 0.4,
    currentVolume: 9.6,
    targetVolume: 17,
    targetEC: 1.6, // Default for vegetative stage
    waterEC: 0.086,
    ecContributionPerGram: 0.4823,
  });
  const [preciseResult, setPreciseResult] = useState<PreciseResult | null>(null);

  const handleEmpiricalCalculate = () => {
    const stage = growthStages[parseInt(selectedStageIndex, 10)];
    if (!stage) return;
    const targetEC = (stage.ec.min + stage.ec.max) / 2;
    const dosingResult = calculateEmpiricalDosing(tankVolume, targetEC, ecToPpmFactor, abRatio);
    setResult({ a: dosingResult.fertilizerAGrams, b: dosingResult.fertilizerBGrams });
    setPreciseResult(null);
  };

  const handlePreciseCalculate = () => {
    const { currentEC, currentVolume, targetVolume, targetEC, waterEC, ecContributionPerGram } = preciseState;

    // Scenario 1: First time setup (currentVolume is 0 or less)
    if (currentVolume <= 0) {
      const totalFertilizer = calculatePreciseDosing(targetVolume, targetEC, waterEC, ecContributionPerGram);
      const fertilizerA = totalFertilizer / 2;
      const fertilizerB = totalFertilizer / 2;
      setPreciseResult({
        waterToAdd: targetVolume,
        totalFertilizer: totalFertilizer,
        fertilizerA: parseFloat(fertilizerA.toFixed(2)),
        fertilizerB: parseFloat(fertilizerB.toFixed(2)),
      });
    } else {
      // Scenario 2: Topping up existing solution using the new, correct logic
      const { waterToAdd, fertilizerToAdd } = calculateTopUpDosing(
        currentVolume,
        currentEC,
        targetVolume,
        targetEC,
        waterEC,
        ecContributionPerGram
      );

      const fertilizerA = fertilizerToAdd / 2;
      const fertilizerB = fertilizerToAdd / 2;

      setPreciseResult({
        waterToAdd: waterToAdd,
        totalFertilizer: fertilizerToAdd,
        fertilizerA: parseFloat(fertilizerA.toFixed(2)),
        fertilizerB: parseFloat(fertilizerB.toFixed(2)),
      });
    }
    setResult(null);
  };

  const handlePreciseInputChange = (field: keyof PreciseDosingState, value: string) => {
    setPreciseState(prevState => ({
      ...prevState,
      [field]: parseFloat(value) || 0
    }));
  };
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-display">Nutrient Dosing Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="empirical" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="empirical">Standard</TabsTrigger>
            <TabsTrigger value="precise">Precise</TabsTrigger>
          </TabsList>
          <TabsContent value="empirical" className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tank-volume">Total Tank Volume (L)</Label>
              <Input
                id="tank-volume"
                type="number"
                value={tankVolume}
                onChange={(e) => setTankVolume(parseFloat(e.target.value) || 0)}
                placeholder="e.g., 100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="growth-stage">Target Growth Stage</Label>
              <Select value={selectedStageIndex} onValueChange={setSelectedStageIndex}>
                <SelectTrigger id="growth-stage">
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  {growthStages.map((stage, index) => (
                    <SelectItem key={index} value={String(index)}>
                      {stage.name} (EC: {stage.ec.min}-{stage.ec.max})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleEmpiricalCalculate} className="w-full transition-all hover:scale-105 active:scale-95">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Dosing
            </Button>
            {result && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg animate-fade-in">
                <h4 className="font-bold text-lg mb-2 text-green-800 dark:text-green-300">Dosing Required:</h4>
                <div className="space-y-2 text-gray-800 dark:text-gray-200">
                  <p className="flex items-center"><FlaskConical className="mr-2 h-5 w-5 text-blue-500" />Fertilizer A: <span className="font-bold ml-2">{result.a} grams</span></p>
                  <p className="flex items-center"><Beaker className="mr-2 h-5 w-5 text-red-500" />Fertilizer B: <span className="font-bold ml-2">{result.b} grams</span></p>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="precise" className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="current-ec">Current Solution EC (mS/cm)</Label>
                <Input id="current-ec" type="number" value={preciseState.currentEC} onChange={e => handlePreciseInputChange('currentEC', e.target.value)} placeholder="e.g., 0.4" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="target-ec">Target EC (mS/cm)</Label>
                <Input id="target-ec" type="number" value={preciseState.targetEC} onChange={e => handlePreciseInputChange('targetEC', e.target.value)} placeholder="e.g., 1.6" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="water-ec">Top-up Water EC (mS/cm)</Label>
                <Input id="water-ec" type="number" value={preciseState.waterEC} onChange={e => handlePreciseInputChange('waterEC', e.target.value)} placeholder="e.g., 0.086" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ec-contribution">Fertilizer EC Factor (mS/cm/g/L)</Label>
                <Input id="ec-contribution" type="number" value={preciseState.ecContributionPerGram} onChange={e => handlePreciseInputChange('ecContributionPerGram', e.target.value)} placeholder="e.g., 0.466" />
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="current-volume">Current Volume (L)</Label>
                <Input id="current-volume" type="number" value={preciseState.currentVolume} onChange={e => handlePreciseInputChange('currentVolume', e.target.value)} placeholder="0 for new mix" />
              </div>
              <ChevronsRight className="h-6 w-6 text-gray-400 mb-2" />
              <div className="space-y-2 flex-1">
                <Label htmlFor="target-volume">Target Volume (L)</Label>
                <Input id="target-volume" type="number" value={preciseState.targetVolume} onChange={e => handlePreciseInputChange('targetVolume', e.target.value)} placeholder="e.g., 15" />
              </div>
            </div>
            <Button onClick={handlePreciseCalculate} className="w-full transition-all hover:scale-105 active:scale-95">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Precise Dosing
            </Button>
            {preciseResult && (
               <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg animate-fade-in">
                <h4 className="font-bold text-lg mb-2 text-blue-800 dark:text-blue-300">Precise Dosing Required:</h4>
                <div className="space-y-2 text-gray-800 dark:text-gray-200">
                  <p className="flex items-center"><Droplets className="mr-2 h-5 w-5 text-cyan-500" />Water to Add: <span className="font-bold ml-2">{preciseResult.waterToAdd} L</span></p>
                  <p className="flex items-center"><Plus className="mr-2 h-5 w-5 text-gray-500" />Total Fertilizer: <span className="font-bold ml-2">{preciseResult.totalFertilizer} g</span></p>
                  <div className="pl-6 border-l-2 border-gray-200 dark:border-gray-700 ml-2 mt-2 space-y-2">
                    <p className="flex items-center"><FlaskConical className="mr-2 h-5 w-5 text-blue-500" />Fertilizer A: <span className="font-bold ml-2">{preciseResult.fertilizerA} g</span></p>
                    <p className="flex items-center"><Beaker className="mr-2 h-5 w-5 text-red-500" />Fertilizer B: <span className="font-bold ml-2">{preciseResult.fertilizerB} g</span></p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
