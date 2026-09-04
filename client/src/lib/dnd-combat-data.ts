/**
 * D&D 5e SRD combat data: conditions, class features, racial traits, spell slots.
 * Short SRD-compatible labels and brief descriptions only.
 */

// ===== Conditions (14 standard 5e conditions) =====
export interface ConditionInfo {
  name: string;
  description: string;
}

export const CONDITIONS: ConditionInfo[] = [
  { name: "Blinded", description: "Auto-fail sight checks. Attacks against you have advantage, your attacks have disadvantage." },
  { name: "Charmed", description: "Cannot attack the charmer. Charmer gains social check advantage." },
  { name: "Deafened", description: "Auto-fail hearing checks." },
  { name: "Frightened", description: "Disadvantage on checks/attacks while source is in sight. Cannot move closer to source." },
  { name: "Grappled", description: "Speed becomes 0. Ends if grappler is moved away or condition imposed." },
  { name: "Incapacitated", description: "Cannot take actions, reactions, or bonus actions." },
  { name: "Invisible", description: "Impossible to see without special senses. Attacks against you have disadvantage, your attacks have advantage." },
  { name: "Paralyzed", description: "Incapacitated, auto-fail STR/DEX saves. Attacks within 5ft have advantage and are criticals on hit." },
  { name: "Petrified", description: "Transformed to stone. Weight x10. Incapacitated, auto-fail STR/DEX saves. Resistance to all damage." },
  { name: "Poisoned", description: "Disadvantage on attacks and ability checks." },
  { name: "Prone", description: "Only crawl movement. Disadvantage on attacks. Melee attacks against you have advantage, ranged have disadvantage." },
  { name: "Restrained", description: "Speed 0, no bonus to speed. Attacks against you have advantage, your attacks have disadvantage. Disadvantage on DEX saves." },
  { name: "Stunned", description: "Incapacitated, cannot move. Attacks against you have advantage. Auto-fail STR/DEX saves." },
  { name: "Unconscious", description: "Incapacitated, unaware, drops prone. Attacks within 5ft have advantage and are criticals. Auto-fail STR/DEX saves." },
];

// ===== Class Features (levels 1-20) =====
export interface ClassFeature {
  level: number;
  name: string;
  description: string;
}

export const CLASS_FEATURES: Record<string, ClassFeature[]> = {
  Barbarian: [
    { level: 1, name: "Rage", description: "Bonus action. Resistance to bludgeoning/piercing/slashing. +2 melee damage. Lasts 1 min, 2+ per day." },
    { level: 1, name: "Unarmored Defense", description: "AC = 10 + DEX mod + CON mod (when not wearing armor)." },
    { level: 2, name: "Reckless Attack", description: "Gain advantage on STR melee attacks, but attacks against you have advantage." },
    { level: 2, name: "Danger Sense", description: "Advantage on DEX saves vs effects you can see." },
    { level: 3, name: "Primal Path", description: "Choose a barbarian archetype (Berserker, Totem Warrior, etc.)." },
    { level: 4, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1. (Or take a feat.)" },
    { level: 5, name: "Extra Attack", description: "Attack twice per Attack action." },
    { level: 5, name: "Fast Movement", description: "Speed +10 ft (unless heavy armor)." },
    { level: 6, name: "Path Feature", description: "Primal Path subclass feature." },
    { level: 7, name: "Feral Instinct", description: "Act normally when surprised if you Rage first." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 9, name: "Brutal Critical", description: "Roll one extra weapon damage die on crit." },
    { level: 10, name: "Path Feature", description: "Primal Path subclass feature." },
    { level: 11, name: "Relentless Rage", description: "Drop to 0 HP but not killed? Save DC 10 to drop to 1 HP instead." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 13, name: "Brutal Critical +1", description: "Roll two extra weapon damage dice on crit." },
    { level: 14, name: "Path Feature", description: "Primal Path subclass feature." },
    { level: 15, name: "Persistent Rage", description: "Rage ends early only if you fall unconscious or choose to end it." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 17, name: "Brutal Critical +2", description: "Roll three extra weapon damage dice on crit." },
    { level: 18, name: "Indomitable Might", description: "Use STR mod minimum for STR checks." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Primal Champion", description: "STR and CON +4. Rage damage +2." },
  ],
  Bard: [
    { level: 1, name: "Spellcasting", description: "Cast bard spells. CHA is your spellcasting ability." },
    { level: 1, name: "Bardic Inspiration", description: "Bonus action. Give ally a d6 to add to a roll. CHA mod uses per long rest." },
    { level: 2, name: "Jack of All Trades", description: "Add half proficiency to ability checks you're not proficient in." },
    { level: 2, name: "Song of Rest", description: "Allies regain extra HP during short rest (d6)." },
    { level: 3, name: "Bard College", description: "Choose a bard college (Lore, Valor, etc.)." },
    { level: 3, name: "Expertise", description: "Double proficiency bonus for two chosen skills." },
    { level: 4, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 5, name: "Bardic Inspiration d8", description: "Inspiration die becomes d8." },
    { level: 6, name: "Countercharm", description: "Action: give allies advantage vs charm/frightened." },
    { level: 6, name: "College Feature", description: "Bard College subclass feature." },
    { level: 7, name: "Bardic Inspiration d10", description: "Inspiration die becomes d10." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 9, name: "Song of Rest d8", description: "Song of Rest die becomes d8." },
    { level: 10, name: "Bardic Inspiration d12", description: "Inspiration die becomes d12. Magical Secrets: learn 2 spells from any class." },
    { level: 10, name: "Expertise", description: "Double proficiency for two more skills." },
    { level: 11, name: "College Feature", description: "Bard College subclass feature." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 13, name: "Song of Rest d10", description: "Song of Rest die becomes d10." },
    { level: 14, name: "College Feature", description: "Bard College subclass feature." },
    { level: 15, name: "Bardic Inspiration d12", description: "Inspiration die confirmed d12." },
    { level: 15, name: "Magical Secrets", description: "Learn 2 more spells from any class." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 17, name: "Song of Rest d12", description: "Song of Rest die becomes d12." },
    { level: 18, name: "Magical Secrets", description: "Learn 2 more spells from any class." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Superior Inspiration", description: "Regain one Bardic Inspiration on initiative." },
  ],
  Cleric: [
    { level: 1, name: "Spellcasting", description: "Cast cleric spells. WIS is your spellcasting ability." },
    { level: 1, name: "Divine Domain", description: "Choose a divine domain (Life, Light, War, etc.). Grants domain spells." },
    { level: 2, name: "Channel Divinity: Turn Undead", description: "Action: force undead to flee. DC = cleric spell save DC." },
    { level: 2, name: "Domain Feature", description: "Divine Domain subclass feature." },
    { level: 3, name: "Domain Spells", description: "2nd-level domain spells." },
    { level: 4, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 5, name: "Destroy Undead", description: "Turn Undead can destroy CR 1/2 undead. 2nd-level domain spells." },
    { level: 6, name: "Channel Divinity: 2/rest", description: "Channel Divinity twice per short rest. Domain feature." },
    { level: 7, name: "Domain Spells", description: "4th-level domain spells." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 8, name: "Destroy Undead CR 1", description: "Destroy Undead affects CR 1 undead." },
    { level: 9, name: "Domain Spells", description: "5th-level domain spells." },
    { level: 10, name: "Divine Intervention", description: "Call on deity: 10% chance of intervention. Can be used once per 7 days." },
    { level: 11, name: "Destroy Undead CR 2", description: "Destroy Undead affects CR 2 undead." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 13, name: "Domain Spells", description: "7th-level domain spells." },
    { level: 14, name: "Destroy Undead CR 3", description: "Destroy Undead affects CR 3 undead." },
    { level: 15, name: "Domain Spells", description: "8th-level domain spells." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 17, name: "Destroy Undead CR 4", description: "Destroy Undead affects CR 4 undead. 9th-level domain spells." },
    { level: 18, name: "Channel Divinity 3/rest", description: "Channel Divinity three times per short rest." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Divine Intervention Improvement", description: "Divine Intervention always succeeds. Use again after 1d6 days." },
  ],
  Druid: [
    { level: 1, name: "Druidic", description: "Know the Druidic language." },
    { level: 1, name: "Spellcasting", description: "Cast druid spells. WIS is your spellcasting ability." },
    { level: 2, name: "Wild Shape", description: "Action: transform into a beast. CR limit scales with level. 2 uses per short rest." },
    { level: 2, name: "Druid Circle", description: "Choose a druid circle (Land, Moon, etc.)." },
    { level: 3, name: "Circle Spells", description: "Druid Circle subclass feature." },
    { level: 4, name: "Wild Shape: Swimming", description: "Can transform into beasts with swimming speed. Ability Score Improvement." },
    { level: 5, name: "Wild Shape: Flying", description: "Can transform into beasts with flying speed." },
    { level: 6, name: "Circle Feature", description: "Druid Circle subclass feature." },
    { level: 7, name: "Circle Spells", description: "Druid Circle feature." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 8, name: "Beast Spells", description: "Can cast spells while in Wild Shape (no verbal/somatic components needed)." },
    { level: 9, name: "Circle Feature", description: "Druid Circle subclass feature." },
    { level: 10, name: "Wild Shape 3/rest", description: "Wild Shape can be used 3 times per short rest." },
    { level: 11, name: "Circle Feature", description: "Druid Circle subclass feature." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 14, name: "Circle Feature", description: "Druid Circle subclass feature." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 18, name: "Circle Feature", description: "Druid Circle subclass feature." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Archdruid", description: "Ignore verbal/somatic/verbal components for druid spells. Unlimited Wild Shape uses." },
  ],
  Fighter: [
    { level: 1, name: "Fighting Style", description: "Choose: Archery, Defense, Dueling, GWF, Protection, Two-Weapon." },
    { level: 1, name: "Second Wind", description: "Bonus action: regain 1d10 + fighter level HP. 1/short rest." },
    { level: 2, name: "Action Surge", description: "Get one additional action on your turn. 1/short rest." },
    { level: 3, name: "Martial Archetype", description: "Choose a martial archetype (Champion, Battle Master, etc.)." },
    { level: 4, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 5, name: "Extra Attack", description: "Attack twice per Attack action." },
    { level: 6, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 7, name: "Archetype Feature", description: "Martial Archetype subclass feature." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 9, name: "Indomitable", description: "Reroll a failed save. 1/long rest." },
    { level: 10, name: "Archetype Feature", description: "Martial Archetype subclass feature." },
    { level: 11, name: "Extra Attack (2)", description: "Attack three times per Attack action." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 13, name: "Indomitable 2/rest", description: "Indomitable usable twice per long rest." },
    { level: 14, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 15, name: "Archetype Feature", description: "Martial Archetype subclass feature." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 17, name: "Action Surge 2/turn", description: "Action Surge twice per turn. Indomitable 3/rest." },
    { level: 18, name: "Archetype Feature", description: "Martial Archetype subclass feature." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Extra Attack (3)", description: "Attack four times per Attack action." },
  ],
  Monk: [
    { level: 1, name: "Martial Arts", description: "Unarmed strike d6+DEX/STR. Bonus action unarmed strike after Attack." },
    { level: 1, name: "Unarmored Defense", description: "AC = 10 + DEX mod + WIS mod (when not wearing armor)." },
    { level: 2, name: "Ki", description: "Ki points = monk level. Flurry of Blows, Patient Defense, Step of the Wind (1 Ki each)." },
    { level: 2, name: "Unarmored Movement", description: "Speed +10 ft when unarmored." },
    { level: 3, name: "Monastic Tradition", description: "Choose a monastic tradition (Open Hand, Shadow, etc.)." },
    { level: 3, name: "Deflect Missiles", description: "Reaction: reduce ranged damage by 1d10 + monk level + DEX. Spend 1 Ki to throw back." },
    { level: 4, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 4, name: "Slow Fall", description: "Reaction: reduce falling damage by 5 x monk level." },
    { level: 5, name: "Extra Attack", description: "Attack twice per Attack action." },
    { level: 5, name: "Stunning Strike", description: "Spend 1 Ki on hit: target makes CON save or is stunned." },
    { level: 6, name: "Tradition Feature", description: "Monastic Tradition subclass feature." },
    { level: 6, name: "Ki-Empowered Strikes", description: "Unarmed strikes count as magical." },
    { level: 7, name: "Evasion", description: "DEX saves: no damage on success, half on fail." },
    { level: 7, name: "Stillness of Mind", description: "Action: end charm/frightened on yourself." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 8, name: "Unarmored Movement +5", description: "Speed +15 ft total (unarmored)." },
    { level: 9, name: "Unarmored Movement: Walls", description: "Move along vertical surfaces and across water." },
    { level: 10, name: "Purity of Body", description: "Immune to disease and poison." },
    { level: 11, name: "Tradition Feature", description: "Monastic Tradition subclass feature." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 13, name: "Tongue of the Sun and Moon", description: "Understand all languages." },
    { level: 14, name: "Diamond Soul", description: "Proficient in all saves. Spend 1 Ki to reroll a failed save." },
    { level: 15, name: "Timeless Body", description: "No aging penalties. Need no food or water." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 17, name: "Tradition Feature", description: "Monastic Tradition subclass feature." },
    { level: 18, name: "Empty Body", description: "Spend 4 Ki: invisible for 1 min. Resistance to all but force." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Perfect Self", description: "Regain 4 Ki on initiative if you have 0." },
  ],
  Paladin: [
    { level: 1, name: "Divine Sense", description: "Action: detect celestials/fiends/undead within 60 ft. 3/long rest." },
    { level: 1, name: "Lay on Hands", description: "Pool of 5 x paladin level HP for healing. Can cure disease/poison (costs 5 HP)." },
    { level: 2, name: "Fighting Style", description: "Choose: Defense, Dueling, GWF, Protection." },
    { level: 2, name: "Spellcasting", description: "Cast paladin spells. CHA is your spellcasting ability." },
    { level: 2, name: "Divine Smite", description: "On melee hit: expend a spell slot for 2d8 + 1d8/slot level radiant (max 5d8, +1d8 vs undead/fiends)." },
    { level: 3, name: "Divine Health", description: "Immune to disease." },
    { level: 3, name: "Sacred Oath", description: "Choose a sacred oath (Devotion, Ancients, Vengeance, etc.)." },
    { level: 4, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 5, name: "Extra Attack", description: "Attack twice per Attack action." },
    { level: 6, name: "Aura of Protection", description: "Allies within 10 ft gain CHA mod to saves." },
    { level: 7, name: "Oath Feature", description: "Sacred Oath subclass feature." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 9, name: "Oath Feature", description: "Sacred Oath subclass feature." },
    { level: 10, name: "Aura of Courage", description: "Allies within 10 ft immune to frightened." },
    { level: 11, name: "Improved Divine Smite", description: "Melee weapon attacks deal +1d8 radiant damage (no spell slot needed)." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 13, name: "Oath Feature", description: "Sacred Oath subclass feature." },
    { level: 14, name: "Aura of Devotion", description: "Aura radius increases to 30 ft (Devotion)." },
    { level: 15, name: "Oath Feature", description: "Sacred Oath subclass feature." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 17, name: "Oath Feature", description: "Sacred Oath subclass feature." },
    { level: 18, name: "Aura Improvements", description: "All auras increase to 30 ft radius." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Oath Feature", description: "Sacred Oath subclass capstone feature." },
  ],
  Ranger: [
    { level: 1, name: "Favored Enemy", description: "Advantage on tracking and recall vs one chosen enemy type." },
    { level: 1, name: "Natural Explorer", description: "Advantage on Int/Survival in chosen terrain. Travel benefits." },
    { level: 2, name: "Fighting Style", description: "Choose: Archery, Defense, Dueling, Two-Weapon." },
    { level: 2, name: "Spellcasting", description: "Cast ranger spells. WIS is your spellcasting ability." },
    { level: 3, name: "Ranger Archetype", description: "Choose a ranger archetype (Hunter, Beast Master, etc.)." },
    { level: 3, name: "Primeval Awareness", description: "Spend a spell slot to detect creature types within 1 mile." },
    { level: 4, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 5, name: "Extra Attack", description: "Attack twice per Attack action." },
    { level: 6, name: "Favored Enemy +1", description: "One additional favored enemy. Natural Explorer +1 terrain." },
    { level: 7, name: "Archetype Feature", description: "Ranger Archetype subclass feature." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 8, name: "Land's Stride", description: "Not slowed by difficult terrain. Pass through plants without penalty." },
    { level: 9, name: "Archetype Feature", description: "Ranger Archetype subclass feature." },
    { level: 10, name: "Hide in Plain Sight", description: "10 min to hide: +10 to Stealth in natural terrain." },
    { level: 10, name: "Natural Explorer +1", description: "One additional favored terrain." },
    { level: 11, name: "Archetype Feature", description: "Ranger Archetype subclass feature." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 13, name: "Favored Enemy +1", description: "One additional favored enemy." },
    { level: 14, name: "Vanish", description: "Bonus action: Hide. Also can't be tracked non-magically." },
    { level: 15, name: "Archetype Feature", description: "Ranger Archetype subclass feature." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 17, name: "Archetype Feature", description: "Ranger Archetype subclass feature." },
    { level: 18, name: "Feral Senses", description: "Aware of invisible creatures within 30 ft. No disadvantage vs unseen attackers." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Foe Slayer", description: "Once per turn: add WIS mod to attack/damage vs favored enemy." },
  ],
  Rogue: [
    { level: 1, name: "Expertise", description: "Double proficiency for two chosen skills." },
    { level: 1, name: "Sneak Attack", description: "Once per turn: extra 1d6 damage on attacks with advantage or ally adjacent." },
    { level: 1, name: "Thieves' Cant", description: "Know the secret rogue language." },
    { level: 2, name: "Cunning Action", description: "Bonus action: Dash, Disengage, or Hide." },
    { level: 3, name: "Roguish Archetype", description: "Choose a roguish archetype (Thief, Assassin, Arcane Trickster, etc.)." },
    { level: 3, name: "Steady Aim", description: "Bonus action: give yourself advantage on next attack (Tasha's)." },
    { level: 4, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 5, name: "Uncanny Dodge", description: "Reaction: halve damage from an attacker you can see." },
    { level: 5, name: "Sneak Attack 3d6", description: "Sneak Attack damage increases to 3d6." },
    { level: 6, name: "Expertise", description: "Double proficiency for two more skills." },
    { level: 7, name: "Evasion", description: "DEX saves: no damage on success, half on fail." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 9, name: "Archetype Feature", description: "Roguish Archetype subclass feature." },
    { level: 10, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 11, name: "Reliable Talent", description: "Treat any roll of 1-9 on a d20 for proficient checks as a 10." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 13, name: "Archetype Feature", description: "Roguish Archetype subclass feature." },
    { level: 14, name: "Blind Sense", description: "Aware of hidden creatures within 10 ft." },
    { level: 15, name: "Slippery Mind", description: "Proficiency in WIS saves." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 17, name: "Archetype Feature", description: "Roguish Archetype subclass feature." },
    { level: 18, name: "Elusive", description: "No attack roll has advantage against you." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Stroke of Luck", description: "Once per turn: treat a missed attack as a hit, or a failed check as a 20." },
  ],
  Sorcerer: [
    { level: 1, name: "Spellcasting", description: "Cast sorcerer spells. CHA is your spellcasting ability." },
    { level: 1, name: "Sorcerous Origin", description: "Choose a sorcerous origin (Draconic, Wild Magic, etc.)." },
    { level: 2, name: "Font of Magic", description: "Sorcery points = sorcerer level. Create spell slots, convert to points." },
    { level: 3, name: "Metamagic", description: "Choose 2 metamagic options (Quicken, Twinned, Subtle, etc.)." },
    { level: 4, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 5, name: "Metamagic Options", description: "Access to more metamagic options." },
    { level: 6, name: "Origin Feature", description: "Sorcerous Origin subclass feature." },
    { level: 7, name: "Metamagic +1", description: "Choose a 3rd metamagic option." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 9, name: "Origin Feature", description: "Sorcerous Origin subclass feature." },
    { level: 10, name: "Metamagic +1", description: "Choose a 4th metamagic option. Font of Magic: flexible casting." },
    { level: 11, name: "Sorcerous Restoration", description: "Regain 4 sorcery points on a short rest." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 13, name: "Origin Feature", description: "Sorcerous Origin subclass feature." },
    { level: 14, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 15, name: "Origin Feature", description: "Sorcerous Origin subclass feature." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 17, name: "Metamagic +1", description: "Choose a 5th metamagic option." },
    { level: 18, name: "Origin Feature", description: "Sorcerous Origin subclass feature." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Sorcerous Supreme", description: "Regain 4 sorcery points on short rest. Spend 1 SP on any save to reroll." },
  ],
  Warlock: [
    { level: 1, name: "Otherworldly Patron", description: "Choose a patron (Archfey, Fiend, Great Old One, etc.)." },
    { level: 1, name: "Pact Magic", description: "Cast warlock spells. CHA is your spellcasting ability. Slots recharge on short rest." },
    { level: 2, name: "Eldritch Invocations", description: "Choose 2 eldritch invocations (Agonizing Blast, Mask of Many Faces, etc.)." },
    { level: 3, name: "Pact Boon", description: "Choose: Pact of the Blade, Pact of the Chain, or Pact of the Tome." },
    { level: 4, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 5, name: "Eldritch Invocation +1", description: "Choose a 3rd eldritch invocation." },
    { level: 5, name: "Thirsting Blade", description: "Can attack twice with pact weapon (if Pact of the Blade)." },
    { level: 6, name: "Patron Feature", description: "Otherworldly Patron subclass feature." },
    { level: 7, name: "Eldritch Invocation +1", description: "Choose a 4th eldritch invocation." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 9, name: "Patron Feature", description: "Otherworldly Patron subclass feature." },
    { level: 10, name: "Eldritch Invocation +1", description: "Choose a 5th eldritch invocation." },
    { level: 11, name: "Mystic Arcanum", description: "Learn a 6th-level spell. Cast once per long rest without a slot." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 13, name: "Patron Feature", description: "Otherworldly Patron subclass feature." },
    { level: 14, name: "Eldritch Invocation +1", description: "Choose a 6th eldritch invocation." },
    { level: 15, name: "Mystic Arcanum (7th)", description: "Learn a 7th-level spell. Cast once per long rest." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 17, name: "Patron Feature", description: "Otherworldly Patron subclass feature." },
    { level: 17, name: "Mystic Arcanum (8th)", description: "Learn an 8th-level spell. Cast once per long rest." },
    { level: 18, name: "Eldritch Invocation +1", description: "Choose a 7th eldritch invocation." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Eldritch Master", description: "Regain all pact magic slots with 1 minute of prayer." },
  ],
  Wizard: [
    { level: 1, name: "Spellcasting", description: "Cast wizard spells. INT is your spellcasting ability." },
    { level: 1, name: "Arcane Recovery", description: "Once per long rest: recover spell slots totaling level/2 (rounded up)." },
    { level: 2, name: "Arcane Tradition", description: "Choose an arcane tradition (Evocation, Abjuration, etc.)." },
    { level: 3, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 4, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 5, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 6, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 7, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 8, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 9, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 10, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 11, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 12, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 13, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 14, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 15, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 16, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 17, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 18, name: "Tradition Feature", description: "Arcane Tradition subclass feature." },
    { level: 19, name: "Ability Score Improvement", description: "Increase one ability score by 2, or two by 1." },
    { level: 20, name: "Signature Spell", description: "Choose 2 3rd-level spells to cast at will. 1/short rest: cast a 3rd-level spell free." },
  ],
};

// ===== Racial Traits =====
export interface RacialTrait {
  name: string;
  description: string;
  skillGranted?: string;
}

export const RACIAL_TRAITS: Record<string, RacialTrait[]> = {
  Human: [
    { name: "Versatility", description: "All ability scores +1. (Or Variant Human: +1 to two scores, one feat, one skill.)" },
  ],
  Dwarf: [
    { name: "Dwarven Resilience", description: "Advantage on saves vs poison, resistance to poison damage." },
    { name: "Stonecunning", description: "Double proficiency on History checks related to stonework." },
    { name: "Dwarven Combat Training", description: "Proficiency with battleaxe, handaxe, light hammer, warhammer." },
    { name: "Tool Proficiency", description: "Proficiency with one artisan's tool (smith's, brewer's, or mason's)." },
    { name: "Speed 25", description: "Base speed 25 ft, not reduced by heavy armor." },
    { name: "Dwarven Toughness", description: "(Hill Dwarf) HP +1 per level (including 1st)." },
  ],
  Elf: [
    { name: "Keen Senses", description: "Proficiency in Perception.", skillGranted: "Perception" },
    { name: "Fey Ancestry", description: "Advantage on saves vs charm. Immune to magical sleep." },
    { name: "Trance", description: "Meditate 4 hours instead of sleeping for a long rest." },
    { name: "Darkvision", description: "See in dim light within 60 ft as if bright." },
    { name: "Elven Weapon Training", description: "Proficiency with longsword, shortsword, longbow, shortbow." },
  ],
  Halfling: [
    { name: "Lucky", description: "Reroll 1s on attack rolls, ability checks, and saving throws." },
    { name: "Brave", description: "Advantage on saves vs frightened." },
    { name: "Halfling Nimbleness", description: "Move through larger creatures' spaces." },
    { name: "Naturally Stealthy", description: "(Lightfoot) Hide behind larger creatures." },
  ],
  Dragonborn: [
    { name: "Draconic Ancestry", description: "Choose dragon type: determines breath weapon damage and resistance." },
    { name: "Breath Weapon", description: "Action: exhale energy (5 ft cone or 30 ft line). Damage = 2d6 + 1d6/level (max 5d6). CON save for half. 1/short rest." },
    { name: "Damage Resistance", description: "Resistance to damage type matching your draconic ancestry." },
  ],
  Gnome: [
    { name: "Gnome Cunning", description: "Advantage on INT, WIS, and CHA saves vs magic." },
    { name: "Darkvision", description: "See in dim light within 60 ft as if bright." },
    { name: "Artificer's Lore", description: "(Rock Gnome) Double proficiency on History checks related to magic items." },
    { name: "Tinker", description: "(Rock Gnome) Create small clockwork devices." },
  ],
  HalfElf: [
    { name: "Versatile Heritage", description: "CHA +2, and +1 to two other ability scores." },
    { name: "Fey Ancestry", description: "Advantage on saves vs charm. Immune to magical sleep." },
    { name: "Skill Versatility", description: "Choose two skills to gain proficiency in.", skillGranted: "Any Two" },
    { name: "Darkvision", description: "See in dim light within 60 ft as if bright." },
  ],
  HalfOrc: [
    { name: "Relentless Endurance", description: "Drop to 0 HP but not killed? Drop to 1 HP instead. 1/long rest." },
    { name: "Savage Attacks", description: "Roll an extra weapon damage die on melee crits." },
    { name: "Menacing", description: "Proficiency in Intimidation.", skillGranted: "Intimidation" },
    { name: "Darkvision", description: "See in dim light within 60 ft as if bright." },
  ],
  Tiefling: [
    { name: "Darkvision", description: "See in dim light within 60 ft as if bright." },
    { name: "Hellish Resistance", description: "Resistance to fire damage." },
    { name: "Infernal Legacy", description: "Know Thaumaturgy cantrip. At 3rd level: Hellish Rebuke (2/day). At 5th: Darkness (1/day)." },
    { name: " Infernal Tie", description: "CHA +2, INT +1." },
  ],
  Goliath: [
    { name: "Stone's Endurance", description: "Reaction: reduce damage by 1d12 + CON mod. 1/short rest." },
    { name: "Powerful Build", description: "Count as one size larger for carrying capacity." },
    { name: "Mountain Born", description: "Resistance to cold damage. Adapted to high altitudes." },
    { name: "Natural Athlete", description: "Proficiency in Athletics.", skillGranted: "Athletics" },
  ],
  Aasimar: [
    { name: "Darkvision", description: "See in dim light within 60 ft as if bright." },
    { name: "Celestial Resistance", description: "Resistance to necrotic and radiant damage." },
    { name: "Healing Hands", description: "Action: restore HP equal to level. 1/long rest." },
    { name: "Light Bearer", description: "Know the Light cantrip. WIS is the spellcasting ability." },
    { name: "Radiant Soul", description: "(Protector) Once per long rest: fly 30 ft and deal extra radiant damage on attacks." },
  ],
  AirGenasi: [
    { name: "Darkvision", description: "See in dim light within 60 ft as if bright." },
    { name: "Unending Breath", description: "Hold breath indefinitely while not incapacitated." },
    { name: "Mingle with the Wind", description: "Cast Levitate once per long rest. CON is the spellcasting ability." },
    { name: "Endurance of the Elements", description: "Resistance to the element of your genasi type." },
  ],
};

// ===== Spell Slot Calculator =====
export interface SpellSlotInfo {
  level: number;
  slots: number;
}

const FULL_CASTER_SLOTS: number[][] = [
  // [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th] by character level
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // 1
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // 2
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // 3
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // 4
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // 5
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // 6
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // 7
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // 8
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // 9
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // 10
  [4, 3, 3, 3, 2, 1, 0, 0, 0], // 11
  [4, 3, 3, 3, 2, 1, 0, 0, 0], // 12
  [4, 3, 3, 3, 2, 1, 1, 0, 0], // 13
  [4, 3, 3, 3, 2, 1, 1, 0, 0], // 14
  [4, 3, 3, 3, 2, 1, 1, 1, 0], // 15
  [4, 3, 3, 3, 2, 1, 1, 1, 0], // 16
  [4, 3, 3, 3, 2, 1, 1, 1, 1], // 17
  [4, 3, 3, 3, 3, 1, 1, 1, 1], // 18
  [4, 3, 3, 3, 3, 2, 1, 1, 1], // 19
  [4, 3, 3, 3, 3, 2, 2, 1, 1], // 20
];

const HALF_CASTER_SLOTS: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // 2
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // 3
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // 4
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // 5
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // 6
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // 7
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // 8
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // 9
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // 10
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // 11
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // 12
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // 13
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // 14
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // 15
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // 16
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // 17
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // 18
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // 19
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // 20
];

const FULL_CASTERS = ["Bard", "Cleric", "Druid", "Sorcerer", "Wizard"];
const HALF_CASTERS = ["Paladin", "Ranger"];

export function getSpellSlots(className: string, level: number): SpellSlotInfo[] {
  const lvl = Math.min(20, Math.max(1, level));

  if (FULL_CASTERS.includes(className)) {
    const slots = FULL_CASTER_SLOTS[lvl - 1];
    return slots.map((slots, i) => ({ level: i + 1, slots })).filter((s) => s.slots > 0);
  }

  if (HALF_CASTERS.includes(className)) {
    const slots = HALF_CASTER_SLOTS[lvl - 1];
    return slots.map((slots, i) => ({ level: i + 1, slots })).filter((s) => s.slots > 0);
  }

  // Warlock: pact magic — slots recharge on short rest, level caps at 5th
  if (className === "Warlock") {
    const numSlots = lvl >= 17 ? 4 : lvl >= 11 ? 3 : lvl >= 3 ? 2 : 1;
    const slotLevel = Math.min(5, Math.ceil(lvl / 2));
    return [{ level: slotLevel, slots: numSlots }];
  }

  return [];
}

// ===== Race Skill Proficiencies =====
export function getRaceSkillProficiencies(race: string): string[] {
  const traits = RACIAL_TRAITS[race];
  if (!traits) return [];
  const skills: string[] = [];
  for (const trait of traits) {
    if (trait.skillGranted && trait.skillGranted !== "Any Two") {
      skills.push(trait.skillGranted);
    }
  }
  return skills;
}

// ===== Get class features for a given level =====
export function getClassFeatures(className: string, level: number): ClassFeature[] {
  const features = CLASS_FEATURES[className];
  if (!features) return [];
  return features.filter((f) => f.level <= level);
}

// ===== Get racial traits for a given race =====
export function getRacialTraits(race: string): RacialTrait[] {
  return RACIAL_TRAITS[race] || [];
}
