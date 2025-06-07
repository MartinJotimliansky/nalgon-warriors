import axios, { AxiosInstance } from "axios";
import { Brute, Weapon, Skill } from "../types/brute";

const API_URL = "http://localhost:5000";

interface LoginCredentials {
  username: string;
  password: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  [key: string]: any;
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to notify brute updates
const notifyBruteUpdate = () => {
  window.dispatchEvent(new CustomEvent('bruteUpdated'));
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      if (!credentials.username || !credentials.password) {
        throw new Error("Usuario y contraseña son requeridos");
      }

      console.log("API - Enviando datos de login:", {
        username: credentials.username,
        password: "****",
      });

      const response = await api.post<LoginResponse>("/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });

      if (response.data.access_token) {
        localStorage.setItem("accessToken", response.data.access_token);
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  signup: async (userData: SignupData): Promise<{ message: string }> => {
    try {
      if (!userData || !userData.username || !userData.email || !userData.password) {
        throw new Error("Todos los campos son obligatorios");
      }

      console.log("API - Enviando datos:", userData);

      const response = await api.post("/auth/signup", userData);
      console.log("API - Respuesta:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error en signup:", error.response?.data || error);
      throw error.response?.data?.message || error.response?.data?.errorMessage || error.message;
    }
  },

  logout: (): void => {
    localStorage.removeItem("accessToken");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },
};

export const bruteService = {  createBrute: async (name: string): Promise<Brute> => {
    try {
      if (!name) {
        throw new Error("El nombre del bruto es requerido");
      }

      if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
        throw new Error("El nombre solo puede contener letras, números y guiones");
      }

      if (name.length < 3 || name.length > 20) {
        throw new Error("El nombre debe tener entre 3 y 20 caracteres");
      }

      console.log("API - Creando bruto:", { name });
      const response = await api.post<Brute>("/brutes", { name });
      
      // Notify that brutes have been updated
      notifyBruteUpdate();
      
      return response.data;
    } catch (error: any) {
      console.error("Error al crear bruto:", error);
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(error.response?.data?.message || error.message || "Error al crear el bruto");
    }
  },

  getBruteById: async (bruteId: number): Promise<Brute> => {
    try {
      const response = await api.get<Brute>(`/brutes/${bruteId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener el bruto");
    }
  },

  getAllBrutes: async (): Promise<Brute[]> => {
    try {
      const response = await api.get<Brute[]>("/brutes");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener los brutos");
    }
  },  selectBrute: async (bruteId: number): Promise<void> => {
    try {
      await api.patch(`/brutes/${bruteId}/select`);
      
      // Notify that brute selection has been updated
      notifyBruteUpdate();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al seleccionar el bruto");
    }
  },  getCurrentSelectedBrute: async (): Promise<Brute> => {
    try {
      console.log('🔍 API: Calling getCurrentSelectedBrute...');
      const response = await api.get<Brute>("/brutes/current/selected");
      console.log('🔍 API: getCurrentSelectedBrute response:', response.data);
      console.log('🔍 API: Brute XP:', response.data.xp);
      console.log('🔍 API: Brute Skills:', response.data.skills);
      console.log('🔍 API: Brute Weapons:', response.data.weapons);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: Error in getCurrentSelectedBrute:', error);
      throw new Error(error.response?.data?.message || "Error al obtener el bruto seleccionado");
    }
  },
  getBruteOpponents: async (bruteId: number): Promise<Brute[]> => {
    try {
      const response = await api.get<Brute[]>(`/brutes/${bruteId}/opponents`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener oponentes");
    }
  },

  getBruteConfig: async (): Promise<{ max_brutes: number; base_hp: number; weapon_chance: number }> => {
    try {
      const response = await api.get(`/brutes/config`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener configuración de brutos");
    }
  },
  initiateFight: async (bruteId: number, opponentId: number): Promise<any> => {
    try {
      // Note: bruteId is not needed since the backend uses the selected brute
      const response = await api.post(`/fights/selected-brute/vs/${opponentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al iniciar la batalla");
    }  },

  getStaticGameData: async (): Promise<{
    weapons: Weapon[];
    skills: Skill[];
    config: { max_brutes: number; base_hp: number; weapon_chance: number };
  }> => {
    try {
      const response = await api.get("/brutes/static-data");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener datos estáticos del juego");
    }
  },

  getAllWeapons: async (): Promise<Weapon[]> => {
    try {
      const response = await api.get("/brutes/weapons");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener las armas");
    }
  },

  getAllSkills: async (): Promise<Skill[]> => {
    try {
      const response = await api.get("/brutes/skills");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener las habilidades");
    }
  },
};

export const fightService = {
  startFight: async (opponentId: number): Promise<any> => {
    try {
      const response = await api.post(`/fights/selected-brute/vs/${opponentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al iniciar la pelea");
    }
  },

  getFightResult: async (fightId: number): Promise<any> => {
    try {
      const response = await api.get(`/fight/${fightId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener el resultado de la pelea");
    }
  },

  getFightHistory: async (bruteId: number): Promise<any> => {
    try {
      const response = await api.get(`/fights/${bruteId}/history`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener el historial de peleas");
    }
  },
};

export const levelService = {
  getBruteLevelInfo: async (bruteId: number): Promise<any> => {
    try {
      const response = await api.get(`/level/brute/${bruteId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener información de nivel");
    }
  },
  getAvailableGratifications: async (bruteId: number): Promise<any> => {
    try {
      const response = await api.get(`/level/brute/${bruteId}/gratifications`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al obtener gratificaciones disponibles");
    }
  },

  levelUp: async (bruteId: number, gratificationChoice: { id: string, type: string }): Promise<any> => {
    try {
      const response = await api.post(`/level/level-up`, {
        bruteId,
        gratificationChoice
      });
      
      // Notify that brute has been updated after level up
      notifyBruteUpdate();
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al subir de nivel");
    }
  },
};
