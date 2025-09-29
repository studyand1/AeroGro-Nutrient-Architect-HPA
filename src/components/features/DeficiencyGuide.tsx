import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DEFICIENCY_GUIDE_ITEMS } from "@/lib/constants";
import { BookOpen } from "lucide-react";
export function DeficiencyGuide() {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-display flex items-center">
          <BookOpen className="mr-3 h-6 w-6" />
          Nutrient Deficiency Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {DEFICIENCY_GUIDE_ITEMS.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {item.symptom}
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                <p><strong className="font-medium text-gray-800 dark:text-gray-200">Possible Cause:</strong> {item.possibleCause}</p>
                <p><strong className="font-medium text-gray-800 dark:text-gray-200">Corrective Action:</strong> {item.action}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}