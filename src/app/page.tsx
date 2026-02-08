'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Users,
    Calendar,
    MapPin,
    DollarSign,
    ArrowRight,
    Zap,
    Trophy,
    Building2,
    Sparkles,
    Heart,
    Star,
    Search,
    MessageCircle,
    Clock,
    Target,
    Briefcase,
    FileText,
    UserPlus,
    ChevronDown
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

// Section options from navigation
const partnerOptions = [
    { label: 'Find Partners Nearby', href: '/partners', icon: Search, description: 'Connect with players in your area' },
    { label: 'Swipe for Partners', href: '/partners/swipe', icon: Users, description: 'Tinder-style partner matching' },
    { label: 'My Preferences', href: '/partners/preferences', icon: Target, description: 'Set your partner preferences' },
    { label: 'Chat & Reach Out', href: '/matches', icon: MessageCircle, description: 'Message your connections' },
    { label: 'Scheduling', href: '/partners/scheduling', icon: Clock, description: 'Plan games with your partners' },
    { label: 'Fare Splitting', href: '/partners/fare-splitting', icon: DollarSign, description: 'Split court costs fairly' },
];

const tournamentOptions = [
    { label: 'Join a Tournament', href: '/tournaments/organise?action=join', icon: UserPlus, description: 'Register as a participant' },
    { label: 'Organise a Tournament', href: '/tournaments/organise?action=organize', icon: Calendar, description: 'Host your own event' },
    { label: 'My Tournaments', href: '/tournaments/my-tournaments', icon: Trophy, description: 'Manage your organised events' },
    { label: 'Work at a Tournament', href: '/tournaments/organise?action=work', icon: Briefcase, description: 'Find tournament jobs' },
    { label: 'My Applications', href: '/tournaments/work/my-applications', icon: FileText, description: 'Track your job applications' },
];

const clubOptions = [
    { label: 'Discover Clubs', href: '/clubs', icon: Search, description: 'Find local badminton clubs' },
    { label: 'My Clubs', href: '/clubs?view=my-clubs', icon: Users, description: 'Manage your memberships' },
    { label: 'Create a Club', href: '/clubs/create', icon: UserPlus, description: 'Start your own community' },
    { label: 'Browse Leagues', href: '/league', icon: Trophy, description: 'Find leagues near you' },
    { label: 'Leaderboards', href: '/league/leaderboard', icon: Star, description: 'Check rankings and standings' },
];

const courtOptions = [
    { label: 'Find Nearby Courts', href: '/locations', icon: Search, description: 'Discover sports halls near you' },
    { label: 'View Prices', href: '/locations?view=prices', icon: DollarSign, description: 'Compare court rental prices' },
    { label: 'Book a Court', href: '/locations?action=book', icon: Calendar, description: 'Reserve your playing time' },
];

// Image placeholders - Replace with your own images
const IMAGES = {
    hero: '/images/hero.jpg', // Main hero image
    partners: '/images/partners.jpg', // Partners section image
    tournaments: '/images/tournaments.jpg', // Tournaments section image
    clubs: '/images/clubs.jpg', // Clubs section image
    courts: '/images/courts.jpg', // Courts section image
};

interface OptionCardProps {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    index: number;
}

function OptionCard({ label, href, icon: Icon, description, index }: OptionCardProps) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-30px" }}
            transition={{
                delay: index * 0.08,
                duration: 0.4,
                type: "spring",
                stiffness: 120
            }}
        >
            <Link href={href}>
                <motion.div
                    className="group flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all duration-300 cursor-pointer"
                    whileHover={{ x: 6, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-white group-hover:text-white transition-colors">{label}</h4>
                        <p className="text-sm text-white/60">{description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </motion.div>
            </Link>
        </motion.div>
    );
}

interface SectionProps {
    title: string;
    subtitle: string;
    emoji: string;
    options: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; description: string }[];
    imageSrc: string;
    imageAlt: string;
    contentPosition: 'left' | 'right';
    imagePosition?: string;
}

function FeatureSection({ title, subtitle, options, imageSrc, imageAlt, contentPosition, imagePosition = 'center' }: SectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // More dramatic parallax effect on the background
    const bgY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
    const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

    // Content slide in from the side
    const contentX = useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1],
        [contentPosition === 'left' ? -150 : 150, 0, 0, contentPosition === 'left' ? -150 : 150]
    );
    const contentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

    return (
        <section ref={sectionRef} className="relative min-h-[900px] md:min-h-[1000px] overflow-hidden">
            {/* Gradient fade at top */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-slate-900 to-transparent z-10 pointer-events-none" />

            {/* Full-width background image with float effect */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: bgY, scale: bgScale, opacity: bgOpacity }}
            >
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: imagePosition }}
                />
            </motion.div>

            {/* Persistent dark overlay */}
            <div className="absolute inset-0 bg-slate-900/50 z-[1]" />

            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none" />

            {/* Content container */}
            <div className="relative z-20 container mx-auto px-6 h-full min-h-[900px] md:min-h-[1000px] flex items-center py-20">
                <div className={`w-full lg:w-1/2 ${contentPosition === 'right' ? 'lg:ml-auto' : ''}`}>
                    <motion.div
                        className="relative"
                        style={{ x: contentX, opacity: contentOpacity }}
                    >
                        {/* Floating dark container */}
                        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
                            {/* Section header */}
                            <div className="mb-6">
                                <motion.div
                                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-semibold tracking-wide mb-4 border border-white/20"
                                    initial={{ opacity: 0, y: -10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {subtitle}
                                </motion.div>

                                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                    {title}
                                </h2>
                            </div>

                            {/* Options list */}
                            <div className="space-y-3">
                                {options.map((option, index) => (
                                    <OptionCard key={option.label} {...option} index={index} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default function HomePage() {
    const { user, isLoading } = useUser();
    const userName = user?.name?.split(' ')[0] || 'Player';

    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress: heroScrollProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    // Hero element animations - FAST split left and right on scroll
    const heroOpacity = useTransform(heroScrollProgress, [0, 0.25], [1, 0]);

    // Title "Welcome to" goes LEFT - faster
    const welcomeX = useTransform(heroScrollProgress, [0, 0.2], [0, -400]);
    const welcomeRotate = useTransform(heroScrollProgress, [0, 0.2], [0, -20]);

    // Title "Goodminton" goes RIGHT - faster
    const goodmintonX = useTransform(heroScrollProgress, [0, 0.2], [0, 400]);
    const goodmintonRotate = useTransform(heroScrollProgress, [0, 0.2], [0, 20]);

    // Badge goes UP and fades - faster
    const badgeY = useTransform(heroScrollProgress, [0, 0.15], [0, -200]);
    const badgeScale = useTransform(heroScrollProgress, [0, 0.15], [1, 0.3]);

    // User greeting goes DOWN - faster
    const greetingY = useTransform(heroScrollProgress, [0, 0.2], [0, 300]);
    const greetingScale = useTransform(heroScrollProgress, [0, 0.2], [1, 0.5]);

    // Subtitle splits - faster
    const subtitleY = useTransform(heroScrollProgress, [0, 0.2], [0, 150]);

    // Scroll indicator fades immediately
    const scrollIndicatorOpacity = useTransform(heroScrollProgress, [0, 0.08], [1, 0]);

    // Background elements spread dramatically - faster
    const bgSpreadLeft = useTransform(heroScrollProgress, [0, 0.2], [0, -350]);
    const bgSpreadRight = useTransform(heroScrollProgress, [0, 0.2], [0, 350]);
    const bgSpreadUp = useTransform(heroScrollProgress, [0, 0.2], [0, -300]);
    const bgSpreadDown = useTransform(heroScrollProgress, [0, 0.2], [0, 300]);

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Hero Section - Welcome to Goodminton */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
                {/* Animated background elements that spread dramatically on scroll */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Top-left bubble - goes further left and up */}
                    <motion.div
                        className="absolute top-20 left-[10%] w-24 h-24 bg-slate-700/40 rounded-full blur-xl"
                        style={{
                            x: bgSpreadLeft,
                            y: bgSpreadUp,
                            opacity: heroOpacity
                        }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    {/* Top-right bubble - goes further right and up */}
                    <motion.div
                        className="absolute top-32 right-[12%] w-36 h-36 bg-slate-600/30 rounded-full blur-2xl"
                        style={{
                            x: bgSpreadRight,
                            y: bgSpreadUp,
                            opacity: heroOpacity
                        }}
                        animate={{ scale: [1.1, 1, 1.1] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    />
                    {/* Bottom-left bubble - goes left and down */}
                    <motion.div
                        className="absolute bottom-32 left-[20%] w-28 h-28 bg-slate-700/30 rounded-full blur-xl"
                        style={{
                            x: bgSpreadLeft,
                            y: bgSpreadDown,
                            opacity: heroOpacity
                        }}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 6, repeat: Infinity }}
                    />
                    {/* Bottom-right bubble - goes right and down */}
                    <motion.div
                        className="absolute bottom-24 right-[18%] w-32 h-32 bg-slate-600/40 rounded-full blur-xl"
                        style={{
                            x: bgSpreadRight,
                            y: bgSpreadDown,
                            opacity: heroOpacity
                        }}
                        animate={{ scale: [1.1, 1, 1.1] }}
                        transition={{ duration: 7, repeat: Infinity }}
                    />
                    {/* Center-left accent */}
                    <motion.div
                        className="absolute top-1/2 left-[5%] w-20 h-20 bg-slate-700/40 rounded-full blur-lg"
                        style={{
                            x: useTransform(heroScrollProgress, [0, 0.5], [0, -350]),
                            opacity: heroOpacity
                        }}
                    />
                    {/* Center-right accent */}
                    <motion.div
                        className="absolute top-1/2 right-[5%] w-20 h-20 bg-slate-700/40 rounded-full blur-lg"
                        style={{
                            x: useTransform(heroScrollProgress, [0, 0.5], [0, 350]),
                            opacity: heroOpacity
                        }}
                    />
                </div>

                {/* Hero Content - Each element splits differently */}
                <div className="relative z-10 container mx-auto px-6 text-center">

                    {/* Floating badge - floats UP on scroll */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-white/20"
                        style={{
                            y: badgeY,
                            scale: badgeScale,
                            opacity: heroOpacity
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="text-white text-sm font-medium tracking-wide">YOUR BADMINTON COMMUNITY</span>
                    </motion.div>

                    {/* Main Heading - "Welcome to" goes LEFT, "Goodminton" goes RIGHT */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
                        <motion.span
                            className="text-white/80 inline-block"
                            style={{
                                x: welcomeX,
                                rotate: welcomeRotate,
                                opacity: heroOpacity
                            }}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            Welcome to
                        </motion.span>
                        <br />
                        <motion.span
                            className="text-white inline-block"
                            style={{
                                x: goodmintonX,
                                rotate: goodmintonRotate,
                                opacity: heroOpacity
                            }}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            Goodminton
                        </motion.span>
                    </h1>

                    {/* User Greeting - goes DOWN on scroll */}
                    <motion.div
                        style={{
                            y: greetingY,
                            scale: greetingScale,
                            opacity: heroOpacity
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mb-10"
                    >
                        <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
                            <span className="text-2xl md:text-3xl text-white">
                                {isLoading ? (
                                    <span className="opacity-50">Loading...</span>
                                ) : (
                                    <>Hello, <span className="font-bold text-white">{userName}</span></>
                                )}
                            </span>
                        </div>
                    </motion.div>

                    {/* Subtitle - fades and moves down */}
                    <motion.p
                        className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
                        style={{
                            y: subtitleY,
                            opacity: heroOpacity
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Connect with badminton enthusiasts, find courts, join tournaments, and be part of a passionate community.
                    </motion.p>

                    {/* Scroll indicator - positioned on right side */}
                    <motion.div
                        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
                        style={{ opacity: scrollIndicatorOpacity }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        {/* Vertical text */}
                        <motion.div
                            className="writing-mode-vertical text-white font-bold text-lg tracking-widest"
                            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            SCROLL
                        </motion.div>

                        {/* Animated line with dot */}
                        <div className="relative h-32 w-[3px] bg-white/30 rounded-full overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 w-full bg-white rounded-full"
                                animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        {/* Bouncing arrow */}
                        <motion.div
                            className="bg-white/20 rounded-full p-2 shadow-lg border border-white/30"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ChevronDown className="w-6 h-6 text-white" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Partner Finding Section */}
            <FeatureSection
                title="Find Your Perfect Badminton Partner"
                subtitle="PARTNER FINDER"
                emoji=""
                options={partnerOptions}
                imageSrc={IMAGES.partners}
                imageAlt="Badminton partners playing together"
                contentPosition="left"
                imagePosition="center"
            />

            {/* Tournament Section */}
            <FeatureSection
                title="Compete & Organise Tournaments"
                subtitle="TOURNAMENTS"
                emoji=""
                options={tournamentOptions}
                imageSrc={IMAGES.tournaments}
                imageAlt="Badminton tournament action"
                contentPosition="right"
                imagePosition="60% center"
            />

            {/* Clubs & Leagues Section */}
            <FeatureSection
                title="Join Clubs & Leagues"
                subtitle="COMMUNITY"
                emoji=""
                options={clubOptions}
                imageSrc={IMAGES.clubs}
                imageAlt="Badminton club members"
                contentPosition="left"
                imagePosition="center 30%"
            />

            {/* Book a Court Section */}
            <FeatureSection
                title="Find & Book Courts Near You"
                subtitle="COURT FINDER"
                emoji=""
                options={courtOptions}
                imageSrc={IMAGES.courts}
                imageAlt="Badminton court"
                contentPosition="right"
                imagePosition="center 70%"
            />

            {/* Stats Section */}
            <section className="py-24 relative overflow-hidden bg-slate-900">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-12">
                            Join the Community
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { value: '2,500+', label: 'Active Players', Icon: Users },
                                { value: '50+', label: 'Courts Listed', Icon: MapPin },
                                { value: '100+', label: 'Tournaments', Icon: Trophy },
                                { value: '30+', label: 'Clubs', Icon: Building2 },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center">
                                        <stat.Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                                    <p className="text-white/70 text-sm uppercase tracking-wide">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Play?
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg">
                            Join thousands of passionate badminton players. Find partners, book courts, and elevate your game.
                        </p>
                        <Link href="/discover">
                            <motion.div
                                className="inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-900 font-bold text-lg rounded-lg shadow-xl cursor-pointer"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5" />
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}