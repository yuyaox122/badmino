'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Trophy, 
    Users, 
    Briefcase,
    Calendar,
    Eye,
    Edit,
    Plus,
    ArrowRight,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/Navigation';
import { mockOrganisedTournaments } from '@/lib/mock-data';

const statusColors = {
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function MyTournamentsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <Header 
                title="My Tournaments" 
                subtitle="Manage your organised tournaments"
            />

            <div className="container mx-auto px-4 py-6">
                {/* Create New Button */}
                <div className="mb-6">
                    <Link
                        href="/tournaments/organise"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 hover:shadow-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Tournament
                    </Link>
                </div>

                {/* Tournaments List */}
                <div className="space-y-4">
                    {mockOrganisedTournaments.map((tournament, index) => (
                        <motion.div
                            key={tournament.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:border-sky-200 hover:shadow-xl transition-all"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                {/* Main Info */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg">
                                            <Trophy className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">{tournament.name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[tournament.status]}`}>
                                                    {tournament.status}
                                                </span>
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {tournament.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm ml-15 pl-0.5">{tournament.location.venue}</p>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-4">
                                    {/* Athletes */}
                                    <div className="bg-sky-50 rounded-xl px-4 py-3 text-center min-w-[100px]">
                                        <div className="flex items-center justify-center gap-1 text-sky-600 mb-1">
                                            <Users className="w-4 h-4" />
                                            <span className="font-bold">{tournament.athletesRegistered}/{tournament.maxAthletes}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Athletes</p>
                                    </div>

                                    {/* Staff Applications */}
                                    {tournament.hiringPersonnel && (
                                        <div className="bg-orange-50 rounded-xl px-4 py-3 text-center min-w-[100px]">
                                            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                                                <Briefcase className="w-4 h-4" />
                                                <span className="font-bold">{tournament.applicationsCount}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">Applications</p>
                                        </div>
                                    )}

                                    {/* Positions */}
                                    {tournament.positions.length > 0 && (
                                        <div className="bg-green-50 rounded-xl px-4 py-3 text-center min-w-[100px]">
                                            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                                                <span className="font-bold">
                                                    {tournament.positions.reduce((acc, p) => acc + p.filled, 0)}/
                                                    {tournament.positions.reduce((acc, p) => acc + p.slots, 0)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">Staff Filled</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/tournaments/manage/${tournament.id}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 font-medium rounded-xl hover:bg-sky-200 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Manage
                                    </Link>
                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Positions Breakdown */}
                            {tournament.positions.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 mb-2">Staff Positions:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {tournament.positions.map((pos, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm">
                                                {pos.role}: {pos.filled}/{pos.slots} (£{pos.wage}/hr)
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {mockOrganisedTournaments.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sky-100 flex items-center justify-center">
                            <Trophy className="w-10 h-10 text-sky-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Tournaments Yet</h3>
                        <p className="text-gray-500 mb-6">Start organising your first tournament!</p>
                        <Link
                            href="/tournaments/organise"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create Tournament
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
