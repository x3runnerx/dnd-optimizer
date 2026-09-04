import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Trash2,
  User,
  ChevronRight,
  Pencil,
  Users,
  Swords,
} from "lucide-react";
import { CLASSES, RACES, ABILITIES, getModifier, formatModifier, getProficiencyBonus, CLASS_MAP } from "@/lib/dnd-data";
import { getRaceSkillProficiencies } from "@/lib/dnd-combat-data";
import { useToast } from "@/hooks/use-toast";
import type { Character, Campaign } from "@shared/schema";

const DEFAULT_STATS = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

export default function CampaignDetail() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, params] = useRoute("/campaigns/:id");
  const campaignId = params?.id ? parseInt(params.id) : 0;

  const { data: campaign } = useQuery<Campaign>({ queryKey: ["/api/campaigns", campaignId] });
  const { data: characters, isLoading } = useQuery<Character[]>({
    queryKey: ["/api/campaigns", campaignId, "characters"],
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "party" | "initiative">("cards");
  const [form, setForm] = useState({
    name: "",
    race: "Human",
    className: "Fighter",
    level: 1,
    ...DEFAULT_STATS,
  });

  const createChar = useMutation({
    mutationFn: (data: typeof form) =>
      apiRequest("POST", "/api/characters", {
        ...data,
        campaignId,
        skillProficiencies: "[]",
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/campaigns", campaignId, "characters"],
      });
      setCreateOpen(false);
      setForm({ name: "", race: "Human", className: "Fighter", level: 1, ...DEFAULT_STATS });
      toast({ title: "Character created" });
      // Navigate to the new character sheet
      res.json().then((char: Character) => {
        window.location.hash = `#/characters/${char.id}`;
      });
    },
    onError: () => toast({ title: "Failed to create character", variant: "destructive" }),
  });

  const deleteChar = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/characters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/campaigns", campaignId, "characters"],
      });
      setDeleteId(null);
      toast({ title: "Character deleted" });
    },
  });

  const updateInitiative = useMutation({
    mutationFn: (data: { id: number; initiativeOverride: number | null }) =>
      apiRequest("PATCH", `/api/characters/${data.id}`, { initiativeOverride: data.initiativeOverride }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", campaignId, "characters"] });
    },
  });

  const updateCampaign = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      apiRequest("PATCH", `/api/campaigns/${campaignId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", campaignId] });
      setEditOpen(false);
      toast({ title: "Campaign updated" });
    },
  });

  if (!campaign) {
    return (
      <div className="p-8 text-center text-muted-foreground">Loading campaign...</div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>

        {/* Campaign Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-serif text-xl font-bold mb-1">{campaign.name}</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {campaign.description || "No description provided"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setEditForm({ name: campaign.name, description: campaign.description || "" }); setEditOpen(true); }}>
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)} data-testid="button-new-character">
              <Plus className="w-4 h-4 mr-1" />
              New Character
            </Button>
          </div>
        </div>

        {/* View toggle */}
        {characters && characters.length > 0 && (
          <div className="flex items-center gap-1 mb-4 border-b border-border pb-px">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                viewMode === "cards" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" /> Cards
            </button>
            <button
              onClick={() => setViewMode("party")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                viewMode === "party" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4" /> Party View
            </button>
            <button
              onClick={() => setViewMode("initiative")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                viewMode === "initiative" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`
            }
            >
              <Swords className="w-4 h-4" /> Initiative
            </button>
          </div>
        )}

        {/* Cards view */}
        {viewMode === "cards" && (
          isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-lg bg-card border border-card-border animate-pulse" />
            ))}
          </div>
        ) : characters && characters.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <User className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <h3 className="font-serif text-lg font-medium mb-1">No characters yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first character to this campaign
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              New Character
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters?.map((char: Character) => (
              <div key={char.id} className="group relative">
                <Link href={`/characters/${char.id}`} className="no-underline">
                  <Card className="p-5 h-full hover-elevate hover:border-primary/40 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold">
                          {char.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-serif text-base font-bold leading-tight">
                            {char.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {char.race} {char.className}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        Lvl {char.level}
                      </Badge>
                    </div>
                    {/* Quick stats */}
                    <div className="flex gap-3 flex-wrap">
                      {ABILITIES.map((a) => (
                        <div key={a.key} className="text-center">
                          <div className="text-xs text-muted-foreground">{a.short}</div>
                          <div className="text-sm font-mono font-medium">
                            {formatModifier(getModifier(char[a.key as keyof Character] as number))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-end">
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Card>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteId(char.id);
                  }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Card
              className="p-5 border-dashed flex flex-col items-center justify-center min-h-36 cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="w-6 h-6 text-muted-foreground mb-1" />
              <span className="text-sm text-muted-foreground">New Character</span>
            </Card>
          </div>
        )
        )}

        {/* Party View */}
        {viewMode === "party" && characters && characters.length > 0 && (
          <Card className="p-4 overflow-x-auto">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Party Comparison</h3>
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-3">Name</th>
                  <th className="pb-2 pr-3">Race/Class</th>
                  <th className="pb-2 pr-3 text-center">Lvl</th>
                  {ABILITIES.map(a => <th key={a.key} className="pb-2 pr-3 text-center">{a.short}</th>)}
                  <th className="pb-2 pr-3 text-center">HP</th>
                  <th className="pb-2 pr-3 text-center">AC</th>
                  <th className="pb-2 pr-3 text-center">Init</th>
                  <th className="pb-2 pr-3 text-center">Pass Perc</th>
                </tr>
              </thead>
              <tbody>
                {characters.map((char: Character) => {
                  const classData = CLASS_MAP[char.className.toLowerCase()];
                  const conMod = getModifier(char.con);
                  const dexMod = getModifier(char.dex);
                  const wisMod = getModifier(char.wis);
                  const level = char.level || 1;
                  const calcMaxHp = classData ? classData.hitDie + conMod + (level - 1) * (Math.floor(classData.hitDie / 2) + 1 + conMod) : 10;
                  const maxHp = char.maxHpOverride ?? calcMaxHp;
                  const init = char.initiativeOverride ?? dexMod;
                  let skillProfs: string[] = [];
                  try { skillProfs = JSON.parse(char.skillProficiencies || "[]"); } catch (e) { skillProfs = []; }
                  const raceSkills = getRaceSkillProficiencies(char.race);
                  const effectiveProfs = Array.from(new Set([...skillProfs, ...raceSkills]));
                  const passPerc = 10 + wisMod + (effectiveProfs.includes("Perception") ? getProficiencyBonus(level) : 0);
                  return (
                    <tr key={char.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 pr-3"><Link href={`/characters/${char.id}`} className="font-medium hover:text-primary no-underline">{char.name}</Link></td>
                      <td className="py-2 pr-3 text-muted-foreground text-xs">{char.race} {char.className}</td>
                      <td className="py-2 pr-3 text-center">{level}</td>
                      {ABILITIES.map(a => {
                        const score = char[a.key as keyof Character] as number;
                        const mod = getModifier(score);
                        return <td key={a.key} className="py-2 pr-3 text-center font-mono">{formatModifier(mod)}</td>;
                      })}
                      <td className="py-2 pr-3 text-center">{char.currentHp ?? maxHp}/{maxHp}</td>
                      <td className="py-2 pr-3 text-center">{10 + dexMod}</td>
                      <td className="py-2 pr-3 text-center font-mono">{formatModifier(init)}</td>
                      <td className="py-2 pr-3 text-center">{passPerc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}

        {/* Initiative Tracker */}
        {viewMode === "initiative" && characters && characters.length > 0 && (() => {
          const sorted = [...characters].sort((a: Character, b: Character) => {
            const aInit = a.initiativeOverride ?? getModifier(a.dex);
            const bInit = b.initiativeOverride ?? getModifier(b.dex);
            return bInit - aInit;
          });
          return (
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Initiative Order</h3>
              <div className="space-y-2">
                {sorted.map((char: Character, idx: number) => {
                  const dexMod = getModifier(char.dex);
                  const init = char.initiativeOverride ?? dexMod;
                  return (
                    <div key={char.id} className={`flex items-center gap-3 rounded-lg border p-3 ${idx === 0 ? "border-primary/40 bg-primary/5" : "border-border"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {idx + 1}
                      </div>
                      <Link href={`/characters/${char.id}`} className="font-medium hover:text-primary no-underline flex-1">
                        {char.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{char.race} {char.className}</span>
                      <div className="flex items-center gap-1">
                        <Label className="text-xs text-muted-foreground">Init</Label>
                        <input
                          type="number"
                          value={char.initiativeOverride ?? ""}
                          placeholder={formatModifier(dexMod)}
                          onChange={(e) => updateInitiative.mutate({ id: char.id, initiativeOverride: e.target.value ? parseInt(e.target.value) : null })}
                          className="w-16 h-8 rounded border border-border bg-transparent px-2 text-center font-mono text-sm"
                        />
                      </div>
                      <span className="font-mono font-bold text-lg w-10 text-center">{formatModifier(init)}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Initiative defaults to DEX modifier. Enter a roll result to override. Characters are sorted by initiative (highest first).</p>
            </Card>
          );
        })()}
      </div>

      {/* Create Character Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">New Character</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="char-name">Character Name</Label>
                <Input
                  id="char-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Thorin Oakenshield"
                  data-testid="input-char-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-level">Level</Label>
                <Input
                  id="char-level"
                  type="number"
                  min={1}
                  max={20}
                  value={form.level}
                  onChange={(e) =>
                    setForm({ ...form, level: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)) })
                  }
                  data-testid="input-char-level"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Race</Label>
                <Select
                  value={form.race}
                  onValueChange={(v) => setForm({ ...form, race: v })}
                >
                  <SelectTrigger data-testid="select-char-race">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RACES.map((r) => (
                      <SelectItem key={r.name} value={r.name}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select
                  value={form.className}
                  onValueChange={(v) => setForm({ ...form, className: v })}
                >
                  <SelectTrigger data-testid="select-char-class">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => (
                      <SelectItem key={c.key} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Ability Scores */}
            <div className="space-y-2">
              <Label>Ability Scores (Standard Array: 15, 14, 13, 12, 10, 8)</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ABILITIES.map((a) => (
                  <div key={a.key} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{a.short}</Label>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={form[a.key as keyof typeof form] as number}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [a.key]: Math.max(1, Math.min(30, parseInt(e.target.value) || 10)),
                        })
                      }
                      className="text-center"
                      data-testid={`input-char-${a.key}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createChar.mutate(form)}
              disabled={!form.name || createChar.isPending}
              data-testid="button-create-character"
            >
              {createChar.isPending ? "Creating..." : "Create Character"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Campaign Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                updateCampaign.mutate({
                  name: editForm.name,
                  description: editForm.description,
                })
              }
              disabled={updateCampaign.isPending}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Character Confirmation */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Delete Character?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            This will permanently delete the character and all associated abilities, traits, and feats.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteChar.mutate(deleteId)}
              disabled={deleteChar.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
