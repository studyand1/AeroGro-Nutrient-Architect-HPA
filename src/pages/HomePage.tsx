import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/components/features/Dashboard";
import { RecipeConfig } from "@/components/features/RecipeConfig";
import { DosingCalculator } from "@/components/features/DosingCalculator";
import { PhControl } from "@/components/features/PhControl";
import { DecisionHelper } from "@/components/features/DecisionHelper";
import { DeficiencyGuide } from "@/components/features/DeficiencyGuide";
import { Toaster } from "@/components/ui/sonner";
import { motion, Variants } from "framer-motion";
export function HomePage() {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
            <Dashboard />
          </motion.div>
          <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
            <DecisionHelper />
          </motion.div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
            <DosingCalculator />
          </motion.div>
          <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
            <PhControl />
          </motion.div>
        </div>
        <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}>
          <RecipeConfig />
        </motion.div>
        <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}>
          <DeficiencyGuide />
        </motion.div>
      </div>
      <Toaster richColors closeButton position="bottom-right" />
    </MainLayout>
  );
}