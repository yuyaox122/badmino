'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
    Heart, 
    X, 
    Star, 
    MapPin, 
    Sparkles,
    MessageCircle,
    Calendar,
    RotateCcw,
    ChevronLeft
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { mockPlayers } from '@/lib/mock-data';
import Link from 'next/link';

interface SwipeCardProps {
    player: typeof mockPlayers[0];
    onSwipe: (direction: 'left' | 'right') => void;
    compatibility: number;
}

function SwipeCard({ player, onSwipe, compatibility }: SwipeCardProps) {
    const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            onSwipe('right');
        } else if (info.offset.x < -threshold) {
            onSwipe('left');
        }
        setDragDirection(null);
    };

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 50) {
            setDragDirection('right');
        } else if (info.offset.x < -50) {
            setDragDirection('left');
        } else {
            setDragDirection(null);
        }
    };

    return (
        <motion.div
            className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ 
                x: dragDirection === 'right' ? 300 : -300,
                opacity: 0,
                rotate: dragDirection === 'right' ? 20 : -20,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Like/Pass Overlay */}
                <AnimatePresence>
                    {dragDirection === 'right' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-green-500/20 z-10 flex items-center justify-center"
                        >
                            <div className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-2xl rotate-[-15deg] border-4 border-white">
                                LIKE!
                            </div>
                        </motion.div>
                    )}
                    {dragDirection === 'left' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-red-500/20 z-10 flex items-center justify-center"
                        >
                            <div className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-2xl rotate-[15deg] border-4 border-white">
                                PASS
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Profile Image */}
                <div className="relative h-80 bg-gradient-to-br from-sky-200 to-blue-200">
                    <img
                        src={player.avatarUrl}
                        alt={player.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                    {/* Compatibility Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-sky-600">{compatibility}%</span>
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Name & Age */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="text-2xl font-bold">{player.name}</h2>
                        <p className="flex items-center gap-1 text-white/80">
                            <MapPin className="w-4 h-4" />
                            {player.location.city || 'Birmingham'}
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="p-5">
                    {/* Skill & Style */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                            Level {player.skillLevel}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                            {player.playStyle}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {player.stats.winRate}% WR
                        </span>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{player.bio}</p>

                    {/* Looking For */}
                    <div className="flex flex-wrap gap-1">
                        {player.lookingFor.map(item => (
                            <span key={item} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function PartnerSwipeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipedIds, setSwipedIds] = useState<string[]>([]);
    const [showMatch, setShowMatch] = useState(false);
    const [matchedPlayer, setMatchedPlayer] = useState<typeof mockPlayers[0] | null>(null);

    // Filter players based on preferences (simplified for demo)
    const potentialPartners = useMemo(() => {
        return mockPlayers.filter(p => p.id !== user?.id && !swipedIds.includes(p.id));
    }, [user?.id, swipedIds]);

    const currentPlayer = potentialPartners[currentIndex];

    // Calculate compatibility score (simplified)
    const calculateCompatibility = (player: typeof mockPlayers[0]) => {
        let score = 50;
        if (user) {
            // Similar skill level adds points
            const skillDiff = Math.abs(player.skillLevel - (user.skillLevel || 5));
            score += Math.max(0, 30 - skillDiff * 5);
            
            // Same play style adds points
            if (player.playStyle === user.playStyle || player.playStyle === 'both') {
                score += 20;
            }
        }
        return Math.min(99, score);
    };

    const handleSwipe = (direction: 'left' | 'right') => {
        if (!currentPlayer) return;

        setSwipedIds(prev => [...prev, currentPlayer.id]);

        if (direction === 'right') {
            // Simulate 30% chance of match for demo
            const isMatch = Math.random() > 0.7;
            if (isMatch) {
                setMatchedPlayer(currentPlayer);
                setShowMatch(true);
            }
        }

        // Move to next card with slight delay for animation
        setTimeout(() => {
            if (currentIndex < potentialPartners.length - 1) {
                setCurrentIndex(0);
            }
        }, 300);
    };

    const handleUndo = () => {
        if (swipedIds.length > 0) {
            setSwipedIds(prev => prev.slice(0, -1));
        }
    };

    // Match Animation Popup
    if (showMatch && matchedPlayer) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 flex items-center justify-center z-50">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="text-center text-white p-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-6"
                    >
                        <Sparkles className="w-20 h-20 mx-auto text-yellow-300" />
                    </motion.div>
                    
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        It&apos;s a Match!
                    </motion.h1>
                    
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl text-sky-100 mb-8"
                    >
                        You and {matchedPlayer.name} both want to play together!
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex justify-center gap-4 mb-8"
                    >
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                            <img src={user?.avatarUrl || ''} alt="You" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex items-center">
                            <Heart className="w-10 h-10 text-red-400 fill-red-400" />
                        </div>
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                            <img src={matchedPlayer.avatarUrl} alt={matchedPlayer.name} className="w-full h-full object-cover" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col gap-3"
                    >
                        <Link
                            href="/matches"
                            className="px-8 py-4 bg-white text-sky-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Send a Message
                        </Link>
                        <Link
                            href="/partners/scheduling"
                            className="px-8 py-4 bg-white/20 text-white font-bold rounded-2xl hover:bg-white/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-5 h-5" />
                            Schedule a Game
                        </Link>
                        <button
                            onClick={() => setShowMatch(false)}
                            className="px-8 py-3 text-white/80 hover:text-white transition-colors"
                        >
                            Keep Swiping
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // No more players
    if (!currentPlayer || potentialPartners.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sky-100 flex items-center justify-center">
                        <Heart className="w-12 h-12 text-sky-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No More Players</h2>
                    <p className="text-gray-500 mb-6">You&apos;ve seen all potential partners in your area!</p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/partners/preferences"
                            className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors"
                        >
                            Update Preferences
                        </Link>
                        <button
                            onClick={() => {
                                setSwipedIds([]);
                                setCurrentIndex(0);
                            }}
                            className="px-6 py-3 text-sky-600 font-medium hover:bg-sky-50 rounded-xl transition-colors"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            {/* Header */}
            <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>
                        <h1 className="text-lg font-bold text-gray-800">Find Partners</h1>
                        <span className="text-sm text-gray-500">
                            {potentialPartners.length} left
                        </span>
                    </div>
                </div>
            </div>

            {/* Swipe Area */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[500px] relative">
                    <AnimatePresence mode="popLayout">
                        {currentPlayer && (
                            <SwipeCard
                                key={currentPlayer.id}
                                player={currentPlayer}
                                onSwipe={handleSwipe}
                                compatibility={calculateCompatibility(currentPlayer)}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center items-center gap-6 mt-8">
                    <button
                        onClick={handleUndo}
                        disabled={swipedIds.length === 0}
                        className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-yellow-500 hover:scale-110 transition-transform disabled:opacity-30 disabled:hover:scale-100"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => handleSwipe('left')}
                        className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:scale-110 hover:bg-red-50 transition-all"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <button
                        onClick={() => handleSwipe('right')}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                        <Heart className="w-8 h-8" />
                    </button>
                    <button
                        className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-sky-500 hover:scale-110 hover:bg-sky-50 transition-all"
                    >
                        <Star className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PartnerSwipePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
                <div className="animate-pulse text-sky-500">Loading...</div>
            </div>
        }>
            <PartnerSwipeContent />
        </Suspense>
    );
}
