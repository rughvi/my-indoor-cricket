import { createAsyncThunk } from '@reduxjs/toolkit';
import { CurrentGame } from '../types/currentGame';
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, runTransaction, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { EmptyGame, Game } from '../types/game';
import { Player } from '../types/player';
import { BallEvent } from '../types/ballEvent';

const currentGameCollection = 'currentGame';
const currentGameDocument = 'details';
const gamesCollection = 'games';

export const fetchAllPlayers = createAsyncThunk('players/fetchAllPlayers', async () => {
    const playersColl = collection(db, 'players');
    const playersSnapshot = await getDocs(playersColl);
    const players = playersSnapshot.docs.map(doc => <Player>{ name: doc.data().name });
    return players;
});

export const fetchCurrentGame = createAsyncThunk('currentGame/fetchCurrentGame', async (gameId: string) => {
    let currentGame: CurrentGame = { gameId: '', game: EmptyGame };
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

export const createNewGame = createAsyncThunk('game/createNewGame', async (game: Game) => {
    const gameDocRef = await addDoc(collection(db, gamesCollection), game);

    const currentGameDocRef = doc(db, currentGameCollection, currentGameDocument);
    await setDoc(currentGameDocRef, <CurrentGame>{ gameId: gameDocRef.id });

    return gameDocRef.id;
});

export const endCurrentGame = createAsyncThunk('game/endGame', async() => {
    const currentGameDocRef = doc(db, 'currentGame', 'details');
    await deleteDoc(currentGameDocRef);
});

export const startInnings = createAsyncThunk('game/startInnings', async (input: {gameId: string, inningsId: string}) => {
    if(input.gameId && input.inningsId) {
        const key = `innings${input.inningsId}`;
        const gameDocRef = doc(db, 'games', input.gameId);
        await setDoc(gameDocRef, { [key] : {status: 'In progress'}}, {merge: true});
    }
});

export const endInnings = createAsyncThunk('game/endInnings', async (input: {gameId: string, inningsId: string}) => {
    if(input.gameId && input.inningsId) {
        const key = `innings${input.inningsId}`;
        const gameDocRef = doc(db, 'games', input.gameId);
        await setDoc(gameDocRef, { [key] : {status: 'Finished'}}, {merge: true});
    }
});

export const addBallEvent = createAsyncThunk('game/innings/addBallEvent', async(input: {gameId: string, inningsId: string, ballEvent: BallEvent}) => {
    if(input.gameId && input.inningsId) {
        const key = `innings${input.inningsId}`;
        const gameDocRef = doc(db, 'games', input.gameId);
        await setDoc(gameDocRef, { [key]: {score : arrayUnion(input.ballEvent)}}, {merge: true});
    }
});

export const addPlayerToTeam = createAsyncThunk('game/addPlayerToTeam', async(input: {gameId: string, team: string, player: Player}) => {
    await runTransaction(db, async (transaction) => {
        const gameDocRef = doc(db, 'games', input.gameId);
        const gameDoc = await transaction.get(gameDocRef);
        if (!gameDoc.exists()) {
            throw "Document does not exist!";
        }

        const gameData = gameDoc.data();        
        const team = gameData[input.team];
        team.push({name: input.player.name});
        await transaction.set(gameDocRef, {[input.team]: team}, {merge: true});
    });
});

export const updateInningsCurrentPlayer = createAsyncThunk('game/updateGame', async (input: {gameId: string, inningsId: string, playerId: string, value: Player}) => {
    if(input.gameId) {
        const gameDocRef = doc(db, 'games', input.gameId);
        await setDoc(gameDocRef, { [`innings${input.inningsId}`]: {[`currentPlayer${input.playerId}`] : input.value}}, {merge: true});
    }
});

export const updateInningsCurrentBowler = createAsyncThunk('game/updateGame', async (input: {gameId: string, inningsId: string, playerId: string, value: Player}) => {
    if(input.gameId) {
        const gameDocRef = doc(db, 'games', input.gameId);
        await setDoc(gameDocRef, { [`innings${input.inningsId}`]: {currentBowler : input.value}}, {merge: true});
    }
});