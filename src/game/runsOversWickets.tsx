import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as Back } from '../back.svg';

const RunsOversWickets = () => {

    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate();
    
    return(
        <div className="Form" style={{backgroundColor: "black", color: "white"}}>
            <div className="GameCard" style={{backgroundColor: "black", color: "white"}}>
                <div className="GameCard-header" style={{backgroundColor: "black", color: "white"}}>
                    <Back style={{width: "30px", height:"30px", fill: "white", color: "white"}} onClick={() => {navigate('/game')}}></Back>
                    {state.runs}
                    <div style={{width: "30px"}}></div>
                </div>
            </div>
        </div>
    );
}

export default RunsOversWickets;