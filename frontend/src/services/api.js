import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {  login: async (credentials) => {
    try {
      if (!credentials.username || !credentials.password) {
        throw new Error('Usuario y contraseña son requeridos');
      }

      console.log('API - Enviando datos de login:', {
        username: credentials.username,
        password: '****'
      });

      // Enviar directamente como JSON, que es lo que espera el backend
      const response = await api.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
      });

      if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },  signup: async (userData) => {
    try {
      if (!userData || !userData.username || !userData.email || !userData.password) {
        throw new Error('Todos los campos son obligatorios');
      }

      console.log('API - Enviando datos:', userData);
      
      const response = await api.post('/auth/signup', {
        username: userData.username,
        email: userData.email,
        password: userData.password
      });

      console.log('API - Respuesta:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en signup:', error.response?.data || error);
      throw error.response?.data?.message || error.response?.data?.errorMessage || error.message;
    }
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};

export const bruteService = {
  createBrute: async (name) => {
    try {
      if (!name) {
        throw new Error('El nombre del bruto es requerido');
      }

      if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
        throw new Error('El nombre solo puede contener letras, números y guiones');
      }

      if (name.length < 3 || name.length > 20) {
        throw new Error('El nombre debe tener entre 3 y 20 caracteres');
      }

      console.log('API - Creando bruto:', { name });
      const response = await api.post('/users/brutes', { name });
      return response.data;
    } catch (error) {
      console.error('Error al crear bruto:', error);
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada');
      }
      throw new Error(error.response?.data?.message || error.message || 'Error al crear el bruto');
    }
  },

  getBruteById: async (bruteId) => {
    try {
      const response = await api.get(`/users/brutes/${bruteId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener bruto:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener el bruto');
    }
  },

  getAllBrutes: async () => {
    try {
      const response = await api.get('/users/brutes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener brutos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los brutos');
    }
  },
  selectBrute: async (bruteId) => {
    try {
      const response = await api.patch(`/users/brutes/${bruteId}/select`);
      return response.data;
    } catch (error) {
      console.error('Error al seleccionar bruto:', error);
      throw new Error(error.response?.data?.message || 'Error al seleccionar el bruto');
    }
  },

  getCurrentSelectedBrute: async () => {
    try {
      const brutes = await bruteService.getAllBrutes();
      // Asumimos que el usuario tiene una propiedad selected_brute_id
      const selectedBrute = brutes.find(brute => brute.isSelected);
      return selectedBrute || null;
    } catch (error) {
      console.error('Error al obtener bruto seleccionado:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener el bruto seleccionado');
    }
  },

  getBruteOpponents: async (bruteId) => {
    try {
      const response = await api.get(`/users/brutes/${bruteId}/opponents`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener oponentes:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los oponentes');
    }
  },
};
