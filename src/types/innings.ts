import { InningsStatus } from "../enums/inningsStatus";
import { BallEvent } from "./ballEvent";
import { Player } from "./player";

export interface Innings {
    status: InningsStatus;
    score: BallEvent[];
    currentBowler?: Player;
    currentPlayer1?: Player;
    currentPlayer2?: Player;
}

export const EmptyInnings: Innings = {
    status: InningsStatus.NotStarted,
    score: [],
}