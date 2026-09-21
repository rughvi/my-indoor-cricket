import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Teams } from "../enums/teams";
import { IRootDispatch, IRootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { EmptyGame, Game } from "../types/game";
import { Player } from "../types/player";
import { setTeamBattingFirst } from "../store/gameSlice";
import { createNewGame } from "../services/gameService";

const GameStart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<IRootDispatch>();
    const team1Players = useSelector<IRootState, Player[]>(state => state.game.currentGame.game.team1);
    const team2Players = useSelector<IRootState, Player[]>(state => state.game.currentGame.game.team2);
    const teamBattingFirst = useSelector<IRootState, Teams>(state => state.game.currentGame.game.teamBattingFirst);
    const [ error, setError ] = useState<string>('');

    const startGame = async () => {
        if(team1Players.length === 0 || team2Players.length === 0) {
            setError('Please select players for the teams');
            return;
        }

        const game: Game = {...EmptyGame, team1: team1Players, team2: team2Players };
        await dispatch(createNewGame(game)).unwrap();
        // await dispatch(fetchCurrentGame('')).unwrap();
        navigate('/game');
    };
    return(
        <div className="Form">
            Game Selection
            <div className="GameCard">
                <div className="GameCard-header">
                    <div >Team 1</div>
                    <button className="Button" onClick={() => {navigate('/teamSelection/1')}}>Edit</button>
                </div>
                <p style={{fontSize: 15, "width": "100%"}}>
                    Players: {team1Players.map(p => p.name).join(", ")}
                </p>
            </div>
            <div className="GameCard">
                <div className="GameCard-header">
                    <div >Team 2</div>
                    <button className="Button" onClick={() => {navigate('/teamSelection/2')}}>Edit</button>
                </div>
                <p style={{fontSize: 15, "width": "100%"}}>
                    Players: {team2Players.map(p => p.name).join(", ")}
                </p>
            </div>
            <div className="line"></div>
            <div className="GameCard">
                <div> Batting: </div>
                <div className="GameCard-header">                    
                    <button className={teamBattingFirst === Teams.One? "ButtonSelected" : "Button"}
                            onClick={() => dispatch(setTeamBattingFirst({teamBattingFirst: Teams.One}))}>Team 1</button>
                    <button className={teamBattingFirst === Teams.Two? "ButtonSelected" : "Button"}
                            onClick={() => dispatch(setTeamBattingFirst({teamBattingFirst: Teams.Two}))}>Team 2</button>
                </div>
            </div>
            <div className="error"> 
                <p> { error } </p>
                <button className="ActionButton" onClick={() => startGame()}>Start game</button>
            </div>
        </div>
    )
}

export default GameStart;