import React, { useState, useEffect, useCallback } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
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

const Header: React.FC = () => {  const [brutes, setBrutes] = useState<Brute[]>([]);
  const [selectedBrute, setSelectedBrute] = useState<Brute | null>(null);
  const [maxBrutes, setMaxBrutes] = useState<number>(5); // Default 5, se actualizará desde backend
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();  const loadBrutes = useCallback(async (): Promise<void> => {
    // Prevent multiple simultaneous calls
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('🔍 Header: Loading brutes...');
      
      // Check if we have cached data to avoid duplicate calls
      const cachedBrutes = sessionStorage.getItem('allBrutes');
      const cachedConfig = sessionStorage.getItem('bruteConfig');
      const cachedCurrentBrute = sessionStorage.getItem('currentSelectedBrute');
      
      if (cachedBrutes && cachedConfig && cachedCurrentBrute) {
        console.log('🎯 Header: Using cached data');
        setBrutes(JSON.parse(cachedBrutes));
        setMaxBrutes(JSON.parse(cachedConfig).max_brutes);
        setSelectedBrute(JSON.parse(cachedCurrentBrute));
        return;
      }
      
      const [allBrutes, config] = await Promise.all([
        bruteService.getAllBrutes(),
        bruteService.getBruteConfig()
      ]);
      
      console.log('🔍 Header: Fresh data loaded - Brutes:', allBrutes.length);
      
      setBrutes(allBrutes);
      setMaxBrutes(config.max_brutes);
      
      const current = await bruteService.getCurrentSelectedBrute();
      setSelectedBrute(current);
      
      // Cache the data to avoid duplicate calls
      sessionStorage.setItem('allBrutes', JSON.stringify(allBrutes));
      sessionStorage.setItem('bruteConfig', JSON.stringify(config));
      sessionStorage.setItem('currentSelectedBrute', JSON.stringify(current));
      
    } catch (error) {
      console.error('❌ Header: Error loading brutes:', error);
      // En caso de error, asegurar que el botón + aparezca
      setBrutes([]);
      setMaxBrutes(5); // Fallback default
      setSelectedBrute(null);    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);useEffect(() => {
    // Only load on initial mount and specific route changes
    if (location.pathname === '/opponents' || location.pathname === '/create-brute' || brutes.length === 0) {
      loadBrutes();
    }

    // Escuchar eventos de actualización de brutos
    const handleBruteUpdate = () => {
      console.log('🔄 Header: Brute update event received, reloading brutes...');
      loadBrutes();
    };

    window.addEventListener('bruteUpdated', handleBruteUpdate);

    return () => {
      window.removeEventListener('bruteUpdated', handleBruteUpdate);
    };
  }, [location.pathname, brutes.length, loadBrutes]);  const handleBruteClick = async (brute: Brute): Promise<void> => {
    try {
      await bruteService.selectBrute(brute.id);
      const updatedBrute = await bruteService.getBruteById(brute.id);
      setSelectedBrute(updatedBrute);
      
      // Clear relevant cache data to force refresh in OpponentSelection
      sessionStorage.removeItem('currentSelectedBrute');
      sessionStorage.removeItem('bruteOpponents');
      sessionStorage.removeItem('fightHistory');
      sessionStorage.removeItem('bruteLevelInfo');
      
      // Update the selected brute cache with new data
      sessionStorage.setItem('currentSelectedBrute', JSON.stringify(updatedBrute));
      
      // Update brutes list to reflect the new selected brute
      setBrutes(prevBrutes => 
        prevBrutes.map(b => ({ ...b, isSelected: b.id === brute.id }))
      );
      
      // Emit event for other components to react
      window.dispatchEvent(new CustomEvent('bruteUpdated', { 
        detail: { selectedBrute: updatedBrute } 
      }));
      
      console.log('🔄 Header: Brute selection updated, navigating to opponents');
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
      <Toolbar>        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>          {brutes.map((brute) => (
            <BruteAvatar
              key={brute.id}
              brute={brute}
              isSelected={selectedBrute?.id === brute.id}
              onClick={() => handleBruteClick(brute)}
            />
          ))}          {(() => {
            console.log('🔍 Header: Brutes length for + button:', brutes.length, 'Max brutes:', maxBrutes, 'Should show +:', brutes.length < maxBrutes);
            return null;
          })()}
          {brutes.length < maxBrutes && (
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
