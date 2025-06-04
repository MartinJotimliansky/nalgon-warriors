import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  IconButton, 
  Typography,
  Tooltip,
  Card,
  CardContent,
  Fade,
  SxProps,
  Theme,
  Avatar
} from '@mui/material';
import { 
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { bruteService } from '../services/api';

import { Brute } from '../types/brute';

interface BruteAvatarProps {
  brute: Brute;
  isSelected: boolean;
  onClick: () => void;
}

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

const BruteAvatar: React.FC<BruteAvatarProps> = ({ brute, isSelected, onClick }) => (
  <Tooltip title={brute.name}>
    <IconButton 
      onClick={onClick}
      sx={{ 
        position: 'relative',
        mr: 1,
        border: (theme: Theme) => isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
        p: 0.5,
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >      <Avatar
        src={`https://robohash.org/${brute.id.toString()}?set=2&size=64x64`}
        alt={brute.name}
        sx={{
          width: 48,
          height: 48,
          backgroundColor: 'background.paper'
        }}
      />
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: '0.75rem',
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: '0 0 4px 4px'
          }}
        >
          {brute.name}
        </Box>
      )}
    </IconButton>
  </Tooltip>
);

const StatBar: React.FC<StatBarProps> = ({ label, value, maxValue = 20 }) => (
  <Box sx={{ width: '100%', mb: 1 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="caption">{label}</Typography>
      <Typography variant="caption">{value}</Typography>
    </Box>
    <Box
      sx={{
        width: '100%',
        height: 4,
        backgroundColor: 'grey.200',
        borderRadius: 2,
        position: 'relative'
      }}
    >
      <Box
        sx={{
          width: `${(value / maxValue) * 100}%`,
          height: '100%',
          backgroundColor: 'primary.main',
          borderRadius: 2,
          transition: 'width 0.5s ease'
        }}
      />
    </Box>
  </Box>
);

const Header: React.FC = () => {
  const [brutes, setBrutes] = useState<Brute[]>([]);
  const [selectedBrute, setSelectedBrute] = useState<Brute | null>(null);
  const [showStats, setShowStats] = useState<boolean>(false);
  const navigate = useNavigate();

  const loadBrutes = async (): Promise<void> => {
    try {
      const allBrutes = await bruteService.getAllBrutes();
      setBrutes(allBrutes);
      const current = await bruteService.getCurrentSelectedBrute();
      setSelectedBrute(current);
    } catch (error) {
      console.error('Error loading brutes:', error);
    }
  };

  useEffect(() => {
    loadBrutes();
  }, []);

  const handleBruteClick = async (brute: Brute): Promise<void> => {
    try {
      await bruteService.selectBrute(brute.id);
      const updatedBrute = await bruteService.getBruteById(brute.id);
      setSelectedBrute(updatedBrute);
      setShowStats(true);
      navigate(`/brutes/${brute.id}`);
    } catch (error) {
      console.error('Error selecting brute:', error);
    }
  };

  const handleCreateBrute = (): void => {
    navigate('/create-brute');
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {brutes.map((brute) => (
              <BruteAvatar
                key={brute.id}
                brute={brute}
                isSelected={selectedBrute?.id === brute.id}
                onClick={() => handleBruteClick(brute)}
              />
            ))}
            {brutes.length < 5 && (
              <Tooltip title="Crear nuevo bruto">
                <IconButton onClick={handleCreateBrute}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {showStats && selectedBrute && selectedBrute.stats && (
        <Fade in={true}>
          <Card 
            sx={{ 
              position: 'absolute', 
              top: 64, 
              right: 16, 
              zIndex: 1000,
              maxWidth: 300,
              boxShadow: 3
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar
                src={`https://robohash.org/${selectedBrute.id.toString()}?set=2&size=128x128`}
                alt={selectedBrute.name}
                sx={{ width: 64, height: 64 }}
              />
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedBrute.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  HP: {selectedBrute.stats.hp}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <StatBar label="Fuerza" value={selectedBrute.stats.strenght} />
                  <StatBar label="Agilidad" value={selectedBrute.stats.agility} />
                  <StatBar label="Resistencia" value={selectedBrute.stats.endurance} />
                  <StatBar label="Inteligencia" value={selectedBrute.stats.intelligence} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      )}
    </>
  );
};

export default Header;
