import { campaigns, characters, characterFeatures, inventoryItems, characterSpells } from '@shared/schema';
import type { Campaign, Character, CharacterFeature, InventoryItem, CharacterSpell, InsertCampaign, InsertCharacter, InsertFeature, InsertInventoryItem, InsertSpell } from '@shared/schema';
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  );
  CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER REFERENCES campaigns(id),
    name TEXT NOT NULL,
    race TEXT NOT NULL,
    class_name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    str INTEGER NOT NULL DEFAULT 10,
    dex INTEGER NOT NULL DEFAULT 10,
    con INTEGER NOT NULL DEFAULT 10,
    int INTEGER NOT NULL DEFAULT 10,
    wis INTEGER NOT NULL DEFAULT 10,
    cha INTEGER NOT NULL DEFAULT 10,
    skill_proficiencies TEXT DEFAULT '[]',
    notes TEXT,
    current_hp INTEGER DEFAULT 0,
    max_hp_override INTEGER,
    temp_hp INTEGER DEFAULT 0,
    hit_dice_used INTEGER DEFAULT 0,
    conditions TEXT DEFAULT '[]',
    initiative_override INTEGER
  );
  CREATE TABLE IF NOT EXISTS character_features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    stat_used TEXT,
    proficient INTEGER DEFAULT 0,
    description TEXT
  );
  CREATE TABLE IF NOT EXISTS inventory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id),
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    type TEXT NOT NULL DEFAULT 'other',
    equipped INTEGER DEFAULT 0,
    weight TEXT,
    description TEXT
  );
  CREATE TABLE IF NOT EXISTS character_spells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id),
    name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    school TEXT,
    casting_time TEXT,
    range TEXT,
    duration TEXT,
    components TEXT,
    description TEXT,
    prepared INTEGER DEFAULT 1
  );
`);

// Add new columns to existing characters table if upgrading
const existingColumns = sqlite.prepare("PRAGMA table_info(characters)").all() as { name: string }[];
const colNames = new Set(existingColumns.map(c => c.name));
const newColumns: [string, string][] = [
  ["current_hp", "INTEGER DEFAULT 0"],
  ["max_hp_override", "INTEGER"],
  ["temp_hp", "INTEGER DEFAULT 0"],
  ["hit_dice_used", "INTEGER DEFAULT 0"],
  ["conditions", "TEXT DEFAULT '[]'"],
  ["initiative_override", "INTEGER"],
];
for (const [col, def] of newColumns) {
  if (!colNames.has(col)) {
    sqlite.exec(`ALTER TABLE characters ADD COLUMN ${col} ${def}`);
  }
}

export const db = drizzle(sqlite);

export interface IStorage {
  // Campaigns
  getCampaigns(): Campaign[];
  getCampaign(id: number): Campaign | undefined;
  createCampaign(data: InsertCampaign): Campaign;
  updateCampaign(id: number, data: Partial<InsertCampaign>): Campaign | undefined;
  deleteCampaign(id: number): void;
  // Characters
  getCharactersByCampaign(campaignId: number): Character[];
  getCharacter(id: number): Character | undefined;
  createCharacter(data: InsertCharacter): Character;
  updateCharacter(id: number, data: Partial<InsertCharacter>): Character | undefined;
  deleteCharacter(id: number): void;
  // Features
  getFeaturesByCharacter(characterId: number): CharacterFeature[];
  createFeature(data: InsertFeature): CharacterFeature;
  deleteFeature(id: number): void;
  // Inventory
  getInventoryByCharacter(characterId: number): InventoryItem[];
  createInventoryItem(data: InsertInventoryItem): InventoryItem;
  deleteInventoryItem(id: number): void;
  updateInventoryItem(id: number, data: Partial<InsertInventoryItem>): InventoryItem | undefined;
  // Spells
  getSpellsByCharacter(characterId: number): CharacterSpell[];
  createSpell(data: InsertSpell): CharacterSpell;
  deleteSpell(id: number): void;
  updateSpell(id: number, data: Partial<InsertSpell>): CharacterSpell | undefined;
}

export class DatabaseStorage implements IStorage {
  // ===== Campaigns =====
  getCampaigns(): Campaign[] {
    return db.select().from(campaigns).all();
  }

  getCampaign(id: number): Campaign | undefined {
    return db.select().from(campaigns).where(eq(campaigns.id, id)).get();
  }

  createCampaign(data: InsertCampaign): Campaign {
    return db.insert(campaigns).values(data).returning().get();
  }

  updateCampaign(id: number, data: Partial<InsertCampaign>): Campaign | undefined {
    db.update(campaigns).set(data).where(eq(campaigns.id, id)).run();
    return this.getCampaign(id);
  }

  deleteCampaign(id: number): void {
    const chars = this.getCharactersByCampaign(id);
    for (const char of chars) {
      this.deleteCharacter(char.id);
    }
    db.delete(campaigns).where(eq(campaigns.id, id)).run();
  }

  // ===== Characters =====
  getCharactersByCampaign(campaignId: number): Character[] {
    return db.select().from(characters).where(eq(characters.campaignId, campaignId)).all();
  }

  getCharacter(id: number): Character | undefined {
    return db.select().from(characters).where(eq(characters.id, id)).get();
  }

  createCharacter(data: InsertCharacter): Character {
    return db.insert(characters).values(data).returning().get();
  }

  updateCharacter(id: number, data: Partial<InsertCharacter>): Character | undefined {
    db.update(characters).set(data).where(eq(characters.id, id)).run();
    return this.getCharacter(id);
  }

  deleteCharacter(id: number): void {
    db.delete(characterFeatures).where(eq(characterFeatures.characterId, id)).run();
    db.delete(inventoryItems).where(eq(inventoryItems.characterId, id)).run();
    db.delete(characterSpells).where(eq(characterSpells.characterId, id)).run();
    db.delete(characters).where(eq(characters.id, id)).run();
  }

  // ===== Features =====
  getFeaturesByCharacter(characterId: number): CharacterFeature[] {
    return db.select().from(characterFeatures).where(eq(characterFeatures.characterId, characterId)).all();
  }

  createFeature(data: InsertFeature): CharacterFeature {
    return db.insert(characterFeatures).values(data).returning().get();
  }

  deleteFeature(id: number): void {
    db.delete(characterFeatures).where(eq(characterFeatures.id, id)).run();
  }

  // ===== Inventory =====
  getInventoryByCharacter(characterId: number): InventoryItem[] {
    return db.select().from(inventoryItems).where(eq(inventoryItems.characterId, characterId)).all();
  }

  createInventoryItem(data: InsertInventoryItem): InventoryItem {
    return db.insert(inventoryItems).values(data).returning().get();
  }

  deleteInventoryItem(id: number): void {
    db.delete(inventoryItems).where(eq(inventoryItems.id, id)).run();
  }

  updateInventoryItem(id: number, data: Partial<InsertInventoryItem>): InventoryItem | undefined {
    db.update(inventoryItems).set(data).where(eq(inventoryItems.id, id)).run();
    return db.select().from(inventoryItems).where(eq(inventoryItems.id, id)).get();
  }

  // ===== Spells =====
  getSpellsByCharacter(characterId: number): CharacterSpell[] {
    return db.select().from(characterSpells).where(eq(characterSpells.characterId, characterId)).all();
  }

  createSpell(data: InsertSpell): CharacterSpell {
    return db.insert(characterSpells).values(data).returning().get();
  }

  deleteSpell(id: number): void {
    db.delete(characterSpells).where(eq(characterSpells.id, id)).run();
  }

  updateSpell(id: number, data: Partial<InsertSpell>): CharacterSpell | undefined {
    db.update(characterSpells).set(data).where(eq(characterSpells.id, id)).run();
    return db.select().from(characterSpells).where(eq(characterSpells.id, id)).get();
  }
}

export const storage = new DatabaseStorage();
