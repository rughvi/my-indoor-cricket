import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GameContextType, useGame } from "../context/gameContext";
import { ReactComponent as Back } from '../back.svg';
import { ReactComponent as Edit } from '../edit.svg';
import { Teams } from "../enums/teams";
import { bowlerStats, currentPlayersStats, getBallEventForRunout, getBallEventForScoreKey, inningsStats } from "../helpers/gameHelper";
import { Player } from "../types/player";
import ScoreKeyboard from "./scoreKeyboard";
import { BowledAndCatch, ScoreKey } from "../enums/scoreKey";
import { ScoreKeyEvent, ScoreKeyEventType } from "../types/scoreKeyEvent";
import { addBallEvent, addBowledBallEvent, updateInningsCurrentPlayer } from "../services/gameService";
import { BallEvent } from "../types/ballEvent";
import { IRootDispatch } from "../store/store";
import { useDispatch } from "react-redux";

const Innings = () => {
    const { inningsId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<IRootDispatch>();
    const { gameId, game, loading, error: gameError }: GameContextType = useGame();
    const stats = inningsStats(game);
    const [currentBatsman, setCurrentBatsman] = useState<Player>();
    const [error, setError] = useState<string>('');
    const [recordingRunout, setRecordingRunout] = useState<boolean>(false);
    const [runoutRuns, setRunoutRuns] = useState<number>(0);
    const [runoutBatsman, setRunoutBatsman] = useState<Player>();
    const [runoutScoreBatsman, setRunoutScoreBatsman] = useState<Player>();
    let battingTeam = Teams.One;
    let bowlingTeam = Teams.Two;
    let currentBowler: Player | undefined;
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
    const currentPlayersScore = currentPlayersStats(game, inningsId!, currentPlayer1, currentPlayer2);
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
        navigate(`/game/current/${playerBowler}/selection/${inningsId}/${currentPlayerId}`, {state: {playersToChooseFrom}});
    };

    const onClickScoreKey = async (scoreKeyEventType: ScoreKeyEventType) => {
        setError('');
        if(scoreKeyEventType.type === ScoreKey.Runout) {
            setRecordingRunout(true);
            return;
        };
        if((currentBowler?.name?.length ??0) === 0 || (currentBatsman?.name?.length ??0) === 0){
            setError('Select current players and bowlers');
            return;
        }
        const striker = currentBatsman?.name === currentPlayer1?.name? currentPlayer1 : currentPlayer2;
        const nonStriker = currentBatsman?.name === currentPlayer1?.name? currentPlayer2 : currentPlayer1;
        const ballEvent: BallEvent = getBallEventForScoreKey(game, inningsId!, scoreKeyEventType, striker!, nonStriker!, currentBowler!);
        if(BowledAndCatch.includes(scoreKeyEventType.type)) {            
            await dispatch(addBowledBallEvent({gameId, inningsId: inningsId!, ballEvent, playerId: (currentBatsman?.name == currentPlayer1?.name? "1": "2")})).unwrap();
            setCurrentBatsman(undefined);
        } else {
            await dispatch(addBallEvent({gameId, inningsId: inningsId!, ballEvent})).unwrap();
        }
        if(ballEvent.totalBalls % 6 == 0) {
            choosePlayer('bowler', -1);
        }
    };
    
    const onRunout = async () => {
        setError('');
        if((runoutBatsman?.name?.length ??0) === 0 || (runoutScoreBatsman?.name?.length ??0) === 0){
            setError('Select runout players');
            return;
        }
        const scoreKeyEvent = ScoreKeyEvent.Runout;
        scoreKeyEvent.value = runoutRuns;
        const striker = currentBatsman?.name === currentPlayer1?.name? currentPlayer1 : currentPlayer2;
        const nonStriker = currentBatsman == currentPlayer1? currentPlayer2 : currentPlayer1;
        const ballEvent: BallEvent = getBallEventForRunout(game, inningsId!, scoreKeyEvent, striker!, nonStriker!, runoutBatsman!, currentBowler!);
        await dispatch(addBallEvent({gameId, inningsId: inningsId!, ballEvent})).unwrap();        
        await dispatch(updateInningsCurrentPlayer({gameId: gameId, inningsId: inningsId!, playerId: runoutBatsman == currentPlayer1? "1" : "2", value: null })).unwrap();
        setCurrentBatsman(undefined);
        setRecordingRunout(false);
    }
    
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
                <div className="BowlerCard" style={{borderStyle: "solid", borderRadius: "10px", borderWidth: "thin", padding: 10, margin: 5, backgroundColor: "whitesmoke"}}>
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
                            <Edit style={{height: "25px", width: "25px"}} onClick={() => {choosePlayer('bowler', -1)}}/>
                        </div>
                    </div>
                </div>
                <div className="BatsmenCard" style={{borderStyle: "solid", borderRadius: "10px", borderWidth: "thin", padding: 10, margin: 5, backgroundColor: "whitesmoke"}}>
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
                                </span>{currentPlayer1?.name} {currentPlayersScore.currentPlayer1Scores.runs} ({currentPlayersScore.currentPlayer1Scores.balls})
                            </div>
                            <Edit style={{height: "25px", width: "25px"}} onClick={() => {choosePlayer('player', 1)}}/>
                        </div>
                    </div>
                    <br />
                    <div className="GameCard-header">
                        <div style={{width: '100%', display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: 'calc(6px + 2vmin)'}}>
                            <div style={{minWidth: '70%'}}  onClick={() => setCurrentBatsman(currentPlayer2)}>
                                <span>
                                    <input type="radio" checked={currentBatsman?.name === currentPlayer2?.name}>
                                    </input>
                                </span>{currentPlayer2?.name} {currentPlayersScore.currentPlayer2Scores.runs} ({currentPlayersScore.currentPlayer2Scores.balls})
                            </div>
                            <Edit style={{height: "25px", width: "25px"}} onClick={() => {choosePlayer('player', 2)}}/>
                        </div>
                    </div>
                </div>
                <ScoreKeyboard onClick={onClickScoreKey} />
                {
                    error.length > 0 &&
                    <div className="error"> 
                        <p> { error } </p>
                    </div>
                }
            </div>
            {recordingRunout && 
                <div className="GameCard" style={{justifyContent: "center", position: "absolute", top:"0px", left:"0px", width:"100%", height:"100%", opacity:"0.9", color:"black"}}>
                    <span style={{fontWeight:"bold"}}>Runout</span>
                    <br/>
                    <div className="GameCard-header" style={{justifyContent: "space-evenly"}}>
                        <div style={{width:"40%"}}>Runout:</div>
                        <div style={{textAlign:"center"}} onClick={() => setRunoutBatsman(currentPlayer1)}><span><input type="radio" checked={runoutBatsman?.name === currentPlayer1?.name}></input></span>{currentPlayer1?.name}</div>
                        <div style={{textAlign:"center"}} onClick={() => setRunoutBatsman(currentPlayer2)}><span><input type="radio" checked={runoutBatsman?.name === currentPlayer2?.name}></input></span>{currentPlayer2?.name}</div>
                    </div>
                    <br/>
                    <div className="GameCard-header" style={{justifyContent: "space-evenly"}}>
                        <div style={{width:"40%"}}>Add <span><input type="number" defaultValue={0} style={{width:"30px"}} value={runoutRuns} onChange={(event) => setRunoutRuns(Number(event.target.value))}></input></span> runs to:</div>
                        <div style={{textAlign:"center"}} onClick={() => setRunoutScoreBatsman(currentPlayer1)}><span><input type="radio" checked={runoutScoreBatsman?.name === currentPlayer1?.name}></input></span>{currentPlayer1?.name}</div>
                        <div style={{textAlign:"center"}} onClick={() => setRunoutScoreBatsman(currentPlayer2)}><span><input type="radio" checked={runoutScoreBatsman?.name === currentPlayer2?.name}></input></span>{currentPlayer2?.name}</div>
                    </div>
                    <br/>
                    <div>
                        <button className="Button" onClick={() => setRecordingRunout(false)}>Cancel</button>
                        <button className="Button" onClick={() => onRunout()}>Continue</button>
                    </div>
                    {
                        error.length > 0 &&
                        <div className="error"> 
                            <p> { error } </p>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Innings;