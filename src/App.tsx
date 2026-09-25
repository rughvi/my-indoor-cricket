import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './Main';
import GameRoot from './game/gameRoot';
import GameHome from './game/gameHome';
import GameStart from './game/gameStart';
import TeamSelection from './game/teamSelection';
import Innings from './game/innings';
import PlayerBowlerSelection from './game/playerBowlerSelection';
import InningsStats from './game/inningsStats';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Main}></Route>
        <Route path="/game-start" Component={GameStart}></Route>
        <Route path="/teamSelection/:teamIndex" Component={TeamSelection}></Route>
        <Route path="/game" element={<GameRoot />}>
            <Route index element={<GameHome />} />
            <Route path='innings/:inningsId' element={<Innings />}></Route>
            <Route path="current/:playerbowler/selection/:inningsId/:currentPlayerId" Component={PlayerBowlerSelection}></Route>
            <Route path="innings-stats/:inningsId" element={<InningsStats />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
