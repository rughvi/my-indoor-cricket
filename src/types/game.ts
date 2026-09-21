import { Teams } from "../enums/teams";
import { EmptyInnings, Innings } from "./innings";
import { Player } from "./player";

export interface Game {
    team1: Player[];
    team2: Player[];
    teamBattingFirst: Teams;
    innings1: Innings;
    innings2: Innings;
}

export const EmptyGame: Game = {
    team1: [],
    team2: [],
    teamBattingFirst: Teams.One,
    innings1: EmptyInnings,
    innings2: EmptyInnings
}