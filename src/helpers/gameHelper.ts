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

export const currentPlayersStats = (game: Game, inningsId: string, player1?: Player, player2?: Player): {
    currentPlayer1Scores: { runs: number, balls: number },
    currentPlayer2Scores: { runs: number, balls: number }
} => {
    if(!player1 || !player2) {
        return {
            currentPlayer1Scores: { runs: 0, balls: 0 },
            currentPlayer2Scores: { runs: 0, balls: 0 }
        }
    }
    let inningsScore;
    if(inningsId == "1") {
        inningsScore = game.innings1.score
        
    } else {
        inningsScore = game.innings2.score
    }
    const player1BallEvents = inningsScore.filter(s => s.striker === player1?.name).map(s =>s.runs);
    let player1Runs = 0;
    const player1Balls = player1BallEvents.length;
    if(player1BallEvents.length > 0) {
        player1Runs = player1BallEvents.reduce((acc, r) => acc + r, 0);
    }
    
    const player2BallEvents = inningsScore.filter(s => s.striker === player2?.name).map(s => s.runs);
    let player2Runs = 0;
    const player2Balls = player2BallEvents.length;
    if(player2BallEvents.length > 0) {
        player2Runs = player2BallEvents.reduce((acc, r) => acc + r, 0);
    }
    return {
        currentPlayer1Scores: { runs: player1Runs, balls: player1Balls },
        currentPlayer2Scores: { runs: player2Runs, balls: player2Balls }
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
    nonStriker: Player,
    bowler: Player): BallEvent => {
    const lastBallEvent = getLastBallEvent(game, inningsId);

    const ballEvent: BallEvent = {
        ...lastBallEvent,
        sequence: lastBallEvent.sequence + 1,
        runs: scoreKeyEventType.value,
        totalBalls: lastBallEvent.totalBalls + 1,
        totalRuns: lastBallEvent.totalRuns + scoreKeyEventType.value,
        striker: striker.name,
        nonStriker: nonStriker.name,
        bowler: bowler.name
    };
    return ballEvent;
}