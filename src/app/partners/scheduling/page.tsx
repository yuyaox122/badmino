'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Users, 
    Check,
    ChevronLeft,
    ChevronRight,
    Plus
} from 'lucide-react';
import { Header } from '@/components/Navigation';
import { useUser } from '@/context/UserContext';
import { mockPlayers } from '@/lib/mock-data';

const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
];

const venues = [
    { id: '1', name: 'Aston University Sports Centre', price: 12 },
    { id: '2', name: 'Birmingham Sports Hub', price: 15 },
    { id: '3', name: 'Nechells Community Centre', price: 8 },
    { id: '4', name: 'Perry Barr Leisure Centre', price: 10 },
];

export default function SchedulingPage() {
    const { user } = useUser();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
    const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const connectedPartners = mockPlayers.slice(0, 5); // Mock connected partners

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: Date[] = [];
        
        // Add padding for first week
        const startPadding = firstDay.getDay();
        for (let i = startPadding - 1; i >= 0; i--) {
            days.push(new Date(year, month, -i));
        }
        
        // Add days of month
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }
        
        return days;
    };

    const togglePartner = (id: string) => {
        setSelectedPartners(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date: Date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const canSchedule = selectedDate && selectedTime && selectedVenue && selectedPartners.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <Header 
                title="Schedule a Game" 
                subtitle="Plan your next badminton session"
            />

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Calendar Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-sky-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-sky-500" />
                            Select Date
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                className="p-2 rounded-xl hover:bg-sky-50 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <span className="font-semibold text-gray-800 min-w-[140px] text-center">
                                {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                            </span>
                            <button
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                className="p-2 rounded-xl hover:bg-sky-50 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentMonth).map((date, index) => {
                            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                            return (
                                <button
                                    key={index}
                                    onClick={() => !isPast(date) && setSelectedDate(date)}
                                    disabled={isPast(date)}
                                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                                        !isCurrentMonth
                                            ? 'text-gray-300'
                                            : isPast(date)
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : isSelected(date)
                                            ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200'
                                            : isToday(date)
                                            ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    <p className="mt-4 text-center text-sky-600 font-medium">
                        Selected: {formatDate(selectedDate)}
                    </p>
                </motion.div>

                {/* Time Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-sky-100"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-sky-500" />
                        Select Time
                    </h2>

                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {timeSlots.map(time => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                                    selectedTime === time
                                        ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200'
                                        : 'bg-gray-50 text-gray-700 hover:bg-sky-50 hover:text-sky-700'
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Venue Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-sky-100"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-sky-500" />
                        Select Venue
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {venues.map(venue => (
                            <button
                                key={venue.id}
                                onClick={() => setSelectedVenue(venue.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                    selectedVenue === venue.id
                                        ? 'border-sky-400 bg-sky-50'
                                        : 'border-gray-200 hover:border-sky-200 hover:bg-sky-50/50'
                                }`}
                            >
                                <span className={`font-medium ${selectedVenue === venue.id ? 'text-sky-700' : 'text-gray-700'}`}>
                                    {venue.name}
                                </span>
                                <span className="text-sm font-bold text-green-600">£{venue.price}/hr</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Partner Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-sky-100"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Users className="w-6 h-6 text-sky-500" />
                        Invite Partners
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {connectedPartners.map(partner => (
                            <button
                                key={partner.id}
                                onClick={() => togglePartner(partner.id)}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                                    selectedPartners.includes(partner.id)
                                        ? 'border-sky-400 bg-sky-50'
                                        : 'border-gray-200 hover:border-sky-200 hover:bg-sky-50/50'
                                }`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        <img src={partner.avatarUrl} alt={partner.name} className="w-full h-full object-cover" />
                                    </div>
                                    {selectedPartners.includes(partner.id) && (
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-left flex-1">
                                    <p className={`font-medium ${selectedPartners.includes(partner.id) ? 'text-sky-700' : 'text-gray-800'}`}>
                                        {partner.name}
                                    </p>
                                    <p className="text-sm text-gray-500">Level {partner.skillLevel} • {partner.playStyle}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Schedule Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    disabled={!canSchedule}
                    className={`w-full flex items-center justify-center gap-3 px-8 py-4 font-bold text-lg rounded-2xl transition-all ${
                        canSchedule
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200 hover:shadow-xl'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <Plus className="w-6 h-6" />
                    Create Schedule
                </motion.button>
            </div>
        </div>
    );
}
