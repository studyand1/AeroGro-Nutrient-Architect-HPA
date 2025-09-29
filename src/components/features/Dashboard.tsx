import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNutrientStore } from "@/store/nutrientStore";
import { Thermometer, Zap } from "lucide-react";
import { useShallow } from 'zustand/react/shallow';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
export function Dashboard() {
  const { currentEC, currentPH, growthStages } = useNutrientStore(
    useShallow(state => ({
      currentEC: state.currentEC,
      currentPH: state.currentPH,
      growthStages: state.growthStages,
    }))
  );
  // For simplicity, we'll use the "Vegetative" stage as the default target
  const targetStage = growthStages[1] || growthStages[0];

  if (!targetStage) {
    return (
      <Card className="col-span-1 lg:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-display">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading system data...</p>
        </CardContent>
      </Card>
    );
  }

  const getProgress = (value: number, min: number, max: number) => {
    if (max === min) return 0;
    const progress = ((value - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, progress)); // Clamp between 0 and 100
  };
  const ecProgress = getProgress(currentEC, targetStage.ec.min, targetStage.ec.max);
  const phProgress = getProgress(currentPH, targetStage.ph.min, targetStage.ph.max);
  const getProgressColor = (value: number, min: number, max: number) => {
    if (value < min || value > max) return "bg-red-500";
    const range = max - min;
    const lowerBound = min + range * 0.25;
    const upperBound = max - range * 0.25;
    if (value < lowerBound || value > upperBound) return "bg-yellow-500";
    return "bg-green-500";
  };
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-display">System Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center font-medium">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>EC (Electrical Conductivity)</span>
            </div>
            <span className="font-bold text-lg">{currentEC.toFixed(2)} mS/cm</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <Progress
                  value={ecProgress}
                  className="h-3"
                  indicatorClassName={cn(
                    getProgressColor(currentEC, targetStage.ec.min, targetStage.ec.max)
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Target: {targetStage.ec.min} - {targetStage.ec.max} mS/cm</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center font-medium">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-orange-500" />
              <span>pH Level</span>
            </div>
            <span className="font-bold text-lg">{currentPH.toFixed(2)}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <Progress
                  value={phProgress}
                  className="h-3"
                  indicatorClassName={cn(
                    getProgressColor(currentPH, targetStage.ph.min, targetStage.ph.max)
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Target: {targetStage.ph.min} - {targetStage.ph.max}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}