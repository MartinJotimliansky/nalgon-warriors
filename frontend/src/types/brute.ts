export interface Stats {
  id: number;
  available_points: number;
  strenght: number;
  agility: number;
  endurance: number;
  intelligence: number;
  hp: number;
}

export interface Weapon {
  id: number;
  name: string;
  min_damage: number;
  max_damage: number;
  crit_chance: number;
  range: number;
  draw_chance: number;
  hit_chance: number;
  speed: number;
  effect_ids: number[];
  power_value: number;
}

export interface Skill {
  id: number;
  name: string | null;
  activationTriggers: string[];
  effectJson: {
    type: 'buff' | 'heal' | 'dodge' | 'counter';
    value: number;
  };
  is_passive: boolean;
  power_value: number;
}

export interface Brute {
  id: number;
  name: string;
  level: number;
  xp: number;
  gold: number;
  stats: Stats;
  skills: Skill[];
  weapons: Weapon[];
  isSelected?: boolean;
}
