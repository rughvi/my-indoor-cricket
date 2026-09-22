import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { EmptyGame, Game } from "../types/game";
import { Teams } from "../enums/teams";
import { InningsStatus } from "../enums/inningsStatus";

export type GameContextType = {
  gameId: string;
  game: Game;
  loading: boolean;
  error: Error | null;
};

export const GameContext = createContext<GameContextType | null>(null);

type GameProviderProps = {
  children: ReactNode;
  gameId: string;
};

const gamesCollection = 'games';

export function GameProvider ({children, gameId}: GameProviderProps) {
  const [game, setGame] = useState<Game>({
    team1: [],
    team2: [],
    teamBattingFirst: Teams.One,
    innings1: {status: InningsStatus.NotStarted, score: [] },
    innings2: {status: InningsStatus.NotStarted, score: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const gameRef = doc(db, gamesCollection, gameId);
    const unsubscribe = onSnapshot(
      gameRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setGame(EmptyGame);
          setLoading(false);
          return;
        }
        const data = snapshot.data();
        const game : Game = {
          team1: snapshot.data().team1,
          team2: snapshot.data().team2,
          teamBattingFirst: snapshot.data().teamBattingFirst,
          innings1: snapshot.data().innings1,
          innings2: snapshot.data().innings2,
        };
        setGame(game);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        // setError(error);
        setLoading(false);
      }
    );

    // Important: stop listening when Provider unmounts
    return unsubscribe;
  }, [gameId]);

  const value: GameContextType = { gameId, game, loading, error, };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => { 
    const context = useContext(GameContext); 
    if (!context) { 
        throw new Error( "useGame must be used inside GameProvider" ); 
    } 
    return context; 
}