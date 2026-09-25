import React, { useEffect, useState } from "react";
import { ReactComponent as Back } from '../back.svg';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IRootDispatch } from "../store/store";
import { GameContextType, useGame } from "../context/gameContext";
import { inningsPlayersStats, inningsStats } from "../helpers/gameHelper";
import { Teams } from "../enums/teams";

const InningsStats = () => {
    const { inningsId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<IRootDispatch>();
    const { gameId, game, loading, error: gameError }: GameContextType = useGame();
    const stats = inningsStats(game);
    let battingTeam;
    let bowlingTeam;
    let runsByWickets = "";
    let overs = "";
    if(inningsId === "1") {
        runsByWickets = `${stats.innings1TotalRuns} / ${stats.innings1TotalWickets}`;
        overs = `${Math.floor((stats.innings1TotalBalls ?? 0) / 6)}.${(stats.innings1TotalBalls ?? 0) % 6}`;        
        battingTeam = game.teamBattingFirst === Teams.One ? Teams.One : Teams.Two;
        bowlingTeam = game.teamBattingFirst === Teams.One ? Teams.Two : Teams.One;
    } else {
        runsByWickets = `${stats.innings2TotalRuns} / ${stats.innings2TotalWickets}`;
        overs = `${Math.floor((stats.innings2TotalBalls ?? 0) / 6)}.${(stats.innings2TotalBalls ?? 0) % 6}`;
        battingTeam = game.teamBattingFirst === Teams.One ? Teams.Two : Teams.One;
        bowlingTeam = game.teamBattingFirst === Teams.One ? Teams.One : Teams.Two;
    }
    const playersScore = inningsPlayersStats(game, inningsId!);
    return (
        <div className="Form">
            <div className="GameCard">
                <div className="GameCard-header">
                    <Back style={{width: "30px", height:"30px"}} onClick={() => {navigate(`/game/innings/${inningsId}`)}}></Back>
                    Innings: {inningsId}
                    <div style={{width: "30px"}}></div>
                </div>
                <br/>
                <div className="GameCard-header">
                    <div>Batting: T{battingTeam}</div>
                    <div style={{fontWeight: 'bold', fontSize: 'calc(16px + 2vmin)', color: "black"}}>{runsByWickets}</div>
                    <div>Overs: {overs}</div>
                </div>
                <div className="BatsmenCard">
                    {
                        Object.keys(playersScore).map((playerName: string) => {
                                const playerScore: number[] = playersScore[(`${playerName}`)];
                                return (<div key={playerName} style={{marginBottom:"5px", width: '100%', display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: 'calc(6px + 2vmin)'}}>
                                            <div style={{minWidth: '70%'}}>
                                                <span>
                                                    <input readOnly type="radio" checked={playerScore !== undefined}></input>
                                                </span>{playerName}
                                            </div>
                                            <div style={{minWidth: '30%'}}>
                                                {playerScore?.reduce((a,c) => a+c) ?? 0} ({playerScore?.length ?? 0})
                                            </div>
                                        </div>)
                        })
                    }
                </div>
                <div className="GameCard-header">
                    <div>Bowling: T{bowlingTeam}</div>
                    <div>Extras: {inningsId === "1"? stats.innings1TotalExtras??0 : stats.innings2TotalExtras??0}</div>
                </div>
            </div>
        </div>
    )
}

export default InningsStats;