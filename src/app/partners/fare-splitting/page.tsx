'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    DollarSign, 
    Users, 
    Plus, 
    Minus, 
    Calculator,
    Check,
    Share2,
    MapPin,
    Clock
} from 'lucide-react';
import { Header } from '@/components/Navigation';
import { useUser } from '@/context/UserContext';
import { mockPlayers } from '@/lib/mock-data';

interface Participant {
    id: string;
    name: string;
    avatarUrl: string;
    share: number;
    paid: boolean;
}

export default function FareSplittingPage() {
    const { user } = useUser();
    const [totalCost, setTotalCost] = useState<string>('');
    const [venue, setVenue] = useState('');
    const [duration, setDuration] = useState(1);
    const [participants, setParticipants] = useState<Participant[]>([
        { 
            id: user?.id || 'current', 
            name: user?.name || 'You', 
            avatarUrl: user?.avatarUrl || '', 
            share: 0, 
            paid: true 
        },
    ]);
    const [showAddPartner, setShowAddPartner] = useState(false);

    const availablePartners = mockPlayers.filter(
        p => !participants.some(participant => participant.id === p.id)
    );

    const costPerPerson = participants.length > 0 && totalCost
        ? (parseFloat(totalCost) / participants.length).toFixed(2)
        : '0.00';

    const addParticipant = (player: typeof mockPlayers[0]) => {
        setParticipants(prev => [
            ...prev,
            {
                id: player.id,
                name: player.name,
                avatarUrl: player.avatarUrl,
                share: 0,
                paid: false,
            },
        ]);
        setShowAddPartner(false);
    };

    const removeParticipant = (id: string) => {
        if (id === user?.id || id === 'current') return;
        setParticipants(prev => prev.filter(p => p.id !== id));
    };

    const togglePaid = (id: string) => {
        setParticipants(prev => 
            prev.map(p => p.id === id ? { ...p, paid: !p.paid } : p)
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <Header 
                title="Fare Splitting" 
                subtitle="Split court costs with your partners"
            />

            <div className="container mx-auto px-4 py-6 max-w-2xl">
                {/* Cost Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-sky-100"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-sky-500" />
                        Session Details
                    </h2>

                    {/* Venue */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Venue / Court
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Aston University Sports Centre"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
                        />
                    </div>

                    {/* Duration */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Duration (hours)
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setDuration(Math.max(0.5, duration - 0.5))}
                                className="p-3 rounded-xl bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="text-2xl font-bold text-gray-800 w-16 text-center">
                                {duration}
                            </span>
                            <button
                                onClick={() => setDuration(duration + 0.5)}
                                className="p-3 rounded-xl bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Total Cost */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            Total Cost (£)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">£</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={totalCost}
                                onChange={(e) => setTotalCost(e.target.value)}
                                className="w-full pl-10 pr-4 py-4 text-3xl font-bold rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Participants Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-sky-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Users className="w-6 h-6 text-sky-500" />
                            Participants ({participants.length})
                        </h2>
                        <button
                            onClick={() => setShowAddPartner(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-600 rounded-xl font-medium hover:bg-sky-200 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Partner
                        </button>
                    </div>

                    <div className="space-y-3">
                        {participants.map((participant, index) => (
                            <motion.div
                                key={participant.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold overflow-hidden">
                                        {participant.avatarUrl ? (
                                            <img src={participant.avatarUrl} alt={participant.name} className="w-full h-full object-cover" />
                                        ) : (
                                            participant.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {participant.name}
                                            {(participant.id === user?.id || participant.id === 'current') && (
                                                <span className="ml-2 text-xs bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full">You</span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Owes: <span className="font-semibold text-sky-600">£{costPerPerson}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => togglePaid(participant.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                            participant.paid
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                        }`}
                                    >
                                        {participant.paid ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Paid
                                            </>
                                        ) : (
                                            'Pending'
                                        )}
                                    </button>
                                    {participant.id !== user?.id && participant.id !== 'current' && (
                                        <button
                                            onClick={() => removeParticipant(participant.id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl shadow-lg p-6 text-white"
                >
                    <div className="text-center mb-4">
                        <p className="text-sky-100 mb-1">Each person pays</p>
                        <p className="text-5xl font-bold">£{costPerPerson}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <p className="text-sky-100 text-sm">Total Cost</p>
                            <p className="text-xl font-bold">£{totalCost || '0.00'}</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <p className="text-sky-100 text-sm">Split Between</p>
                            <p className="text-xl font-bold">{participants.length} people</p>
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-sky-600 font-bold rounded-xl hover:bg-sky-50 transition-colors">
                        <Share2 className="w-5 h-5" />
                        Send Payment Requests
                    </button>
                </motion.div>

                {/* Add Partner Modal */}
                {showAddPartner && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[70vh] overflow-y-auto"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Add Partner</h3>
                            
                            {availablePartners.length > 0 ? (
                                <div className="space-y-2">
                                    {availablePartners.map(partner => (
                                        <button
                                            key={partner.id}
                                            onClick={() => addParticipant(partner)}
                                            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-sky-50 border border-gray-100 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <img src={partner.avatarUrl} alt={partner.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-gray-800">{partner.name}</p>
                                                <p className="text-sm text-gray-500">Level {partner.skillLevel}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">All partners have been added</p>
                            )}

                            <button
                                onClick={() => setShowAddPartner(false)}
                                className="w-full mt-4 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
