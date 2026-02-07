'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft,
    Briefcase,
    User,
    Mail,
    Phone,
    FileText,
    Upload,
    Plus,
    Trash2,
    Building,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { mockTournamentJobs, mockOrganisedTournaments } from '@/lib/mock-data';

interface Experience {
    id: string;
    title: string;
    company: string;
    duration: string;
    description: string;
}

export default function JobApplyPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;
    
    const job = mockTournamentJobs.find(j => j.id === jobId);
    const tournament = job ? mockOrganisedTournaments.find(t => t.id === job.tournamentId) : null;
    
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        availability: 'full-day',
    });
    const [experiences, setExperiences] = useState<Experience[]>([
        { id: '1', title: '', company: '', duration: '', description: '' }
    ]);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!job || !tournament) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Job not found</p>
            </div>
        );
    }

    const addExperience = () => {
        setExperiences([
            ...experiences,
            { id: Date.now().toString(), title: '', company: '', duration: '', description: '' }
        ]);
    };

    const removeExperience = (id: string) => {
        if (experiences.length > 1) {
            setExperiences(experiences.filter(exp => exp.id !== id));
        }
    };

    const updateExperience = (id: string, field: keyof Experience, value: string) => {
        setExperiences(experiences.map(exp => 
            exp.id === id ? { ...exp, [field]: value } : exp
        ));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitting(false);
        setSubmitted(true);
    };

    const isStep1Valid = formData.fullName && formData.email && formData.phone;
    const isStep2Valid = experiences.every(exp => exp.title && exp.company);
    const isStep3Valid = cvFile && formData.coverLetter;

    // Success Screen
    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                    >
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
                    <p className="text-gray-500 mb-6">
                        Your application for <span className="font-medium text-sky-600">{job.role}</span> at {tournament.name} has been received.
                    </p>
                    <div className="bg-sky-50 rounded-xl p-4 mb-6 text-left">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">What&apos;s next?</span><br />
                            The tournament organizers will review your application and get back to you via email.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/tournaments/work/my-applications"
                            className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors"
                        >
                            View My Applications
                        </Link>
                        <Link
                            href="/tournaments"
                            className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Back to Tournaments
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            {/* Header */}
            <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/tournaments"
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-800">Apply for {job.role}</h1>
                            <p className="text-sm text-gray-500">{tournament.name}</p>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-2 mt-4">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`flex-1 h-1.5 rounded-full transition-colors ${
                                    s <= step ? 'bg-sky-500' : 'bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span className={step >= 1 ? 'text-sky-600 font-medium' : ''}>Personal Info</span>
                        <span className={step >= 2 ? 'text-sky-600 font-medium' : ''}>Experience</span>
                        <span className={step >= 3 ? 'text-sky-600 font-medium' : ''}>CV & Cover Letter</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-2xl">
                {/* Job Summary Card */}
                <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{job.role}</h3>
                            <p className="text-sm text-gray-500">{tournament.name}</p>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm">
                                <span className="text-green-600 font-medium">£{job.wage}/hour</span>
                                <span className="text-gray-500">{job.dates?.[0] || 'Full day'}</span>
                                <span className="text-gray-500">{tournament.date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Personal Information */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
                        >
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-sky-500" />
                                Personal Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="+44 7XXX XXXXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                                    <select
                                        value={formData.availability}
                                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                                    >
                                        <option value="full-day">Full Day</option>
                                        <option value="morning">Morning Only</option>
                                        <option value="afternoon">Afternoon Only</option>
                                        <option value="flexible">Flexible</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!isStep1Valid}
                                    className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Work Experience */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
                        >
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-sky-500" />
                                Work Experience
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">Add your relevant work experience (at least one)</p>
                            
                            <div className="space-y-4">
                                {experiences.map((exp, index) => (
                                    <div key={exp.id} className="p-4 bg-gray-50 rounded-xl relative">
                                        {experiences.length > 1 && (
                                            <button
                                                onClick={() => removeExperience(exp.id)}
                                                className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <p className="text-sm font-medium text-gray-600 mb-3">Experience {index + 1}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={exp.title}
                                                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                                placeholder="Job Title *"
                                            />
                                            <input
                                                type="text"
                                                value={exp.company}
                                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                                placeholder="Company/Organization *"
                                            />
                                            <input
                                                type="text"
                                                value={exp.duration}
                                                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                                placeholder="Duration (e.g., 2022-2023)"
                                            />
                                        </div>
                                        <textarea
                                            value={exp.description}
                                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                            className="w-full mt-3 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                                            placeholder="Brief description of your responsibilities..."
                                            rows={2}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <button
                                onClick={addExperience}
                                className="mt-4 flex items-center gap-2 px-4 py-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Another Experience
                            </button>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!isStep2Valid}
                                    className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: CV & Cover Letter */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
                        >
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-sky-500" />
                                CV & Cover Letter
                            </h2>
                            
                            {/* CV Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Your CV *</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-sky-400 transition-colors">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="cv-upload"
                                    />
                                    {cvFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                                <CheckCircle className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-gray-800">{cvFile.name}</p>
                                                <p className="text-sm text-gray-500">{(cvFile.size / 1024).toFixed(0)} KB</p>
                                            </div>
                                            <button
                                                onClick={() => setCvFile(null)}
                                                className="ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="cv-upload" className="cursor-pointer">
                                            <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-600 font-medium">Click to upload your CV</p>
                                            <p className="text-sm text-gray-400 mt-1">PDF, DOC, or DOCX (max 5MB)</p>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Cover Letter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter *</label>
                                <textarea
                                    value={formData.coverLetter}
                                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                    rows={6}
                                />
                                <p className="text-xs text-gray-400 mt-1">{formData.coverLetter.length}/500 characters</p>
                            </div>

                            {/* Summary */}
                            <div className="mt-6 p-4 bg-sky-50 rounded-xl">
                                <h4 className="font-medium text-gray-800 mb-2">Application Summary</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                                    <p><span className="font-medium">Email:</span> {formData.email}</p>
                                    <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                                    <p><span className="font-medium">Experiences:</span> {experiences.filter(e => e.title).length}</p>
                                    <p><span className="font-medium">CV:</span> {cvFile?.name || 'Not uploaded'}</p>
                                </div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isStep3Valid || submitting}
                                    className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
