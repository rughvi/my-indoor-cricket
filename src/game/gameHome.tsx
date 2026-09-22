import React, { useEffect, useState } from "react";
import '../css/form.css';
import '../css/gameCard.css';
import { GameContextType, useGame } from "../context/gameContext";
import { ReactComponent as Back } from '../back.svg';
import { useNavigate } from "react-router-dom";
import { InningsStatus } from "../enums/inningsStatus";
import { IRootDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { endCurrentGame, endInnings, startInnings } from "../services/gameService";
import { Teams } from "../enums/teams";
import { inningsStats } from "../helpers/gameHelper";

const GameHome = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<IRootDispatch>();
    const [inningsToEnd, setInningsToEnd] = useState<string>("");
    const [assertEndInnings, setAssertEndInnings] = useState<boolean>(false);
    const { gameId, game, loading, error }: GameContextType = useGame();
    let innings1Action = 'Start';
    if(game.innings1.status == InningsStatus.InProgress) {
        innings1Action = 'Resume';
    }
    if(game.innings1.status == InningsStatus.Finished) {
        innings1Action = 'Finished';
    }
    let innings2Action = 'Start';
    if(game.innings2.status == InningsStatus.InProgress) {
        innings2Action = 'Resume';
    }
    if(game.innings2.status == InningsStatus.Finished) {
        innings2Action = 'Finished';
    }

    const stats = inningsStats(game);
    const startResumeInnings = async (inningsId: string) => {
        await dispatch(startInnings({gameId, inningsId: inningsId})).unwrap();
        navigate(`/game/innings/${inningsId}`);
    };

    const endInningsFn = async (id: string) => {        
        await dispatch(endInnings({gameId: gameId, inningsId: id})).unwrap();
        if(id === "2") {
            await dispatch(endCurrentGame()).unwrap();
        }
        setAssertEndInnings(false);
    };
    
    return(
        <div className="Form">
            <div className="GameCard">
                <div className="GameCard-header">
                    <Back style={{width: "30px", height:"30px"}} onClick={() => {navigate('/')}}></Back>
                    Game
                    <div style={{width: "30px"}}></div>
                </div>
            </div>
            <div className="GameCard" style={{borderStyle: "solid", borderRadius: "10px", borderWidth: "thin", padding: 10, margin: 10, backgroundColor: "whitesmoke"}}>
                <div className="GameCard-header">
                    <div style={{color: "black", fontWeight: "bold"}}>Innings 1</div>                    
                    <button className={innings1Action !== 'Finished'? "ButtonSelected" : "Button"} disabled={innings1Action === 'Finished'} onClick={() => {startResumeInnings("1")}}>{innings1Action}</button>
                </div>
                <br/>
                <div className="GameCard-header">
                    <div style={{fontSize:"14px"}}><span style={{fontWeight: "bold", color:"black"}}>{game.teamBattingFirst === Teams.One? 'Team 1' : 'Team 2'}</span> Batting</div>
                    <div style={{fontSize: "12px", width:"100px", textAlign: "end", textDecoration:"underline"}} onClick={() => navigate(`/inningsScore/1`)}>more</div>
                </div>
                <div className="GameCard-header">
                    <div style={{color: "black", fontWeight: 'bold', fontSize: 'calc(16px + 2vmin)'}}>{stats.innings1TotalRuns ?? 0} / {stats.innings1TotalWickets ?? 0}</div>
                    <div>Overs: {Math.floor((stats.innings1TotalBalls ?? 0) / 6)}.{(stats.innings1TotalBalls ?? 0) % 6}</div>
                </div>
                <br/>
                <div style={{fontSize: 15, "width": "100%"}}>Players :</div>
                <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", fontSize: 12, "width": "100%"}}>
                    {game.teamBattingFirst === Teams.One?
                        game.team1.map(p => (<div style={{padding: "5px 5px", backgroundColor: "#efefef", color:"black", borderRadius: "10px", marginRight: "2px"}}>{p.name}</div>)):
                        game.team2.map(p => (<div style={{padding: "5px 5px", backgroundColor: "#efefef", color:"black", borderRadius: "10px", marginRight: "2px"}}>{p.name}</div>))}
                </div>
                <br/>
                <button className="Button" disabled={innings1Action === 'Finished'} onClick={() => {setInningsToEnd("1"); setAssertEndInnings(true);}}>End innings</button>
            </div>
            <div className="GameCard"  style={{borderStyle: "solid", borderRadius: "10px", borderWidth: "thin", padding: 10, backgroundColor: "whitesmoke"}}>
                <div className="GameCard-header">
                    <div style={{color: "black", fontWeight: "bold"}} >Innings 2</div>                    
                    <button className={ innings1Action === 'Finished' && innings2Action !== 'Finished'? "ButtonSelected" : "Button"} disabled={innings1Action !== 'Finished' || innings2Action === 'Finished'} onClick={() => {startResumeInnings("2")}}>{innings2Action}</button>
                </div>
                <br/>
                <div className="GameCard-header">
                    <div style={{fontSize:"14px"}}><span style={{fontWeight: "bold", color:"black"}}>{game.teamBattingFirst === Teams.One? 'Team 2' : 'Team 1'}</span> Batting</div>
                    <div style={{fontSize: "12px", width:"100px", textAlign: "end", textDecoration:"underline"}} onClick={() => navigate(`/inningsScore/2`)}>more</div>
                </div>
                <div className="GameCard-header">
                   <div style={{color: "black", fontWeight: 'bold', fontSize: 'calc(16px + 2vmin)'}}>{stats.innings2TotalRuns ?? 0} / {stats.innings2TotalWickets ?? 0}</div>
                   <div>Overs: {Math.floor((stats.innings2TotalBalls ?? 0) / 6)}.{(stats.innings2TotalBalls ?? 0) % 6}</div>
                </div>
                <br/>
                <div style={{fontSize: 15, "width": "100%"}}>Players :</div>
                <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", fontSize: 12, "width": "100%"}}>
                    {game.teamBattingFirst === Teams.One?
                        game.team2.map(p => (<div style={{padding: "5px 5px", backgroundColor: "#efefef", color:"black", borderRadius: "10px", marginRight: "2px"}}>{p.name}</div>)):
                        game.team1.map(p => (<div style={{padding: "5px 5px", backgroundColor: "#efefef", color:"black", borderRadius: "10px", marginRight: "2px"}}>{p.name}</div>))}
                </div>
                <br/>
                <button className="Button" disabled={innings1Action !== 'Finished' || innings2Action === 'Finished'} onClick={() => {setInningsToEnd("2"); setAssertEndInnings(true)}}>End innings</button>
            </div>
            { assertEndInnings && 
                <div className="GameCard" style={{justifyContent: "center", position: "absolute", top:"0px", left:"0px", width:"100%", height:"100%", opacity:"0.9", color:"black"}}>
                    <div style={{opacity:"1"}}>Are you sure you want to end innings?</div>
                    <div>
                        <button className="Button" onClick={() => setAssertEndInnings(false)}>No</button>
                        <button className="Button" onClick={() => endInningsFn(inningsToEnd)}>Yes</button>
                    </div>
                </div>
            }
        </div>
    )
};

export default GameHome;