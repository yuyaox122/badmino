'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Medal,
    Crown,
    TrendingUp,
    ChevronUp,
    ChevronDown,
    Flame,
    Target,
} from 'lucide-react';
import { Header } from '@/components/Navigation';

interface LeaderboardPlayer {
    rank: number;
    name: string;
    wins: number;
    losses: number;
    winRate: number;
    rating: number;
    streak: number; // positive = win streak, negative = loss streak
    change: number; // rank change: positive = moved up, negative = moved down
}

const allPlayers: LeaderboardPlayer[] = [
    { rank: 1, name: 'Sarah Chen', wins: 42, losses: 6, winRate: 87.5, rating: 2150, streak: 8, change: 0 },
    { rank: 2, name: 'James Wilson', wins: 38, losses: 9, winRate: 80.9, rating: 2080, streak: 3, change: 1 },
    { rank: 3, name: 'Priya Sharma', wins: 35, losses: 10, winRate: 77.8, rating: 2020, streak: 5, change: -1 },
    { rank: 4, name: 'Marcus Thompson', wins: 33, losses: 12, winRate: 73.3, rating: 1960, streak: 2, change: 2 },
    { rank: 5, name: 'Emily Zhang', wins: 30, losses: 13, winRate: 69.8, rating: 1910, streak: -1, change: 0 },
    { rank: 6, name: 'Raj Patel', wins: 28, losses: 15, winRate: 65.1, rating: 1870, streak: 1, change: -2 },
    { rank: 7, name: 'Olivia Brown', wins: 26, losses: 16, winRate: 61.9, rating: 1830, streak: 4, change: 3 },
    { rank: 8, name: 'Daniel Kim', wins: 25, losses: 18, winRate: 58.1, rating: 1790, streak: -2, change: -1 },
    { rank: 9, name: 'Aisha Mohammed', wins: 23, losses: 19, winRate: 54.8, rating: 1750, streak: 1, change: 0 },
    { rank: 10, name: 'Tom Bailey', wins: 21, losses: 20, winRate: 51.2, rating: 1710, streak: -3, change: -2 },
    { rank: 11, name: 'Mei Lin', wins: 20, losses: 22, winRate: 47.6, rating: 1670, streak: 2, change: 1 },
    { rank: 12, name: 'Chris Evans', wins: 18, losses: 24, winRate: 42.9, rating: 1630, streak: -1, change: -1 },
];

const singlesPlayers: LeaderboardPlayer[] = [
    { rank: 1, name: 'James Wilson', wins: 22, losses: 4, winRate: 84.6, rating: 2100, streak: 5, change: 1 },
    { rank: 2, name: 'Sarah Chen', wins: 20, losses: 5, winRate: 80.0, rating: 2060, streak: 3, change: -1 },
    { rank: 3, name: 'Marcus Thompson', wins: 18, losses: 6, winRate: 75.0, rating: 1990, streak: 2, change: 0 },
    { rank: 4, name: 'Emily Zhang', wins: 16, losses: 7, winRate: 69.6, rating: 1940, streak: -1, change: 2 },
    { rank: 5, name: 'Priya Sharma', wins: 15, losses: 8, winRate: 65.2, rating: 1900, streak: 1, change: -1 },
    { rank: 6, name: 'Daniel Kim', wins: 14, losses: 9, winRate: 60.9, rating: 1850, streak: 4, change: 3 },
    { rank: 7, name: 'Raj Patel', wins: 13, losses: 10, winRate: 56.5, rating: 1810, streak: -2, change: -2 },
    { rank: 8, name: 'Olivia Brown', wins: 12, losses: 11, winRate: 52.2, rating: 1770, streak: 1, change: 0 },
    { rank: 9, name: 'Aisha Mohammed', wins: 11, losses: 12, winRate: 47.8, rating: 1730, streak: -1, change: -1 },
    { rank: 10, name: 'Tom Bailey', wins: 10, losses: 13, winRate: 43.5, rating: 1690, streak: 2, change: 1 },
];

const doublesPlayers: LeaderboardPlayer[] = [
    { rank: 1, name: 'Priya Sharma', wins: 20, losses: 2, winRate: 90.9, rating: 2180, streak: 10, change: 0 },
    { rank: 2, name: 'Sarah Chen', wins: 22, losses: 3, winRate: 88.0, rating: 2130, streak: 6, change: 0 },
    { rank: 3, name: 'Olivia Brown', wins: 14, losses: 5, winRate: 73.7, rating: 1970, streak: 3, change: 2 },
    { rank: 4, name: 'James Wilson', wins: 16, losses: 5, winRate: 76.2, rating: 1950, streak: -1, change: -1 },
    { rank: 5, name: 'Raj Patel', wins: 15, losses: 5, winRate: 75.0, rating: 1930, streak: 2, change: -1 },
    { rank: 6, name: 'Marcus Thompson', wins: 15, losses: 6, winRate: 71.4, rating: 1900, streak: 1, change: 0 },
    { rank: 7, name: 'Mei Lin', wins: 14, losses: 7, winRate: 66.7, rating: 1860, streak: 4, change: 2 },
    { rank: 8, name: 'Aisha Mohammed', wins: 12, losses: 7, winRate: 63.2, rating: 1820, streak: 2, change: 0 },
    { rank: 9, name: 'Daniel Kim', wins: 11, losses: 9, winRate: 55.0, rating: 1760, streak: -3, change: -2 },
    { rank: 10, name: 'Chris Evans', wins: 10, losses: 10, winRate: 50.0, rating: 1720, streak: 1, change: 0 },
];

const tabs = [
    { key: 'overall', label: 'Overall' },
    { key: 'singles', label: 'Singles' },
    { key: 'doubles', label: 'Doubles' },
];

const podiumGradients = [
    'from-yellow-400 to-amber-500',  // Gold - 1st
    'from-slate-300 to-slate-400',   // Silver - 2nd
    'from-amber-600 to-orange-700',  // Bronze - 3rd
];

const podiumIcons = [Crown, Medal, Medal];

function RankChange({ change }: { change: number }) {
    if (change === 0) return <span className="text-slate-500 text-sm">--</span>;
    if (change > 0)
        return (
            <span className="flex items-center gap-0.5 text-emerald-400 text-sm font-medium">
                <ChevronUp className="w-4 h-4" />
                {change}
            </span>
        );
    return (
        <span className="flex items-center gap-0.5 text-red-400 text-sm font-medium">
            <ChevronDown className="w-4 h-4" />
            {Math.abs(change)}
        </span>
    );
}

function Streak({ streak }: { streak: number }) {
    if (streak === 0) return null;
    if (streak > 0)
        return (
            <span className="flex items-center gap-1 text-orange-400 text-xs font-medium">
                <Flame className="w-3.5 h-3.5" />
                {streak}W
            </span>
        );
    return (
        <span className="flex items-center gap-1 text-slate-500 text-xs font-medium">
            {Math.abs(streak)}L
        </span>
    );
}

export default function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState('overall');

    const dataMap: Record<string, LeaderboardPlayer[]> = {
        overall: allPlayers,
        singles: singlesPlayers,
        doubles: doublesPlayers,
    };

    const players = dataMap[activeTab];
    const topThree = players.slice(0, 3);
    const rest = players.slice(3);

    return (
        <div className="min-h-screen bg-slate-900">
            <Header
                title="Leaderboards"
                subtitle="Rankings and standings"
            />

            <div className="container mx-auto px-4 py-6">
                {/* Tab Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 mb-6"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.key
                                    ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg'
                                    : 'bg-slate-800 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Podium - Top 3 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-3 gap-3 mb-6"
                >
                    {/* 2nd place */}
                    {[topThree[1], topThree[0], topThree[2]].map((player, visualIndex) => {
                        const actualRank = player.rank;
                        const rankIndex = actualRank - 1;
                        const PodiumIcon = podiumIcons[rankIndex];
                        const isFirst = actualRank === 1;

                        return (
                            <motion.div
                                key={player.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + visualIndex * 0.1 }}
                                className={`relative bg-slate-800 rounded-3xl p-5 border border-white/10 text-center ${isFirst ? 'md:-mt-4' : 'mt-4 md:mt-6'
                                    }`}
                            >
                                {/* Rank badge */}
                                <div className={`mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br ${podiumGradients[rankIndex]} flex items-center justify-center shadow-lg mb-3`}>
                                    <PodiumIcon className="w-6 h-6 text-white" />
                                </div>

                                {/* Avatar */}
                                <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${podiumGradients[rankIndex]} flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg`}>
                                    {player.name.charAt(0)}
                                </div>

                                <h3 className="font-bold text-white text-sm md:text-base truncate">{player.name}</h3>
                                <p className="text-sky-400 font-semibold text-lg">{player.rating}</p>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <span className="text-xs text-slate-400">{player.winRate}% WR</span>
                                    <Streak streak={player.streak} />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    {player.wins}W - {player.losses}L
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Stats Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-3 gap-3 mb-6"
                >
                    {[
                        { label: 'Total Players', value: players.length, icon: Target, color: 'text-sky-400' },
                        { label: 'Highest Rating', value: players[0]?.rating || 0, icon: TrendingUp, color: 'text-emerald-400' },
                        { label: 'Top Win Rate', value: `${Math.max(...players.map(p => p.winRate)).toFixed(1)}%`, icon: Trophy, color: 'text-amber-400' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-slate-800 rounded-2xl p-4 border border-white/10 text-center">
                            <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                            <p className="text-white font-bold text-lg">{stat.value}</p>
                            <p className="text-slate-400 text-xs">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Full Rankings Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-800 rounded-3xl shadow-lg border border-white/10 overflow-hidden"
                >
                    <div className="p-5 border-b border-white/10">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-sky-500" />
                            Full Rankings
                        </h2>
                    </div>

                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-[3rem_1fr_4rem_4rem_5rem_5rem_4rem_3.5rem] gap-2 px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
                        <span>#</span>
                        <span>Player</span>
                        <span className="text-center">W</span>
                        <span className="text-center">L</span>
                        <span className="text-center">Win %</span>
                        <span className="text-center">Rating</span>
                        <span className="text-center">Streak</span>
                        <span className="text-center">+/-</span>
                    </div>

                    {/* Player Rows */}
                    <div>
                        {rest.map((player, index) => (
                            <motion.div
                                key={player.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.45 + index * 0.03 }}
                                className="grid grid-cols-[3rem_1fr_auto] md:grid-cols-[3rem_1fr_4rem_4rem_5rem_5rem_4rem_3.5rem] gap-2 items-center px-5 py-3.5 border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                                {/* Rank */}
                                <span className="text-slate-400 font-semibold">{player.rank}</span>

                                {/* Player */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                        {player.name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-white truncate">{player.name}</span>
                                </div>

                                {/* Mobile: compact stats */}
                                <div className="flex items-center gap-3 md:hidden">
                                    <span className="text-sky-400 font-semibold text-sm">{player.rating}</span>
                                    <RankChange change={player.change} />
                                </div>

                                {/* Desktop columns */}
                                <span className="hidden md:block text-center text-emerald-400 font-medium">{player.wins}</span>
                                <span className="hidden md:block text-center text-red-400 font-medium">{player.losses}</span>
                                <span className="hidden md:block text-center text-white font-medium">{player.winRate}%</span>
                                <span className="hidden md:block text-center text-sky-400 font-semibold">{player.rating}</span>
                                <span className="hidden md:flex justify-center"><Streak streak={player.streak} /></span>
                                <span className="hidden md:flex justify-center"><RankChange change={player.change} /></span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
