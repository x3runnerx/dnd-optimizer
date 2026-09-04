import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sword,
  Shield,
  Sparkles,
  Star,
  Target,
  Zap,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  ABILITIES,
  ABILITY_NAMES,
  type RecItem,
  type ClassData,
  type Ability,
  formatModifier,
} from "@/lib/dnd-data";

const CATEGORY_ICONS: Record<string, typeof Sword> = {
  attack: Sword,
  defense: Shield,
  spellcasting: Sparkles,
  skills: Star,
  strategy: Target,
  feat: Zap,
};

const PRIORITY_BADGE: Record<string, { label: string; className: string }> = {
  high: { label: "High", className: "bg-primary/15 text-primary border-primary/30" },
  medium: { label: "Medium", className: "bg-secondary/15 text-secondary-foreground border-secondary/30" },
  low: { label: "Low", className: "bg-muted text-muted-foreground border-border" },
};

export interface OptimizerData {
  classData: ClassData;
  items: RecItem[];
  modifiers: Record<Ability, number>;
  profBonus: number;
  statAnalysis: {
    ability: Ability;
    score: number;
    mod: number;
    isPrimary: boolean;
    isSecondary: boolean;
  }[];
  saveAnalysis: {
    ability: Ability;
    bonus: number;
    proficient: boolean;
    label: string;
  }[];
  topSkills: { name: string; ability: Ability; bonus: number; proficient: boolean }[];
}

export function OptimizerPanel({
  data,
  level,
  stats,
}: {
  data: OptimizerData;
  level: number;
  stats: Record<Ability, number>;
}) {
  const { classData, items, modifiers, profBonus, statAnalysis, saveAnalysis, topSkills } = data;

  // Derived stats
  const initiative = modifiers.dex;
  const passivePerception = 10 + modifiers.wis + (topSkills.find(s => s.name === "Perception")?.proficient ? profBonus : 0);
  const unarmoredAC = 10 + modifiers.dex;
  const conMod = modifiers.con;
  const hpEstimate = classData.hitDie + conMod + (level - 1) * (Math.floor(classData.hitDie / 2) + 1 + conMod);

  return (
    <div className="space-y-4">
      {/* Key Derived Stats */}
      <Card className="p-4">
        <h3 className="font-serif text-sm font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Key Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox label="Proficiency" value={`+${profBonus}`} />
          <StatBox label="Initiative" value={formatModifier(initiative)} />
          <StatBox label="Passive Perc." value={`${passivePerception}`} />
          <StatBox label="Unarmored AC" value={`${unarmoredAC}`} />
          <StatBox label="HP (est.)" value={`${hpEstimate}`} />
          <StatBox label="Hit Die" value={`d${classData.hitDie}`} />
          <StatBox
            label="Cast Stat"
            value={classData.spellcastingAbility ? classData.spellcastingAbility.toUpperCase() : "—"}
          />
          <StatBox label="Roles" value={classData.roles.length.toString()} />
        </div>
      </Card>

      {/* Stat Priority Analysis */}
      <Card className="p-4">
        <h3 className="font-serif text-sm font-bold mb-3">Ability Score Analysis</h3>
        <div className="grid grid-cols-2 gap-2">
          {statAnalysis.map((s) => (
            <div
              key={s.ability}
              className={`flex items-center justify-between p-2 rounded-md border ${
                s.isPrimary
                  ? "border-primary/40 bg-primary/5"
                  : s.isSecondary
                  ? "border-secondary/30 bg-secondary/5"
                  : "border-border"
              }`}
            >
              <div className="text-left">
                <div className="text-xs text-muted-foreground uppercase">{s.ability}</div>
                {s.isPrimary && <div className="text-[10px] text-primary font-medium">PRIMARY</div>}
                {s.isSecondary && <div className="text-[10px] text-muted-foreground font-medium">SECONDARY</div>}
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-bold">{s.score}</div>
                <div className="text-xs font-mono text-muted-foreground">{formatModifier(s.mod)}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-4">
        <h3 className="font-serif text-sm font-bold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Optimization Recommendations
        </h3>
        <div className="space-y-3">
          {items.map((item, i) => {
            const Icon = CATEGORY_ICONS[item.category] || Target;
            const priority = PRIORITY_BADGE[item.priority];
            return (
              <div
                key={i}
                className={`rounded-md border p-3 ${priority.className}`}
              >
                <div className="flex items-start gap-2 mb-1">
                  <Icon className="w-4 h-4 mt-0.5 shrink-0 text-foreground/60" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${priority.className}`}>
                        {priority.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Saving Throws */}
      <Card className="p-4">
        <h3 className="font-serif text-sm font-bold mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Saving Throws
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {saveAnalysis.map((s) => (
            <div
              key={s.ability}
              className={`flex items-center justify-between px-2 py-1.5 rounded-md text-sm ${
                s.proficient ? "bg-primary/5 border border-primary/20" : ""
              }`}
            >
              <span className="text-muted-foreground">{ABILITY_NAMES[s.ability].slice(0, 3)}</span>
              <span className="font-mono font-medium">{formatModifier(s.bonus)}</span>
              {s.proficient && (
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                  Prof
                </Badge>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <AlertCircle className="w-3 h-3" />
          Weak saves:{" "}
          {saveAnalysis.filter(s => s.label === "Weak").map(s => ABILITY_NAMES[s.ability].slice(0, 3)).join(", ") || "None"}
        </div>
      </Card>

      {/* Top Skills */}
      <Card className="p-4">
        <h3 className="font-serif text-sm font-bold mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          Best Skills
        </h3>
        <div className="space-y-1">
          {topSkills.slice(0, 8).map((skill) => (
            <div
              key={skill.name}
              className="flex items-center justify-between py-1 text-sm"
            >
              <div className="flex items-center gap-2">
                {skill.proficient && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
                <span className={skill.proficient ? "font-medium" : "text-muted-foreground"}>
                  {skill.name}
                </span>
                <span className="text-xs text-muted-foreground">({skill.ability.toUpperCase()})</span>
              </div>
              <span className="font-mono font-medium">{formatModifier(skill.bonus)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2 rounded-md bg-muted/40 border border-border">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-base font-mono font-bold">{value}</div>
    </div>
  );
}
