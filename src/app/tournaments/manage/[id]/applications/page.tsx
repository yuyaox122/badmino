'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, 
    ArrowLeft,
    Search,
    Filter,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Mail,
    Download,
    User,
    Calendar,
    MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockOrganisedTournaments, mockStaffApplications } from '@/lib/mock-data';

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    under_review: { label: 'Reviewing', color: 'bg-blue-100 text-blue-700', icon: Eye },
    accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function StaffApplicationsPage() {
    const params = useParams();
    const tournamentId = params.id as string;
    
    const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing' | 'accepted' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    const tournament = mockOrganisedTournaments.find(t => t.id === tournamentId);
    const allApplications = mockStaffApplications.filter(a => a.tournamentId === tournamentId);
    
    const filteredApplications = allApplications.filter(app => {
        const matchesFilter = filter === 'all' || app.status === filter;
        const matchesSearch = app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.position.toLowerCase().includes(searchQuery.toLowerCase());
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
                            <h1 className="text-xl font-bold text-gray-800">Staff Applications</h1>
                            <p className="text-sm text-gray-500">{tournament?.name}</p>
                        </div>
                        <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                            {filteredApplications.length} applications
                        </span>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or position..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                            {(['all', 'pending', 'reviewing', 'accepted', 'rejected'] as const).map(status => (
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
                {/* Applications List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredApplications.map((application, index) => {
                            const StatusIcon = statusConfig[application.status].icon;
                            return (
                                <motion.div
                                    key={application.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:border-sky-200 hover:shadow-xl transition-all"
                                >
                                    <div className="p-5">
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            {/* Avatar & Info */}
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center overflow-hidden">
                                                    <User className="w-7 h-7 text-sky-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-lg font-bold text-gray-800">
                                                            {application.fullName}
                                                        </h3>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[application.status].color}`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {statusConfig[application.status].label}
                                                        </span>
                                                    </div>
                                                    <p className="text-sky-600 font-medium">{application.position}</p>
                                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="w-4 h-4" />
                                                            {application.email}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            Applied {application.appliedAt}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Experience Summary */}
                                            <div className="flex items-center gap-6 md:border-l md:pl-6 border-gray-100">
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-gray-800">{application.experiences.length}</p>
                                                    <p className="text-xs text-gray-500">Experiences</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-gray-800">{application.availability}</p>
                                                    <p className="text-xs text-gray-500">Availability</p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/tournaments/manage/${tournamentId}/applications/${application.id}`}
                                                    className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 font-medium rounded-xl hover:bg-sky-200 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </Link>
                                                <a
                                                    href={application.cvUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                                                    title="Download CV"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Cover Letter Preview */}
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-sm text-gray-500 line-clamp-2">{application.coverLetter}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredApplications.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <Briefcase className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Applications Found</h3>
                        <p className="text-gray-500">
                            {searchQuery || filter !== 'all' 
                                ? 'Try adjusting your search or filters'
                                : 'No one has applied to your tournament positions yet'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
