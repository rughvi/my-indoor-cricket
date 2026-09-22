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
    Wicket,
    Bowled,
    Catch,
    Runout
}

export const WidesAndNoballs = [
    ScoreKey.Wide,
    ScoreKey.NoBall,
    ScoreKey.NoBallPlusOne,
    ScoreKey.NoBallPlusTwo,
    ScoreKey.NoBallPlusThree,
    ScoreKey.NoBallPlusFour,
    ScoreKey.NoBallPlusFive,
    ScoreKey.NoBallPlusSix
]