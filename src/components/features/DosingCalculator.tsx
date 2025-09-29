import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNutrientStore } from "@/store/nutrientStore";
import { calculateEmpiricalDosing } from "@/lib/calculations";
import { Calculator, FlaskConical, Beaker } from "lucide-react";
export function DosingCalculator() {
  const { tankVolume, setTankVolume, growthStages, ecToPpmFactor, abRatio } = useNutrientStore();
  const [selectedStageIndex, setSelectedStageIndex] = useState<string>("1");
  const [result, setResult] = useState<{ a: number; b: number } | null>(null);
  const handleCalculate = () => {
    const stage = growthStages[parseInt(selectedStageIndex, 10)];
    if (!stage) return;
    const targetEC = (stage.ec.min + stage.ec.max) / 2;
    const dosingResult = calculateEmpiricalDosing(tankVolume, targetEC, ecToPpmFactor, abRatio);
    setResult({ a: dosingResult.fertilizerAGrams, b: dosingResult.fertilizerBGrams });
  };
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-display">Dosing Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="empirical" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="empirical">Empirical (EC-Based)</TabsTrigger>
            <TabsTrigger value="precise" disabled>Precise (Element-Based)</TabsTrigger>
          </TabsList>
          <TabsContent value="empirical" className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tank-volume">Tank Volume (Liters)</Label>
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
            <Button onClick={handleCalculate} className="w-full transition-all hover:scale-105 active:scale-95">
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
          <TabsContent value="precise" className="pt-6 text-center text-gray-500">
            <p>Element-precise calculations coming soon!</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}