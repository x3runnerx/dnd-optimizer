import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, Map as MapIcon, ScrollText } from "lucide-react";
import type { Campaign } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({ queryKey: ["/api/campaigns"] });
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      apiRequest("POST", "/api/campaigns", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setCreateOpen(false);
      setForm({ name: "", description: "" });
      toast({ title: "Campaign created" });
    },
    onError: () => toast({ title: "Failed to create campaign", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/campaigns/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setDeleteId(null);
      toast({ title: "Campaign deleted" });
    },
    onError: () => toast({ title: "Failed to delete campaign", variant: "destructive" }),
  });

  return (
    <div className="min-h-screen">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-sidebar">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="font-serif text-base font-bold">D&D Companion</span>
        </Link>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="font-serif text-xl font-bold mb-1">Campaign Overview</h1>
          <p className="text-sm text-muted-foreground">
            Manage your campaigns and characters
          </p>
        </div>

        {/* Campaign grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-lg bg-card border border-card-border animate-pulse"
              />
            ))}
          </div>
        ) : campaigns && campaigns.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <MapIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <h3 className="font-serif text-lg font-medium mb-1">No campaigns yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first campaign to start tracking characters
            </p>
            <Button onClick={() => setCreateOpen(true)} data-testid="button-new-campaign">
              <Plus className="w-4 h-4 mr-1" />
              New Campaign
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns?.map((c: Campaign) => (
              <div key={c.id} className="group relative">
                <Link href={`/campaigns/${c.id}`} className="no-underline">
                  <Card className="p-5 h-full hover-elevate hover:border-primary/40 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <ScrollText className="w-5 h-5 text-primary/70" />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteId(c.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        data-testid={`button-delete-campaign-${c.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-serif text-base font-bold mb-1">{c.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {c.description || "No description"}
                    </p>
                  </Card>
                </Link>
              </div>
            ))}
            <Card
              className="p-5 border-dashed flex flex-col items-center justify-center min-h-32 cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="w-6 h-6 text-muted-foreground mb-1" />
              <span className="text-sm text-muted-foreground">New Campaign</span>
            </Card>
          </div>
        )}
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Curse of Strahd, Homebrew Underdark..."
                data-testid="input-campaign-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-desc">Description (optional)</Label>
              <Textarea
                id="campaign-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the campaign setting..."
                rows={3}
                data-testid="input-campaign-desc"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate(form)}
              disabled={!form.name || createMutation.isPending}
              data-testid="button-create-campaign"
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Delete Campaign?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            This will permanently delete the campaign and all characters within it.
            This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
