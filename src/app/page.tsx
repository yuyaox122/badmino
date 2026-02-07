'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Users, 
    Calendar, 
    MapPin, 
    DollarSign,
    Sparkles,
    ArrowRight,
    Zap
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

const featureCards = [
    {
        title: 'Partner Preferences',
        description: 'Set your ideal partner criteria',
        icon: Users,
        href: '/partners/preferences',
        gradient: 'from-sky-400 to-blue-500',
    },
    {
        title: 'Scheduling',
        description: 'Plan games with your partners',
        icon: Calendar,
        href: '/partners/scheduling',
        gradient: 'from-cyan-400 to-sky-500',
    },
    {
        title: 'Play Now',
        description: 'Find available partners nearby',
        icon: Zap,
        href: '/partners',
        gradient: 'from-blue-400 to-indigo-500',
    },
    {
        title: 'Fare Splitting',
        description: 'Split court costs fairly',
        icon: DollarSign,
        href: '/partners/fare-splitting',
        gradient: 'from-teal-400 to-cyan-500',
    },
];

export default function HomePage() {
    const { user, isLoading } = useUser();
    const userName = user?.name?.split(' ')[0] || 'Player';

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-sky-300/30 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
                
                <div className="relative container mx-auto px-4 py-16 md:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        {/* Welcome Message */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-sky-500" />
                            <span className="text-sky-600 font-medium">Your badminton journey starts here</span>
                            <Sparkles className="w-5 h-5 text-sky-500" />
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                            <span className="text-gray-800">Welcome to </span>
                            <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                Badmino
                            </span>
                            <span className="text-gray-800">,</span>
                            <br />
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent"
                            >
                                {isLoading ? '...' : userName}!
                            </motion.span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Connect with players, join tournaments, and become part of the ultimate badminton community.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/partners"
                                className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all duration-300 flex items-center gap-2"
                            >
                                <Users className="w-5 h-5" />
                                Find Partners
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/locations"
                                className="px-8 py-4 bg-white text-sky-600 font-semibold rounded-2xl shadow-lg border border-sky-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <MapPin className="w-5 h-5" />
                                Find Courts
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Find Partner Section */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
                            Let&apos;s help you find a{' '}
                            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                                partner
                            </span>
                            !
                        </h2>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">
                            Choose from our features designed to connect you with the perfect playing partner
                        </p>
                    </motion.div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featureCards.map((card, index) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <Link href={card.href}>
                                    <div className="group relative bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:shadow-sky-100 hover:border-sky-200 transition-all duration-300 cursor-pointer h-full">
                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <card.icon className="w-7 h-7 text-white" />
                                        </div>
                                        
                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-sky-600 transition-colors">
                                            {card.title}
                                        </h3>
                                        <p className="text-gray-500">
                                            {card.description}
                                        </p>
                                        
                                        {/* Arrow */}
                                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                            <ArrowRight className="w-5 h-5 text-sky-500" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Stats Section */}
            <section className="py-16 bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-500">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '2,500+', label: 'Active Players' },
                            { value: '50+', label: 'Courts Listed' },
                            { value: '100+', label: 'Tournaments' },
                            { value: '30+', label: 'Clubs' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="text-center text-white"
                            >
                                <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                                <p className="text-sky-100">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}