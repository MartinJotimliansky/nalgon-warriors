import React, { useState, useEffect } from 'react';
import { FaLevelUpAlt, FaDumbbell, FaArrowRight, FaBolt, FaStar } from 'react-icons/fa';
import { GiShield, GiBrain, GiSwordman } from 'react-icons/gi';
import './LevelUp.css';

interface Gratification {
  id: number;
  name: string;
  type: string;
  description: string;
  value: any;
}

interface LevelUpProps {
  currentLevel: number;
  newLevel: number;
  availableGratifications: Gratification[];
  onGratificationSelected: (gratificationId: number) => void;
  onCancel: () => void;
}

const LevelUp: React.FC<LevelUpProps> = ({
  currentLevel,
  newLevel,
  availableGratifications,
  onGratificationSelected,
  onCancel
}) => {
  const [selectedGratification, setSelectedGratification] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);  const getGratificationIcon = (type: string) => {
    switch (type) {
      case 'stat_boost':
        return <FaDumbbell />;
      case 'weapon':
        return <GiSwordman />;
      case 'skill':
        return <FaStar />;
      default:
        return <FaLevelUpAlt />;
    }
  };
  const getStatIcon = (statName: string) => {
    switch (statName.toLowerCase()) {
      case 'strength':
        return <FaDumbbell />;
      case 'agility':
        return <FaBolt />;
      case 'intellect':
        return <GiBrain />;
      case 'endurance':
        return <GiShield />;
      default:
        return <FaDumbbell />;
    }
  };

  const renderGratificationValue = (gratification: Gratification) => {
    if (gratification.type === 'stat_boost') {
      return (
        <div className="stat-boosts">
          {Object.entries(gratification.value).map(([stat, value]) => (
            <div key={stat} className="stat-boost">
              {getStatIcon(stat)}
              <span>+{value as number}</span>
            </div>
          ))}
        </div>
      );
    } else if (gratification.type === 'weapon') {
      return (
        <div className="weapon-info">
          <span className="damage">Daño: {gratification.value.damage}</span>
          {gratification.value.special && (
            <span className="special">Especial: {gratification.value.special}</span>
          )}
        </div>
      );
    } else if (gratification.type === 'skill') {
      return (
        <div className="skill-info">
          <span className="effect">Efecto: {gratification.value.effect}</span>
          <span className="cooldown">Cooldown: {gratification.value.cooldown}s</span>
        </div>
      );
    }
    return null;
  };

  const handleGratificationClick = (gratificationId: number) => {
    setSelectedGratification(gratificationId);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedGratification) {
      onGratificationSelected(selectedGratification);
    }
  };

  const handleCancel = () => {
    setSelectedGratification(null);
    setShowConfirmation(false);
  };

  return (
    <div className="level-up-overlay">
      <div className="level-up-modal">
        <div className="level-up-header">
          <FaLevelUpAlt className="level-up-icon" />
          <h1>¡SUBISTE DE NIVEL!</h1>
          <div className="level-transition">
            <span className="old-level">Nivel {currentLevel}</span>
            <FaArrowRight className="arrow" />
            <span className="new-level">Nivel {newLevel}</span>
          </div>
        </div>

        {!showConfirmation ? (
          <div className="gratification-selection">
            <h2>Elige tu recompensa:</h2>
            <div className="gratifications-grid">
              {availableGratifications.map((gratification) => (
                <div
                  key={gratification.id}
                  className={`gratification-card ${selectedGratification === gratification.id ? 'selected' : ''}`}
                  onClick={() => handleGratificationClick(gratification.id)}
                >
                  <div className="gratification-icon">
                    {getGratificationIcon(gratification.type)}
                  </div>
                  <h3>{gratification.name}</h3>
                  <p className="gratification-description">
                    {gratification.description}
                  </p>
                  <div className="gratification-value">
                    {renderGratificationValue(gratification)}
                  </div>
                  <div className="gratification-type">
                    {gratification.type === 'stat_boost' && 'Mejora de Stats'}
                    {gratification.type === 'weapon' && 'Nueva Arma'}
                    {gratification.type === 'skill' && 'Nueva Habilidad'}
                  </div>
                </div>
              ))}
            </div>
            <div className="selection-buttons">
              <button className="cancel-button" onClick={onCancel}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="confirmation-screen">
            <h2>¿Confirmas tu elección?</h2>
            {selectedGratification && (
              <div className="selected-gratification">
                {(() => {
                  const gratification = availableGratifications.find(g => g.id === selectedGratification);
                  return gratification ? (
                    <div className="gratification-preview">
                      <div className="gratification-icon large">
                        {getGratificationIcon(gratification.type)}
                      </div>
                      <h3>{gratification.name}</h3>
                      <p>{gratification.description}</p>
                      <div className="gratification-value">
                        {renderGratificationValue(gratification)}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
            <div className="confirmation-buttons">
              <button className="cancel-button" onClick={handleCancel}>
                Cambiar
              </button>
              <button className="confirm-button" onClick={handleConfirm}>
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelUp;
