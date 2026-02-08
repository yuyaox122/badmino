'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Trophy, 
    Users, 
    Calendar, 
    Medal,
    ArrowRight,
    Star,
    TrendingUp
} from 'lucide-react';
import { Header } from '@/components/Navigation';
import Link from 'next/link';

const leagueOptions = [
    {
        title: 'Join a League',
        description: 'Find and join local badminton leagues',
        icon: Users,
        href: '/league/join',
        gradient: 'from-sky-400 to-blue-500',
    },
    {
        title: 'Create a League',
        description: 'Start your own league and invite players',
        icon: Trophy,
        href: '/league/create',
        gradient: 'from-cyan-400 to-sky-500',
    },
    {
        title: 'My Leagues',
        description: 'View and manage your league memberships',
        icon: Medal,
        href: '/league/my-leagues',
        gradient: 'from-blue-400 to-indigo-500',
    },
    {
        title: 'Leaderboards',
        description: 'Check rankings and standings',
        icon: TrendingUp,
        href: '/league/leaderboard',
        gradient: 'from-teal-400 to-cyan-500',
    },
];

const upcomingMatches = [
    { opponent: 'Sarah Chen', date: 'Tomorrow, 7:00 PM', venue: 'Aston Sports Centre' },
    { opponent: 'James Wilson', date: 'Feb 10, 6:00 PM', venue: 'Birmingham Hub' },
    { opponent: 'Marcus Thompson', date: 'Feb 12, 8:00 PM', venue: 'Perry Barr' },
];

export default function LeaguePage() {
    return (
        <div className="min-h-screen bg-slate-900">
            <Header 
                title="League" 
                subtitle="Compete in local badminton leagues"
            />

            <div className="container mx-auto px-4 py-6">
                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {leagueOptions.map((option, index) => (
                        <motion.div
                            key={option.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={option.href}>
                                <div className="group bg-slate-800 rounded-2xl p-6 shadow-lg border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <option.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                                                {option.title}
                                            </h3>
                                            <p className="text-slate-400">{option.description}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Upcoming Matches */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-800 rounded-3xl shadow-lg p-6 border border-white/10"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-sky-500" />
                        Upcoming League Matches
                    </h2>

                    <div className="space-y-3">
                        {upcomingMatches.map((match, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                        {match.opponent.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">vs {match.opponent}</p>
                                        <p className="text-sm text-slate-400">{match.venue}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-sky-400">{match.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
