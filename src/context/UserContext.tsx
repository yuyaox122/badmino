'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player } from '@/types';
import { mockCurrentUser } from '@/lib/mock-data';

interface UserContextType {
    user: Player | null;
    setUser: (user: Player | null) => void;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Player | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading user data
        setTimeout(() => {
            setUser(mockCurrentUser);
            setIsLoading(false);
        }, 500);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
