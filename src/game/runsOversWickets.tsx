import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as Back } from '../back.svg';
import '../css/runsOversWickets.css';

const RunsOversWickets = () => {
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate();
    
    return(
        <div className="Form" style={{backgroundColor: "black", color: "white"}}>
            <Back style={{width: "30px", height:"30px", fill: "white", color: "white"}} onClick={() => navigate('/game')}></Back>
            <div className="runs-display">
                
                <span className="runs-number">123/5</span>
                <span className="runs-label">RUNS</span>
            </div>
        </div>
    );
}

export default RunsOversWickets;