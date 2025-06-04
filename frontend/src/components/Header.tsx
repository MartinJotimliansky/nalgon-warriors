import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  IconButton, 
  Tooltip,
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

const BruteAvatar: React.FC<BruteAvatarProps> = ({ brute, isSelected, onClick }) => (
  <Tooltip title={brute.name}>
    <IconButton 
      onClick={onClick}
      sx={{ 
        position: 'relative',
        mr: 1,
        border: (theme) => isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
        p: 0.5,
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >        <Avatar
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

const Header: React.FC = () => {
  const [brutes, setBrutes] = useState<Brute[]>([]);
  const [selectedBrute, setSelectedBrute] = useState<Brute | null>(null);
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
      navigate('/opponents');
    } catch (error) {
      console.error('Error selecting brute:', error);
    }
  };

  const handleCreateBrute = (): void => {
    navigate('/create-brute');
  };

  return (
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
  );
};

export default Header;
