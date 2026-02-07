'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { 
    Users, 
    Calendar, 
    Zap, 
    DollarSign,
    MapPin,
    Trophy,
    Building2,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { GoodmintonLogo } from '@/components/Navigation';

const featureCards = [
    {
        title: 'Partner Preferences',
        description: 'Set your ideal playing partner criteria',
        icon: <Users size={32} />,
        href: '/partners/preferences',
        gradient: 'from-sky-400 to-blue-500',
        delay: 0.1,
    },
    {
        title: 'Scheduling',
        description: 'Plan games with your connections',
        icon: <Calendar size={32} />,
        href: '/partners/scheduling',
        gradient: 'from-cyan-400 to-sky-500',
        delay: 0.2,
    },
    {
        title: 'Play Now',
        description: 'Find available players instantly',
        icon: <Zap size={32} />,
        href: '/discover',
        gradient: 'from-blue-400 to-indigo-500',
        delay: 0.3,
    },
    {
        title: 'Fare Splitting',
        description: 'Split court costs with partners',
        icon: <DollarSign size={32} />,
        href: '/partners/fare-splitting',
        gradient: 'from-teal-400 to-cyan-500',
        delay: 0.4,
    },
];

const quickActions = [
    {
        title: 'Find Courts',
        icon: <MapPin size={20} />,
        href: '/locations',
        color: 'bg-sky-100 text-sky-600 hover:bg-sky-200',
    },
    {
        title: 'Join Tournament',
        icon: <Trophy size={20} />,
        href: '/tournaments',
        color: 'bg-amber-100 text-amber-600 hover:bg-amber-200',
    },
    {
        title: 'Explore Clubs',
        icon: <Building2 size={20} />,
        href: '/clubs',
        color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    },
];

export default function HomePage() {
    const { user, isLoading } = useUser();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200 rounded-full blur-3xl opacity-50" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-50" />
                </div>

                <div className="container mx-auto px-4 py-16 md:py-24 relative">
                    {/* Welcome Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full mb-6"
                        >
                            <Sparkles size={16} />
                            <span className="text-sm font-medium">Welcome to Goodminton</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                            <span className="text-gray-800">Welcome to </span>
                            <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                Goodminton
                            </span>
                            <span className="text-gray-800">, </span>
                            <br className="hidden md:block" />
                            {isLoading ? (
                                <span className="inline-block w-40 h-12 bg-gray-200 rounded-lg animate-pulse" />
                            ) : (
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent"
                                >
                                    {user?.name || 'Player'}!
                                </motion.span>
                            )}
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Your ultimate badminton companion. Find partners, book courts, join tournaments, and connect with the community.
                        </p>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center gap-4 mb-16"
                    >
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                href={action.href}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${action.color}`}
                            >
                                {action.icon}
                                <span className="hidden sm:inline">{action.title}</span>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Main Action Section */}
            <section className="container mx-auto px-4 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Let's help you find a partner!
                    </h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Choose from our features below to get started on your badminton journey
                    </p>
                </motion.div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {featureCards.map((card) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: card.delay }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group"
                        >
                            <Link href={card.href}>
                                <div className="relative bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden h-full transition-shadow hover:shadow-xl hover:shadow-sky-100">
                                    {/* Gradient background on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                    
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white mb-4 shadow-lg`}>
                                        {card.icon}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-sky-600 transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {card.description}
                                    </p>

                                    {/* Arrow */}
                                    <div className="flex items-center text-sky-500 font-medium">
                                        <span>Get Started</span>
                                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-r from-sky-500 to-blue-600 py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white"
                    >
                        {[
                            { value: '500+', label: 'Active Players' },
                            { value: '50+', label: 'Tournaments' },
                            { value: '20+', label: 'Clubs' },
                            { value: '100+', label: 'Courts Listed' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                                <p className="text-sky-100">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <GoodmintonLogo size={32} />
                        <span className="text-lg font-bold text-gray-800">Goodminton</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Built with ❤️ at AstonHack11 • Theme: Community - Connect, Support, Empower
                    </p>
                </div>
            </footer>
        </div>
    );
}