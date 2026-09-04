import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft, Trash2, ChevronUp, ChevronDown, Plus, Heart, Shield,
  Zap, BookOpen, Package, Star, Swords, Scroll, Check,
} from "lucide-react";
import {
  ABILITIES, SKILLS, CLASSES, RACES, CLASS_MAP,
  getModifier, getProficiencyBonus, formatModifier, getRecommendations,
  type Ability,
} from "@/lib/dnd-data";
import {
  CONDITIONS, getClassFeatures, getRacialTraits, getSpellSlots,
  getRaceSkillProficiencies,
} from "@/lib/dnd-combat-data";
import { OptimizerPanel } from "@/components/OptimizerPanel";
import { useToast } from "@/hooks/use-toast";
import type { Character, CharacterFeature, InventoryItem, CharacterSpell } from "@shared/schema";

const FEATURE_TYPES = [
  { value: "ability", label: "Ability" },
  { value: "trait", label: "Racial Trait" },
  { value: "feat", label: "Feat" },
  { value: "feature", label: "Class Feature" },
];

const ITEM_TYPES = [
  { value: "weapon", label: "Weapon" },
  { value: "armor", label: "Armor" },
  { value: "shield", label: "Shield" },
  { value: "consumable", label: "Consumable" },
  { value: "tool", label: "Tool" },
  { value: "treasure", label: "Treasure" },
  { value: "other", label: "Other" },
];

const TABS = [
  { id: "stats", label: "Stats", icon: Star },
  { id: "combat", label: "Combat", icon: Heart },
  { id: "skills", label: "Skills", icon: Swords },
  { id: "spells", label: "Spells", icon: BookOpen },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "features", label: "Features", icon: Scroll },
];

export default function CharacterSheet() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, params] = useRoute("/characters/:id");
  const charId = params?.id ? parseInt(params.id) : 0;
  const [activeTab, setActiveTab] = useState("stats");

  const { data: character, isLoading } = useQuery<Character>({ queryKey: ["/api/characters", charId] });
  const { data: features } = useQuery<CharacterFeature[]>({ queryKey: ["/api/characters", charId, "features"] });
  const { data: inventory } = useQuery<InventoryItem[]>({ queryKey: ["/api/characters", charId, "inventory"] });
  const { data: spells } = useQuery<CharacterSpell[]>({ queryKey: ["/api/characters", charId, "spells"] });

  const [localChar, setLocalChar] = useState<Character | null>(null);
  const [skillProfs, setSkillProfs] = useState<string[]>([]);
  const [activeConditions, setActiveConditions] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Feature form
  const [featureFormOpen, setFeatureFormOpen] = useState(false);
  const [featureForm, setFeatureForm] = useState({ name: "", type: "feature", statUsed: "", proficient: false, description: "" });

  // Item form
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [itemForm, setItemForm] = useState({ name: "", quantity: 1, type: "other", weight: "", description: "" });

  // Spell form
  const [spellFormOpen, setSpellFormOpen] = useState(false);
  const [spellForm, setSpellForm] = useState({ name: "", level: 0, school: "", castingTime: "", range: "", duration: "", components: "", description: "" });

  const savedRef = useRef(false);

  useEffect(() => {
    if (character) {
      setLocalChar(character);
      try { setSkillProfs(JSON.parse(character.skillProficiencies || "[]")); } catch { setSkillProfs([]); }
      try { setActiveConditions(JSON.parse(character.conditions || "[]")); } catch { setActiveConditions([]); }
    }
  }, [character]);

  const updateChar = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiRequest("PATCH", `/api/characters/${charId}`, data),
    onSuccess: (res) => { res.json().then((updated) => { savedRef.current = true; queryClient.setQueryData(["/api/characters", charId], updated); }); },
  });

  const hasChanges = useMemo(() => {
    if (!localChar || !character) return false;
    const sp = (() => { try { return JSON.parse(character.skillProficiencies || "[]") as string[]; } catch { return []; } })();
    const cd = (() => { try { return JSON.parse(character.conditions || "[]") as string[]; } catch { return []; } })();
    return (
      localChar.str !== character.str || localChar.dex !== character.dex ||
      localChar.con !== character.con || localChar.int !== character.int ||
      localChar.wis !== character.wis || localChar.cha !== character.cha ||
      localChar.level !== character.level || localChar.race !== character.race ||
      localChar.className !== character.className || localChar.name !== character.name ||
      localChar.notes !== character.notes ||
      localChar.currentHp !== character.currentHp ||
      localChar.tempHp !== character.tempHp ||
      localChar.hitDiceUsed !== character.hitDiceUsed ||
      localChar.maxHpOverride !== character.maxHpOverride ||
      localChar.initiativeOverride !== character.initiativeOverride ||
      JSON.stringify([...skillProfs].sort()) !== JSON.stringify([...sp].sort()) ||
      JSON.stringify([...activeConditions].sort()) !== JSON.stringify([...cd].sort())
    );
  }, [localChar, character, skillProfs, activeConditions]);

  useEffect(() => {
    if (!localChar || !hasChanges) return;
    const timer = setTimeout(() => {
      updateChar.mutate({
        name: localChar.name, str: localChar.str, dex: localChar.dex, con: localChar.con,
        int: localChar.int, wis: localChar.wis, cha: localChar.cha, level: localChar.level,
        race: localChar.race, className: localChar.className, notes: localChar.notes,
        skillProficiencies: JSON.stringify(skillProfs),
        currentHp: localChar.currentHp, tempHp: localChar.tempHp,
        hitDiceUsed: localChar.hitDiceUsed, maxHpOverride: localChar.maxHpOverride,
        initiativeOverride: localChar.initiativeOverride, conditions: JSON.stringify(activeConditions),
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [localChar, skillProfs, activeConditions, hasChanges]);

  // Mutations
  const addFeature = useMutation({
    mutationFn: (data: typeof featureForm) => apiRequest("POST", `/api/characters/${charId}/features`, { ...data, statUsed: data.statUsed || null }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/characters", charId, "features"] }); setFeatureFormOpen(false); setFeatureForm({ name: "", type: "feature", statUsed: "", proficient: false, description: "" }); toast({ title: "Feature added" }); },
  });

  const deleteFeature = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/characters/${charId}/features/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/characters", charId, "features"] }),
  });

  const deleteChar = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/characters/${charId}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] }); window.location.hash = "#/campaigns/" + (character?.campaignId || ""); },
  });

  const addItem = useMutation({
    mutationFn: (data: typeof itemForm) => apiRequest("POST", `/api/characters/${charId}/inventory`, { ...data, weight: data.weight || null }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/characters", charId, "inventory"] }); setItemFormOpen(false); setItemForm({ name: "", quantity: 1, type: "other", weight: "", description: "" }); toast({ title: "Item added" }); },
  });

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/characters/${charId}/inventory/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/characters", charId, "inventory"] }),
  });

  const toggleEquipped = useMutation({
    mutationFn: (data: { id: number; equipped: boolean }) => apiRequest("PATCH", `/api/characters/${charId}/inventory/${data.id}`, { equipped: data.equipped }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/characters", charId, "inventory"] }),
  });

  const addSpell = useMutation({
    mutationFn: (data: typeof spellForm) => apiRequest("POST", `/api/characters/${charId}/spells`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/characters", charId, "spells"] }); setSpellFormOpen(false); setSpellForm({ name: "", level: 0, school: "", castingTime: "", range: "", duration: "", components: "", description: "" }); toast({ title: "Spell added" }); },
  });

  const deleteSpell = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/characters/${charId}/spells/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/characters", charId, "spells"] }),
  });

  const togglePrepared = useMutation({
    mutationFn: (data: { id: number; prepared: boolean }) => apiRequest("PATCH", `/api/characters/${charId}/spells/${data.id}`, { prepared: data.prepared }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/characters", charId, "spells"] }),
  });

  if (isLoading || !localChar) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Loading character...</p></div>;
  }

  const classData = CLASS_MAP[localChar.className.toLowerCase()] || CLASSES[0];
  const level = localChar.level || 1;
  const profBonus = getProficiencyBonus(level);
  const mods = ABILITIES.reduce((acc, a) => { acc[a.key] = getModifier((localChar as any)[a.key] || 10); return acc; }, {} as Record<string, number>);

  // HP calculations
  const conMod = mods.con;
  const calculatedMaxHp = classData ? classData.hitDie + conMod + (level - 1) * (Math.floor(classData.hitDie / 2) + 1 + conMod) : 10;
  const maxHp = localChar.maxHpOverride ?? calculatedMaxHp;
  const hpPercent = maxHp > 0 ? Math.max(0, Math.min(100, (localChar.currentHp || 0) / maxHp * 100)) : 0;

  // Skill enforcement
  const classSkillChoices = classData?.numSkillChoices || 0;
  const raceSkills = getRaceSkillProficiencies(localChar.race);
  const classSkillOptions = classData?.skillOptions || [];
  const userSelectedSkills = skillProfs.filter(s => !raceSkills.includes(s));
  const skillChoicesRemaining = classSkillChoices - userSelectedSkills.length;
  const canSelectMoreSkills = skillChoicesRemaining > 0;
  // Effective proficiencies = user-selected + race-granted
  const effectiveSkillProfs = Array.from(new Set([...skillProfs, ...raceSkills]));

  // Derived features
  const derivedClassFeatures = classData ? getClassFeatures(localChar.className, level) : [];
  const derivedRacialTraits = getRacialTraits(localChar.race);
  const spellSlots = classData ? getSpellSlots(localChar.className, level) : [];

  // Initiative
  const initiative = localChar.initiativeOverride ?? mods.dex;

  // Optimizer data
  const optimizerData = getRecommendations({
    className: localChar.className,
    race: localChar.race,
    level,
    str: localChar.str || 10,
    dex: localChar.dex || 10,
    con: localChar.con || 10,
    int: localChar.int || 10,
    wis: localChar.wis || 10,
    cha: localChar.cha || 10,
    skillProfs: effectiveSkillProfs,
  });

  const charStats = ABILITIES.reduce((acc, a) => { acc[a.key] = (localChar as any)[a.key] || 10; return acc; }, {} as Record<string, number>);

  const update = (field: string, value: any) => setLocalChar(prev => prev ? { ...prev, [field]: value } : null);

  const toggleSkill = (skillName: string) => {
    if (skillProfs.includes(skillName)) {
      setSkillProfs(skillProfs.filter(s => s !== skillName));
    } else {
      if (raceSkills.includes(skillName)) return; // Already granted by race
      if (!classSkillOptions.includes(skillName)) {
        toast({ title: "Not a class skill", description: `${skillName} is not in your class skill list.`, variant: "destructive" });
        return;
      }
      if (!canSelectMoreSkills) {
        toast({ title: "Skill limit reached", description: `Your class allows ${classSkillChoices} skill choices.`, variant: "destructive" });
        return;
      }
      setSkillProfs([...skillProfs, skillName]);
    }
  };

  const toggleCondition = (name: string) => {
    if (activeConditions.includes(name)) {
      setActiveConditions(activeConditions.filter(c => c !== name));
    } else {
      setActiveConditions([...activeConditions, name]);
    }
  };

  const hpColor = hpPercent > 50 ? "text-green-500" : hpPercent > 25 ? "text-yellow-500" : "text-red-500";
  const hpBarColor = hpPercent > 50 ? "bg-green-600" : hpPercent > 25 ? "bg-yellow-600" : "bg-red-600";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Link href={`/campaigns/${localChar.campaignId}`} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Campaign
          </Link>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)} data-testid="button-delete-character">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Character header card */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Input
            value={localChar.name}
            onChange={(e) => update("name", e.target.value)}
            className="text-xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0"
            data-testid="input-char-name"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={localChar.race} onValueChange={(v) => update("race", v)}>
              <SelectTrigger className="w-32" data-testid="select-char-race"><SelectValue /></SelectTrigger>
              <SelectContent>{RACES.map(r => <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={localChar.className} onValueChange={(v) => update("className", v)}>
              <SelectTrigger className="w-32" data-testid="select-char-class"><SelectValue /></SelectTrigger>
              <SelectContent>{CLASSES.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Lvl</Label>
              <Input type="number" min={1} max={20} value={level} onChange={(e) => update("level", Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))} className="w-14 h-8" data-testid="input-char-level" />
            </div>
          </div>
        </div>
      </Card>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-border overflow-x-auto pb-px">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Tab content */}
        <div className="space-y-4">
          {/* ===== Stats Tab ===== */}
          {activeTab === "stats" && (
            <>
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Ability Scores</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {ABILITIES.map((a) => {
                    const score = (localChar as any)[a.key] || 10;
                    const mod = getModifier(score);
                    return (
                      <div key={a.key} className="flex flex-col items-center gap-1 rounded-lg border border-border p-2">
                        <span className="text-xs text-muted-foreground uppercase">{a.short}</span>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => update(a.key, score - 1)}><ChevronDown className="h-3 w-3" /></Button>
                          <span className="text-xl font-bold tabular-nums w-8 text-center">{score}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => update(a.key, score + 1)}><ChevronUp className="h-3 w-3" /></Button>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatModifier(mod)}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Saving Throws</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {ABILITIES.map(a => {
                    const proficient = classData?.savingThrows.includes(a.key) || false;
                    const bonus = mods[a.key] + (proficient ? profBonus : 0);
                    return (
                      <div key={a.key} className={`flex items-center justify-between rounded px-2 py-1 text-sm ${proficient ? "bg-primary/10" : ""}`}>
                        <span className={proficient ? "font-medium" : "text-muted-foreground"}>{a.name}</span>
                        <span className="tabular-nums">{formatModifier(bonus)}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}

          {/* ===== Combat Tab ===== */}
          {activeTab === "combat" && (
            <>
              {/* HP Tracker */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Hit Points</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <Label className="text-xs text-muted-foreground">Current HP</Label>
                      <Input type="number" value={localChar.currentHp || 0} onChange={(e) => update("currentHp", parseInt(e.target.value) || 0)} className="w-20 text-center text-lg font-bold" />
                    </div>
                    <span className="text-2xl text-muted-foreground">/</span>
                    <div className="flex flex-col items-center">
                      <Label className="text-xs text-muted-foreground">Max HP</Label>
                      <Input type="number" value={localChar.maxHpOverride ?? calculatedMaxHp} onChange={(e) => update("maxHpOverride", parseInt(e.target.value) || null)} className="w-20 text-center text-lg font-bold" placeholder={String(calculatedMaxHp)} />
                    </div>
                    <div className="flex flex-col items-center">
                      <Label className="text-xs text-muted-foreground">Temp HP</Label>
                      <Input type="number" value={localChar.tempHp || 0} onChange={(e) => update("tempHp", parseInt(e.target.value) || 0)} className="w-16 text-center" />
                    </div>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full transition-all ${hpBarColor}`} style={{ width: `${hpPercent}%` }} />
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Est. HP (avg rolls): <span className={`font-bold ${hpColor}`}>{calculatedMaxHp}</span></span>
                    <span className="text-muted-foreground">Hit Die: <span className="font-bold">d{classData?.hitDie}</span></span>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Hit Dice Used:</span>
                      <Input type="number" min={0} max={level} value={localChar.hitDiceUsed || 0} onChange={(e) => update("hitDiceUsed", Math.max(0, Math.min(level, parseInt(e.target.value) || 0)))} className="w-14 h-7" />
                      <span className="text-muted-foreground">/ {level}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* AC & Initiative */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Combat Stats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="text-center rounded-lg border border-border p-2">
                    <Shield className="h-4 w-4 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mt-1">AC (Unarmored)</p>
                    <p className="text-xl font-bold">{10 + mods.dex}</p>
                  </div>
                  <div className="text-center rounded-lg border border-border p-2">
                    <Zap className="h-4 w-4 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mt-1">Initiative</p>
                    <div className="flex items-center justify-center gap-1">
                      <Input type="number" value={localChar.initiativeOverride ?? ""} onChange={(e) => update("initiativeOverride", e.target.value ? parseInt(e.target.value) : null)} className="w-12 text-center text-lg font-bold h-7" placeholder={formatModifier(mods.dex)} />
                    </div>
                  </div>
                  <div className="text-center rounded-lg border border-border p-2">
                    <p className="text-xs text-muted-foreground">Proficiency</p>
                    <p className="text-xl font-bold">{formatModifier(profBonus)}</p>
                  </div>
                  <div className="text-center rounded-lg border border-border p-2">
                    <p className="text-xs text-muted-foreground">Passive Perc.</p>
                    <p className="text-xl font-bold">{10 + mods.wis + (effectiveSkillProfs.includes("Perception") ? profBonus : 0)}</p>
                  </div>
                </div>
              </Card>

              {/* Conditions */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Conditions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CONDITIONS.map(cond => {
                    const active = activeConditions.includes(cond.name);
                    return (
                      <button
                        key={cond.name}
                        onClick={() => toggleCondition(cond.name)}
                        title={cond.description}
                        className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-sm text-left transition-colors ${
                          active ? "border-red-500 bg-red-500/10 text-red-500" : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${active ? "bg-red-500" : "bg-muted-foreground/30"}`} />
                        <span className="truncate">{cond.name}</span>
                      </button>
                    );
                  })}
                </div>
                {activeConditions.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">{activeConditions.length} active condition(s)</p>
                )}
              </Card>
            </>
          )}

          {/* ===== Skills Tab ===== */}
          {activeTab === "skills" && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Skills</h3>
                <Badge variant={skillChoicesRemaining > 0 ? "default" : "secondary"}>
                  {userSelectedSkills.length}/{classSkillChoices} class choices
                </Badge>
              </div>
              {raceSkills.length > 0 && (
                <p className="text-xs text-muted-foreground mb-2">Granted by race: {raceSkills.join(", ")}</p>
              )}
              <div className="space-y-1">
                {SKILLS.map(skill => {
                  const proficient = effectiveSkillProfs.includes(skill.name);
                  const granted = raceSkills.includes(skill.name);
                  const bonus = mods[skill.ability] + (proficient || granted ? profBonus : 0);
                  const canToggle = classSkillOptions.includes(skill.name) || granted || proficient;
                  return (
                    <button
                      key={skill.name}
                      onClick={() => canToggle && toggleSkill(skill.name)}
                      disabled={!canToggle && !proficient}
                      className={`flex items-center justify-between w-full rounded px-2 py-1.5 text-sm text-left transition-colors ${
                        proficient || granted ? "bg-primary/10" : "hover:bg-muted"
                      } ${!canToggle && !proficient ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded border ${proficient || granted ? "border-primary bg-primary" : "border-muted-foreground/40"} flex items-center justify-center`}>
                          {(proficient || granted) && <Check className="h-3 w-3 text-primary-foreground" />}
                        </span>
                        <span className={proficient || granted ? "font-medium" : ""}>{skill.name}</span>
                        <span className="text-xs text-muted-foreground">({skill.ability.toUpperCase()})</span>
                        {granted && <Badge variant="outline" className="text-xs py-0">Race</Badge>}
                      </div>
                      <span className="tabular-nums">{formatModifier(bonus)}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ===== Spells Tab ===== */}
          {activeTab === "spells" && (
            <>
              {spellSlots.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Spell Slots</h3>
                  <div className="flex gap-2 flex-wrap">
                    {spellSlots.map(slot => (
                      <div key={slot.level} className="flex flex-col items-center rounded-lg border border-border p-2 min-w-[60px]">
                        <span className="text-xs text-muted-foreground">{slot.level === 0 ? "Cantrip" : `Lvl ${slot.level}`}</span>
                        <span className="text-lg font-bold">{slot.slots}</span>
                        <span className="text-xs text-muted-foreground">{slot.slots === 1 ? "slot" : "slots"}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {localChar.className === "Warlock"
                      ? "Pact Magic: slots recharge on short rest. Cast at the highest available level."
                      : "Spell slots recharge on a long rest."}
                  </p>
                </Card>
              )}

              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Known Spells</h3>
                  <Button size="sm" onClick={() => setSpellFormOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
                </div>
                {(spells as CharacterSpell[] | undefined)?.length ? (
                  <div className="space-y-1">
                    {(spells as CharacterSpell[]).map(spell => (
                      <div key={spell.id} className="flex items-center justify-between rounded-lg border border-border p-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{spell.name}</span>
                            <Badge variant="outline" className="text-xs">{spell.level === 0 ? "Cantrip" : `Lvl ${spell.level}`}</Badge>
                            {spell.school && <span className="text-xs text-muted-foreground">{spell.school}</span>}
                            {!spell.prepared && <Badge variant="secondary" className="text-xs">Unprepared</Badge>}
                          </div>
                          {spell.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{spell.description}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePrepared.mutate({ id: spell.id, prepared: !spell.prepared })}
                            className={`px-2 py-1 rounded text-xs ${spell.prepared ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                            data-testid={`button-toggle-prepared-${spell.id}`}
                          >
                            {spell.prepared ? "Prepared" : "Prepare"}
                          </button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteSpell.mutate(spell.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No spells yet. Add your known spells here.</p>
                )}
              </Card>
            </>
          )}

          {/* ===== Inventory Tab ===== */}
          {activeTab === "inventory" && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Inventory & Equipment</h3>
                <Button size="sm" onClick={() => setItemFormOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
              </div>
              {(inventory as InventoryItem[] | undefined)?.length ? (
                <div className="space-y-1">
                  {(inventory as InventoryItem[]).map(item => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {item.equipped ? <Badge className="text-xs bg-green-600">Equipped</Badge> : null}
                          <span className="font-medium text-sm">{item.name}</span>
                          {item.quantity > 1 && <Badge variant="secondary" className="text-xs">x{item.quantity}</Badge>}
                          <Badge variant="outline" className="text-xs">{ITEM_TYPES.find(t => t.value === item.type)?.label || item.type}</Badge>
                        </div>
                        {item.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleEquipped.mutate({ id: item.id, equipped: !item.equipped })}
                          className={`px-2 py-1 rounded text-xs ${item.equipped ? "bg-green-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                          data-testid={`button-toggle-equipped-${item.id}`}
                        >
                          {item.equipped ? "Equipped" : "Equip"}
                        </button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteItem.mutate(item.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No items yet. Add weapons, armor, and gear here.</p>
              )}
            </Card>
          )}

          {/* ===== Features Tab ===== */}
          {activeTab === "features" && (
            <>
              {/* Derived class features */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Class Features ({localChar.className})</h3>
                <div className="space-y-2">
                  {derivedClassFeatures.map((f, i) => (
                    <div key={i} className="rounded-lg border border-border p-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Lvl {f.level}</Badge>
                        <span className="font-medium text-sm">{f.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Derived racial traits */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Racial Traits ({localChar.race})</h3>
                <div className="space-y-2">
                  {derivedRacialTraits.map((t, i) => (
                    <div key={i} className="rounded-lg border border-border p-2">
                      <span className="font-medium text-sm">{t.name}</span>
                      <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Custom features */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Custom Features & Feats</h3>
                  <Button size="sm" onClick={() => setFeatureFormOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
                </div>
                {(features as CharacterFeature[] | undefined)?.length ? (
                  <div className="space-y-1">
                    {(features as CharacterFeature[]).map(f => (
                      <div key={f.id} className="flex items-center justify-between rounded-lg border border-border p-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{FEATURE_TYPES.find(t => t.value === f.type)?.label || f.type}</Badge>
                            <span className="font-medium text-sm">{f.name}</span>
                            {f.statUsed && <span className="text-xs text-muted-foreground">({f.statUsed.toUpperCase()})</span>}
                            {f.proficient === 1 && <Badge variant="secondary" className="text-xs">Proficient</Badge>}
                          </div>
                          {f.description && <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>}
                        </div>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteFeature.mutate(f.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">No custom features. Add feats, magic items, or homebrew traits.</p>
                )}
              </Card>

              {/* Notes */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Notes</h3>
                <Textarea value={localChar.notes || ""} onChange={(e) => update("notes", e.target.value)} placeholder="Campaign notes, backstory, reminders..." className="min-h-[100px]" />
              </Card>
            </>
          )}
        </div>

        {/* Optimizer panel — desktop only */}
        <div className="hidden lg:block">
          <div className="sticky top-4">
            <OptimizerPanel data={optimizerData} level={level} stats={charStats} />
          </div>
        </div>
      </div>

      {/* Mobile optimizer */}
      {activeTab === "stats" && (
        <div className="lg:hidden">
          <OptimizerPanel data={optimizerData} level={level} stats={charStats} />
        </div>
      )}

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete {localChar.name}?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently delete the character and all associated data.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteChar.mutate()}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feature form dialog */}
      <Dialog open={featureFormOpen} onOpenChange={setFeatureFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Feature</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={featureForm.name} onChange={(e) => setFeatureForm({...featureForm, name: e.target.value})} placeholder="Great Weapon Master" /></div>
            <div><Label>Type</Label>
              <Select value={featureForm.type} onValueChange={(v) => setFeatureForm({...featureForm, type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{FEATURE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Stat Used (optional)</Label>
              <Select value={featureForm.statUsed} onValueChange={(v) => setFeatureForm({...featureForm, statUsed: v})}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>{ABILITIES.map(a => <SelectItem key={a.key} value={a.key}>{a.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="feat-prof" checked={featureForm.proficient} onChange={(e) => setFeatureForm({...featureForm, proficient: e.target.checked})} className="rounded" />
              <Label htmlFor="feat-prof">Applies proficiency bonus</Label>
            </div>
            <div><Label>Description</Label><Textarea value={featureForm.description} onChange={(e) => setFeatureForm({...featureForm, description: e.target.value})} placeholder="Brief description of the feature..." /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setFeatureFormOpen(false)}>Cancel</Button>
            <Button onClick={() => addFeature.mutate(featureForm)} disabled={!featureForm.name}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item form dialog */}
      <Dialog open={itemFormOpen} onOpenChange={setItemFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Item</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={itemForm.name} onChange={(e) => setItemForm({...itemForm, name: e.target.value})} placeholder="Longsword" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Quantity</Label><Input type="number" min={1} value={itemForm.quantity} onChange={(e) => setItemForm({...itemForm, quantity: parseInt(e.target.value) || 1})} /></div>
              <div><Label>Type</Label>
                <Select value={itemForm.type} onValueChange={(v) => setItemForm({...itemForm, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ITEM_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Weight (optional)</Label><Input value={itemForm.weight} onChange={(e) => setItemForm({...itemForm, weight: e.target.value})} placeholder="3 lbs" /></div>
            <div><Label>Description (optional)</Label><Textarea value={itemForm.description} onChange={(e) => setItemForm({...itemForm, description: e.target.value})} placeholder="Versatile (1d8/1d10), finesse..." /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setItemFormOpen(false)}>Cancel</Button>
            <Button onClick={() => addItem.mutate(itemForm)} disabled={!itemForm.name}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Spell form dialog */}
      <Dialog open={spellFormOpen} onOpenChange={setSpellFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Spell</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Spell Name</Label><Input value={spellForm.name} onChange={(e) => setSpellForm({...spellForm, name: e.target.value})} placeholder="Fireball" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Level</Label>
                <Select value={String(spellForm.level)} onValueChange={(v) => setSpellForm({...spellForm, level: parseInt(v)})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{[0,1,2,3,4,5,6,7,8,9].map(l => <SelectItem key={l} value={String(l)}>{l === 0 ? "Cantrip" : `Level ${l}`}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>School</Label><Input value={spellForm.school} onChange={(e) => setSpellForm({...spellForm, school: e.target.value})} placeholder="Evocation" /></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div><Label>Casting Time</Label><Input value={spellForm.castingTime} onChange={(e) => setSpellForm({...spellForm, castingTime: e.target.value})} placeholder="1 action" /></div>
              <div><Label>Range</Label><Input value={spellForm.range} onChange={(e) => setSpellForm({...spellForm, range: e.target.value})} placeholder="150 ft" /></div>
              <div><Label>Duration</Label><Input value={spellForm.duration} onChange={(e) => setSpellForm({...spellForm, duration: e.target.value})} placeholder="Instant" /></div>
            </div>
            <div><Label>Components</Label><Input value={spellForm.components} onChange={(e) => setSpellForm({...spellForm, components: e.target.value})} placeholder="V, S, M" /></div>
            <div><Label>Description</Label><Textarea value={spellForm.description} onChange={(e) => setSpellForm({...spellForm, description: e.target.value})} placeholder="Brief spell description..." /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSpellFormOpen(false)}>Cancel</Button>
            <Button onClick={() => addSpell.mutate(spellForm)} disabled={!spellForm.name}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
