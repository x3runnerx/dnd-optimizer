// ============================================================
// D&D 5e SRD-Compatible Data Module
// Classes, races, skills, formulas, and recommendation engine
// ============================================================

// ===== Core Types =====
export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface AbilityInfo {
  key: Ability;
  name: string;
  short: string;
}

export interface SkillInfo {
  name: string;
  ability: Ability;
}

export interface ClassData {
  key: string;
  name: string;
  hitDie: number;
  primaryStats: Ability[];
  secondaryStats: Ability[];
  savingThrows: Ability[];
  spellcastingAbility: Ability | null;
  skillOptions: string[];
  numSkillChoices: number;
  roles: string[];
  // Template-based recommendations that get filled with computed values
  recommendations: (ctx: RecContext) => RecItem[];
}

export interface RaceData {
  name: string;
  statBonuses: Partial<Record<Ability, number>>;
  speed: number;
  size: string;
  briefTraits: string[];
}

export interface RecContext {
  stats: Record<Ability, number>;
  modifiers: Record<Ability, number>;
  level: number;
  profBonus: number;
  skillProfs: string[];
  numSkillChoices: number;
}

export interface RecItem {
  title: string;
  detail: string;
  category: 'attack' | 'defense' | 'spellcasting' | 'skills' | 'strategy' | 'feat';
  priority: 'high' | 'medium' | 'low';
}

// ===== Abilities =====
export const ABILITIES: AbilityInfo[] = [
  { key: 'str', name: 'Strength', short: 'STR' },
  { key: 'dex', name: 'Dexterity', short: 'DEX' },
  { key: 'con', name: 'Constitution', short: 'CON' },
  { key: 'int', name: 'Intelligence', short: 'INT' },
  { key: 'wis', name: 'Wisdom', short: 'WIS' },
  { key: 'cha', name: 'Charisma', short: 'CHA' },
];

export const ABILITY_NAMES: Record<Ability, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

// ===== Skills =====
export const SKILLS: SkillInfo[] = [
  { name: 'Athletics', ability: 'str' },
  { name: 'Acrobatics', ability: 'dex' },
  { name: 'Sleight of Hand', ability: 'dex' },
  { name: 'Stealth', ability: 'dex' },
  { name: 'Arcana', ability: 'int' },
  { name: 'History', ability: 'int' },
  { name: 'Investigation', ability: 'int' },
  { name: 'Nature', ability: 'int' },
  { name: 'Religion', ability: 'int' },
  { name: 'Animal Handling', ability: 'wis' },
  { name: 'Insight', ability: 'wis' },
  { name: 'Medicine', ability: 'wis' },
  { name: 'Perception', ability: 'wis' },
  { name: 'Survival', ability: 'wis' },
  { name: 'Deception', ability: 'cha' },
  { name: 'Intimidation', ability: 'cha' },
  { name: 'Performance', ability: 'cha' },
  { name: 'Persuasion', ability: 'cha' },
];

export const SKILLS_BY_ABILITY: Record<Ability, string[]> = {
  str: ['Athletics'],
  dex: ['Acrobatics', 'Sleight of Hand', 'Stealth'],
  con: [],
  int: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'],
  wis: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'],
  cha: ['Deception', 'Intimidation', 'Performance', 'Persuasion'],
};

// ===== Races =====
export const RACES: RaceData[] = [
  {
    name: 'Dragonborn',
    statBonuses: { str: 2, cha: 1 },
    speed: 30,
    size: 'Medium',
    briefTraits: ['Breath Weapon', 'Damage Resistance (based on ancestry)'],
  },
  {
    name: 'Dwarf (Hill)',
    statBonuses: { con: 2, wis: 1 },
    speed: 25,
    size: 'Medium',
    briefTraits: ['Darkvision', 'Dwarven Resilience (advantage vs poison)', 'Stonecunning'],
  },
  {
    name: 'Dwarf (Mountain)',
    statBonuses: { con: 2, str: 2 },
    speed: 25,
    size: 'Medium',
    briefTraits: ['Darkvision', 'Dwarven Resilience', 'Dwarven Armor Training'],
  },
  {
    name: 'Elf (High)',
    statBonuses: { dex: 2, int: 1 },
    speed: 30,
    size: 'Medium',
    briefTraits: ['Darkvision', 'Fey Ancestry', 'Trance', 'Cantrip'],
  },
  {
    name: 'Elf (Wood)',
    statBonuses: { dex: 2, wis: 1 },
    speed: 35,
    size: 'Medium',
    briefTraits: ['Darkvision', 'Fey Ancestry', 'Mask of the Wild'],
  },
  {
    name: 'Gnome (Forest)',
    statBonuses: { int: 2, dex: 1 },
    speed: 25,
    size: 'Small',
    briefTraits: ['Darkvision', 'Gnome Cunning', 'Natural Illusionist'],
  },
  {
    name: 'Gnome (Rock)',
    statBonuses: { int: 2, con: 1 },
    speed: 25,
    size: 'Small',
    briefTraits: ['Darkvision', 'Gnome Cunning', 'Artificer Lore'],
  },
  {
    name: 'Half-Elf',
    statBonuses: { cha: 2 },
    speed: 30,
    size: 'Medium',
    briefTraits: ['Darkvision', 'Fey Ancestry', '+1 to two other ability scores (choose)'],
  },
  {
    name: 'Halfling',
    statBonuses: { dex: 2 },
    speed: 25,
    size: 'Small',
    briefTraits: ['Lucky (reroll 1s)', 'Brave (advantage vs fear)', 'Halfling Nimbleness'],
  },
  {
    name: 'Half-Orc',
    statBonuses: { str: 2, con: 1 },
    speed: 30,
    size: 'Medium',
    briefTraits: ['Darkvision', 'Relentless Endurance', 'Savage Attacks'],
  },
  {
    name: 'Human',
    statBonuses: {},
    speed: 30,
    size: 'Medium',
    briefTraits: ['+1 to all ability scores', 'Extra language'],
  },
  {
    name: 'Tiefling',
    statBonuses: { int: 1, cha: 2 },
    speed: 30,
    size: 'Medium',
    briefTraits: ['Darkvision', 'Hellish Resistance', 'Infernal Legacy'],
  },
];

// ===== Classes =====
const ALL_SKILLS = SKILLS.map(s => s.name);

export const CLASSES: ClassData[] = [
  {
    key: 'barbarian',
    name: 'Barbarian',
    hitDie: 12,
    primaryStats: ['str', 'con'],
    secondaryStats: ['dex'],
    savingThrows: ['str', 'con'],
    spellcastingAbility: null,
    skillOptions: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
    numSkillChoices: 2,
    roles: ['Frontline Melee', 'Damage Soak', 'Rage Damage'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const strMod = ctx.modifiers.str;
      const conMod = ctx.modifiers.con;
      const dexMod = ctx.modifiers.dex;
      const rageDmg = ctx.level >= 9 ? 3 : ctx.level >= 1 ? 2 : 2;

      items.push({
        title: 'Rage-Powered Melee',
        detail: `With STR ${ctx.stats.str} (+${strMod}), your melee attacks with Rage deal +${rageDmg} damage. Unarmored Defense gives AC ${10 + dexMod + conMod}. Prioritize STR for attack/damage and CON for HP and AC.`,
        category: 'attack',
        priority: 'high',
      });

      if (dexMod >= conMod) {
        items.push({
          title: 'DEX is high — consider medium armor',
          detail: `Your DEX (+${dexMod}) equals or beats CON (+${conMod}). Medium armor with DEX gives AC ${14 + Math.min(dexMod, 2)} without Disadvantage on Stealth. Compare to Unarmored Defense AC ${10 + dexMod + conMod}.`,
          category: 'defense',
          priority: 'medium',
        });
      }

      items.push({
        title: 'Reckless Attack + Rage',
        detail: 'Use Reckless Attack for Advantage on STR melee attacks during Rage. This combos with Brutal Crit and advantage-based effects.',
        category: 'strategy',
        priority: 'high',
      });

      if (ctx.stats.str >= 16) {
        items.push({
          title: 'Feat: Great Weapon Master',
          detail: 'Your high STR (16+) supports the -5/+10 trade-off. With Reckless Attack granting Advantage, the penalty is mitigated.',
          category: 'feat',
          priority: 'medium',
        });
      }

      items.push({
        title: 'Skills: Athletics is key',
        detail: `Athletics uses STR (+${strMod}${ctx.skillProfs.includes('Athletics') ? `, proficient +${ctx.profBonus}` : ''}). Essential for grappling, shoving, and climbing during Rage.`,
        category: 'skills',
        priority: 'medium',
      });

      return items;
    },
  },
  {
    key: 'bard',
    name: 'Bard',
    hitDie: 8,
    primaryStats: ['cha', 'dex'],
    secondaryStats: ['con'],
    savingThrows: ['dex', 'cha'],
    spellcastingAbility: 'cha',
    skillOptions: ALL_SKILLS,
    numSkillChoices: 3,
    roles: ['Support Caster', 'Face', 'Skill Monkey', 'Light Control'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const chaMod = ctx.modifiers.cha;
      const dexMod = ctx.modifiers.dex;

      const spellDC = 8 + ctx.profBonus + chaMod;
      const spellAttack = ctx.profBonus + chaMod;

      items.push({
        title: 'Spell Save DC & Attack',
        detail: `Spell save DC: ${spellDC} (8 + proficiency ${ctx.profBonus} + CHA ${chaMod >= 0 ? '+' : ''}${chaMod}). Spell attack bonus: +${spellAttack}. Prioritize CHA-boosting ASIs to increase both.`,
        category: 'spellcasting',
        priority: 'high',
      });

      items.push({
        title: 'Bardic Inspiration scaling',
        detail: `At level ${ctx.level}, Inspiration die is d${ctx.level >= 15 ? 12 : ctx.level >= 10 ? 10 : ctx.level >= 5 ? 8 : 6}. Uses CHA mod times per rest. With CHA ${ctx.stats.cha}, you get ${Math.max(1, chaMod)} uses.`,
        category: 'spellcasting',
        priority: 'high',
      });

      items.push({
        title: 'Light armor + DEX',
        detail: `With DEX +${dexMod}, light armor gives AC ${11 + dexMod}. Consider studded leather for AC ${12 + dexMod}.`,
        category: 'defense',
        priority: 'low',
      });

      items.push({
        title: 'Jack of All Trades',
        detail: `At level 2, you add +${Math.floor(ctx.profBonus / 2)} to all non-proficient ability checks. This covers Initiative, tool checks, and any skill not yet proficient.`,
        category: 'skills',
        priority: 'medium',
      });

      items.push({
        title: 'Face role — Persuasion & Deception',
        detail: `CHA +${chaMod} makes you the party Face. With proficiency in Persuasion, your total bonus is +${chaMod + (ctx.skillProfs.includes('Persuasion') ? ctx.profBonus : 0)}.`,
        category: 'skills',
        priority: 'medium',
      });

      return items;
    },
  },
  {
    key: 'cleric',
    name: 'Cleric',
    hitDie: 8,
    primaryStats: ['wis', 'con'],
    secondaryStats: ['str'],
    savingThrows: ['wis', 'cha'],
    spellcastingAbility: 'wis',
    skillOptions: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    numSkillChoices: 2,
    roles: ['Healer', 'Support Caster', 'Divine Spellcaster', 'Frontline (Heavy Domain)'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const wisMod = ctx.modifiers.wis;
      const conMod = ctx.modifiers.con;

      const spellDC = 8 + ctx.profBonus + wisMod;
      const spellAttack = ctx.profBonus + wisMod;

      items.push({
        title: 'Spell Save DC & Attack',
        detail: `Spell save DC: ${spellDC}. Spell attack: +${spellAttack}. WIS is your casting stat — every +2 WIS raises your DC by 1.`,
        category: 'spellcasting',
        priority: 'high',
      });

      items.push({
        title: 'Healing Word — bonus action heal',
        detail: `Healing Word restores 1d4 + ${wisMod} HP as a bonus action at range. Save higher-level slots for Cure Wounds (${wisMod} bonus) or Mass Healing Word.`,
        category: 'spellcasting',
        priority: 'high',
      });

      if (ctx.stats.str >= 14) {
        items.push({
          title: 'STR supports melee cleric',
          detail: `STR ${ctx.stats.str} (+${ctx.modifiers.str}) allows effective melee with a mace or warhammer. Spirit Guardians + melee is a strong combo for War/Forge domains.`,
          category: 'strategy',
          priority: 'medium',
        });
      }

      items.push({
        title: 'CON for concentration',
        detail: `CON +${conMod} gives concentration saves at +${conMod}. Maintaining Bless or Spirit Guardians in melee is critical — consider War Caster feat.`,
        category: 'defense',
        priority: 'high',
      });

      items.push({
        title: 'Skills: Insight & Religion',
        detail: `Insight (WIS +${wisMod}${ctx.skillProfs.includes('Insight') ? ` +${ctx.profBonus}` : ''}) and Religion (INT +${ctx.modifiers.int}) are thematic. Insight is more broadly useful.`,
        category: 'skills',
        priority: 'low',
      });

      return items;
    },
  },
  {
    key: 'druid',
    name: 'Druid',
    hitDie: 8,
    primaryStats: ['wis', 'con'],
    secondaryStats: ['dex'],
    savingThrows: ['int', 'wis'],
    spellcastingAbility: 'wis',
    skillOptions: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    numSkillChoices: 2,
    roles: ['Caster', 'Wild Shape', 'Battlefield Control', 'Healer'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const wisMod = ctx.modifiers.wis;
      const conMod = ctx.modifiers.con;

      const spellDC = 8 + ctx.profBonus + wisMod;

      items.push({
        title: 'Spell Save DC & Attack',
        detail: `Spell save DC: ${spellDC}. Spell attack: +${ctx.profBonus + wisMod}. WIS drives all spell effectiveness.`,
        category: 'spellcasting',
        priority: 'high',
      });

      items.push({
        title: 'Wild Shape CR scaling',
        detail: `At level ${ctx.level}, Wild Shape CR limit is ${ctx.level >= 8 ? 'CR 1 (flying beasts allowed)' : ctx.level >= 4 ? 'CR 1/2 (swimming beasts allowed, no flying)' : ctx.level >= 2 ? 'CR 1/4 (no flying or swimming)' : 'not yet available (unlocks at level 2)'}. Higher WIS does not affect Wild Shape HP but does affect your spells after reverting.`,
        category: 'strategy',
        priority: 'high',
      });

      items.push({
        title: 'Concentration priority',
        detail: `CON +${conMod} for concentration saves. Moon Druids in Wild Shape should cast concentration spells (Call Lightning, Flaming Sphere) before transforming.`,
        category: 'defense',
        priority: 'high',
      });

      items.push({
        title: 'Skills: Perception & Survival',
        detail: `Perception (WIS +${wisMod}${ctx.skillProfs.includes('Perception') ? ` +${ctx.profBonus}` : ''}) is widely useful. Survival for tracking outdoors.`,
        category: 'skills',
        priority: 'low',
      });

      return items;
    },
  },
  {
    key: 'fighter',
    name: 'Fighter',
    hitDie: 10,
    primaryStats: ['str', 'dex'],
    secondaryStats: ['con'],
    savingThrows: ['str', 'con'],
    spellcastingAbility: null,
    skillOptions: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    numSkillChoices: 2,
    roles: ['Melee Striker', 'Ranged DPS', 'Action Surge Burst', 'Tank'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const strMod = ctx.modifiers.str;
      const dexMod = ctx.modifiers.dex;
      const conMod = ctx.modifiers.con;

      // Determine best attack stat
      const bestAttack = strMod >= dexMod ? 'str' : 'dex';
      const bestMod = Math.max(strMod, dexMod);
      const bestName = bestAttack === 'str' ? 'Strength' : 'Dexterity';

      items.push({
        title: `Best Attack Stat: ${bestName}`,
        detail: `${bestName} ${ctx.stats[bestAttack]} (+${bestMod}) is your strongest attack stat. Attack bonus: +${ctx.profBonus + bestMod}. Use ${bestAttack === 'str' ? 'melee weapons' : 'finesse or ranged weapons'} for maximum accuracy.`,
        category: 'attack',
        priority: 'high',
      });

      items.push({
        title: 'Action Surge — burst damage',
        detail: `Action Surge grants an extra Action. At level ${ctx.level}, you get ${ctx.level >= 17 ? 2 : 1} use(s) per short rest. Best used for a full extra Attack action with Extra Attack (${ctx.level >= 11 ? 3 : ctx.level >= 5 ? 2 : 1} attacks).`,
        category: 'strategy',
        priority: 'high',
      });

      if (ctx.stats.str >= 16 && strMod >= dexMod) {
        items.push({
          title: 'Feat: Great Weapon Master or Polearm Master',
          detail: `STR ${ctx.stats.str} supports heavy weapons. GWM (-5/+10) pairs well with Precision Attack maneuver. PAM gives bonus action reach attack. Both scale with your ${ctx.profBonus + strMod} attack bonus.`,
          category: 'feat',
          priority: 'medium',
        });
      } else if (ctx.stats.dex >= 16) {
        items.push({
          title: 'Feat: Sharpshooter or Crossbow Expert',
          detail: `DEX ${ctx.stats.dex} supports ranged combat. Sharpshooter (-5/+10) ignores half/three-quarters cover and extends range. Crossbow Expert removes loading penalty and grants bonus action attack.`,
          category: 'feat',
          priority: 'medium',
        });
      }

      items.push({
        title: 'CON for survivability',
        detail: `CON +${conMod} gives ~${10 + conMod + (ctx.level - 1) * (Math.floor(10 / 2) + 1 + conMod)} HP at level ${ctx.level} (d10 + CON). Second Wind heals 1d10 + ${ctx.level} per short rest.`,
        category: 'defense',
        priority: 'medium',
      });

      items.push({
        title: 'Skills: Athletics or Perception',
        detail: `Athletics (STR +${strMod}) for grappling/shoving. Perception (WIS +${ctx.modifiers.wis}) is the most-rolled skill in the game.`,
        category: 'skills',
        priority: 'low',
      });

      return items;
    },
  },
  {
    key: 'monk',
    name: 'Monk',
    hitDie: 8,
    primaryStats: ['dex', 'wis'],
    secondaryStats: ['con'],
    savingThrows: ['str', 'dex'],
    spellcastingAbility: null,
    skillOptions: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    numSkillChoices: 2,
    roles: ['Mobile Striker', 'Stunning Strike', 'Ki Caster', 'Skirmisher'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const dexMod = ctx.modifiers.dex;
      const wisMod = ctx.modifiers.wis;
      const conMod = ctx.modifiers.con;

      const unarmoredAC = 10 + dexMod + wisMod;
      const kiPoints = ctx.level;
      const martialArts = ctx.level >= 17 ? 'd10' : ctx.level >= 11 ? 'd8' : ctx.level >= 5 ? 'd6' : 'd4';

      items.push({
        title: 'Unarmored Defense & Martial Arts',
        detail: `AC ${unarmoredAC} (10 + DEX ${dexMod >= 0 ? '+' : ''}${dexMod} + WIS ${wisMod >= 0 ? '+' : ''}${wisMod}). Martial Arts die: ${martialArts}. Both DEX and WIS are critical — they boost AC, attack, Ki save DC, and skills simultaneously.`,
        category: 'defense',
        priority: 'high',
      });

      items.push({
        title: 'Stunning Strike — your key combo',
        detail: `At level 5+, spend 1 Ki point on a hit to force a CON save (DC ${8 + ctx.profBonus + wisMod}). This is your strongest tactical tool — set up allies for Advantage and break enemy actions.`,
        category: 'attack',
        priority: 'high',
      });

      items.push({
        title: `Ki Points: ${ctx.level >= 2 ? ctx.level : 0}`,
        detail: `${ctx.level >= 2 ? `You have ${ctx.level} Ki points per short rest. Flurry of Blows (1 Ki) gives 2 unarmed bonus-action attacks. Patient Defense (1 Ki) gives Disengage + Dodge. Step of the Wind (1 Ki) gives Dash + Disengage as bonus action.` : 'You unlock Ki points at level 2.'}`,
        category: 'strategy',
        priority: 'high',
      });

      if (dexMod >= 3) {
        items.push({
          title: 'Feat: Mobile',
          detail: 'Mobile adds +10 ft speed and lets you ignore difficult terrain from targets you attack. Pairs perfectly with hit-and-run Flurry tactics.',
          category: 'feat',
          priority: 'medium',
        });
      }

      items.push({
        title: 'Skills: Acrobatics & Stealth',
        detail: `Acrobatics (DEX +${dexMod}) and Stealth (DEX +${dexMod}) are your strongest skills. Insight (WIS +${wisMod}) is also strong for reading opponents.`,
        category: 'skills',
        priority: 'low',
      });

      return items;
    },
  },
  {
    key: 'paladin',
    name: 'Paladin',
    hitDie: 10,
    primaryStats: ['str', 'cha'],
    secondaryStats: ['con'],
    savingThrows: ['wis', 'cha'],
    spellcastingAbility: 'cha',
    skillOptions: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    numSkillChoices: 2,
    roles: ['Frontline Tank', 'Smite Damage', 'Party Buffer', 'Face'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const strMod = ctx.modifiers.str;
      const chaMod = ctx.modifiers.cha;
      const conMod = ctx.modifiers.con;

      const spellDC = 8 + ctx.profBonus + chaMod;
      const auraBonus = ctx.level >= 18 ? chaMod : ctx.level >= 6 ? chaMod : 0;

      items.push({
        title: 'Divine Smite — burst damage',
        detail: `${ctx.level >= 2 ? `On a melee hit, expend a spell slot for 2d8 + 1d8 per slot level above 1st (max 5d8, +1d8 vs undead/fiends). With STR +${strMod} attack bonus (+${ctx.profBonus + strMod}), you hit often and hard. Save slots for critical hits (double dice).` : 'You unlock Divine Smite at level 2.'}`,
        category: 'attack',
        priority: 'high',
      });

      items.push({
        title: 'Spell Save DC & Aura',
        detail: `Spell save DC: ${spellDC}. ${ctx.level >= 6 ? `Aura of Protection: you and allies within 10 ft get +${chaMod} to ALL saving throws. This is one of the best party buffs in the game.` : 'At level 6, Aura of Protection grants CHA mod to all saves for you and nearby allies.'}`,
        category: 'spellcasting',
        priority: 'high',
      });

      items.push({
        title: 'Skills: Persuasion & Athletics',
        detail: `Persuasion (CHA +${chaMod}${ctx.skillProfs.includes('Persuasion') ? ` +${ctx.profBonus}` : ''}) makes you a strong Face. Athletics (STR +${strMod}) for shoving/grappling.`,
        category: 'skills',
        priority: 'medium',
      });

      if (ctx.stats.str >= 16) {
        items.push({
          title: 'Feat: Great Weapon Master or Sentinel',
          detail: `STR ${ctx.stats.str} supports heavy weapons. With Divine Smite, each hit is devastating — GWM adds +10 per hit. Sentinel locks down enemies and triggers bonus attacks, comboing with Aura of Protection.`,
          category: 'feat',
          priority: 'medium',
        });
      }

      items.push({
        title: 'CON for frontline survival',
        detail: `CON +${conMod} gives HP for frontline tanking. At level ${ctx.level}, your HP pool (d10 + CON) should be 25+ to survive melee focus fire.`,
        category: 'defense',
        priority: 'medium',
      });

      return items;
    },
  },
  {
    key: 'ranger',
    name: 'Ranger',
    hitDie: 10,
    primaryStats: ['dex', 'wis'],
    secondaryStats: ['con'],
    savingThrows: ['str', 'dex'],
    spellcastingAbility: 'wis',
    skillOptions: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
    numSkillChoices: 3,
    roles: ['Ranged DPS', 'Scout', 'Skirmisher', 'Tracker'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const dexMod = ctx.modifiers.dex;
      const wisMod = ctx.modifiers.wis;

      const spellDC = 8 + ctx.profBonus + wisMod;

      items.push({
        title: 'Ranged Attack — DEX primary',
        detail: `DEX ${ctx.stats.dex} (+${dexMod}) gives ranged attack +${ctx.profBonus + dexMod}. Longbow: 1d8 + ${dexMod} damage at 150 ft. This is your bread and butter.`,
        category: 'attack',
        priority: 'high',
      });

      items.push({
        title: 'Spell Save DC & Attack',
        detail: `Spell save DC: ${spellDC}. Spell attack: +${ctx.profBonus + wisMod}. WIS affects spells like Hunter's Mark (no save, but affects tracking), Ensnaring Strike, and Conjure Barrage.`,
        category: 'spellcasting',
        priority: 'medium',
      });

      items.push({
        title: 'Favored Enemy & Natural Explorer',
        detail: `Favored Enemy gives +${wisMod} to tracking and recall vs chosen type. At level ${ctx.level}, ${ctx.level >= 6 ? 'you have 2 favored enemies and Greater Favored Enemy (+4 damage).' : 'you have 1 favored enemy (+2 damage).'}`,
        category: 'strategy',
        priority: 'medium',
      });

      if (ctx.stats.dex >= 16) {
        items.push({
          title: 'Feat: Sharpshooter or Crossbow Expert',
          detail: `DEX ${ctx.stats.dex} supports Sharpshooter (-5/+10 with no range/disadvantage penalties). Crossbow Expert allows hand crossbow with bonus action attack and removes loading penalty. Both massively increase DPR.`,
          category: 'feat',
          priority: 'high',
        });
      }

      items.push({
        title: 'Skills: Perception, Stealth, Survival',
        detail: `Perception (WIS +${wisMod}), Stealth (DEX +${dexMod}), and Survival (WIS +${wisMod}) are your strongest skills. You get 3 choices — take all three.`,
        category: 'skills',
        priority: 'medium',
      });

      return items;
    },
  },
  {
    key: 'rogue',
    name: 'Rogue',
    hitDie: 8,
    primaryStats: ['dex', 'int'],
    secondaryStats: ['con', 'cha'],
    savingThrows: ['dex', 'int'],
    spellcastingAbility: null,
    skillOptions: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
    numSkillChoices: 4,
    roles: ['Sneak Attack Striker', 'Skill Expert', 'Scout', 'Face'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const dexMod = ctx.modifiers.dex;
      const intMod = ctx.modifiers.int;
      const sneakDie = Math.ceil(ctx.level / 2);

      items.push({
        title: `Sneak Attack: ${sneakDie}d6`,
        detail: `Sneak Attack deals ${sneakDie}d6 (${sneakDie * 3.5} avg) extra damage once per turn when you have Advantage or an ally adjacent to the target. DEX ${ctx.stats.dex} (+${dexMod}) drives accuracy. Attack bonus: +${ctx.profBonus + dexMod}.`,
        category: 'attack',
        priority: 'high',
      });

      items.push({
        title: 'Cunning Action — bonus action economy',
        detail: `At level 2+, use your bonus action to Dash, Disengage, or Hide. ${ctx.level >= 2 ? 'This is the core of rogue mobility. Dash + Hide in the same turn positions you for next-round Sneak Attack.' : 'You unlock this at level 2.'}`,
        category: 'strategy',
        priority: 'high',
      });

      if (ctx.stats.dex >= 16) {
        items.push({
          title: 'Feat: Sharpshooter or Mobile',
          detail: `DEX ${ctx.stats.dex} supports ranged Sneak Attack. Sharpshooter (-5/+10) trades accuracy for damage, but Sneak Attack still applies. Mobile gives +10 ft speed and free Disengage.`,
          category: 'feat',
          priority: 'medium',
        });
      }

      items.push({
        title: 'Skills: 4 choices, Expertise at level 1',
        detail: `With ${ctx.numSkillChoices} skill choices and Expertise (double proficiency on 2 skills), prioritize: Stealth (DEX +${dexMod}), Perception (WIS +${ctx.modifiers.wis}), Investigation (INT +${intMod}), and Persuasion/Deception (CHA +${ctx.modifiers.cha}). Expertise in Stealth gives +${dexMod + ctx.profBonus * 2}.`,
        category: 'skills',
        priority: 'high',
      });

      items.push({
        title: 'Uncanny Dodge at level 5',
        detail: `At level ${ctx.level}, ${ctx.level >= 5 ? 'Uncanny Dodge halves one attack per round as a reaction — use it on the biggest hit.' : 'you unlock Uncanny Dodge at level 5, halving one attack\'s damage per round.'}`,
        category: 'defense',
        priority: 'medium',
      });

      return items;
    },
  },
  {
    key: 'sorcerer',
    name: 'Sorcerer',
    hitDie: 6,
    primaryStats: ['cha', 'con'],
    secondaryStats: ['dex'],
    savingThrows: ['con', 'cha'],
    spellcastingAbility: 'cha',
    skillOptions: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    numSkillChoices: 2,
    roles: ['Blaster Caster', 'Metamagic Controller', 'Face', 'Utility Caster'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const chaMod = ctx.modifiers.cha;
      const conMod = ctx.modifiers.con;

      const spellDC = 8 + ctx.profBonus + chaMod;
      const spellAttack = ctx.profBonus + chaMod;

      items.push({
        title: 'Spell Save DC & Attack',
        detail: `Spell save DC: ${spellDC}. Spell attack: +${spellAttack}. CHA drives everything — maximize it with ASIs. At level ${ctx.level}, you have ${ctx.level >= 2 ? ctx.level >= 10 ? 5 : ctx.level >= 3 ? 4 : 3 : 0} sorcery points and ${ctx.level >= 3 ? Math.floor(ctx.level / 2) : 0} metamagic options.`,
        category: 'spellcasting',
        priority: 'high',
      });

      if (ctx.level >= 3) {
        items.push({
          title: 'Metamagic: Quicken & Twinned',
          detail: `Quicken Spell (2 SP) turns a spell into a bonus action — cast Fireball AND a cantrip in one turn. Twinned Spell (1 SP) targets a second creature with single-target spells like Haste or Hold Person. You have ${ctx.level >= 17 ? 4 : ctx.level >= 10 ? 3 : 2} metamagic options.`,
          category: 'strategy',
          priority: 'high',
        });
      }

      items.push({
        title: 'CON for HP and concentration',
        detail: `With d6 hit die, CON +${conMod} is critical. You have ~${ctx.level * 4 + 4 + conMod * ctx.level} HP at level ${ctx.level}. CON also boosts concentration saves for buffs like Haste.`,
        category: 'defense',
        priority: 'high',
      });

      items.push({
        title: 'Feat: War Caster',
        detail: 'Advantage on concentration saves, cast with hands full, and cast as opportunity attack. Essential for maintaining concentration on Haste/Shield of Faith in combat.',
        category: 'feat',
        priority: 'medium',
      });

      items.push({
        title: 'Face role — Persuasion',
        detail: `CHA +${chaMod} makes you a strong Face. Persuasion total: +${chaMod + (ctx.skillProfs.includes('Persuasion') ? ctx.profBonus : 0)}.`,
        category: 'skills',
        priority: 'low',
      });

      return items;
    },
  },
  {
    key: 'warlock',
    name: 'Warlock',
    hitDie: 8,
    primaryStats: ['cha', 'con'],
    secondaryStats: ['dex'],
    savingThrows: ['wis', 'cha'],
    spellcastingAbility: 'cha',
    skillOptions: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
    numSkillChoices: 2,
    roles: ['Eldritch Blaster', 'Pact Boon', 'Short-Rest Caster', 'Face'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const chaMod = ctx.modifiers.cha;
      const conMod = ctx.modifiers.con;

      const spellDC = 8 + ctx.profBonus + chaMod;
      const spellAttack = ctx.profBonus + chaMod;
      const eldritchBlastBeams = ctx.level >= 17 ? 4 : ctx.level >= 11 ? 3 : ctx.level >= 5 ? 2 : 1;

      items.push({
        title: 'Eldritch Blast — your bread and butter',
        detail: `Eldritch Blast fires ${eldritchBlastBeams} beam(s), each dealing 1d10 + ${chaMod >= 1 ? chaMod : 0} with Agonizing Blast invocation. Total per turn: ${eldritchBlastBeams}d10 + ${eldritchBlastBeams * (chaMod >= 1 ? chaMod : 0)}. Attack per beam: +${spellAttack}.`,
        category: 'attack',
        priority: 'high',
      });

      items.push({
        title: 'Spell Save DC & Attack',
        detail: `Spell save DC: ${spellDC}. Spell attack: +${spellAttack}. Spell slots: ${ctx.level >= 17 ? 4 : ctx.level >= 11 ? 3 : ctx.level >= 3 ? 2 : 1} slot(s) at level ${ctx.level} (short rest recharge, upcast to level ${Math.min(5, Math.ceil(ctx.level / 2))}).`,
        category: 'spellcasting',
        priority: 'high',
      });

      items.push({
        title: 'Pact Boon selection',
        detail: `${ctx.level >= 3 ? 'You can select a Pact Boon. Pact of the Tome: extra cantrips + rituals. Pact of the Blade: melee weapon. Pact of the Chain: familiar with special abilities.' : 'At level 3, choose a Pact Boon. Pact of the Tome is most flexible for casters.'}`,
        category: 'strategy',
        priority: 'medium',
      });

      items.push({
        title: 'CON for concentration',
        detail: `CON +${conMod} for concentration saves on Hex, Darkness, or other concentration spells. Hex gives each Eldritch Blast beam +1d6 necrotic.`,
        category: 'defense',
        priority: 'medium',
      });

      items.push({
        title: 'Feat: Eldritch Adept or War Caster',
        detail: 'Eldritch Adept grants an extra invocation. War Caster helps maintain Hex concentration. Choose based on your playstyle.',
        category: 'feat',
        priority: 'low',
      });

      return items;
    },
  },
  {
    key: 'wizard',
    name: 'Wizard',
    hitDie: 6,
    primaryStats: ['int', 'con'],
    secondaryStats: ['dex'],
    savingThrows: ['int', 'wis'],
    spellcastingAbility: 'int',
    skillOptions: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    numSkillChoices: 2,
    roles: ['Controller', 'Blaster', 'Utility', 'Ritual Caster'],
    recommendations: (ctx) => {
      const items: RecItem[] = [];
      const intMod = ctx.modifiers.int;
      const conMod = ctx.modifiers.con;
      const dexMod = ctx.modifiers.dex;

      const spellDC = 8 + ctx.profBonus + intMod;
      const spellAttack = ctx.profBonus + intMod;

      items.push({
        title: 'Spell Save DC & Attack',
        detail: `Spell save DC: ${spellDC}. Spell attack: +${spellAttack}. INT ${ctx.stats.int} (+${intMod}) drives all spell effectiveness. Every +2 INT = +1 DC, making ASIs very impactful.`,
        category: 'spellcasting',
        priority: 'high',
      });

      items.push({
        title: 'Spell selection by save type',
        detail: `With DC ${spellDC}, prefer save-or-suck spells targeting weak saves: Wisdom (Charm Person, Hold Person), Constitution (Poison Spray, Blight), Dexterity (Fireball, Lightning Bolt). Avoid STR-save spells unless targeting casters. ${ctx.level >= 2 ? `You have ${ctx.level} sorcery points and ${ctx.level >= 17 ? 4 : ctx.level >= 10 ? 3 : ctx.level >= 3 ? 2 : 0} metamagic options.` : 'You unlock sorcery points and metamagic at level 2.'}`,
        category: 'strategy',
        priority: 'high',
      });

      items.push({
        title: 'CON for survival & concentration',
        detail: `d6 hit die means CON +${conMod} is critical. HP ~${ctx.level * 4 + 4 + conMod * ctx.level} at level ${ctx.level}. Concentration saves at +${conMod} for maintaining Mage Armor, Shield, or Haste.`,
        category: 'defense',
        priority: 'high',
      });

      items.push({
        title: 'Feat: War Caster',
        detail: 'Advantage on concentration checks, cast with weapons/shield, and opportunity-attack spells. Wizards should prioritize this at level 4 unless INT is already 20.',
        category: 'feat',
        priority: 'high',
      });

      items.push({
        title: 'DEX for AC and Initiative',
        detail: `DEX +${dexMod} gives Initiative +${dexMod} and AC ${10 + dexMod} with Mage Armor. Going first lets you cast control spells before enemies act.`,
        category: 'defense',
        priority: 'medium',
      });

      items.push({
        title: 'Skills: Arcana & Investigation',
        detail: `Arcana (INT +${intMod}${ctx.skillProfs.includes('Arcana') ? ` +${ctx.profBonus}` : ''}) is your strongest skill. Investigation (INT +${intMod}) is also strong for puzzles and traps.`,
        category: 'skills',
        priority: 'low',
      });

      return items;
    },
  },
];

// ===== Helper Maps =====
export const CLASS_MAP: Record<string, ClassData> = Object.fromEntries(
  CLASSES.map(c => [c.key, c])
);

export const CLASS_NAMES = CLASSES.map(c => c.name);
export const CLASS_KEYS = CLASSES.map(c => c.key);
export const RACE_NAMES = RACES.map(r => r.name);

// ===== Formulas =====
export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getProficiencyBonus(level: number): number {
  return Math.floor((level - 1) / 4) + 2;
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function getSkillBonus(
  skillName: string,
  stats: Record<Ability, number>,
  skillProfs: string[],
  profBonus: number
): number {
  const skill = SKILLS.find(s => s.name === skillName);
  if (!skill) return 0;
  const mod = getModifier(stats[skill.ability]);
  const proficient = skillProfs.includes(skillName);
  return mod + (proficient ? profBonus : 0);
}

export function getAbilityBonus(
  ability: Ability,
  stats: Record<Ability, number>,
  profBonus: number,
  proficient: boolean
): number {
  const mod = getModifier(stats[ability]);
  return mod + (proficient ? profBonus : 0);
}

// ===== Recommendation Engine =====
export interface CharacterStats {
  className: string;
  race: string;
  level: number;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  skillProfs: string[];
}

export function getRecommendations(char: CharacterStats): {
  classData: ClassData;
  items: RecItem[];
  modifiers: Record<Ability, number>;
  profBonus: number;
  statAnalysis: { ability: Ability; score: number; mod: number; isPrimary: boolean; isSecondary: boolean }[];
  saveAnalysis: { ability: Ability; bonus: number; proficient: boolean; label: string }[];
  topSkills: { name: string; ability: Ability; bonus: number; proficient: boolean }[];
} {
  const stats: Record<Ability, number> = {
    str: char.str,
    dex: char.dex,
    con: char.con,
    int: char.int,
    wis: char.wis,
    cha: char.cha,
  };

  const modifiers: Record<Ability, number> = {
    str: getModifier(char.str),
    dex: getModifier(char.dex),
    con: getModifier(char.con),
    int: getModifier(char.int),
    wis: getModifier(char.wis),
    cha: getModifier(char.cha),
  };

  const profBonus = getProficiencyBonus(char.level);
  const classData = CLASS_MAP[char.className.toLowerCase()] || CLASSES[0];

  const ctx: RecContext = {
    stats,
    modifiers,
    level: char.level,
    profBonus,
    skillProfs: char.skillProfs,
    numSkillChoices: classData.numSkillChoices,
  };

  const items = classData.recommendations(ctx);

  // Stat analysis
  const statAnalysis = ABILITIES.map(a => ({
    ability: a.key,
    score: stats[a.key],
    mod: modifiers[a.key],
    isPrimary: classData.primaryStats.includes(a.key),
    isSecondary: classData.secondaryStats.includes(a.key),
  }));

  // Save analysis
  const saveAnalysis = ABILITIES.map(a => {
    const proficient = classData.savingThrows.includes(a.key);
    const bonus = modifiers[a.key] + (proficient ? profBonus : 0);
    return {
      ability: a.key,
      bonus,
      proficient,
      label: proficient ? 'Strong' : modifiers[a.key] >= 2 ? 'OK' : 'Weak',
    };
  });

  // Top skills (sorted by total bonus)
  const topSkills = SKILLS.map(s => ({
    name: s.name,
    ability: s.ability,
    bonus: getSkillBonus(s.name, stats, char.skillProfs, profBonus),
    proficient: char.skillProfs.includes(s.name),
  })).sort((a, b) => b.bonus - a.bonus);

  return {
    classData,
    items,
    modifiers,
    profBonus,
    statAnalysis,
    saveAnalysis,
    topSkills,
  };
}
