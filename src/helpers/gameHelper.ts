import { Game } from "../types/game";

export const inningsStats = (game: Game) => {
    const innings1Score = game?.innings1?.score?.sort((a, b) => b.sequence - a.sequence);
    const innings2Score = game?.innings2?.score?.sort((a, b) => b.sequence - a.sequence);
    return {
        innings1TotalRuns: innings1Score[0]?.totalRuns ?? 0,
        innings1TotalBalls: innings1Score[0]?.totalBalls ?? 0,
        innings1TotalWickets: innings1Score[0]?.totalWickets ?? 0,
        innings2TotalRuns: innings2Score[0]?.totalRuns ?? 0,
        innings2TotalBalls: innings2Score[0]?.totalBalls ?? 0,
        innings2TotalWickets: innings2Score[0]?.totalWickets ?? 0,
    }
}