import { BallEventStatus } from "../enums/ballEventStatus";
import { ExtrasType } from "../enums/extrasType";

export interface BallEvent {
    sequence: number;
    status: BallEventStatus;
    totalRuns: number;
    totalWickets: number;
    totalExtras: number;
    totalBalls: number;
    
    striker: string;
    nonStriker: string;
    bowler: string;
    runs: number;
    
    extras?: {
        type: ExtrasType,
        runs: number
    };

    wicket?: {
        player: string;        
    }
}