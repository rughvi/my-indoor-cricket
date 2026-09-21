import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../store/store";
import { CurrentGame } from "../types/currentGame";
import { GameProvider } from "../context/gameContext";
import { Outlet } from "react-router-dom";

const GameRoot = () => {   
    const currentGame = useSelector<IRootState, CurrentGame>(state => state.game.currentGame); 
    return (
        <GameProvider gameId={currentGame.gameId}>
            <Outlet />
        </GameProvider>
    );
};

export default GameRoot;