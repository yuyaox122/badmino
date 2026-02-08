'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    Clock, 
    DollarSign, 
    Star,
    Phone,
    Globe,
    Navigation,
    Filter,
    Heart,
    ExternalLink,
    X,
    Calendar,
    User,
    Mail,
    CreditCard,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Users,
    Send
} from 'lucide-react';
import { Header } from '@/components/Navigation';

interface SportsCentre {
    id: string;
    name: string;
    address: string;
    distance: string;
    distanceKm: number;
    pricePerHour: number;
    rating: number;
    reviewCount: number;
    courts: number;
    openHours: string;
    phone: string;
    website?: string;
    amenities: string[];
    imageUrl: string;
    available: boolean;
    membershipDiscount?: number;
}

const mockSportsCentres: SportsCentre[] = [
    {
        id: '1',
        name: 'Aston University Sports Centre',
        address: 'Aston St, Birmingham B4 7ET',
        distance: '0.8 miles',
        distanceKm: 1.3,
        pricePerHour: 12,
        rating: 4.7,
        reviewCount: 156,
        courts: 6,
        openHours: '6:00 AM - 10:00 PM',
        phone: '0121 204 4000',
        website: 'https://aston.ac.uk/sport',
        amenities: ['Changing Rooms', 'Showers', 'Parking', 'Cafe'],
        imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600',
        available: true,
        membershipDiscount: 20,
    },
    {
        id: '2',
        name: 'Birmingham Sports Hub',
        address: 'Park Street, Birmingham B5 5JR',
        distance: '1.2 miles',
        distanceKm: 1.9,
        pricePerHour: 15,
        rating: 4.5,
        reviewCount: 203,
        courts: 8,
        openHours: '7:00 AM - 11:00 PM',
        phone: '0121 456 7890',
        website: 'https://bhamsportshub.com',
        amenities: ['Changing Rooms', 'Showers', 'Parking', 'Pro Shop', 'Coaching'],
        imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600',
        available: true,
        membershipDiscount: 15,
    },
    {
        id: '3',
        name: 'Edgbaston Priory Club',
        address: 'Sir Harry\'s Road, Edgbaston B15 2UZ',
        distance: '2.5 miles',
        distanceKm: 4.0,
        pricePerHour: 20,
        rating: 4.9,
        reviewCount: 89,
        courts: 4,
        openHours: '6:30 AM - 10:30 PM',
        phone: '0121 440 2492',
        website: 'https://edgbastonpriory.com',
        amenities: ['Premium Facilities', 'Restaurant', 'Spa', 'Parking', 'Coaching'],
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        available: false,
    },
    {
        id: '4',
        name: 'Nechells Community Centre',
        address: 'Nechells Parkway, Birmingham B7 5PD',
        distance: '1.8 miles',
        distanceKm: 2.9,
        pricePerHour: 8,
        rating: 4.2,
        reviewCount: 67,
        courts: 3,
        openHours: '8:00 AM - 9:00 PM',
        phone: '0121 327 5566',
        amenities: ['Changing Rooms', 'Free Parking'],
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600',
        available: true,
    },
    {
        id: '5',
        name: 'Perry Barr Leisure Centre',
        address: 'Aldridge Road, Birmingham B42 2ET',
        distance: '3.2 miles',
        distanceKm: 5.1,
        pricePerHour: 10,
        rating: 4.4,
        reviewCount: 134,
        courts: 5,
        openHours: '6:00 AM - 10:00 PM',
        phone: '0121 464 5678',
        website: 'https://better.org.uk',
        amenities: ['Changing Rooms', 'Showers', 'Parking', 'Gym', 'Pool'],
        imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600',
        available: true,
        membershipDiscount: 10,
    },
    {
        id: '6',
        name: 'Harborne Pool & Fitness Centre',
        address: 'Lordswood Road, Harborne B17 9QS',
        distance: '4.1 miles',
        distanceKm: 6.6,
        pricePerHour: 11,
        rating: 4.3,
        reviewCount: 98,
        courts: 4,
        openHours: '6:30 AM - 9:30 PM',
        phone: '0121 427 2345',
        amenities: ['Changing Rooms', 'Showers', 'Pool', 'Gym'],
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        available: true,
    },
];

// Generate available time slots
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
        const isAvailable = Math.random() > 0.3; // 70雨 chance available
        slots.push({
            time: `${hour.toString().padStart(2, '0')}:00`,
            available: isAvailable,
        });
    }
    return slots;
};

type BookingStep = 'closed' | 'time' | 'details' | 'review' | 'processing' | 'confirmed';

type SortOption = 'distance' | 'price' | 'rating';

export default function LocationsPage() {
    const [sortBy, setSortBy] = useState<SortOption>('distance');
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    
    // Booking flow state
    const [bookingStep, setBookingStep] = useState<BookingStep>('closed');
    const [selectedCentre, setSelectedCentre] = useState<SportsCentre | null>(null);
    const [timeSlots, setTimeSlots] = useState<{time: string; available: boolean}[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [isMember, setIsMember] = useState(false);
    const [membershipCode, setMembershipCode] = useState('');
    const [bookingDetails, setBookingDetails] = useState({
        name: '',
        email: '',
        phone: '',
        notes: '',
    });

    const toggleFavorite = (id: string) => {
        setFavorites(prev => 
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const startBooking = (centre: SportsCentre) => {
        setSelectedCentre(centre);
        setTimeSlots(generateTimeSlots());
        setSelectedSlots([]);
        setBookingStep('time');
    };

    const toggleTimeSlot = (time: string) => {
        setSelectedSlots(prev => {
            if (prev.includes(time)) {
                return prev.filter(t => t !== time);
            }
            // Allow selecting adjacent slots
            const newSlots = [...prev, time].sort();
            return newSlots;
        });
    };

    const calculateTotal = () => {
        if (!selectedCentre) return 0;
        let total = selectedCentre.pricePerHour * selectedSlots.length;
        if (isMember && selectedCentre.membershipDiscount) {
            total = total * (1 - selectedCentre.membershipDiscount / 100);
        }
        return total;
    };

    const handleConfirmBooking = () => {
        setBookingStep('processing');
        // Simulate API call
        setTimeout(() => {
            setBookingStep('confirmed');
        }, 2000);
    };

    const resetBooking = () => {
        setBookingStep('closed');
        setSelectedCentre(null);
        setSelectedSlots([]);
        setIsMember(false);
        setMembershipCode('');
        setBookingDetails({ name: '', email: '', phone: '', notes: '' });
    };

    const nextDate = () => {
        const next = new Date(selectedDate);
        next.setDate(next.getDate() + 1);
        setSelectedDate(next);
        setTimeSlots(generateTimeSlots());
        setSelectedSlots([]);
    };

    const prevDate = () => {
        const prev = new Date(selectedDate);
        prev.setDate(prev.getDate() - 1);
        if (prev >= new Date()) {
            setSelectedDate(prev);
            setTimeSlots(generateTimeSlots());
            setSelectedSlots([]);
        }
    };

    const filteredAndSortedCentres = [...mockSportsCentres]
        .filter(centre => !showAvailableOnly || centre.available)
        .sort((a, b) => {
            switch (sortBy) {
                case 'distance':
                    return a.distanceKm - b.distanceKm;
                case 'price':
                    return a.pricePerHour - b.pricePerHour;
                case 'rating':
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });

    return (
        <div className="min-h-screen bg-slate-900">
            <Header 
                title="Find Nearby Courts" 
                subtitle="Discover badminton courts near you"
            />

            <div className="container mx-auto px-4 py-6">
                {/* My Bookings Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 rounded-3xl shadow-lg p-6 mb-6 border border-white/10"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-sky-400" />
                        My Bookings
                    </h2>
                    
                    {/* Mock bookings - in real app these would come from database */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white">Aston University Sports Centre</h4>
                                <p className="text-sm text-slate-400">Tomorrow, 7:00 PM - 8:00 PM</p>
                            </div>
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                                Confirmed
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white">Birmingham Sports Hub</h4>
                                <p className="text-sm text-slate-400">Feb 15, 6:00 PM - 7:00 PM</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                                Pending
                            </span>
                        </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 mt-4 text-center">
                        Your booking history will be saved here
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="bg-slate-800 rounded-2xl shadow-lg p-4 mb-6 border border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-sky-500" />
                            <span className="font-medium text-slate-200">Sort by:</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                            {[
                                { key: 'distance', label: 'Distance', icon: Navigation },
                                { key: 'price', label: 'Price', icon: DollarSign },
                                { key: 'rating', label: 'Rating', icon: Star },
                            ].map(option => (
                                <button
                                    key={option.key}
                                    onClick={() => setSortBy(option.key as SortOption)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                        sortBy === option.key
                                            ? 'bg-white text-slate-900 shadow-lg'
                                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                                    }`}
                                >
                                    <option.icon className="w-4 h-4" />
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showAvailableOnly}
                                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                                className="w-5 h-5 rounded-lg border-white/20 bg-white/10 text-sky-500 focus:ring-sky-400"
                            />
                            <span className="text-slate-200 font-medium">Available Now</span>
                        </label>
                    </div>
                </div>

                {/* Sports Centres Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedCentres.map((centre, index) => (
                        <motion.div
                            key={centre.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-800 rounded-3xl shadow-lg overflow-hidden border border-white/10 hover:shadow-xl hover:border-white/20 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gradient-to-br from-sky-200 to-blue-200">
                                <img
                                    src={centre.imageUrl}
                                    alt={centre.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        centre.available 
                                            ? 'bg-green-500/20 text-green-300'
                                            : 'bg-red-500/20 text-red-300'
                                    }`}>
                                        {centre.available ? 'Available' : 'Fully Booked'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => toggleFavorite(centre.id)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 transition-colors"
                                >
                                    <Heart 
                                        className={`w-5 h-5 ${
                                            favorites.includes(centre.id) 
                                                ? 'fill-red-500 text-red-500' 
                                                : 'text-slate-300'
                                        }`} 
                                    />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-bold text-white">{centre.name}</h3>
                                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-semibold text-yellow-300">{centre.rating}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-slate-400 mb-3">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{centre.address}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Navigation className="w-4 h-4 text-sky-400" />
                                        <span className="text-sm font-medium">{centre.distance}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <DollarSign className="w-4 h-4 text-green-400" />
                                        <span className="text-sm font-medium">£{centre.pricePerHour}/hr</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Clock className="w-4 h-4 text-blue-400" />
                                        <span className="text-sm">{centre.courts} courts</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <span className="text-xs text-slate-500">{centre.reviewCount} reviews</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-4">
                                    {centre.amenities.slice(0, 3).map(amenity => (
                                        <span key={amenity} className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded-lg">
                                            {amenity}
                                        </span>
                                    ))}
                                    {centre.amenities.length > 3 && (
                                        <span className="px-2 py-1 bg-white/5 text-slate-400 text-xs rounded-lg">
                                            +{centre.amenities.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => startBooking(centre)}
                                        disabled={!centre.available}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-xl transition-all ${
                                            centre.available 
                                                ? 'bg-white text-slate-900 hover:bg-slate-100'
                                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {centre.available ? 'Book Now' : 'Fully Booked'}
                                    </button>
                                    <a
                                        href={`tel:${centre.phone}`}
                                        className="p-3 bg-white/10 text-slate-300 rounded-xl hover:bg-white/20 transition-colors"
                                    >
                                        <Phone className="w-5 h-5" />
                                    </a>
                                    {centre.website && (
                                        <a
                                            href={centre.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-white/10 text-slate-300 rounded-xl hover:bg-white/20 transition-colors"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {bookingStep !== 'closed' && selectedCentre && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto"
                        onClick={resetBooking}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto my-4 border border-white/10"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedCentre.name}</h2>
                                    <p className="text-sm text-slate-400">{selectedCentre.address}</p>
                                </div>
                                <button
                                    onClick={resetBooking}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Step 1: Time Selection */}
                            {bookingStep === 'time' && (
                                <>
                                    {/* Date selector */}
                                    <div className="flex items-center justify-between mb-4 bg-slate-700/50 rounded-2xl p-3">
                                        <button
                                            onClick={prevDate}
                                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-slate-300" />
                                        </button>
                                        <div className="text-center">
                                            <p className="font-semibold text-white">
                                                {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={nextDate}
                                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5 text-slate-300" />
                                        </button>
                                    </div>

                                    {/* Time slots */}
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-slate-300 mb-3">Select available time slots (you can book multiple hours)</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {timeSlots.map(slot => (
                                                <button
                                                    key={slot.time}
                                                    onClick={() => slot.available && toggleTimeSlot(slot.time)}
                                                    disabled={!slot.available}
                                                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                                                        selectedSlots.includes(slot.time)
                                                            ? 'bg-sky-500 text-white shadow-lg'
                                                            : slot.available
                                                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                                : 'bg-slate-700/50 text-slate-500 cursor-not-allowed line-through'
                                                    }`}
                                                >
                                                    {slot.time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Membership toggle */}
                                    {selectedCentre.membershipDiscount && (
                                        <div className="mb-4">
                                            <label className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl cursor-pointer border border-amber-100">
                                                <input
                                                    type="checkbox"
                                                    checked={isMember}
                                                    onChange={(e) => {
                                                        setIsMember(e.target.checked);
                                                        if (!e.target.checked) setMembershipCode('');
                                                    }}
                                                    className="w-5 h-5 rounded border-amber-300 text-amber-500"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-amber-800">I have a {selectedCentre.name} membership</p>
                                                    <p className="text-xs text-amber-600">Get {selectedCentre.membershipDiscount}% discount with valid membership</p>
                                                </div>
                                                <span className="text-lg">🏅</span>
                                            </label>
                                            
                                            {/* Membership code input */}
                                            {isMember && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100"
                                                >
                                                    <label className="block text-sm font-medium text-amber-800 mb-2">
                                                        Membership ID / Code *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={membershipCode}
                                                        onChange={(e) => setMembershipCode(e.target.value.toUpperCase())}
                                                        placeholder="Enter your membership code"
                                                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white font-mono tracking-wider uppercase"
                                                    />
                                                    <p className="text-xs text-amber-600 mt-2">
                                                        This code will be sent to {selectedCentre.name} to verify your membership
                                                    </p>
                                                </motion.div>
                                            )}
                                        </div>
                                    )}

                                    {/* Price summary */}
                                    <div className="bg-slate-700/50 rounded-2xl p-4 mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-300">Court rate</span>
                                            <span className="font-medium text-white">£{selectedCentre.pricePerHour}/hour</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-300">Duration</span>
                                            <span className="font-medium text-white">{selectedSlots.length} hour{selectedSlots.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        {isMember && selectedCentre.membershipDiscount && (
                                            <div className="flex justify-between items-center mb-2 text-green-400">
                                                <span>Member discount</span>
                                                <span>-{selectedCentre.membershipDiscount}%</span>
                                            </div>
                                        )}
                                        <div className="border-t border-white/10 pt-2 mt-2 flex justify-between items-center">
                                            <span className="font-semibold text-white">Total</span>
                                            <span className="text-2xl font-bold text-sky-400">£{calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setBookingStep('details')}
                                        disabled={selectedSlots.length === 0}
                                        className={`w-full py-4 rounded-2xl font-semibold transition-all ${
                                            selectedSlots.length > 0
                                                ? 'bg-white text-slate-900 hover:bg-slate-100 hover:shadow-lg'
                                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                        }`}
                                    >
                                        Continue
                                    </button>
                                </>
                            )}

                            {/* Step 2: Personal Details */}
                            {bookingStep === 'details' && (
                                <>
                                    <button
                                        onClick={() => setBookingStep('time')}
                                        className="text-sky-400 text-sm font-medium mb-4 flex items-center gap-1 hover:text-sky-300"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Back to time selection
                                    </button>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name *</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={bookingDetails.name}
                                                    onChange={(e) => setBookingDetails(prev => ({ ...prev, name: e.target.value }))}
                                                    className="w-full pl-11 pr-4 py-3 border border-white/10 bg-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-white placeholder-slate-400"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={bookingDetails.email}
                                                    onChange={(e) => setBookingDetails(prev => ({ ...prev, email: e.target.value }))}
                                                    className="w-full pl-11 pr-4 py-3 border border-white/10 bg-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-white placeholder-slate-400"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="tel"
                                                    value={bookingDetails.phone}
                                                    onChange={(e) => setBookingDetails(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="w-full pl-11 pr-4 py-3 border border-white/10 bg-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-white placeholder-slate-400"
                                                    placeholder="07XXX XXXXXX"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Special Requests</label>
                                            <textarea
                                                value={bookingDetails.notes}
                                                onChange={(e) => setBookingDetails(prev => ({ ...prev, notes: e.target.value }))}
                                                className="w-full px-4 py-3 border border-white/10 bg-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-white placeholder-slate-400 resize-none"
                                                rows={3}
                                                placeholder="Any special requests or notes..."
                                            />
                                        </div>
                                    </div>

                                    {isMember && !membershipCode && (
                                        <p className="text-amber-400 text-sm mb-2 flex items-center gap-1">
                                            ⚠️ Please enter your membership code above
                                        </p>
                                    )}
                                    <button
                                        onClick={() => setBookingStep('review')}
                                        disabled={!bookingDetails.name || !bookingDetails.email || (isMember && !membershipCode)}
                                        className={`w-full py-4 rounded-2xl font-semibold transition-all ${
                                            bookingDetails.name && bookingDetails.email && (!isMember || membershipCode)
                                                ? 'bg-white text-slate-900 hover:bg-slate-100 hover:shadow-lg'
                                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                        }`}
                                    >
                                        Review Booking
                                    </button>
                                </>
                            )}

                            {/* Step 3: Review & Confirm */}
                            {bookingStep === 'review' && (
                                <>
                                    <button
                                        onClick={() => setBookingStep('details')}
                                        className="text-sky-400 text-sm font-medium mb-4 flex items-center gap-1 hover:text-sky-300"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Back to details
                                    </button>

                                    <div className="space-y-4 mb-6">
                                        {/* Booking summary */}
                                        <div className="bg-sky-500/20 rounded-2xl p-4 border border-sky-500/30">
                                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-sky-400" />
                                                Booking Details
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-300">Date</span>
                                                    <span className="font-medium text-white">{selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-300">Time</span>
                                                    <span className="font-medium text-white">{selectedSlots.sort().join(', ')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-300">Duration</span>
                                                    <span className="font-medium text-white">{selectedSlots.length} hour{selectedSlots.length !== 1 ? 's' : ''}</span>
                                                </div>
                                                {isMember && membershipCode && (
                                                    <div className="flex justify-between items-center pt-2 border-t border-sky-500/30 mt-2">
                                                        <span className="text-amber-400 flex items-center gap-1">
                                                            🏅 Membership
                                                        </span>
                                                        <span className="font-mono font-medium text-amber-400">{membershipCode}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Personal details */}
                                        <div className="bg-slate-700/50 rounded-2xl p-4">
                                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                                <User className="w-5 h-5 text-sky-400" />
                                                Your Details
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-300">Name</span>
                                                    <span className="font-medium text-white">{bookingDetails.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-300">Email</span>
                                                    <span className="font-medium text-white">{bookingDetails.email}</span>
                                                </div>
                                                {bookingDetails.phone && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-300">Phone</span>
                                                        <span className="font-medium text-white">{bookingDetails.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Payment */}
                                        <div className="bg-emerald-500/20 rounded-2xl p-4 border border-emerald-500/30">
                                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-emerald-400" />
                                                Payment
                                            </h4>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-300">Total Amount</span>
                                                <span className="text-2xl font-bold text-emerald-400">£{calculateTotal().toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-500/20 rounded-xl p-3 mb-4 flex items-start gap-2 border border-amber-500/30">
                                        <Send className="w-5 h-5 text-amber-400 mt-0.5" />
                                        <p className="text-sm text-amber-300">
                                            A confirmation will be sent to {selectedCentre.name} and you'll receive a booking confirmation email.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleConfirmBooking}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        Confirm & Pay £{calculateTotal().toFixed(2)}
                                    </button>
                                </>
                            )}

                            {/* Step 4: Processing */}
                            {bookingStep === 'processing' && (
                                <div className="text-center py-8">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-16 h-16 border-4 border-sky-500/30 border-t-sky-500 rounded-full mx-auto mb-4"
                                    />
                                    <h3 className="text-xl font-bold text-white mb-2">Processing Your Booking...</h3>
                                    <p className="text-slate-400">Sending notification to {selectedCentre.name}</p>
                                </div>
                            )}

                            {/* Step 5: Confirmed */}
                            {bookingStep === 'confirmed' && (
                                <div className="text-center py-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring" }}
                                        className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed! 🎉</h3>
                                    <p className="text-slate-300 mb-4">
                                        Your court has been booked at {selectedCentre.name}
                                    </p>

                                    <div className="bg-slate-700/50 rounded-2xl p-4 mb-6 text-left">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Booking Reference</span>
                                                <span className="font-mono font-bold text-sky-400">BK-{Date.now().toString().slice(-6)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Date & Time</span>
                                                <span className="font-medium text-white">{selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {selectedSlots[0]}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Duration</span>
                                                <span className="font-medium text-white">{selectedSlots.length} hour{selectedSlots.length !== 1 ? 's' : ''}</span>
                                            </div>
                                            {isMember && membershipCode && (
                                                <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                                                    <span className="text-amber-400">🏅 Membership Applied</span>
                                                    <span className="font-mono font-medium text-amber-400">{membershipCode}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isMember && membershipCode && (
                                        <div className="bg-amber-500/20 rounded-xl p-3 mb-4 flex items-start gap-2 border border-amber-500/30 text-left">
                                            <span className="text-lg">🏅</span>
                                            <p className="text-sm text-amber-300">
                                                Your membership code <strong className="font-mono">{membershipCode}</strong> has been sent to {selectedCentre.name} for verification.
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-sky-500/20 rounded-xl p-3 mb-4 flex items-start gap-2 border border-sky-500/30">
                                        <Mail className="w-5 h-5 text-sky-400 mt-0.5" />
                                        <p className="text-sm text-sky-300 text-left">
                                            Confirmation email sent to <strong>{bookingDetails.email}</strong>
                                        </p>
                                    </div>

                                    <button
                                        onClick={resetBooking}
                                        className="w-full py-4 bg-white text-slate-900 rounded-2xl font-semibold hover:bg-slate-100 hover:shadow-lg transition-all"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
