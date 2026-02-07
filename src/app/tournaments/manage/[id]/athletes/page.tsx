'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    ArrowLeft,
    Search,
    Filter,
    Clock,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    Trophy,
    Star,
    Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockOrganisedTournaments, mockAthleteRegistrations } from '@/lib/mock-data';

const statusConfig = {
    registered: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

export default function AthletesReviewPage() {
    const params = useParams();
    const tournamentId = params.id as string;
    
    const [filter, setFilter] = useState<'all' | 'registered' | 'confirmed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    const tournament = mockOrganisedTournaments.find(t => t.id === tournamentId);
    const allAthletes = mockAthleteRegistrations.filter(r => r.tournamentId === tournamentId);
    
    const filteredAthletes = allAthletes.filter(athlete => {
        const matchesFilter = filter === 'all' || athlete.status === filter;
        const playerName = athlete.player?.name?.toLowerCase() || '';
        const matchesSearch = playerName.includes(searchQuery.toLowerCase()) ||
                            athlete.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            {/* Header */}
            <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Link
                            href={`/tournaments/manage/${tournamentId}`}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-800">Registered Athletes</h1>
                            <p className="text-sm text-gray-500">{tournament?.name}</p>
                        </div>
                        <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                            {filteredAthletes.length}/{tournament?.maxAthletes || 0} athletes
                        </span>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                            {(['all', 'confirmed', 'registered'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                                        filter === status
                                            ? 'bg-sky-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-2xl font-bold text-green-600">{allAthletes.filter(a => a.status === 'confirmed').length}</p>
                        <p className="text-sm text-gray-500">Confirmed</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-2xl font-bold text-yellow-600">{allAthletes.filter(a => a.status === 'registered').length}</p>
                        <p className="text-sm text-gray-500">Pending Confirmation</p>
                    </div>
                </div>

                {/* Athletes List */}
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredAthletes.map((athlete, index) => {
                            const StatusIcon = statusConfig[athlete.status].icon;
                            return (
                                <motion.div
                                    key={athlete.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:border-sky-200 hover:shadow-xl transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Avatar & Info */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                                                {athlete.player?.avatarUrl ? (
                                                    <img 
                                                        src={athlete.player.avatarUrl} 
                                                        alt={athlete.player?.name || 'Player'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Users className="w-6 h-6 text-sky-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-gray-800">{athlete.player?.name || 'Unknown Player'}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[athlete.status].color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {statusConfig[athlete.status].label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Trophy className="w-4 h-4" />
                                                        {athlete.category}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Star className="w-4 h-4" />
                                                        Level {athlete.skillLevel}
                                                    </span>
                                                    <span className="text-sky-600">
                                                        {athlete.discipline.join(', ')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact & Actions */}
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(athlete.registeredAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {athlete.player?.email && (
                                                    <a
                                                        href={`mailto:${athlete.player.email}`}
                                                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                                        title="Send Email"
                                                    >
                                                        <Mail className="w-5 h-5" />
                                                    </a>
                                                )}
                                                {athlete.status === 'registered' && (
                                                    <>
                                                        <button 
                                                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Confirm"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        <button 
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredAthletes.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <Users className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Athletes Found</h3>
                        <p className="text-gray-500">
                            {searchQuery || filter !== 'all' 
                                ? 'Try adjusting your search or filters'
                                : 'No athletes have registered yet'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
