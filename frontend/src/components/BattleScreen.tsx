import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fightService } from '../services/api';
import './BattleScreen.css';
import { Brute } from '../types/brute';

const BattleScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [winner, setWinner] = useState<Brute | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const opponentId = searchParams.get('opponentId');
    
    const startBattle = async () => {
      if (!opponentId) {
        setError('No se especificó un oponente');
        setLoading(false);
        return;
      }

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

  if (loading) {
    return <div className="battle-result">Iniciando batalla...</div>;
  }

  if (error) {
    return (
      <div className="battle-result error">
        <p>{error}</p>
        <button onClick={() => navigate('/opponents')}>Volver a oponentes</button>
      </div>
    );
  }

  return (
    <div className="battle-result">
      {winner && (
        <>
          <h2>¡{winner.name} es el ganador!</h2>
          <button onClick={() => navigate('/opponents')}>Volver a oponentes</button>
        </>
      )}
    </div>
  );
};

export default BattleScreen;
