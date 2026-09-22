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

export const EmptyBallEvent: BallEvent = {
    sequence: 0,
    status: BallEventStatus.Delivery,
    totalRuns: 0,
    totalBalls: 0,
    totalExtras: 0,
    totalWickets: 0,
    striker: '',
    nonStriker: '',
    bowler: '',
    runs: 0
}