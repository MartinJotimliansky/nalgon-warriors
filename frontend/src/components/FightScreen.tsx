import React from 'react';
import { Brute } from '../types/brute';

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
      </div>

      <button onClick={onClose} className="close-button">
        Cerrar
      </button>

      <style>{`
        .fight-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .fight-arena {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          max-width: 1000px;
          margin-bottom: 40px;
        }

        .fighter {
          text-align: center;
          color: white;
        }

        .fighter-image {
          width: 200px;
          height: 200px;
          margin-bottom: 20px;
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          background: #444;
          border-radius: 10px;
        }

        .vs {
          font-size: 48px;
          font-weight: bold;
          color: #ff4444;
          margin: 0 40px;
        }

        .stats {
          background: rgba(255, 255, 255, 0.1);
          padding: 10px;
          border-radius: 5px;
          margin-top: 10px;
        }

        .fight-status {
          color: white;
          text-align: center;
          font-size: 24px;
          margin: 20px 0;
        }

        .close-button {
          padding: 10px 20px;
          background: #ff4444;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
        }

        .close-button:hover {
          background: #ff6666;
        }
      `}</style>
    </div>
  );
};

export default FightScreen;
