import { createSlice } from "@reduxjs/toolkit";
import { CurrentGame } from "../types/currentGame";
import { fetchCurrentGame } from "../services/gameService";
import { Status } from "../enums/status";
import { EmptyGame } from "../types/game";

export interface GameSliceState {
    fetchCurrentGameStatus: Status;
    fetchCurrentGameError: string;
    currentGame: CurrentGame;    
}

const gameSliceInitialState: GameSliceState = {
    fetchCurrentGameStatus: Status.Idle,
    fetchCurrentGameError: '',
    currentGame: {gameId: '', game: EmptyGame}
};

export const gameSlice = createSlice({
    name: 'game',
    initialState: gameSliceInitialState,
    reducers: {
        setTeamBattingFirst: (state, action) => {
            state.currentGame.game.teamBattingFirst = action.payload.teamBattingFirst;
        },
        assignPlayersToTeams: (state, action) => {
            if(action.payload.team === "1") {
                state.currentGame.game.team1 = Object.assign([], action.payload.players);
            } else if (action.payload.team === "2") {
                state.currentGame.game.team2 = Object.assign([], action.payload.players);
            }
        },
    },
     extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentGame.pending, (state) => {
                state.fetchCurrentGameStatus = Status.Pending;
            })
            .addCase(fetchCurrentGame.fulfilled, (state, action) => {
                state.fetchCurrentGameStatus = Status.Fulfilled;
                state.currentGame = action.payload;
            })
            .addCase(fetchCurrentGame.rejected, (state, action) => {
                state.fetchCurrentGameStatus = Status.Failed;
                state.fetchCurrentGameError = action.error.message || 'Failed to fetch current game';
            });
     }
});

export const { setTeamBattingFirst, assignPlayersToTeams } = gameSlice.actions;
export default gameSlice.reducer;