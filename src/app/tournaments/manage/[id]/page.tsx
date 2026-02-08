'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Trophy, 
    Users, 
    Briefcase,
    Calendar,
    MapPin,
    ArrowLeft,
    Eye,
    Mail,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Edit
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockOrganisedTournaments, mockStaffApplications, mockAthleteRegistrations } from '@/lib/mock-data';

const statusColors = {
    draft: 'bg-slate-700 text-slate-300',
    pending: 'bg-yellow-500/20 text-yellow-400',
    active: 'bg-green-500/20 text-green-400',
    completed: 'bg-blue-500/20 text-blue-400',
    cancelled: 'bg-red-500/20 text-red-400',
};

export default function TournamentManagePage() {
    const params = useParams();
    const tournamentId = params.id as string;
    
    const tournament = mockOrganisedTournaments.find(t => t.id === tournamentId);
    const applications = mockStaffApplications.filter(a => a.tournamentId === tournamentId);
    const athletes = mockAthleteRegistrations.filter(r => r.tournamentId === tournamentId);

    if (!tournament) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-400">Tournament not found</p>
            </div>
        );
    }

    const pendingApplications = applications.filter(a => a.status === 'pending').length;
    const acceptedApplications = applications.filter(a => a.status === 'accepted').length;
    const confirmedAthletes = athletes.filter(a => a.status === 'confirmed').length;

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <div className="sticky top-16 z-30 bg-slate-800/80 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/tournaments/my-tournaments"
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-300" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-white">{tournament.name}</h1>
                            <p className="text-sm text-slate-400">{tournament.location.venue}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[tournament.status]}`}>
                            {tournament.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800 rounded-2xl p-5 shadow-lg border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-sky-400" />
                            </div>
                            <span className="text-2xl font-bold text-white">{athletes.length}</span>
                        </div>
                        <p className="text-sm text-slate-400">Athletes Registered</p>
                        <p className="text-xs text-slate-500">{confirmedAthletes} confirmed</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-800 rounded-2xl p-5 shadow-lg border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-orange-400" />
                            </div>
                            <span className="text-2xl font-bold text-white">{applications.length}</span>
                        </div>
                        <p className="text-sm text-slate-400">Staff Applications</p>
                        <p className="text-xs text-orange-400">{pendingApplications} pending review</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-800 rounded-2xl p-5 shadow-lg border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="text-2xl font-bold text-white">{acceptedApplications}</span>
                        </div>
                        <p className="text-sm text-slate-400">Staff Confirmed</p>
                        <p className="text-xs text-slate-500">of {tournament.positions.reduce((a, p) => a + p.slots, 0)} needed</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800 rounded-2xl p-5 shadow-lg border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-lg font-bold text-white">{tournament.date}</span>
                        </div>
                        <p className="text-sm text-slate-400">Tournament Date</p>
                    </motion.div>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Review Staff Applications */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href={`/tournaments/manage/${tournamentId}/applications`}>
                            <div className="bg-slate-800 rounded-3xl p-6 shadow-lg border border-white/10 hover:border-white/20 hover:shadow-xl transition-all cursor-pointer group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Briefcase className="w-7 h-7 text-white" />
                                    </div>
                                    {pendingApplications > 0 && (
                                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">
                                            {pendingApplications} new
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                                    Review Staff Applications
                                </h3>
                                <p className="text-slate-400 mb-4">
                                    View CVs, experience, and manage job applications
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1 text-orange-400">
                                        <Clock className="w-4 h-4" />
                                        {pendingApplications} pending
                                    </span>
                                    <span className="flex items-center gap-1 text-green-400">
                                        <CheckCircle className="w-4 h-4" />
                                        {acceptedApplications} accepted
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Review Athletes */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href={`/tournaments/manage/${tournamentId}/athletes`}>
                            <div className="bg-slate-800 rounded-3xl p-6 shadow-lg border border-white/10 hover:border-white/20 hover:shadow-xl transition-all cursor-pointer group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Users className="w-7 h-7 text-white" />
                                    </div>
                                    <span className="px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-sm font-bold">
                                        {athletes.length}/{tournament.maxAthletes}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                                    Review Athletes
                                </h3>
                                <p className="text-slate-400 mb-4">
                                    View registered participants and their details
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1 text-green-400">
                                        <CheckCircle className="w-4 h-4" />
                                        {confirmedAthletes} confirmed
                                    </span>
                                    <span className="flex items-center gap-1 text-yellow-400">
                                        <Clock className="w-4 h-4" />
                                        {athletes.length - confirmedAthletes} pending
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Position Status */}
                {tournament.positions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-800 rounded-3xl p-6 shadow-lg border border-white/10 mb-6"
                    >
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-sky-400" />
                            Staff Positions
                        </h3>
                        <div className="space-y-3">
                            {tournament.positions.map((pos, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-white">{pos.role}</p>
                                        <p className="text-sm text-slate-400">£{pos.wage}/hour</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-bold text-white">{pos.filled}/{pos.slots}</p>
                                            <p className="text-xs text-slate-400">filled</p>
                                        </div>
                                        <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                                                style={{ width: `${(pos.filled / pos.slots) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-3"
                >
                    <button className="flex items-center gap-2 px-5 py-3 bg-sky-500/20 text-sky-400 font-medium rounded-xl hover:bg-sky-500/30 transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit Tournament
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-green-500/20 text-green-400 font-medium rounded-xl hover:bg-green-500/30 transition-colors">
                        <Mail className="w-4 h-4" />
                        Email All Participants
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-purple-500/20 text-purple-400 font-medium rounded-xl hover:bg-purple-500/30 transition-colors">
                        <FileText className="w-4 h-4" />
                        Export Data
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
