import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import type * as z from "zod/mini";

// ===== Campaigns =====
export const campaigns = sqliteTable("campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
});

// ===== Characters =====
export const characters = sqliteTable("characters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  name: text("name").notNull(),
  race: text("race").notNull(),
  className: text("class_name").notNull(),
  level: integer("level").notNull().default(1),
  str: integer("str").notNull().default(10),
  dex: integer("dex").notNull().default(10),
  con: integer("con").notNull().default(10),
  int: integer("int").notNull().default(10),
  wis: integer("wis").notNull().default(10),
  cha: integer("cha").notNull().default(10),
  // JSON array of skill names the character is proficient in: '["Athletics","Perception"]'
  skillProficiencies: text("skill_proficiencies").default("[]"),
  notes: text("notes"),
  // Combat tracking
  currentHp: integer("current_hp").default(0),
  maxHpOverride: integer("max_hp_override"),
  tempHp: integer("temp_hp").default(0),
  hitDiceUsed: integer("hit_dice_used").default(0),
  // JSON array of active conditions: '["Poisoned","Stunned"]'
  conditions: text("conditions").default("[]"),
  initiativeOverride: integer("initiative_override"),
});

// ===== Character Features (abilities, traits, feats) =====
export const characterFeatures = sqliteTable("character_features", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .references(() => characters.id)
    .notNull(),
  name: text("name").notNull(),
  // 'ability' | 'trait' | 'feat' | 'feature'
  type: text("type").notNull(),
  // Which ability score it uses (e.g. 'str', 'dex'), if applicable
  statUsed: text("stat_used"),
  // 0 = not proficient, 1 = proficient
  proficient: integer("proficient").default(0),
  description: text("description"),
});

// ===== Inventory Items =====
export const inventoryItems = sqliteTable("inventory_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id").references(() => characters.id).notNull(),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  // 'weapon' | 'armor' | 'shield' | 'consumable' | 'tool' | 'treasure' | 'other'
  type: text("type").notNull().default("other"),
  equipped: integer("equipped").default(0),
  weight: text("weight"),
  description: text("description"),
});

// ===== Character Spells =====
export const characterSpells = sqliteTable("character_spells", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id").references(() => characters.id).notNull(),
  name: text("name").notNull(),
  level: integer("level").notNull().default(0),
  school: text("school"),
  castingTime: text("casting_time"),
  range: text("range"),
  duration: text("duration"),
  components: text("components"),
  description: text("description"),
  prepared: integer("prepared").default(1),
});

// ===== Insert Schemas =====
export const insertCampaignSchema = createInsertSchema(campaigns);
export const insertCharacterSchema = createInsertSchema(characters);
export const insertFeatureSchema = createInsertSchema(characterFeatures);
export const insertInventoryItemSchema = createInsertSchema(inventoryItems);
export const insertSpellSchema = createInsertSchema(characterSpells);

// ===== Types =====
export type Campaign = typeof campaigns.$inferSelect;
export type Character = typeof characters.$inferSelect;
export type CharacterFeature = typeof characterFeatures.$inferSelect;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type CharacterSpell = typeof characterSpells.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InsertSpell = z.infer<typeof insertSpellSchema>;
