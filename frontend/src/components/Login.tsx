import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  Container,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { authService, bruteService } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface LoginCredentials {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError('Usuario y contraseña son requeridos');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Enviando login con:', {
        username: credentials.username,
        password: '****'
      });

      await authService.login({
        username: credentials.username.trim(),
        password: credentials.password
      });

      // Obtener los brutos del usuario después del login
      const brutes = await bruteService.getAllBrutes();
      
      if (brutes && brutes.length > 0) {
        // Si tiene brutos, seleccionar el primero y navegar a la arena
        await bruteService.selectBrute(brutes[0].id);
        navigate(`/brutes/${brutes[0].id}`);
      } else {
        // Si no tiene brutos, ir a la pantalla de creación
        navigate('/create-brute');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Usuario"
              name="username"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3,
                mb: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                ¿No tienes una cuenta?{' '}
                <Link 
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/signup')}
                >
                  Regístrate
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
