import { Box, BrainCircuit, Cpu, Globe } from "lucide-react";
import type { ProjectCategory } from "@/data/resume";

const icons = { Web: Globe, Systems: Cpu, "AI/ML": BrainCircuit, Graphics: Box } as const;

export function CategoryIcon({ category, className }: { category: ProjectCategory; className?: string }) {
  const Icon = icons[category];
  return <Icon aria-hidden className={className} />;
}
