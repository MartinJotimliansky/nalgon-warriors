import React, { useState, useEffect } from 'react';
import { Brute } from '../types/brute';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  Container,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Fade,
  Alert,
  LinearProgress
} from '@mui/material';
import { 
  SportsKabaddi as BruteIcon,
  Casino as DiceIcon,
  Save as SaveIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';
import { bruteService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, maxValue = 20 }) => (
  <Box sx={{ width: '100%', mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {value}
      </Typography>
    </Box>
    <LinearProgress 
      variant="determinate" 
      value={(value / maxValue) * 100} 
      sx={{ 
        height: 10, 
        borderRadius: 5,
        backgroundColor: 'grey.200',
        '& .MuiLinearProgress-bar': {
          borderRadius: 5,
        }
      }}
    />
  </Box>
);

const BruteCreation = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [brute, setBrute] = useState<Brute | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {    // Verificar autenticación
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCreateBrute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {      const newBrute = await bruteService.createBrute(name);
      await bruteService.selectBrute(newBrute.id);
      navigate(`/brutes/${newBrute.id}`); // Redirige directamente a la arena del bruto
  } catch (err: any) {
      if (err.message?.includes('Sesión expirada')) {
        navigate('/login');
      } else {
        setError(err.message || 'Error al crear el bruto');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderBruteStats = () => {
    if (!brute || !brute.stats) return null;

    const stats = brute.stats;
    return (
      <Card sx={{ mt: 3, backgroundColor: 'background.paper' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HeartIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="h6">
              HP: {stats.hp}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <StatBar label="Fuerza" value={stats.strenght} />
          <StatBar label="Agilidad" value={stats.agility} />
          <StatBar label="Resistencia" value={stats.endurance} />
          <StatBar label="Inteligencia" value={stats.intelligence} />
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <BruteIcon sx={{ mr: 2, fontSize: 40 }} />
            <Typography variant="h4" component="h1">
              Crear Bruto
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleCreateBrute}>
            <TextField
              fullWidth
              label="Nombre del Bruto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !name}
              startIcon={loading ? <CircularProgress size={20} /> : <DiceIcon />}
              sx={{ mb: 2 }}
            >
              {loading ? 'Creando...' : 'Crear Bruto'}
            </Button>
          </form>

          {brute && (
            <Fade in={true}>
              <Box>
                <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
                  ¡Bruto Creado!
                </Typography>
                {renderBruteStats()}
              </Box>
            </Fade>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default BruteCreation;
