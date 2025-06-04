import React from 'react';
import { Brute } from '../types/brute';
import '../styles/FightScreen.css';

interface FightScreenProps {
  brute: Brute;
  opponent: Brute;
  onClose: () => void;
}

const FightScreen: React.FC<FightScreenProps> = ({ brute, opponent, onClose }) => {
  return (
    <div className="fight-screen">
      <div className="fight-arena">
        <div className="fighter brute">
          <div className="fighter-image">
            <div className="placeholder-image"></div>
          </div>
          <h3>{brute.name}</h3>
          <div className="stats">
            <p>HP: {brute.stats.hp}</p>
            <p>Nivel: {brute.level}</p>
          </div>
        </div>

        <div className="vs">VS</div>

        <div className="fighter opponent">
          <div className="fighter-image">
            <div className="placeholder-image"></div>
          </div>
          <h3>{opponent.name}</h3>
          <div className="stats">
            <p>HP: {opponent.stats.hp}</p>
            <p>Nivel: {opponent.level}</p>
          </div>
        </div>
      </div>

      <div className="fight-status">
        <h2>¡PELEANDO!</h2>
      </div>      <button onClick={onClose} className="close-button">
        Cerrar
      </button>
    </div>
  );
};

export default FightScreen;
