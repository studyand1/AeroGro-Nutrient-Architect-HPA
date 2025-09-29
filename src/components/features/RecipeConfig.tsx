import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNutrientStore, Fertilizer } from "@/store/nutrientStore";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save, SlidersHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
const fertilizerSchema = z.object({
  totalN: z.number().min(0), nitrateN: z.number().min(0), p2o5: z.number().min(0),
  k2o: z.number().min(0), ca: z.number().min(0), mgO: z.number().min(0),
  s: z.number().min(0), fe: z.number().min(0), mn: z.number().min(0),
  zn: z.number().min(0), cu: z.number().min(0), b: z.number().min(0),
  mo: z.number().min(0),
});
const growthStageSchema = z.object({
  name: z.string(),
  ec: z.object({ min: z.number(), max: z.number() }),
  ph: z.object({ min: z.number(), max: z.number() }),
});
const formSchema = z.object({
  fertilizerA: fertilizerSchema,
  fertilizerB: fertilizerSchema,
  growthStages: z.array(growthStageSchema),
  ecToPpmFactor: z.number().min(1),
  abRatio: z.number().min(0),
  phChangePerMlPerL: z.number().min(0),
});
type FormData = z.infer<typeof formSchema>;
export function RecipeConfig() {
  const store = useNutrientStore();
  const { control, handleSubmit, formState: { isDirty } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fertilizerA: store.fertilizerA,
      fertilizerB: store.fertilizerB,
      growthStages: store.growthStages,
      ecToPpmFactor: store.ecToPpmFactor,
      abRatio: store.abRatio,
      phChangePerMlPerL: store.phChangePerMlPerL,
    },
  });
  const { fields } = useFieldArray({ control, name: "growthStages" });
  const onSubmit = (data: FormData) => {
    store.setFertilizerA(data.fertilizerA);
    store.setFertilizerB(data.fertilizerB);
    data.growthStages.forEach((stage, index) => store.setGrowthStage(index, stage));
    store.setEcToPpmFactor(data.ecToPpmFactor);
    store.setAbRatio(data.abRatio);
    store.setPhChangePerMlPerL(data.phChangePerMlPerL);
    toast.success("Configuration Saved!", { description: "Your nutrient recipes have been updated." });
  };
  const renderFertilizerFields = (prefix: 'fertilizerA' | 'fertilizerB') => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Object.keys(fertilizerSchema.shape).map((key) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={`${prefix}.${key}`} className="text-sm font-medium uppercase">{key}</Label>
          <Controller
            name={`${prefix}.${key as keyof Fertilizer}`}
            control={control}
            render={({ field }) => (
              <Input {...field} id={`${prefix}.${key}`} type="number" step="0.01" className="bg-gray-50 dark:bg-gray-800" value={field.value || ''} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
            )}
          />
        </div>
      ))}
    </div>
  );
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold font-display">Recipe Configuration</CardTitle>
        {isDirty && (
          <Button onClick={handleSubmit(onSubmit)} size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">Fertilizer A Composition (%)</AccordionTrigger>
              <AccordionContent>{renderFertilizerFields('fertilizerA')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">Fertilizer B Composition (%)</AccordionTrigger>
              <AccordionContent>{renderFertilizerFields('fertilizerB')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">Growth Stage Targets</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <h4 className="font-bold mb-4">{field.name}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>EC Range (mS/cm)</Label>
                        <div className="flex items-center gap-2">
                          <Controller name={`growthStages.${index}.ec.min`} control={control} render={({ field }) => <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} placeholder="Min" />} />
                          <Controller name={`growthStages.${index}.ec.max`} control={control} render={({ field }) => <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} placeholder="Max" />} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>pH Range</Label>
                        <div className="flex items-center gap-2">
                          <Controller name={`growthStages.${index}.ph.min`} control={control} render={({ field }) => <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} placeholder="Min" />} />
                          <Controller name={`growthStages.${index}.ph.max`} control={control} render={({ field }) => <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} placeholder="Max" />} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center">
                  <SlidersHorizontal className="mr-3 h-5 w-5" /> System Parameters
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ecToPpmFactor">EC to PPM Factor</Label>
                    <Controller name="ecToPpmFactor" control={control} render={({ field }) => <Input id="ecToPpmFactor" type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abRatio">A:B Dosing Ratio</Label>
                    <Controller name="abRatio" control={control} render={({ field }) => <Input id="abRatio" type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />} />
                  </div>
                  <div className="space-y-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="w-full text-left">
                          <Label htmlFor="phChangePerMlPerL">pH Factor</Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated pH change per mL of diluted acid per 100L of tank volume.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Controller name="phChangePerMlPerL" control={control} render={({ field }) => <Input id="phChangePerMlPerL" type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </CardContent>
    </Card>
  );
}