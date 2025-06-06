import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bruteService, fightService, levelService } from '../services/api';
import { Brute } from '../types/brute';
import ExperienceBar from './ExperienceBar';
import '../styles/OpponentSelection.css';
// Importar iconos para los stats
import { FaBolt, FaHeart, FaRunning, FaShieldAlt } from 'react-icons/fa';
import { GiSwordman, GiBrain, GiShield } from 'react-icons/gi';
import { FaDumbbell } from 'react-icons/fa'; // fuerza

interface FightHistory {
    id: number;
    attacker: Brute;
    defender: Brute;
    winner: Brute;
}

interface LevelInfo {
    currentXp: number;
    level: number;
    currentLevelXp: number;
    nextLevelXp: number;
    progressPercentage: number;
    canLevelUp: boolean;
    blockedFromCombat: boolean;
}

interface StatBarProps {
    icon: React.ReactNode;
    value: number;
    maxValue?: number;
}

const StatBar: React.FC<StatBarProps> = ({ icon, value, maxValue = 20 }) => (
    <div className="stat-bar">
        <div className="stat-icon">{icon}</div>
        <div className="stat-bar-bg">
            <div
                className="stat-bar-fill"
                style={{ width: `${(value / maxValue) * 100}%` }}
            />
        </div>
    </div>
);

const OpponentSelection: React.FC = () => {
    const [selectedBrute, setSelectedBrute] = useState<Brute | null>(null);
    const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
    const [opponents, setOpponents] = useState<Brute[]>([]);
    const [fightHistory, setFightHistory] = useState<FightHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const location = useLocation();    const loadData = async () => {
        setLoading(true);
        try {
            const currentBrute = await bruteService.getCurrentSelectedBrute();
            setSelectedBrute(currentBrute);
            if (currentBrute) {
                const [opponentsList, historyData, bruteLevelInfo] = await Promise.all([
                    bruteService.getBruteOpponents(currentBrute.id),
                    fightService.getFightHistory(currentBrute.id),
                    levelService.getBruteLevelInfo(currentBrute.id)
                ]);
                setOpponents(opponentsList);
                setFightHistory(historyData.slice(0, 6)); // Últimos 6 combates
                setLevelInfo(bruteLevelInfo);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };    useEffect(() => {
        loadData();
    }, [navigate, location.key]); // location.key cambia cada vez que navegamos, incluso a la misma ruta

    const handleLevelUp = async () => {
        if (!selectedBrute || !levelInfo?.canLevelUp) return;
        
        try {
            await levelService.levelUp(selectedBrute.id);
            // Reload data to get updated level information
            await loadData();
        } catch (error) {
            console.error('Error leveling up:', error);
        }
    };

    const handleFightClick = (opponentId: number): void => {
        // Block combat if brute can level up
        if (levelInfo?.blockedFromCombat) {
            alert('¡Tu bruto debe subir de nivel antes de continuar combatiendo!');
            return;
        }
        navigate(`/battle?opponentId=${opponentId}`);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!selectedBrute) {
        return <div>No tienes un bruto seleccionado</div>;
    }

    return (
        <div className="opponent-selection">
            <div className="battle-layout">
                {/* Tu bruto */}
                <div className="your-brute">                    <div className="brute-header">
                        <div className="avatar-container">
                            <img src={`https://robohash.org/${selectedBrute?.id.toString()}?set=2&size=180x180`} alt="Avatar" className="brute-avatar" />
                        </div>
                        <h2>{selectedBrute?.name || ''}</h2>
                        <div className="brute-level">
                            <GiSwordman /> Nivel {selectedBrute?.level || 0}
                        </div>
                        <div className="brute-hp">{selectedBrute?.stats?.hp || 0}</div>
                        
                        {/* Experience Bar */}
                        {levelInfo && (
                            <ExperienceBar
                                currentXp={levelInfo.currentXp}
                                currentLevelXp={levelInfo.currentLevelXp}
                                nextLevelXp={levelInfo.nextLevelXp}
                                level={levelInfo.level}
                                canLevelUp={levelInfo.canLevelUp}
                                onLevelUp={handleLevelUp}
                            />
                        )}
                    </div>
                    {selectedBrute?.stats && (
                        <div className="stats-grid">
                            <StatBar icon={<FaHeart />} value={selectedBrute.stats.hp} maxValue={100} />
                            <StatBar icon={<FaBolt />} value={selectedBrute.stats.strenght} />
                            <StatBar icon={<FaRunning />} value={selectedBrute.stats.agility} />
                            <StatBar icon={<FaShieldAlt />} value={selectedBrute.stats.endurance} />
                        </div>
                    )}
                </div>                {/* Lista de oponentes */}
                <div className="opponents">
                    {levelInfo?.blockedFromCombat && (
                        <div className="combat-blocked-notice">
                            ⚠️ Debes subir de nivel antes de continuar combatiendo
                        </div>
                    )}
                    <div className={`opponents-grid ${levelInfo?.blockedFromCombat ? 'disabled' : ''}`}>                        {opponents.map((opponent) => (                            <div key={opponent.id} className="opponent-card" onClick={() => handleFightClick(opponent.id)}>
                                <div className="opponent-header">
                                    <h3 className="opponent-name">{opponent.name}</h3>
                                </div>
                                <div className="opponent-special-stats-row">
                                    <div className="opponent-hp-icon-block">
                                        <FaHeart className="hp-icon-large" />
                                        <span className="hp-value-large">{opponent.stats?.hp || 0}</span>
                                    </div>
                                    <div className="opponent-special-stats-bars">
                                        <div className="stat-bar-row"><FaDumbbell className="stat-icon" /> <div className="stat-bar-bg"><div className="stat-bar-fill" style={{width: `${(opponent.stats?.strenght || 0) * 10}%`}} /></div></div>
                                        <div className="stat-bar-row"><GiShield className="stat-icon" /> <div className="stat-bar-bg"><div className="stat-bar-fill" style={{width: `${(opponent.stats?.endurance || 0) * 10}%`}} /></div></div>
                                        <div className="stat-bar-row"><FaBolt className="stat-icon" /> <div className="stat-bar-bg"><div className="stat-bar-fill" style={{width: `${(opponent.stats?.agility || 0) * 10}%`}} /></div></div>
                                        <div className="stat-bar-row"><GiBrain className="stat-icon" /> <div className="stat-bar-bg"><div className="stat-bar-fill" style={{width: `${(opponent.stats?.intelligence || 0) * 10}%`}} /></div></div>
                                    </div>
                                    <div className="avatar-container-right">
                                        <img src={`https://robohash.org/${opponent.id.toString()}?set=2&size=80x80`} alt="Avatar" className="opponent-avatar" />
                                        <div className="level-badge">
                                            <GiSwordman /> Nivel {opponent.level}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Historial de combates */}
                <div className="fight-history">
                    <h2>Últimos Combates</h2>
                    <div className="history-list">
                        {fightHistory.map((fight) => {
                            const isWinner = fight.winner.id === selectedBrute?.id;
                            const opponent = fight.attacker.id === selectedBrute?.id ? fight.defender : fight.attacker;
                            return (
                                <div key={fight.id} className={`history-card ${isWinner ? 'victory' : 'defeat'}`}>
                                    <p>
                                        {selectedBrute?.name} {isWinner ? 'ha vencido a' : 'ha perdido contra'} {opponent.name}
                                    </p>
                                    <p className="exp-gain">+{isWinner ? '2' : '1'} exp.</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpponentSelection;
