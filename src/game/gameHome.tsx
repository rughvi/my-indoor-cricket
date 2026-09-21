import React, { useEffect, useState } from "react";
import { GameContextType, useGame } from "../context/gameContext";

const GameHome = () => {
    const { gameId, loading, error }: GameContextType = useGame();
    return(<div>Game Home {gameId}</div>)
};

export default GameHome;