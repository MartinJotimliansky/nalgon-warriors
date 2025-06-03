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
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { PersonAdd as SignUpIcon } from '@mui/icons-material';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.username || !formData.email || !formData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const signupData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      };

      console.log('Enviando datos de registro:', signupData);

      await authService.signup(signupData);

      // Después del registro exitoso, iniciar sesión automáticamente
      await authService.login({
        email: formData.email,
        password: formData.password
      });
      navigate('/create-brute');
    } catch (err) {
      console.error('Error durante el registro:', err);
      setError(err.message || 'Error en el registro. Por favor, verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper 
          sx={{ 
            p: 4,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SignUpIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Registro
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre de usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
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
              {loading ? <CircularProgress size={24} /> : 'Registrarse'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="/login" variant="body2">
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
