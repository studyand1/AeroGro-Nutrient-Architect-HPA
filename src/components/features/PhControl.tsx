import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { calculateAcidDilution } from "@/lib/calculations";
import { TriangleAlert, TestTube, Droplets } from "lucide-react";
export function PhControl() {
  const [initialConc, setInitialConc] = useState(85);
  const [targetConc, setTargetConc] = useState(8.5);
  const [finalVolume, setFinalVolume] = useState(100);
  const [result, setResult] = useState<{ acid: number; water: number } | null>(null);
  const handleCalculate = () => {
    const dilutionResult = calculateAcidDilution(initialConc, targetConc, finalVolume);
    setResult({ acid: dilutionResult.acidVolume, water: dilutionResult.waterVolume });
  };
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-display">pH Control & Acid Safety</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Safety Warning!</AlertTitle>
          <AlertDescription>
            85% phosphoric acid is highly corrosive. Always wear PPE (gloves, goggles). <strong>Always add acid to water</strong>, never the other way around, to prevent dangerous splashing.
          </AlertDescription>
        </Alert>
        <div className="space-y-2">
          <h3 className="font-semibold">Dilution Calculator</h3>
          <p className="text-sm text-muted-foreground">
            Create a safer, diluted working solution for pH adjustments.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="initial-conc">Initial Acid %</Label>
            <Input id="initial-conc" type="number" value={initialConc} onChange={e => setInitialConc(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-conc">Target Acid %</Label>
            <Input id="target-conc" type="number" value={targetConc} onChange={e => setTargetConc(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="final-volume">Final Volume (mL)</Label>
            <Input id="final-volume" type="number" value={finalVolume} onChange={e => setFinalVolume(parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <Button onClick={handleCalculate} className="w-full transition-all hover:scale-105 active:scale-95">Calculate Dilution</Button>
        {result && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg animate-fade-in">
            <h4 className="font-bold text-lg mb-2 text-blue-800 dark:text-blue-300">To make {finalVolume}mL of {targetConc}% solution:</h4>
            <div className="space-y-2 text-gray-800 dark:text-gray-200">
              <p className="flex items-center"><TestTube className="mr-2 h-5 w-5 text-red-500" />Add <span className="font-bold mx-1">{result.acid} mL</span> of {initialConc}% acid...</p>
              <p className="flex items-center"><Droplets className="mr-2 h-5 w-5 text-cyan-500" />...to <span className="font-bold mx-1">{result.water} mL</span> of water.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}