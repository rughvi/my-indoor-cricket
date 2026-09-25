import { ScoreKey } from "../enums/scoreKey";

export interface ScoreKeyEventType {
    type: ScoreKey;
    value: number;
    label: string;
    shortLabel: string;
}

export const ScoreKeyEvent = {
    Dot: {
        type: ScoreKey.Dot,
        value: 0,
        label: "0",
        shortLabel: "0"
    },
    One: {
        type: ScoreKey.One,
        value: 1,
        label: "1",
        shortLabel: "1"
    },
    Two: {
        type: ScoreKey.Two,
        value: 2,
        label: "2",
        shortLabel: "2"
    },
    Three: {
        type: ScoreKey.Three,
        value: 3,
        label: "3",
        shortLabel: "3"
    },
    Four: {
        type: ScoreKey.Four,
        value: 4,
        label: "4",
        shortLabel: "4"
    },
    Five: {
        type: ScoreKey.Five,
        value: 5,
        label: "5",
        shortLabel: "5"
    },
    Six: {
        type: ScoreKey.Six,
        value: 6,
        label: "6",
        shortLabel: "6"
    },
    NoBall: {
        type: ScoreKey.NoBall,
        value: 3,
        label: "NB",
        shortLabel: "Nb"
    },
    NoBallPlusOne: {
        type: ScoreKey.NoBallPlusOne,
        value: 4,
        label: "NB1",
        shortLabel: "Nb1"
    },
    NoBallPlusTwo: {
        type: ScoreKey.NoBallPlusTwo,
        value: 5,
        label: "NB2",
        shortLabel: "Nb2"
    },
    NoBallPlusThree: {
        type: ScoreKey.NoBallPlusThree,
        value: 6,
        label: "NB3",
        shortLabel: "Nb3"
    },
    NoBallPlusFour: {
        type: ScoreKey.NoBallPlusFour,
        value: 7,
        label: "NB4",
        shortLabel: "Nb4"
    },
    NoBallPlusFive: {
        type: ScoreKey.NoBallPlusFive,
        value: 8,
        label: "NB5",
        shortLabel: "Nb5"
    },
    NoBallPlusSix: {
        type: ScoreKey.NoBallPlusSix,
        value: 9,
        label: "NB6",
        shortLabel: "Nb6"
    },
    Wide: {
        type: ScoreKey.Wide,
        value: 3,
        label: "WD",
        shortLabel: "Wd"
    },
    WidePlusOne: {
        type: ScoreKey.WidePlusOne,
        value: 4,
        label: "WD1",
        shortLabel: "Wd1"
    },
    WidePlusTwo: {
        type: ScoreKey.WidePlusTwo,
        value: 5,
        label: "WD2",
        shortLabel: "Wd2"
    },
    WidePlusThree: {
        type: ScoreKey.WidePlusThree,
        value: 6,
        label: "WD3",
        shortLabel: "Wd3"
    },
    Bowled: {
        type: ScoreKey.Bowled,
        value: 0,
        label: "BWLD",
        shortLabel: "B"
    },
    Catch: {
        type: ScoreKey.Catch,
        value: 0,
        label: "CATCH",
        shortLabel: "C"
    },
    Runout: {
        type: ScoreKey.Runout,
        value: 0,
        label: "RUNOUT",
        shortLabel: "Ro"
    }
}