import { configureStore } from '@reduxjs/toolkit'

import gameReducer from './gameSlice';
import playerReducer from './playerSlice';

const store = configureStore({
  reducer: {
    player: playerReducer,
    game: gameReducer
  },
});

export default store;

export type IRootState = ReturnType<typeof store.getState>
export type IRootDispatch = typeof store.dispatch;