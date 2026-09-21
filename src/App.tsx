import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './Main';
import GameRoot from './game/gameRoot';
import GameHome from './game/gameHome';
import GameStart from './game/gameStart';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Main}></Route>
        <Route path="/game-start" Component={GameStart}></Route>
        <Route path="/game" element={<GameRoot />}>
            <Route index element={<GameHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
