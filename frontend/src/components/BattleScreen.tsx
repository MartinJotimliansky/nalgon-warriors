import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fightService } from '../services/api';
import '../styles/BattleScreen.css';
import { Brute } from '../types/brute';

const BattleScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [winner, setWinner] = useState<Brute | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const battleStartedRef = useRef<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const opponentId = searchParams.get('opponentId');
    
    // Prevenir múltiples llamadas en React Strict Mode
    if (battleStartedRef.current) return;
    
    const startBattle = async () => {
      if (!opponentId) {
        setError('No se especificó un oponente');
        setLoading(false);
        return;
      }

      battleStartedRef.current = true;

      try {
        const result = await fightService.startFight(Number(opponentId));
        setWinner(result.winner);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al iniciar la pelea');
      } finally {
        setLoading(false);
      }
    };

    startBattle();
  }, [location.search]);
  const handleReturnToOpponents = () => {
    console.log('🔄 BattleScreen: Battle completed, clearing cache and updating brute data...');
    
    // Clear all cached data to force refresh
    sessionStorage.removeItem('currentSelectedBrute');
    sessionStorage.removeItem('bruteOpponents');
    sessionStorage.removeItem('fightHistory');
    sessionStorage.removeItem('bruteLevelInfo');
    sessionStorage.removeItem('allBrutes');
    sessionStorage.removeItem('bruteConfig');
    
    // Dispatch event to notify components to refresh
    window.dispatchEvent(new CustomEvent('bruteUpdated', { 
      detail: { postBattle: true } 
    }));
    
    navigate('/opponents');
  };

  if (loading) {
    return <div className="battle-result">Iniciando batalla...</div>;
  }

  if (error) {
    return (
      <div className="battle-result error">
        <p>{error}</p>
        <button onClick={handleReturnToOpponents}>Volver a oponentes</button>
      </div>
    );
  }

  return (
    <div className="battle-result">
      {winner && (
        <>
          <h2>¡{winner.name} es el ganador!</h2>
          <button onClick={handleReturnToOpponents}>Volver a oponentes</button>
        </>
      )}
    </div>
  );
};

export default BattleScreen;
