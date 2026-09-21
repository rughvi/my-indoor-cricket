import { createSlice } from "@reduxjs/toolkit";
import { CurrentGame } from "../types/currentGame";
import { fetchCurrentGame } from "../services/gameService";
import { Status } from "../enums/status";

export interface GameSliceState {
    fetchCurrentGameStatus: Status;
    fetchCurrentGameError: string;
    currentGame: CurrentGame;    
}

const gameSliceInitialState: GameSliceState = {
    fetchCurrentGameStatus: Status.Idle,
    fetchCurrentGameError: '',
    currentGame: {gameId: ''}
};

export const gameSlice = createSlice({
    name: 'game',
    initialState: gameSliceInitialState,
    reducers: {

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

// export const { setTeamBattingFirst, assignPlayersToTeams, clearTeamPlayers, updateInningsCurrentPlayer, updateInningsCurrentBowler } = gameSlice.actions;
export default gameSlice.reducer;