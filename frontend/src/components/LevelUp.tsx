import React, { useState, useEffect } from 'react';
import { FaLevelUpAlt, FaDumbbell, FaArrowRight, FaBolt, FaStar } from 'react-icons/fa';
import { GiShield, GiBrain, GiSwordman } from 'react-icons/gi';
import { levelService } from '../services/api';
import Tooltip from './Tooltip';
import './LevelUp.css';

interface GratificationOption {
  id: string;
  type: 'stat_boost' | 'weapon' | 'skill';
  name: string;
  description: string;
  data: any;
}

interface LevelUpProps {
  bruteId: number;
  currentLevel: number;
  onLevelUpComplete: (result: any) => void;
  onCancel: () => void;
}

const LevelUp: React.FC<LevelUpProps> = ({
  bruteId,
  currentLevel,
  onLevelUpComplete,
  onCancel
}) => {
  const [availableGratifications, setAvailableGratifications] = useState<GratificationOption[]>([]);
  const [selectedGratification, setSelectedGratification] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGratifications();
  }, [bruteId]);

  const loadGratifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const gratifications = await levelService.getAvailableGratifications(bruteId);
      setAvailableGratifications(gratifications);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };const getGratificationIcon = (type: string) => {
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
  const renderGratificationValue = (gratification: GratificationOption) => {
    if (gratification.type === 'stat_boost') {
      const data = gratification.data;
      return (
        <div className="stat-boosts">
          {data.hp > 0 && (
            <div className="stat-boost">
              <FaDumbbell />
              <span>+{data.hp} HP</span>
            </div>
          )}
          {data.strength > 0 && (
            <div className="stat-boost">
              {getStatIcon('strength')}
              <span>+{data.strength} Fuerza</span>
            </div>
          )}
          {data.resistance > 0 && (
            <div className="stat-boost">
              {getStatIcon('endurance')}
              <span>+{data.resistance} Resistencia</span>
            </div>
          )}
          {data.speed > 0 && (
            <div className="stat-boost">
              {getStatIcon('agility')}
              <span>+{data.speed} Velocidad</span>
            </div>
          )}
          {data.intelligence > 0 && (
            <div className="stat-boost">
              {getStatIcon('intellect')}
              <span>+{data.intelligence} Inteligencia</span>
            </div>
          )}
        </div>
      );    } else if (gratification.type === 'weapon') {
      const data = gratification.data;
      return (
        <Tooltip 
          content={data.description || `Arma con ${data.min_damage || 'N/A'}-${data.max_damage || 'N/A'} de daño`}
          className="weapon-tooltip"
        >
          <div className="weapon-info">
            <span className="weapon-name">{data.name}</span>
            {data.value_json && (
              <span className="weapon-stats">Stats: {JSON.stringify(data.value_json)}</span>
            )}
          </div>
        </Tooltip>
      );    } else if (gratification.type === 'skill') {
      const data = gratification.data;
      return (
        <Tooltip 
          content={data.description || 'Habilidad especial que otorga ventajas únicas en combate'}
          className="skill-tooltip"
        >
          <div className="skill-info">
            <span className="skill-name">{data.name}</span>
            {data.value_json && (
              <span className="skill-effects">Efectos: {JSON.stringify(data.value_json)}</span>
            )}
          </div>
        </Tooltip>
      );
    }
    return null;
  };

  const handleGratificationClick = (gratificationId: string) => {
    setSelectedGratification(gratificationId);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (selectedGratification && !processing) {
      try {
        setProcessing(true);
        setError(null);
        
        const selectedGrat = availableGratifications.find(g => g.id === selectedGratification);
        if (!selectedGrat) {
          throw new Error('Gratificación no encontrada');
        }

        const result = await levelService.levelUp(bruteId, {
          id: selectedGrat.id,
          type: selectedGrat.type
        });

        onLevelUpComplete(result);
      } catch (error: any) {
        setError(error.message);
        setProcessing(false);
      }
    }
  };
  const handleCancel = () => {
    setSelectedGratification(null);
    setShowConfirmation(false);
  };

  if (loading) {
    return (
      <div className="level-up-overlay">
        <div className="level-up-modal">
          <div className="loading">
            <FaLevelUpAlt className="loading-icon" />
            <p>Cargando gratificaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="level-up-overlay">
        <div className="level-up-modal">
          <div className="error">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={onCancel}>Cerrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="level-up-overlay">
      <div className="level-up-modal">
        <div className="level-up-header">
          <FaLevelUpAlt className="level-up-icon" />
          <h1>¡PUEDES SUBIR DE NIVEL!</h1>
          <div className="level-transition">
            <span className="old-level">Nivel {currentLevel}</span>
            <FaArrowRight className="arrow" />
            <span className="new-level">Nivel {currentLevel + 1}</span>
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
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            <div className="confirmation-buttons">
              <button 
                className="cancel-button" 
                onClick={handleCancel}
                disabled={processing}
              >
                Cambiar
              </button>
              <button 
                className="confirm-button" 
                onClick={handleConfirm}
                disabled={processing}
              >
                {processing ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelUp;
