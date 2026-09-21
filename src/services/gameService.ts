import { createAsyncThunk } from '@reduxjs/toolkit';
import { Game } from '../types/game';
import { CurrentGame } from '../types/currentGame';
import { doc, getDoc } from 'firebase/firestore/lite';
import { db } from '../firebase/firebase';

const currentGameCollection = 'currentGame';
const currentGameDocument = 'details';

export const fetchCurrentGame = createAsyncThunk('currentGame/fetchCurrentGame', async (gameId: string) => {
    let currentGame: CurrentGame = { gameId: '' };
    if(gameId.length > 0) {
        currentGame.gameId = gameId;
    } else {
        const currentGameDoc = doc(db, currentGameCollection, currentGameDocument);
        const currentGameSnapshot = await getDoc(currentGameDoc);
        if(currentGameSnapshot.exists()) {
            currentGame.gameId = currentGameSnapshot.data().gameId;
        } else {
            return currentGame;
        }
    }
        
    // const gameDoc = doc(db, gamesCollection, currentGame.gameId);
    // const gameSnapshot = await getDoc(gameDoc);
    // if(gameSnapshot.exists()){
    //     currentGame.game = { 
    //         team1: gameSnapshot.data().team1, 
    //         team2: gameSnapshot.data().team2, 
    //         teamBattingFirst: gameSnapshot.data().teamBattingFirst, 
    //         innings1Status:  gameSnapshot.data().innings1Status,
    //         innings2Status: gameSnapshot.data().innings2Status,
    //         innings1CurrentBowler: gameSnapshot.data().innings1CurrentBowler,
    //         innings2CurrentBowler: gameSnapshot.data().innings2CurrentBowler,
    //         innings1CurrentPlayer1: gameSnapshot.data().innings1CurrentPlayer1,
    //         innings1CurrentPlayer2: gameSnapshot.data().innings1CurrentPlayer2,
    //         innings2CurrentPlayer1: gameSnapshot.data().innings2CurrentPlayer1,
    //         innings2CurrentPlayer2: gameSnapshot.data().innings2CurrentPlayer2,
    //         innings1PlayersScore: gameSnapshot.data().innings1PlayersScore,
    //         innings2PlayersScore: gameSnapshot.data().innings2PlayersScore,
    //         innings1Bowling: gameSnapshot.data().innings1Bowling,
    //         innings2Bowling: gameSnapshot.data().innings2Bowling,
    //         innings1TotalRuns: gameSnapshot.data().innings1TotalRuns,
    //         innings2TotalRuns: gameSnapshot.data().innings2TotalRuns,
    //         innings1TotalBalls: gameSnapshot.data().innings1TotalBalls,
    //         innings2TotalBalls: gameSnapshot.data().innings2TotalBalls,
    //         innings1Extras: gameSnapshot.data().innings1Extras,
    //         innings2Extras: gameSnapshot.data().innings2Extras,
    //         innings1Wickets: gameSnapshot.data().innings1Wickets,
    //         innings2Wickets: gameSnapshot.data().innings2Wickets,
    //     };
    // }
    return currentGame;
});