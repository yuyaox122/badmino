'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Briefcase,
    Clock,
    CheckCircle,
    XCircle,
    Download,
    Send,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { mockStaffApplications, mockOrganisedTournaments } from '@/lib/mock-data';

const statusConfig = {
    pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
};

export default function ApplicationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const tournamentId = params.id as string;
    const applicationId = params.appId as string;
    
    const application = mockStaffApplications.find(a => a.id === applicationId);
    const tournament = mockOrganisedTournaments.find(t => t.id === tournamentId);
    
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [actionTaken, setActionTaken] = useState<string | null>(null);

    if (!application || !tournament) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Application not found</p>
            </div>
        );
    }

    const handleAccept = () => {
        setActionTaken('accepted');
        setEmailSubject(`Congratulations! Your application for ${application.position} has been accepted`);
        setEmailBody(`Dear ${application.fullName},\n\nWe are pleased to inform you that your application for the ${application.position} position at ${tournament.name} has been accepted!\n\nPlease reply to this email to confirm your attendance.\n\nBest regards,\nThe ${tournament.name} Team`);
        setShowEmailModal(true);
    };

    const handleReject = () => {
        setActionTaken('rejected');
        setEmailSubject(`Update on your application for ${application.position}`);
        setEmailBody(`Dear ${application.fullName},\n\nThank you for your interest in the ${application.position} position at ${tournament.name}.\n\nAfter careful consideration, we have decided to move forward with other candidates. We appreciate the time you took to apply and wish you the best in your future endeavors.\n\nBest regards,\nThe ${tournament.name} Team`);
        setShowEmailModal(true);
    };

    const handleSendEmail = () => {
        // In a real app, this would send an email via API
        alert(`Email sent to ${application.email}!\nStatus updated to: ${actionTaken}`);
        setShowEmailModal(false);
        router.push(`/tournaments/manage/${tournamentId}/applications`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            {/* Header */}
            <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/tournaments/manage/${tournamentId}/applications`}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-800">Application Details</h1>
                            <p className="text-sm text-gray-500">{application.position} at {tournament.name}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${statusConfig[application.status].color}`}>
                            {statusConfig[application.status].label}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Applicant Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
                        >
                            <div className="flex items-start gap-5">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                                    <User className="w-10 h-10 text-sky-600" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                        {application.fullName}
                                    </h2>
                                    <p className="text-lg text-sky-600 font-medium mb-3">
                                        {application.position}
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        <a href={`mailto:${application.email}`} className="flex items-center gap-1 hover:text-sky-600 transition-colors">
                                            <Mail className="w-4 h-4" />
                                            {application.email}
                                        </a>
                                        <a href={`tel:${application.phone}`} className="flex items-center gap-1 hover:text-sky-600 transition-colors">
                                            <Phone className="w-4 h-4" />
                                            {application.phone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                                <span className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    Applied {application.appliedAt}
                                </span>
                                <span className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    Available: {application.availability}
                                </span>
                            </div>
                        </motion.div>

                        {/* Cover Letter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-sky-500" />
                                Cover Letter
                            </h3>
                            <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                                {application.coverLetter}
                            </p>
                        </motion.div>

                        {/* Work Experience */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-sky-500" />
                                Work Experience
                            </h3>
                            <div className="space-y-4">
                                {application.experiences.map((exp, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{exp.role}</h4>
                                                <p className="text-sky-600">{exp.tournamentName}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">{exp.dateFrom} - {exp.dateTo}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleAccept}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Accept Application
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                                >
                                    <XCircle className="w-5 h-5" />
                                    Reject Application
                                </button>
                                <button
                                    onClick={() => {
                                        setEmailSubject('');
                                        setEmailBody('');
                                        setActionTaken(null);
                                        setShowEmailModal(true);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-sky-100 text-sky-700 font-semibold rounded-xl hover:bg-sky-200 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Email
                                </button>
                            </div>
                        </motion.div>

                        {/* CV Download */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4">CV/Resume</h3>
                            <a
                                href={application.cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-sky-50 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                                    <Download className="w-6 h-6 text-sky-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">Download CV</p>
                                    <p className="text-sm text-gray-500">PDF Document</p>
                                </div>
                                <ExternalLink className="w-5 h-5 text-gray-400" />
                            </a>
                        </motion.div>

                        {/* Position Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Position</h3>
                            <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl">
                                <p className="font-bold text-gray-800 mb-1">{application.position}</p>
                                <p className="text-sm text-gray-600">{tournament.name}</p>
                                <div className="mt-3 pt-3 border-t border-sky-100">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Date</span>
                                        <span className="font-medium text-gray-800">{tournament.date}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-gray-500">Location</span>
                                        <span className="font-medium text-gray-800">{tournament.location.venue}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Send Email to Applicant</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <input
                                    type="text"
                                    value={application.email}
                                    disabled
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    rows={8}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendEmail}
                                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                                Send Email
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
