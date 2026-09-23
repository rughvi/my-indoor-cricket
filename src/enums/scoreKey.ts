export enum ScoreKey {
    Dot,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    NoBall,
    NoBallPlusOne,
    NoBallPlusTwo,
    NoBallPlusThree,
    NoBallPlusFour,
    NoBallPlusFive,
    NoBallPlusSix,
    Wide,
    WidePlusOne,
    WidePlusTwo,
    WidePlusThree,
    Wicket,
    Bowled,
    Catch,
    Runout
}

export const WidesAndNoballs = [
    ScoreKey.Wide,
    ScoreKey.WidePlusOne,
    ScoreKey.WidePlusTwo,
    ScoreKey.WidePlusThree,
    ScoreKey.NoBall,
    ScoreKey.NoBallPlusOne,
    ScoreKey.NoBallPlusTwo,
    ScoreKey.NoBallPlusThree,
    ScoreKey.NoBallPlusFour,
    ScoreKey.NoBallPlusFive,
    ScoreKey.NoBallPlusSix
];

export const BowledAndCatch = [
    ScoreKey.Bowled,
    ScoreKey.Catch
];