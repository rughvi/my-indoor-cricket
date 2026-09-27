import React, { useEffect, useState } from "react";
import { AllPlayersProvider } from "../context/allPlayersContext";
import { Outlet } from "react-router-dom";

const Games = () => {
    return(
        <AllPlayersProvider>
            <Outlet />
        </AllPlayersProvider>
    );
};

export default Games;