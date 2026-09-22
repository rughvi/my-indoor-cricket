import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GameContextType, useGame } from "../context/gameContext";
import { ReactComponent as Back } from '../back.svg';
import { ReactComponent as Edit } from '../edit.svg';
import { Teams } from "../enums/teams";
import { bowlerStats, currentPlayersStats, inningsStats } from "../helpers/gameHelper";
import { Player } from "../types/player";

const Innings = () => {
    const { inningsId } = useParams();
    const navigate = useNavigate();
    const { gameId, game, loading, error }: GameContextType = useGame();
    const stats = inningsStats(game);
    const [currentBatsman, setCurrentBatsman] = useState<Player>();
    let battingTeam = Teams.One;
    let bowlingTeam = Teams.Two;
    let currentBowler;
    let currentBowlerStats;
    let currentPlayer1: Player | undefined;
    let currentPlayer2: Player | undefined;
    if(inningsId == "1") {
        battingTeam = game.teamBattingFirst == Teams.One? Teams.One : Teams.Two;
        bowlingTeam = game.teamBattingFirst == Teams.One? Teams.Two : Teams.One;
        currentBowler = game.innings1.currentBowler;
        currentBowlerStats = bowlerStats(game, "1", currentBowler);
        currentPlayer1 = game.innings1.currentPlayer1;
        currentPlayer2 = game.innings1.currentPlayer2;
    } else {
        battingTeam = game.teamBattingFirst == Teams.One? Teams.Two : Teams.One;
        bowlingTeam = game.teamBattingFirst == Teams.One? Teams.One : Teams.Two;
        currentBowler = game.innings2.currentBowler;
        currentBowlerStats = bowlerStats(game, "2", currentBowler);
        currentPlayer1 = game.innings2.currentPlayer1;
        currentPlayer2 = game.innings2.currentPlayer2
    }
    const currentPlayersScore = currentPlayersStats(game, currentPlayer1, currentPlayer2);
    const choosePlayer = (playerBowler: string, currentPlayerId: number) => {
        // const nonCurrentPlayer = (currentPlayerId === 1 ? currentPlayer2: currentPlayer1);
        let playersToChooseFrom = [];
        if(playerBowler === 'player') { //batsman
            if(battingTeam === Teams.One) {
                playersToChooseFrom = game.team1;
            } else {
                playersToChooseFrom = game.team2;
            }
        } else { //bowler
            if(bowlingTeam === Teams.One) {
                playersToChooseFrom = game.team1;
            } else {
                playersToChooseFrom = game.team2;
            }
        }
        navigate(`/current/${playerBowler}/selection/${inningsId}/${currentPlayerId}`, {state: {playersToChooseFrom}});
    };

    return(
        <div className="Form">
            <div className="GameCard">
                <div className="GameCard-header">
                    <Back style={{width: "30px", height:"30px"}} onClick={() => {navigate('/game')}}></Back>
                    Innings: {inningsId}
                    <div style={{width: "30px"}}></div>
                </div>
                <br/>
            </div>
            <div className="GameCard">
                {(inningsId === "1") ? 
                    <>
                        <div className="GameCard-header">
                            <div>Batting: T{battingTeam}</div>
                            <div style={{fontWeight: 'bold', fontSize: 'calc(16px + 2vmin)', color: "black"}}>{stats.innings1TotalRuns ?? 0}/{stats.innings1TotalWickets ?? 0}</div>
                            <div>Bowling: T{bowlingTeam}</div>
                        </div>
                        <br />
                        <div className="GameCard-header">
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>Overs: <span style={{fontWeight: "bold", color:"black"}}> {Math.floor((stats.innings1TotalBalls ?? 0) / 6)}.{(stats.innings1TotalBalls ?? 0) % 6}</span>
                            </div>
                            <div>Extras: {stats.innings1TotalExtras ?? 0}</div>
                        </div>
                        <br/>
                    </>
                    : 
                    <>
                        <div className="GameCard-header">
                            <div>Batting: T{battingTeam}</div>
                            <div style={{fontWeight: 'bold', fontSize: 'calc(16px + 2vmin)', color: "black"}}>{stats.innings2TotalRuns ?? 0}/{stats.innings2TotalWickets ?? 0}</div>
                            <div>Bowling: T{bowlingTeam}</div>
                        </div>
                        <br />
                        <div className="GameCard-header">
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>Overs: <span style={{fontWeight: "bold", color:"black"}}> {Math.floor((stats.innings2TotalBalls ?? 0) / 6)}.{(stats.innings2TotalBalls ?? 0) % 6}</span>
                            </div>
                            <div>Extras: {stats.innings2TotalExtras ?? 0}</div>
                        </div>
                        <br/>
                    </>
                }
                {/* <div className="GameCard-header">
                    <Previous style={{height: "25px", width: "25px"}} />
                    <div style={{display: "inline-block", overflowX: "auto", overflowY: "hidden", width: "80%",  whiteSpace: "nowrap"}}>{statsByBall()}</div>
                    <Next style={{height: "25px", width: "25px"}} />
                </div> */}
                
                <br/>
                <div className="BowlerCard" style={{borderStyle: "solid", borderRadius: "10px", borderWidth: "thin", padding: 10, margin: 10, backgroundColor: "whitesmoke"}}>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
                        <div style={{color: "black", fontWeight: "bold", fontSize: "14px"}}>Bowler:</div>
                        <div style={{fontSize: "12px", width:"100px", textAlign: "end", textDecoration:"underline"}} onClick={() => navigate(`/inningsScore/${inningsId}`)}>more</div>
                    </div>                    
                    <div className="GameCard-header">
                        <div style={{width: '100%', display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: 'calc(6px + 2vmin)'}}>
                            <div style={{minWidth: '30%'}}>{currentBowler?.name}</div>
                            <div>Over: {currentBowlerStats?.overs}<span>|</span></div>
                            <div>Runs: {currentBowlerStats?.runs}<span>|</span></div>
                            <div>Wkts: {currentBowlerStats?.wickets} </div>
                            {/* <Edit style={{height: "25px", width: "25px"}} onClick={() => {choosePlayer('bowler', -1)}}/> */}
                        </div>
                    </div>
                </div>
                <div className="BatsmenCard" style={{borderStyle: "solid", borderRadius: "10px", borderWidth: "thin", padding: 10, margin: 10, backgroundColor: "whitesmoke"}}>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
                        <div style={{color: "black", fontWeight: "bold", fontSize: "14px"}}>Batsmen:</div>
                        <div style={{fontSize: "12px", width:"100px", textAlign: "end", textDecoration:"underline"}} onClick={() => navigate(`/inningsScore/${inningsId}`)}>more</div>
                    </div>                    
                    <div className="GameCard-header">
                        <div style={{width: '100%', display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: 'calc(6px + 2vmin)'}}>
                            <div style={{minWidth: '70%'}}  onClick={() => setCurrentBatsman(currentPlayer1)}>
                                <span>
                                    <input type="radio" checked={currentBatsman?.name === currentPlayer1?.name}>
                                    </input>
                                </span>{currentPlayer1?.name} {currentPlayersScore.currentPlayer1Scores?.reduce((a,c) => a+c) ?? 0} ({currentPlayersScore.currentPlayer1Scores?.length ?? 0})
                            </div>
                            <Edit style={{height: "25px", width: "25px"}} onClick={() => {choosePlayer('player', 1)}}/>
                        </div>
                    </div>
                    <div className="GameCard-header">
                        <div style={{width: '100%', display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: 'calc(6px + 2vmin)'}}>
                            <div style={{minWidth: '70%'}}  onClick={() => setCurrentBatsman(currentPlayer2)}>
                                <span>
                                    <input type="radio" checked={currentBatsman?.name === currentPlayer2?.name}>
                                    </input>
                                </span>{currentPlayer2?.name} {currentPlayersScore.currentPlayer2Scores?.reduce((a,c) => a+c) ?? 0} ({currentPlayersScore.currentPlayer2Scores?.length ?? 0})
                            </div>
                            <Edit style={{height: "25px", width: "25px"}} onClick={() => {choosePlayer('player', 2)}}/>
                        </div>
                    </div>
                </div>
                <br />
                {/* <ScoreKeyboard onClick={onClickScoreKey} /> */}
                {/* {
                    error.length > 0 &&
                    <div className="error"> 
                        <p> { error } </p>
                    </div>
                } */}
            </div>
        </div>
    )
}

export default Innings;