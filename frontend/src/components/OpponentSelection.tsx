import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bruteService, fightService } from '../services/api';
import './OpponentSelection.css';

const OpponentSelection = () => {
    const [selectedBrute, setSelectedBrute] = useState(null);
    const [opponents, setOpponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const currentBrute = await bruteService.getCurrentSelectedBrute();
                setSelectedBrute(currentBrute);
                if (currentBrute) {
                    const opponentsList = await bruteService.getBruteOpponents(currentBrute.id);
                    setOpponents(opponentsList);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleFightClick = async (opponentId) => {
        try {
            await fightService.startFight(opponentId);
            navigate('/battle');
        } catch (error) {
            console.error('Error starting fight:', error);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!selectedBrute) {
        return <div>No tienes un bruto seleccionado</div>;
    }

    return (
        <div className="opponent-selection">
            <div className="current-brute">
                <h2>Tu Bruto</h2>
                <div className="brute-card">
                    <img 
                        src="https://placekitten.com/200/200" 
                        alt={selectedBrute.name} 
                        className="brute-image"
                    />
                    <h3>{selectedBrute.name}</h3>
                    <div className="stats">
                        <p>Nivel: {selectedBrute.level}</p>
                        <p>HP: {selectedBrute.stats?.hp || 0}</p>
                        <p>Fuerza: {selectedBrute.stats?.strength || 0}</p>
                        <p>Agilidad: {selectedBrute.stats?.agility || 0}</p>
                    </div>
                </div>
            </div>

            <div className="opponents-grid">
                <h2>Elige tu oponente</h2>
                <div className="grid">
                    {opponents.map(opponent => (
                        <div key={opponent.id} className="opponent-card" onClick={() => handleFightClick(opponent.id)}>
                            <img 
                                src="https://placekitten.com/150/150" 
                                alt={opponent.name} 
                                className="opponent-image"
                            />
                            <h3>{opponent.name}</h3>
                            <div className="stats">
                                <p>Nivel: {opponent.level}</p>
                                <p>HP: {opponent.stats?.hp || 0}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OpponentSelection;
