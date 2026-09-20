import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './Main';
import NewOrResumeGame from './game/newOrResumeGame';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Main}></Route>
        <Route path="/new-or-resume-game" Component={NewOrResumeGame}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
