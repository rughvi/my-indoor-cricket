import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Player } from "../types/player";
import { collection, onSnapshot } from "firebase/firestore";
import firebaseApp, { db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

export type AllPlayersContextType = {
    allPlayers: Player[],
    loading: boolean;
    error: Error | null;
};

export const AllPlayersContext = createContext<AllPlayersContextType | null> (null);

type AllPlayersProviderProps = {
    children: ReactNode;
}

const allPlayersCollection = 'players';

export function AllPlayersProvider ({children}: AllPlayersProviderProps) {
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = getAuth(firebaseApp);
    const [user] = useAuthState(auth);

    useEffect(() => {
        const allPlayersRef = collection(db, allPlayersCollection);
        const unsubscribe = onSnapshot(
            allPlayersRef,
            (snapshot) => {
                if(snapshot.empty) {
                    setAllPlayers([]);
                    setLoading(false);
                    return;
                }
                const allPlayers = snapshot.docs.map(d => ({name: d.data().name}));
                setAllPlayers(allPlayers);
                setLoading(false);
            },
            (error) => {
                console.error(error);
                // setError(error);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [user]);

    const value: AllPlayersContextType = { allPlayers, loading, error };
    
    return (
        <AllPlayersContext.Provider value={value}>
            {children}
        </AllPlayersContext.Provider>
    );
}

export const useAllPlayers = () => { 
    const context = useContext(AllPlayersContext); 
    if (!context) { 
        throw new Error( "useAllPlayers must be used inside AllPlayersProvider" ); 
    } 
    return context; 
}