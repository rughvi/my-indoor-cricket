import { configureStore } from '@reduxjs/toolkit'

import gameReducer from './gameSlice';

const store = configureStore({
  reducer: {
    game: gameReducer
  },
});

export default store;

export type IRootState = ReturnType<typeof store.getState>
export type IRootDispatch = typeof store.dispatch;