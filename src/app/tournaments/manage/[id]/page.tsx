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
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
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
                <p className="text-gray-500">Tournament not found</p>
            </div>
        );
    }

    const pendingApplications = applications.filter(a => a.status === 'pending').length;
    const acceptedApplications = applications.filter(a => a.status === 'accepted').length;
    const confirmedAthletes = athletes.filter(a => a.status === 'confirmed').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            {/* Header */}
            <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/tournaments/my-tournaments"
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-800">{tournament.name}</h1>
                            <p className="text-sm text-gray-500">{tournament.location.venue}</p>
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
                        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-sky-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">{athletes.length}</span>
                        </div>
                        <p className="text-sm text-gray-500">Athletes Registered</p>
                        <p className="text-xs text-gray-400">{confirmedAthletes} confirmed</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-orange-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">{applications.length}</span>
                        </div>
                        <p className="text-sm text-gray-500">Staff Applications</p>
                        <p className="text-xs text-orange-500">{pendingApplications} pending review</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">{acceptedApplications}</span>
                        </div>
                        <p className="text-sm text-gray-500">Staff Confirmed</p>
                        <p className="text-xs text-gray-400">of {tournament.positions.reduce((a, p) => a + p.slots, 0)} needed</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-lg font-bold text-gray-800">{tournament.date}</span>
                        </div>
                        <p className="text-sm text-gray-500">Tournament Date</p>
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
                            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:border-sky-200 hover:shadow-xl transition-all cursor-pointer group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Briefcase className="w-7 h-7 text-white" />
                                    </div>
                                    {pendingApplications > 0 && (
                                        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold">
                                            {pendingApplications} new
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-sky-600 transition-colors">
                                    Review Staff Applications
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    View CVs, experience, and manage job applications
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1 text-orange-600">
                                        <Clock className="w-4 h-4" />
                                        {pendingApplications} pending
                                    </span>
                                    <span className="flex items-center gap-1 text-green-600">
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
                            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:border-sky-200 hover:shadow-xl transition-all cursor-pointer group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Users className="w-7 h-7 text-white" />
                                    </div>
                                    <span className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-bold">
                                        {athletes.length}/{tournament.maxAthletes}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-sky-600 transition-colors">
                                    Review Athletes
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    View registered participants and their details
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1 text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        {confirmedAthletes} confirmed
                                    </span>
                                    <span className="flex items-center gap-1 text-yellow-600">
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
                        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-6"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-sky-500" />
                            Staff Positions
                        </h3>
                        <div className="space-y-3">
                            {tournament.positions.map((pos, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-gray-800">{pos.role}</p>
                                        <p className="text-sm text-gray-500">£{pos.wage}/hour</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">{pos.filled}/{pos.slots}</p>
                                            <p className="text-xs text-gray-500">filled</p>
                                        </div>
                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
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
                    <button className="flex items-center gap-2 px-5 py-3 bg-sky-100 text-sky-700 font-medium rounded-xl hover:bg-sky-200 transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit Tournament
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-green-100 text-green-700 font-medium rounded-xl hover:bg-green-200 transition-colors">
                        <Mail className="w-4 h-4" />
                        Email All Participants
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-purple-100 text-purple-700 font-medium rounded-xl hover:bg-purple-200 transition-colors">
                        <FileText className="w-4 h-4" />
                        Export Data
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
