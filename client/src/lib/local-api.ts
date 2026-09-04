/**
 * Local storage adapter that mirrors the Express API routes.
 * Used when VITE_STORAGE_MODE=mobile (Capacitor mobile builds).
 * The Capacitor WebView supports localStorage, so no extra plugin needed.
 */

import type { Campaign, Character, CharacterFeature, InventoryItem, CharacterSpell } from "@shared/schema";

const CAMPAIGNS_KEY = "d20_campaigns";
const CHARACTERS_KEY = "d20_characters";
const FEATURES_KEY = "d20_features";
const INVENTORY_KEY = "d20_inventory";
const SPELLS_KEY = "d20_spells";

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

let idCounter = 1;
let initialized = false;

function nextId(): number {
  return idCounter++;
}

// Lazy init — only runs when local-api is first used (mobile mode only)
function ensureInit() {
  if (initialized) return;
  const all = [
    ...read<Campaign>(CAMPAIGNS_KEY),
    ...read<Character>(CHARACTERS_KEY),
    ...read<CharacterFeature>(FEATURES_KEY),
    ...read<InventoryItem>(INVENTORY_KEY),
    ...read<CharacterSpell>(SPELLS_KEY),
  ];
  idCounter = Math.max(1, ...all.map((item) => item.id)) + 1;
  initialized = true;
}

// Fake Response that mimics fetch Response interface
class LocalResponse {
  ok = true;
  status = 200;
  statusText = "OK";

  constructor(private data: unknown) {}

  async json(): Promise<unknown> {
    return this.data;
  }

  async text(): Promise<string> {
    return JSON.stringify(this.data);
  }
}

function ok(data: unknown): LocalResponse {
  return new LocalResponse(data);
}

function notFound(): LocalResponse {
  const r = new LocalResponse(null);
  r.ok = false;
  r.status = 404;
  r.statusText = "Not Found";
  return r;
}

/**
 * Handle a local API request, mirroring the Express routes.
 * Same method + URL signature as the real backend.
 */
export async function localRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<LocalResponse> {
  ensureInit();

  // ===== Campaigns =====
  if (method === "GET" && url === "/api/campaigns") {
    return ok(read<Campaign>(CAMPAIGNS_KEY));
  }

  if (method === "POST" && url === "/api/campaigns") {
    const campaigns = read<Campaign>(CAMPAIGNS_KEY);
    const body = data as Partial<Campaign>;
    const campaign: Campaign = {
      id: nextId(),
      name: body.name || "Untitled",
      description: body.description || null,
    };
    campaigns.push(campaign);
    write(CAMPAIGNS_KEY, campaigns);
    return ok(campaign);
  }

  const campaignMatch = url.match(/^\/api\/campaigns\/(\d+)$/);
  if (campaignMatch) {
    const id = parseInt(campaignMatch[1]);
    if (method === "GET") {
      const campaign = read<Campaign>(CAMPAIGNS_KEY).find((c) => c.id === id);
      return campaign ? ok(campaign) : notFound();
    }
    if (method === "PATCH") {
      const campaigns = read<Campaign>(CAMPAIGNS_KEY);
      const idx = campaigns.findIndex((c) => c.id === id);
      if (idx === -1) return notFound();
      campaigns[idx] = { ...campaigns[idx], ...(data as Partial<Campaign>), id };
      write(CAMPAIGNS_KEY, campaigns);
      return ok(campaigns[idx]);
    }
    if (method === "DELETE") {
      // Cascade: delete characters + their features, inventory, spells
      const characters = read<Character>(CHARACTERS_KEY);
      const deletedCharIds = characters.filter((c) => c.campaignId === id).map((c) => c.id);
      write(CHARACTERS_KEY, characters.filter((c) => c.campaignId !== id));
      if (deletedCharIds.length > 0) {
        write(FEATURES_KEY, read<CharacterFeature>(FEATURES_KEY).filter((f) => !deletedCharIds.includes(f.characterId)));
        write(INVENTORY_KEY, read<InventoryItem>(INVENTORY_KEY).filter((i) => !deletedCharIds.includes(i.characterId)));
        write(SPELLS_KEY, read<CharacterSpell>(SPELLS_KEY).filter((s) => !deletedCharIds.includes(s.characterId)));
      }
      write(CAMPAIGNS_KEY, read<Campaign>(CAMPAIGNS_KEY).filter((c) => c.id !== id));
      return ok({ success: true });
    }
  }

  const campaignCharsMatch = url.match(/^\/api\/campaigns\/(\d+)\/characters$/);
  if (campaignCharsMatch && method === "GET") {
    const campaignId = parseInt(campaignCharsMatch[1]);
    return ok(read<Character>(CHARACTERS_KEY).filter((c) => c.campaignId === campaignId));
  }

  // ===== Characters =====
  if (method === "POST" && url === "/api/characters") {
    const characters = read<Character>(CHARACTERS_KEY);
    const body = data as Partial<Character>;
    const character: Character = {
      id: nextId(),
      campaignId: body.campaignId || 1,
      name: body.name || "Unnamed",
      race: body.race || "Human",
      className: body.className || "Fighter",
      level: body.level || 1,
      str: body.str || 10,
      dex: body.dex || 10,
      con: body.con || 10,
      int: body.int || 10,
      wis: body.wis || 10,
      cha: body.cha || 10,
      skillProficiencies: body.skillProficiencies || "[]",
      notes: body.notes || null,
      currentHp: body.currentHp ?? 0,
      maxHpOverride: body.maxHpOverride ?? null,
      tempHp: body.tempHp ?? 0,
      hitDiceUsed: body.hitDiceUsed ?? 0,
      conditions: body.conditions || "[]",
      initiativeOverride: body.initiativeOverride ?? null,
    };
    characters.push(character);
    write(CHARACTERS_KEY, characters);
    return ok(character);
  }

  const charMatch = url.match(/^\/api\/characters\/(\d+)$/);
  if (charMatch) {
    const id = parseInt(charMatch[1]);
    if (method === "GET") {
      const character = read<Character>(CHARACTERS_KEY).find((c) => c.id === id);
      return character ? ok(character) : notFound();
    }
    if (method === "PATCH") {
      const characters = read<Character>(CHARACTERS_KEY);
      const idx = characters.findIndex((c) => c.id === id);
      if (idx === -1) return notFound();
      characters[idx] = { ...characters[idx], ...(data as Partial<Character>), id };
      write(CHARACTERS_KEY, characters);
      return ok(characters[idx]);
    }
    if (method === "DELETE") {
      // Cascade: delete features, inventory, spells
      write(FEATURES_KEY, read<CharacterFeature>(FEATURES_KEY).filter((f) => f.characterId !== id));
      write(INVENTORY_KEY, read<InventoryItem>(INVENTORY_KEY).filter((i) => i.characterId !== id));
      write(SPELLS_KEY, read<CharacterSpell>(SPELLS_KEY).filter((s) => s.characterId !== id));
      write(CHARACTERS_KEY, read<Character>(CHARACTERS_KEY).filter((c) => c.id !== id));
      return ok({ success: true });
    }
  }

  // ===== Character Features =====
  const featuresMatch = url.match(/^\/api\/characters\/(\d+)\/features$/);
  if (featuresMatch) {
    const charId = parseInt(featuresMatch[1]);
    if (method === "GET") {
      return ok(read<CharacterFeature>(FEATURES_KEY).filter((f) => f.characterId === charId));
    }
    if (method === "POST") {
      const features = read<CharacterFeature>(FEATURES_KEY);
      const body = data as Partial<CharacterFeature>;
      const feature: CharacterFeature = {
        id: nextId(),
        characterId: charId,
        name: body.name || "Feature",
        type: body.type || "feature",
        statUsed: body.statUsed || null,
        proficient: body.proficient || 0,
        description: body.description || null,
      };
      features.push(feature);
      write(FEATURES_KEY, features);
      return ok(feature);
    }
  }

  // DELETE /api/characters/:id/features/:featureId
  const featureDeleteMatch = url.match(/^\/api\/characters\/(\d+)\/features\/(\d+)$/);
  if (featureDeleteMatch && method === "DELETE") {
    const featureId = parseInt(featureDeleteMatch[2]);
    write(FEATURES_KEY, read<CharacterFeature>(FEATURES_KEY).filter((f) => f.id !== featureId));
    return ok({ success: true });
  }

  // ===== Inventory =====
  const inventoryMatch = url.match(/^\/api\/characters\/(\d+)\/inventory$/);
  if (inventoryMatch) {
    const charId = parseInt(inventoryMatch[1]);
    if (method === "GET") {
      return ok(read<InventoryItem>(INVENTORY_KEY).filter((i) => i.characterId === charId));
    }
    if (method === "POST") {
      const items = read<InventoryItem>(INVENTORY_KEY);
      const body = data as Partial<InventoryItem>;
      const item: InventoryItem = {
        id: nextId(),
        characterId: charId,
        name: body.name || "Item",
        quantity: body.quantity || 1,
        type: body.type || "other",
        equipped: body.equipped || 0,
        weight: body.weight || null,
        description: body.description || null,
      };
      items.push(item);
      write(INVENTORY_KEY, items);
      return ok(item);
    }
  }

  // DELETE /api/characters/:id/inventory/:itemId
  const inventoryDeleteMatch = url.match(/^\/api\/characters\/(\d+)\/inventory\/(\d+)$/);
  if (inventoryDeleteMatch && method === "DELETE") {
    const itemId = parseInt(inventoryDeleteMatch[2]);
    write(INVENTORY_KEY, read<InventoryItem>(INVENTORY_KEY).filter((i) => i.id !== itemId));
    return ok({ success: true });
  }

  // PATCH /api/characters/:id/inventory/:itemId
  if (inventoryDeleteMatch && method === "PATCH") {
    const itemId = parseInt(inventoryDeleteMatch[2]);
    const items = read<InventoryItem>(INVENTORY_KEY);
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx === -1) return notFound();
    const body = data as Partial<InventoryItem>;
    if (body.equipped !== undefined) items[idx].equipped = body.equipped ? 1 : 0;
    if (body.name !== undefined) items[idx].name = body.name;
    if (body.quantity !== undefined) items[idx].quantity = body.quantity;
    if (body.type !== undefined) items[idx].type = body.type;
    if (body.description !== undefined) items[idx].description = body.description;
    write(INVENTORY_KEY, items);
    return ok(items[idx]);
  }

  // ===== Spells =====
  const spellsMatch = url.match(/^\/api\/characters\/(\d+)\/spells$/);
  if (spellsMatch) {
    const charId = parseInt(spellsMatch[1]);
    if (method === "GET") {
      return ok(read<CharacterSpell>(SPELLS_KEY).filter((s) => s.characterId === charId));
    }
    if (method === "POST") {
      const spells = read<CharacterSpell>(SPELLS_KEY);
      const body = data as Partial<CharacterSpell>;
      const spell: CharacterSpell = {
        id: nextId(),
        characterId: charId,
        name: body.name || "Spell",
        level: body.level || 0,
        school: body.school || null,
        castingTime: body.castingTime || null,
        range: body.range || null,
        duration: body.duration || null,
        components: body.components || null,
        description: body.description || null,
        prepared: body.prepared ?? 1,
      };
      spells.push(spell);
      write(SPELLS_KEY, spells);
      return ok(spell);
    }
  }

  // DELETE /api/characters/:id/spells/:spellId
  const spellDeleteMatch = url.match(/^\/api\/characters\/(\d+)\/spells\/(\d+)$/);
  if (spellDeleteMatch && method === "DELETE") {
    const spellId = parseInt(spellDeleteMatch[2]);
    write(SPELLS_KEY, read<CharacterSpell>(SPELLS_KEY).filter((s) => s.id !== spellId));
    return ok({ success: true });
  }

  // PATCH /api/characters/:id/spells/:spellId
  if (spellDeleteMatch && method === "PATCH") {
    const spellId = parseInt(spellDeleteMatch[2]);
    const spells = read<CharacterSpell>(SPELLS_KEY);
    const idx = spells.findIndex((s) => s.id === spellId);
    if (idx === -1) return notFound();
    const body = data as Partial<CharacterSpell>;
    if (body.prepared !== undefined) spells[idx].prepared = body.prepared ? 1 : 0;
    if (body.name !== undefined) spells[idx].name = body.name;
    if (body.level !== undefined) spells[idx].level = body.level;
    if (body.school !== undefined) spells[idx].school = body.school;
    if (body.description !== undefined) spells[idx].description = body.description;
    write(SPELLS_KEY, spells);
    return ok(spells[idx]);
  }

  console.warn(`[local-api] Unhandled route: ${method} ${url}`);
  return notFound();
}
