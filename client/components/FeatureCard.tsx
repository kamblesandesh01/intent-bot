import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="p-6 rounded-xl bg-card dark:bg-slate-900 border border-border dark:border-slate-800 hover:border-primary/30 hover:shadow-lg transition duration-300 group h-full">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-2 text-lg">{title}</h3>
      <p className="text-foreground/70 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
