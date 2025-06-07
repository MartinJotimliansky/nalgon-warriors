import { bruteService } from './api';
import { Weapon, Skill } from '../types/brute';

interface StaticGameData {
  weapons: Weapon[];
  skills: Skill[];
  config: { max_brutes: number; base_hp: number; weapon_chance: number };
}

class StaticDataManager {
  private static instance: StaticDataManager;
  private staticData: StaticGameData | null = null;
  private loadingPromise: Promise<StaticGameData> | null = null;

  public static getInstance(): StaticDataManager {
    if (!StaticDataManager.instance) {
      StaticDataManager.instance = new StaticDataManager();
    }
    return StaticDataManager.instance;
  }

  /**
   * Loads static data once and caches it. Subsequent calls return cached data.
   * Returns the same promise if already loading to avoid duplicate requests.
   */
  public async getStaticData(): Promise<StaticGameData> {
    // If already loaded, return cached data
    if (this.staticData) {
      console.log('📦 StaticDataManager: Using cached static data');
      return this.staticData;
    }

    // If currently loading, return the existing promise
    if (this.loadingPromise) {
      console.log('⏳ StaticDataManager: Waiting for ongoing load...');
      return this.loadingPromise;
    }

    // Start loading and cache the promise
    console.log('🔄 StaticDataManager: Loading static data from server...');
    this.loadingPromise = this.loadStaticData();

    try {
      this.staticData = await this.loadingPromise;
      console.log('✅ StaticDataManager: Static data loaded and cached');
      return this.staticData;
    } catch (error) {
      console.error('❌ StaticDataManager: Failed to load static data:', error);
      throw error;
    } finally {
      // Clear the loading promise whether successful or not
      this.loadingPromise = null;
    }
  }

  /**
   * Loads static data from the server
   */
  private async loadStaticData(): Promise<StaticGameData> {
    return await bruteService.getStaticGameData();
  }

  /**
   * Gets weapons from cached data
   */
  public async getWeapons(): Promise<Weapon[]> {
    const data = await this.getStaticData();
    return data.weapons;
  }

  /**
   * Gets skills from cached data
   */
  public async getSkills(): Promise<Skill[]> {
    const data = await this.getStaticData();
    return data.skills;
  }

  /**
   * Gets config from cached data
   */
  public async getConfig(): Promise<{ max_brutes: number; base_hp: number; weapon_chance: number }> {
    const data = await this.getStaticData();
    return data.config;
  }

  /**
   * Forces a reload of static data (useful for cache invalidation)
   */
  public async reloadStaticData(): Promise<StaticGameData> {
    console.log('🔄 StaticDataManager: Force reloading static data...');
    this.staticData = null;
    this.loadingPromise = null;
    return this.getStaticData();
  }

  /**
   * Clears cached data
   */
  public clearCache(): void {
    console.log('🗑️ StaticDataManager: Clearing cached data');
    this.staticData = null;
    this.loadingPromise = null;
  }
}

// Export singleton instance
export const staticDataManager = StaticDataManager.getInstance();
