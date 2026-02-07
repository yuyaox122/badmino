'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockBookedSessions } from '@/lib/mock-data';

interface Venue {
    id: string;
    name: string;
    pricePerHour: number;
}

interface Participant {
    id: string;
    name: string;
    avatarUrl: string;
    share: number;
    paid: boolean;
}

interface PaymentAllocation {
    participantId: string;
    name: string;
    avatarUrl: string;
    amount: number;
    percentage: number;
    isIncluded: boolean;
    isPaid: boolean;
}

export interface ScheduledSession {
    id: string;
    date: string;
    time: string;
    duration: number;
    venue: Venue;
    participants: Participant[];
    totalCost: number;
    splitMode: 'equal' | 'custom';
    status: 'pending' | 'upcoming' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
    createdBy: string;
    paymentAllocations?: PaymentAllocation[];
}

interface BookingContextType {
    scheduledSessions: ScheduledSession[];
    addScheduledSession: (session: ScheduledSession) => void;
    updateScheduledSession: (id: string, updates: Partial<ScheduledSession>) => void;
    getSessionsForFareSplitting: () => ScheduledSession[];
    getSessionById: (id: string) => ScheduledSession | undefined;
    updatePaymentAllocations: (sessionId: string, allocations: PaymentAllocation[]) => void;
    markParticipantPaid: (sessionId: string, participantId: string, isPaid: boolean) => void;
    createSessionFromSchedule: (data: {
        date: Date;
        time: string;
        duration: number;
        venue: Venue;
        participantDetails: { id: string; name: string; avatarUrl: string }[];
    }) => ScheduledSession;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>([]);

    useEffect(() => {
        const initialSessions = mockBookedSessions.map(session => ({
            ...session,
            paymentAllocations: session.participants.map(p => ({
                participantId: p.id,
                name: p.name,
                avatarUrl: p.avatarUrl,
                amount: p.share,
                percentage: (p.share / session.totalCost) * 100,
                isIncluded: true,
                isPaid: p.paid,
            })),
        }));
        setScheduledSessions(initialSessions);
    }, []);

    const addScheduledSession = (session: ScheduledSession) => {
        setScheduledSessions(prev => [...prev, session]);
    };

    const updateScheduledSession = (id: string, updates: Partial<ScheduledSession>) => {
        setScheduledSessions(prev =>
            prev.map(s => s.id === id ? { ...s, ...updates } : s)
        );
    };

    const getSessionsForFareSplitting = () => {
        return scheduledSessions.filter(s => 
            ['pending', 'upcoming', 'confirmed'].includes(s.status)
        );
    };

    const getSessionById = (id: string) => {
        return scheduledSessions.find(s => s.id === id);
    };

    const updatePaymentAllocations = (sessionId: string, allocations: PaymentAllocation[]) => {
        setScheduledSessions(prev =>
            prev.map(s => {
                if (s.id === sessionId) {
                    const updatedParticipants = s.participants.map(p => {
                        const allocation = allocations.find(a => a.participantId === p.id);
                        return allocation ? { ...p, share: allocation.amount, paid: allocation.isPaid } : p;
                    });
                    return { 
                        ...s, 
                        paymentAllocations: allocations,
                        participants: updatedParticipants,
                        splitMode: 'custom' as const,
                    };
                }
                return s;
            })
        );
    };

    const markParticipantPaid = (sessionId: string, participantId: string, isPaid: boolean) => {
        setScheduledSessions(prev =>
            prev.map(s => {
                if (s.id === sessionId) {
                    const updatedParticipants = s.participants.map(p =>
                        p.id === participantId ? { ...p, paid: isPaid } : p
                    );
                    const updatedAllocations = s.paymentAllocations?.map(a =>
                        a.participantId === participantId ? { ...a, isPaid } : a
                    );
                    return { 
                        ...s, 
                        participants: updatedParticipants,
                        paymentAllocations: updatedAllocations,
                    };
                }
                return s;
            })
        );
    };

    const createSessionFromSchedule = (data: {
        date: Date;
        time: string;
        duration: number;
        venue: Venue;
        participantDetails: { id: string; name: string; avatarUrl: string }[];
    }): ScheduledSession => {
        const totalCost = data.venue.pricePerHour * data.duration;
        const sharePerPerson = totalCost / (data.participantDetails.length + 1);
        
        const allParticipants: Participant[] = [
            {
                id: 'current-user',
                name: 'You',
                avatarUrl: '',
                share: sharePerPerson,
                paid: false,
            },
            ...data.participantDetails.map(p => ({
                id: p.id,
                name: p.name,
                avatarUrl: p.avatarUrl,
                share: sharePerPerson,
                paid: false,
            })),
        ];

        const paymentAllocations: PaymentAllocation[] = allParticipants.map(p => ({
            participantId: p.id,
            name: p.name,
            avatarUrl: p.avatarUrl,
            amount: p.share,
            percentage: (p.share / totalCost) * 100,
            isIncluded: true,
            isPaid: false,
        }));

        const newSession: ScheduledSession = {
            id: `session-${Date.now()}`,
            date: data.date.toISOString().split('T')[0],
            time: data.time,
            duration: data.duration,
            venue: data.venue,
            participants: allParticipants,
            totalCost,
            splitMode: 'equal',
            status: 'pending',
            createdAt: new Date().toISOString(),
            createdBy: 'current-user',
            paymentAllocations,
        };

        setScheduledSessions(prev => [...prev, newSession]);
        
        return newSession;
    };

    return (
        <BookingContext.Provider value={{
            scheduledSessions,
            addScheduledSession,
            updateScheduledSession,
            getSessionsForFareSplitting,
            getSessionById,
            updatePaymentAllocations,
            markParticipantPaid,
            createSessionFromSchedule,
        }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}
