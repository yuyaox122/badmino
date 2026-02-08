'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Trophy, 
    Users, 
    Calendar,
    MapPin,
    Target,
    Clock,
    ChevronLeft,
    CheckCircle,
    Star
} from 'lucide-react';
import { Header } from '@/components/Navigation';
import Link from 'next/link';

const skillLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to badminton' },
    { value: 'intermediate', label: 'Intermediate', description: '1-3 years experience' },
    { value: 'advanced', label: 'Advanced', description: '3+ years competitive play' },
    { value: 'mixed', label: 'Mixed Levels', description: 'All skill levels welcome' },
];

const leagueFormats = [
    { value: 'singles', label: 'Singles', icon: '🏸' },
    { value: 'doubles', label: 'Doubles', icon: '🏸🏸' },
    { value: 'mixed-doubles', label: 'Mixed Doubles', icon: '👫' },
    { value: 'team', label: 'Team League', icon: '👥' },
];

export default function CreateLeaguePage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        format: 'singles',
        skillLevel: 'mixed',
        maxPlayers: 16,
        startDate: '',
        endDate: '',
        location: '',
        entryFee: '',
        matchFrequency: 'weekly',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In real app, this would save to database
        console.log('League created:', formData);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-900">
                <Header 
                    title="League Created!" 
                    subtitle="Your league is ready to go"
                />
                <div className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-800 rounded-3xl p-8 text-center border border-white/10 max-w-md mx-auto"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{formData.name}</h2>
                        <p className="text-slate-400 mb-6">Your league has been created successfully!</p>
                        <div className="space-y-3">
                            <Link href="/league/my-leagues">
                                <button className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                                    View My Leagues
                                </button>
                            </Link>
                            <Link href="/league">
                                <button className="w-full py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all">
                                    Back to League Hub
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Header 
                title="Create a League" 
                subtitle="Start your own badminton league"
            />

            <div className="container mx-auto px-4 py-6">
                {/* Back Button */}
                <Link href="/league">
                    <motion.button
                        whileHover={{ x: -4 }}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to League Hub
                    </motion.button>
                </Link>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="max-w-2xl mx-auto space-y-6"
                >
                    {/* Basic Info */}
                    <div className="bg-slate-800 rounded-3xl p-6 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-sky-400" />
                            League Details
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    League Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Birmingham Badminton League"
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Tell players what your league is about..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Format Selection */}
                    <div className="bg-slate-800 rounded-3xl p-6 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="w-6 h-6 text-cyan-400" />
                            League Format
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {leagueFormats.map(format => (
                                <button
                                    key={format.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, format: format.value }))}
                                    className={`p-4 rounded-xl border-2 transition-all ${
                                        formData.format === format.value
                                            ? 'border-sky-400 bg-sky-400/20'
                                            : 'border-white/10 bg-slate-700/50 hover:border-white/30'
                                    }`}
                                >
                                    <span className="text-2xl mb-2 block">{format.icon}</span>
                                    <span className={`font-medium ${formData.format === format.value ? 'text-sky-400' : 'text-white'}`}>
                                        {format.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Skill Level */}
                    <div className="bg-slate-800 rounded-3xl p-6 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-400" />
                            Skill Level
                        </h2>
                        
                        <div className="space-y-2">
                            {skillLevels.map(level => (
                                <button
                                    key={level.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, skillLevel: level.value }))}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                        formData.skillLevel === level.value
                                            ? 'border-sky-400 bg-sky-400/20'
                                            : 'border-white/10 bg-slate-700/50 hover:border-white/30'
                                    }`}
                                >
                                    <span className={`font-medium ${formData.skillLevel === level.value ? 'text-sky-400' : 'text-white'}`}>
                                        {level.label}
                                    </span>
                                    <span className="text-sm text-slate-400 block">{level.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Schedule & Location */}
                    <div className="bg-slate-800 rounded-3xl p-6 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-blue-400" />
                            Schedule & Location
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Match Frequency
                                </label>
                                <select
                                    name="matchFrequency"
                                    value={formData.matchFrequency}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="biweekly">Bi-weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Aston University Sports Centre"
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Players & Fees */}
                    <div className="bg-slate-800 rounded-3xl p-6 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6 text-indigo-400" />
                            Players & Entry
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Max Players
                                </label>
                                <select
                                    name="maxPlayers"
                                    value={formData.maxPlayers}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value={8}>8 Players</option>
                                    <option value={16}>16 Players</option>
                                    <option value={32}>32 Players</option>
                                    <option value={64}>64 Players</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Entry Fee (£)
                                </label>
                                <input
                                    type="number"
                                    name="entryFee"
                                    value={formData.entryFee}
                                    onChange={handleInputChange}
                                    placeholder="0 for free"
                                    min="0"
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg"
                    >
                        Create League
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
}
