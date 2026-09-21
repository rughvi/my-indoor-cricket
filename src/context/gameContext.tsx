import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Game } from "../types/game";

export type GameContextType = {
  gameId: string;
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
  const [game, setGame] = useState<Game>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const gameRef = doc(db, gamesCollection, gameId);
    console.log('gameRef', gameId, gameRef);
    const unsubscribe = onSnapshot(
      gameRef,
      (snapshot) => {
        const data = snapshot.data();
        console.log('data', data);
        // .map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));

        // setGame(data);
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

  const value: GameContextType = { gameId, loading, error, };

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