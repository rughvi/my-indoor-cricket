import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Back } from '../back.svg';
import { IRootDispatch, IRootState } from "../store/store";
import { Player } from "../types/player";
import { Teams } from "../enums/teams";
import { GameContextType, useGame } from "../context/gameContext";
import { addPlayerToTeam, updateInningsCurrentBowler, updateInningsCurrentPlayer } from "../services/gameService";


const PlayerBowlerSelection = () => {
    const { playerbowler, inningsId, currentPlayerId } = useParams();
    const location = useLocation();
    const [playerBowler, setPlayerBowler] = useState<string>('');
    const { gameId, game, loading, error: gameError }: GameContextType = useGame();
    let teamPlayers: Player[] = location.state.playersToChooseFrom ?? [];
    
    const dispatch = useDispatch<IRootDispatch>();
    const navigate = useNavigate();

    const onPlayerSelectionDone = async (player: Player) => {
        if(playerbowler === 'player') {
            await dispatch(updateInningsCurrentPlayer({gameId: gameId, inningsId: inningsId!, playerId: currentPlayerId!, value: player })).unwrap();
        } else {
            await dispatch(updateInningsCurrentBowler({gameId: gameId, inningsId: inningsId!, playerId: currentPlayerId!, value: player })).unwrap();
        }
        navigate(`/game/innings/${inningsId}`);
    };

    const onPlayerAdd = async (player: Player) => {
        if(playerbowler === 'player') {
            if(inningsId === "1") {
                if(game.teamBattingFirst === Teams.One) {
                    // add batsmen to team 1
                    await dispatch(addPlayerToTeam({gameId: gameId, team: "team1", player})).unwrap();
                } else {
                    // add batsmen to team 2
                    await dispatch(addPlayerToTeam({gameId: gameId, team: "team2", player})).unwrap();
                }
            } else {
                if(game.teamBattingFirst === Teams.One) {
                    // add batsmen to team 2
                    await dispatch(addPlayerToTeam({gameId: gameId, team: "team2", player})).unwrap();
                } else {
                    // add batsmen to team 1
                    await dispatch(addPlayerToTeam({gameId: gameId, team: "team1", player})).unwrap();
                }
            }
            await dispatch(updateInningsCurrentPlayer({gameId: gameId, inningsId: inningsId!, playerId: currentPlayerId!, value: player })).unwrap();
        } else {
            if(inningsId === "1") {
                if(game.teamBattingFirst === Teams.One) {
                    // add bowler to team 2
                    await dispatch(addPlayerToTeam({gameId: gameId, team: "team2", player})).unwrap();
                } else {
                    // add bowler to team 1
                    await dispatch(addPlayerToTeam({gameId: gameId, team: "team1", player})).unwrap();
                }
            } else {
                if(game.teamBattingFirst === Teams.One) {
                    // add bowler to team 1
                    await dispatch(addPlayerToTeam({gameId: gameId, team: "team1", player})).unwrap();
                } else {
                    // add bowler to team 2
                    await dispatch(addPlayerToTeam({gameId: gameId, team: "team2", player})).unwrap();
                }
            }

            await dispatch(updateInningsCurrentBowler({gameId: gameId, inningsId: inningsId!, playerId: currentPlayerId!, value: player })).unwrap();
        }
        navigate(`/game/innings/${inningsId}`);
    };

    return (
        <div className="Form">
            <div className="GameCard">
                <div className="GameCard-header">
                    <Back style={{width: "30px", height:"30px"}} onClick={() => {navigate(`/game/innings/${inningsId}`)}}></Back>
                    Select {playerbowler === 'player'? 'player ' + currentPlayerId : 'bowler'}
                    <div style={{width: "30px"}}></div>
                </div>
            </div>
            <div className="GameCard">
                <ul className="TeamSelectionUL">
                    {teamPlayers.map((player, index) => (
                        <li key={index}>
                            <button className="Button" onClick={() => { onPlayerSelectionDone(player) }}> {player.name} </button>
                        </li>
                    ))}
                </ul>
                <div className="line"></div>
                <br/>
                <input style={{height: '30px', width: '50%',fontSize: '18px' }} value={playerBowler} onChange={(event) => {setPlayerBowler(event.target.value)}}/>
                <button className="Button" onClick={() => { onPlayerAdd({name: playerBowler}) }}>Add {playerbowler === 'player'? 'player ' + currentPlayerId : 'bowler'}</button>
            </div>
        </div>
    );
};

export default PlayerBowlerSelection;