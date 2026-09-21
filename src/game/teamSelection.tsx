import React, { useState } from "react";
import { ReactComponent as Back } from '../back.svg';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../store/store";
import { Player, UIPlayer } from "../types/player";
import { assignPlayersToTeams } from "../store/gameSlice";
import '../css/button.css';
import '../css/ul.css';
import '../css/teamSelection.css';

const TeamSelection= () => {
    const { teamIndex } = useParams();
    const teamPlayers = useSelector<IRootState, Player[]>(state => state.player.allPlayers);
    const [selectablePlayers, setSelectablePlayers] = useState<UIPlayer[]>(teamPlayers.map(tp => ({ name: tp.name, selected: false })));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectPlayer = (player: UIPlayer, index: number) => {
        let players: UIPlayer[] = selectablePlayers.map((p, i) => ({name: p.name, selected: p.selected}));        
        let indexedPlayer = players[index];
        indexedPlayer.selected = (indexedPlayer.selected? false: true);

        setSelectablePlayers(players);
    };

    const onPlayerSelectionDone = () => {
        const playersSelected: Player[] = selectablePlayers.filter(p => p.selected === true).map(p => ({name: p.name}));
        dispatch(assignPlayersToTeams({ team: teamIndex, players: playersSelected}));
        navigate('/game-start');
    };
    
    return (
        <div className="Form">
            <div className="GameCard">
                <div className="GameCard-header">
                    <Back style={{width: "30px", height:"30px"}} onClick={() => {navigate('/game-start')}}></Back>
                    Select players for Team {teamIndex}
                    <div style={{width: "30px"}}></div>
                </div>
            </div>
            <div className="GameCard">
                <ul className="TeamSelectionUL">
                    {selectablePlayers.map((player, index) => (
                        <li key={index}>
                            <button className={`PlayerButton ${player.selected === true? 'ButtonSelected' : 'Button'}`} onClick={() => { selectPlayer(player, index) }}> {player.name} </button>
                        </li>
                    ))}
                </ul>                
            </div>
            <div className="GameCard">
                <button className="ActionButton" onClick={() => { onPlayerSelectionDone()}}>Ok</button>
            </div>
        </div>
    );
};

export default TeamSelection;