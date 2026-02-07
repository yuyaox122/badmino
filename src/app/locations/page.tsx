'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    ExternalLink
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

type SortOption = 'distance' | 'price' | 'rating';

export default function LocationsPage() {
    const [sortBy, setSortBy] = useState<SortOption>('distance');
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    const toggleFavorite = (id: string) => {
        setFavorites(prev => 
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
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
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <Header 
                title="Find Nearby Courts" 
                subtitle="Discover badminton courts near you"
            />

            <div className="container mx-auto px-4 py-6">
                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-sky-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-sky-500" />
                            <span className="font-medium text-gray-700">Sort by:</span>
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
                                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-200'
                                            : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
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
                                className="w-5 h-5 rounded-lg border-sky-300 text-sky-500 focus:ring-sky-400"
                            />
                            <span className="text-gray-700 font-medium">Available Now</span>
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
                            className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:border-sky-200 transition-all duration-300"
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
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {centre.available ? 'Available' : 'Fully Booked'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => toggleFavorite(centre.id)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                                >
                                    <Heart 
                                        className={`w-5 h-5 ${
                                            favorites.includes(centre.id) 
                                                ? 'fill-red-500 text-red-500' 
                                                : 'text-gray-400'
                                        }`} 
                                    />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-bold text-gray-800">{centre.name}</h3>
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-semibold text-yellow-700">{centre.rating}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-500 mb-3">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{centre.address}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Navigation className="w-4 h-4 text-sky-500" />
                                        <span className="text-sm font-medium">{centre.distance}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <DollarSign className="w-4 h-4 text-green-500" />
                                        <span className="text-sm font-medium">£{centre.pricePerHour}/hr</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm">{centre.courts} courts</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="text-xs text-gray-400">{centre.reviewCount} reviews</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-4">
                                    {centre.amenities.slice(0, 3).map(amenity => (
                                        <span key={amenity} className="px-2 py-1 bg-sky-50 text-sky-600 text-xs rounded-lg">
                                            {amenity}
                                        </span>
                                    ))}
                                    {centre.amenities.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-lg">
                                            +{centre.amenities.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-sky-200 transition-all">
                                        Book Now
                                    </button>
                                    <a
                                        href={`tel:${centre.phone}`}
                                        className="p-3 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-colors"
                                    >
                                        <Phone className="w-5 h-5" />
                                    </a>
                                    {centre.website && (
                                        <a
                                            href={centre.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-colors"
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
        </div>
    );
}
