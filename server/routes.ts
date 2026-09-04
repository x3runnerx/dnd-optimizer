import type { Express } from "express";
import type { Server } from "node:http";
import { storage } from "./storage";

export async function registerRoutes(
  _httpServer: Server,
  app: Express
): Promise<Server> {
  // ===== Campaigns =====
  app.get("/api/campaigns", (_req, res) => {
    res.json(storage.getCampaigns());
  });

  app.post("/api/campaigns", (req, res) => {
    const campaign = storage.createCampaign(req.body);
    res.json(campaign);
  });

  app.get("/api/campaigns/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const campaign = storage.getCampaign(id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.json(campaign);
  });

  app.patch("/api/campaigns/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const campaign = storage.updateCampaign(id, req.body);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.json(campaign);
  });

  app.delete("/api/campaigns/:id", (req, res) => {
    const id = parseInt(req.params.id);
    storage.deleteCampaign(id);
    res.json({ success: true });
  });

  app.get("/api/campaigns/:id/characters", (req, res) => {
    const id = parseInt(req.params.id);
    res.json(storage.getCharactersByCampaign(id));
  });

  // ===== Characters =====
  app.post("/api/characters", (req, res) => {
    const character = storage.createCharacter(req.body);
    res.json(character);
  });

  app.get("/api/characters/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const character = storage.getCharacter(id);
    if (!character) return res.status(404).json({ error: "Character not found" });
    res.json(character);
  });

  app.patch("/api/characters/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const character = storage.updateCharacter(id, req.body);
    if (!character) return res.status(404).json({ error: "Character not found" });
    res.json(character);
  });

  app.delete("/api/characters/:id", (req, res) => {
    const id = parseInt(req.params.id);
    storage.deleteCharacter(id);
    res.json({ success: true });
  });

  // ===== Character Features =====
  app.get("/api/characters/:id/features", (req, res) => {
    const characterId = parseInt(req.params.id);
    res.json(storage.getFeaturesByCharacter(characterId));
  });

  app.post("/api/characters/:id/features", (req, res) => {
    const characterId = parseInt(req.params.id);
    const feature = storage.createFeature({ ...req.body, characterId });
    res.json(feature);
  });

  app.delete("/api/characters/:id/features/:featureId", (req, res) => {
    const featureId = parseInt(req.params.featureId);
    storage.deleteFeature(featureId);
    res.json({ success: true });
  });

  // ===== Inventory =====
  app.get("/api/characters/:id/inventory", (req, res) => {
    const characterId = parseInt(req.params.id);
    res.json(storage.getInventoryByCharacter(characterId));
  });

  app.post("/api/characters/:id/inventory", (req, res) => {
    const characterId = parseInt(req.params.id);
    const item = storage.createInventoryItem({ ...req.body, characterId, equipped: req.body.equipped ? 1 : 0 });
    res.json(item);
  });

  app.delete("/api/characters/:id/inventory/:itemId", (req, res) => {
    const itemId = parseInt(req.params.itemId);
    storage.deleteInventoryItem(itemId);
    res.json({ success: true });
  });

  app.patch("/api/characters/:id/inventory/:itemId", (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const updates: Record<string, unknown> = {};
    if (req.body.equipped !== undefined) updates.equipped = req.body.equipped ? 1 : 0;
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.quantity !== undefined) updates.quantity = req.body.quantity;
    if (req.body.type !== undefined) updates.type = req.body.type;
    if (req.body.weight !== undefined) updates.weight = req.body.weight;
    if (req.body.description !== undefined) updates.description = req.body.description;
    const updated = storage.updateInventoryItem(itemId, updates);
    res.json(updated);
  });

  // ===== Spells =====
  app.get("/api/characters/:id/spells", (req, res) => {
    const characterId = parseInt(req.params.id);
    res.json(storage.getSpellsByCharacter(characterId));
  });

  app.post("/api/characters/:id/spells", (req, res) => {
    const characterId = parseInt(req.params.id);
    const spell = storage.createSpell({ ...req.body, characterId, prepared: req.body.prepared === false ? 0 : 1 });
    res.json(spell);
  });

  app.delete("/api/characters/:id/spells/:spellId", (req, res) => {
    const spellId = parseInt(req.params.spellId);
    storage.deleteSpell(spellId);
    res.json({ success: true });
  });

  app.patch("/api/characters/:id/spells/:spellId", (req, res) => {
    const spellId = parseInt(req.params.spellId);
    const updates: Record<string, unknown> = {};
    if (req.body.prepared !== undefined) updates.prepared = req.body.prepared ? 1 : 0;
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.level !== undefined) updates.level = req.body.level;
    if (req.body.school !== undefined) updates.school = req.body.school;
    if (req.body.description !== undefined) updates.description = req.body.description;
    const updated = storage.updateSpell(spellId, updates);
    res.json(updated);
  });

  return _httpServer;
}
