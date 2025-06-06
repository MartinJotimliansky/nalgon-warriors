import React from 'react';
import { GiSwordman } from 'react-icons/gi';
import '../styles/ExperienceBar.css';

interface ExperienceBarProps {
  currentXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  level: number;
  canLevelUp: boolean;
  onLevelUp?: () => void;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({
  currentXp,
  currentLevelXp,
  nextLevelXp,
  level,
  canLevelUp,
  onLevelUp
}) => {
  const xpInCurrentLevel = currentXp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  const progressPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  return (
    <div className="experience-bar-container">
      <div className="experience-bar-header">
        <div className="level-display">
          <GiSwordman className="level-icon" />
          <span className="level-text">Nivel {level}</span>
        </div>
        <div className="xp-text">
          {xpInCurrentLevel} / {xpNeededForNextLevel} XP
        </div>
      </div>
      
      <div className="experience-bar">
        <div 
          className="experience-bar-fill" 
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>
      
      {canLevelUp && onLevelUp && (
        <button 
          className="level-up-button"
          onClick={onLevelUp}
        >
          ¡Subir de Nivel!
        </button>
      )}
    </div>
  );
};

export default ExperienceBar;
