import { BallEventStatus } from "../enums/ballEventStatus";
import { BallEvent, EmptyBallEvent } from "../types/ballEvent";
import { BowlerStats } from "../types/bowlerStats";
import { Game } from "../types/game";
import { Player } from "../types/player";
import { ScoreKeyEventType } from "../types/scoreKeyEvent";

export const inningsStats = (game: Game) => {
    const innings1Score = game?.innings1?.score?.sort((a, b) => b.sequence - a.sequence);
    const innings2Score = game?.innings2?.score?.sort((a, b) => b.sequence - a.sequence);
    return {
        innings1TotalRuns: innings1Score[0]?.totalRuns ?? 0,
        innings1TotalBalls: innings1Score[0]?.totalBalls ?? 0,
        innings1TotalWickets: innings1Score[0]?.totalWickets ?? 0,
        innings1TotalExtras: innings1Score[0]?.totalExtras ?? 0,

        innings2TotalRuns: innings2Score[0]?.totalRuns ?? 0,
        innings2TotalBalls: innings2Score[0]?.totalBalls ?? 0,
        innings2TotalWickets: innings2Score[0]?.totalWickets ?? 0,
        innings2TotalExtras: innings2Score[0]?.totalExtras ?? 0,
    }
}

export const bowlerStats = (game: Game, inningsId: string, bowler?: Player) => {
    let inningsScore;
    if(inningsId == "1") {
        inningsScore = game.innings1.score
        
    } else {
        inningsScore = game.innings2.score
    }

    const ballEvents = inningsScore.filter(s => s.bowler === bowler?.name);
    const balls = ballEvents?.length ?? 0;
    const runs = ballEvents?.reduce((acc, e) => acc + e.runs, 0);
    const wickets = ballEvents?.filter(e => e.wicket)?.length ?? 0;

    const bowlerStats: BowlerStats =  {
        overs: `${Math.floor(balls / 6)}.${balls % 6}`,
        runs: runs,
        wickets: wickets
    };

    return bowlerStats;
}

export const currentPlayersStats = (game: Game, player1?: Player, player2?: Player): {
    currentPlayer1Scores: number[],
    currentPlayer2Scores: number[]
} => {
    if(player1 && player2) {
        return {
            currentPlayer1Scores: [0],
            currentPlayer2Scores: [0]
        }
    }
    return {
        currentPlayer1Scores: [0],
        currentPlayer2Scores: [0]
    }
}

export const getLastBallEvent = (game: Game, inningsId: string): BallEvent => {
    let score: BallEvent[] = [];
    if(inningsId == "1") {
        score = game.innings1.score;
    } else {
        score = game.innings2.score;
    }
    if(score.length == 0) {
        return EmptyBallEvent;
    }
    const sortedScore = score.sort((a, b) => b.sequence - a.sequence);
    return sortedScore[0];
}

export const getBallEventForScoreKey = (
    game: Game, 
    inningsId: string, 
    scoreKeyEventType: ScoreKeyEventType,
    striker: Player,
    nonStriker: Player): BallEvent => {
    const lastBallEvent = getLastBallEvent(game, inningsId);

    const ballEvent: BallEvent = {
        ...lastBallEvent,
        sequence: lastBallEvent.sequence + 1,
        runs: scoreKeyEventType.value,
        totalBalls: lastBallEvent.totalBalls + 1,
        totalRuns: lastBallEvent.totalRuns + scoreKeyEventType.value,
        striker: striker.name,
        nonStriker: nonStriker.name
    };
    return ballEvent;
}