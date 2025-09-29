import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNutrientStore } from "@/store/nutrientStore";
import { getDecisionHelperAdvice, Decision } from "@/lib/calculations";
import { Lightbulb, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useShallow } from 'zustand/react/shallow';
export function DecisionHelper() {
  const {
    currentEC, currentPH, setCurrentEC, setCurrentPH,
    growthStages, tankVolume, ecToPpmFactor, abRatio, phChangePerMlPerL
  } = useNutrientStore(
    useShallow(state => ({
      currentEC: state.currentEC,
      currentPH: state.currentPH,
      setCurrentEC: state.setCurrentEC,
      setCurrentPH: state.setCurrentPH,
      growthStages: state.growthStages,
      tankVolume: state.tankVolume,
      ecToPpmFactor: state.ecToPpmFactor,
      abRatio: state.abRatio,
      phChangePerMlPerL: state.phChangePerMlPerL,
    }))
  );
  const [selectedStageIndex, setSelectedStageIndex] = useState<string>("1");
  const [advice, setAdvice] = useState<Decision | null>(null);
  const handleGetAdvice = () => {
    const stage = growthStages[parseInt(selectedStageIndex, 10)];
    if (!stage) return;
    const result = getDecisionHelperAdvice(currentEC, currentPH, stage.ec, stage.ph, tankVolume, ecToPpmFactor, abRatio, phChangePerMlPerL);
    setAdvice(result);
  };
  const AdviceIcon = ({ status }: { status: Decision['status'] }) => {
    switch (status) {
      case 'OK': return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'WARN': return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'DANGER': return <XCircle className="h-6 w-6 text-red-500" />;
      default: return null;
    }
  };
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-display">Decision Helper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">Enter your current readings to get actionable advice.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current-ec">Current EC (mS/cm)</Label>
            <Input id="current-ec" type="number" step="0.01" value={currentEC} onChange={e => setCurrentEC(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current-ph">Current pH</Label>
            <Input id="current-ph" type="number" step="0.01" value={currentPH} onChange={e => setCurrentPH(parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="target-stage-helper">Target Growth Stage</Label>
          <Select value={selectedStageIndex} onValueChange={setSelectedStageIndex}>
            <SelectTrigger id="target-stage-helper">
              <SelectValue placeholder="Select a stage" />
            </SelectTrigger>
            <SelectContent>
              {growthStages.map((stage, index) => (
                <SelectItem key={index} value={String(index)}>{stage.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start space-y-4">
        <Button onClick={handleGetAdvice} className="w-full md:w-auto transition-all hover:scale-105 active:scale-95">
          <Lightbulb className="mr-2 h-4 w-4" />
          Get Advice
        </Button>
        {advice && (
          <div className="w-full p-4 border-l-4 rounded-r-lg animate-fade-in" style={{
            borderColor: advice.status === 'OK' ? 'hsl(var(--chart-2))' : advice.status === 'WARN' ? 'hsl(var(--chart-4))' : 'hsl(var(--destructive))',
            backgroundColor: advice.status === 'OK' ? 'hsla(var(--chart-2), 0.1)' : advice.status === 'WARN' ? 'hsla(var(--chart-4), 0.1)' : 'hsla(var(--destructive), 0.1)',
          }}>
            <div className="flex items-start space-x-3">
              <AdviceIcon status={advice.status} />
              <div>
                <h4 className="font-bold">{advice.message}</h4>
                <p className="text-muted-foreground">{advice.action}</p>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}