'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    ChevronRight, 
    Check,
    Users,
    MapPin,
    Star,
    Target,
    Clock,
    Sparkles
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

interface Question {
    id: string;
    question: string;
    subtext?: string;
    type: 'single' | 'multiple' | 'input' | 'slider';
    options?: { value: string; label: string; icon?: React.ReactNode }[];
    placeholder?: string;
    icon: React.ReactNode;
}

const questions: Question[] = [
    {
        id: 'gender',
        question: "What is your preferred partner's gender?",
        subtext: 'Select your preference or choose any',
        type: 'single',
        icon: <Users className="w-8 h-8" />,
        options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'any', label: 'Any Gender' },
        ],
    },
    {
        id: 'location',
        question: 'Where will you be playing?',
        subtext: 'Enter your preferred playing location',
        type: 'input',
        placeholder: 'e.g., Birmingham, Aston University...',
        icon: <MapPin className="w-8 h-8" />,
    },
    {
        id: 'skillLevel',
        question: "What skill level do you expect your partner to be?",
        subtext: 'Rate from beginner (1) to professional (10)',
        type: 'single',
        icon: <Star className="w-8 h-8" />,
        options: [
            { value: '1-3', label: 'Beginner (1-3)' },
            { value: '4-5', label: 'Intermediate (4-5)' },
            { value: '6-7', label: 'Advanced (6-7)' },
            { value: '8-10', label: 'Expert (8-10)' },
            { value: 'any', label: 'Any Level' },
        ],
    },
    {
        id: 'playStyle',
        question: 'What play style are you looking for?',
        subtext: 'Select one or more styles',
        type: 'multiple',
        icon: <Target className="w-8 h-8" />,
        options: [
            { value: 'singles', label: 'Singles' },
            { value: 'doubles', label: 'Doubles' },
            { value: 'mixed', label: 'Mixed Doubles' },
            { value: 'casual', label: 'Casual Rally' },
        ],
    },
    {
        id: 'availability',
        question: 'When are you usually available to play?',
        subtext: 'Select your preferred times',
        type: 'multiple',
        icon: <Clock className="w-8 h-8" />,
        options: [
            { value: 'weekday-morning', label: 'Weekday Mornings' },
            { value: 'weekday-afternoon', label: 'Weekday Afternoons' },
            { value: 'weekday-evening', label: 'Weekday Evenings' },
            { value: 'weekend-morning', label: 'Weekend Mornings' },
            { value: 'weekend-afternoon', label: 'Weekend Afternoons' },
            { value: 'weekend-evening', label: 'Weekend Evenings' },
        ],
    },
    {
        id: 'intention',
        question: 'What are you looking for in a partner?',
        subtext: 'Choose your playing intention',
        type: 'multiple',
        icon: <Sparkles className="w-8 h-8" />,
        options: [
            { value: 'casual', label: 'Casual Fun' },
            { value: 'competitive', label: 'Competitive Matches' },
            { value: 'training', label: 'Training Partner' },
            { value: 'coaching', label: 'Coaching/Mentoring' },
            { value: 'social', label: 'Social/Make Friends' },
        ],
    },
];

export default function PartnerPreferencesPage() {
    const router = useRouter();
    const { user } = useUser();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    const handleSingleSelect = (value: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    };

    const handleMultipleSelect = (value: string) => {
        const current = (answers[currentQuestion.id] as string[]) || [];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: updated }));
    };

    const handleInputChange = (value: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    };

    const canProceed = () => {
        const answer = answers[currentQuestion.id];
        if (currentQuestion.type === 'multiple') {
            return Array.isArray(answer) && answer.length > 0;
        }
        return !!answer;
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Save preferences and navigate
            console.log('Preferences saved:', answers);
            router.push('/partners');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            router.back();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            {/* Progress Bar */}
            <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-40">
                <motion.div
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Step Counter */}
                <div className="text-center mb-4">
                    <span className="text-sm text-sky-600 font-medium">
                        Step {currentStep + 1} of {questions.length}
                    </span>
                </div>

                {/* Question Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-2xl mx-auto"
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-sky-200">
                                {currentQuestion.icon}
                            </div>
                        </div>

                        {/* Question */}
                        <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-3">
                            {currentQuestion.question}
                        </h1>
                        {currentQuestion.subtext && (
                            <p className="text-center text-gray-500 mb-8">
                                {currentQuestion.subtext}
                            </p>
                        )}

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion.type === 'input' ? (
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={currentQuestion.placeholder}
                                        value={(answers[currentQuestion.id] as string) || ''}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-sky-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {currentQuestion.options?.map((option) => {
                                        const isSelected = currentQuestion.type === 'multiple'
                                            ? ((answers[currentQuestion.id] as string[]) || []).includes(option.value)
                                            : answers[currentQuestion.id] === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => 
                                                    currentQuestion.type === 'multiple'
                                                        ? handleMultipleSelect(option.value)
                                                        : handleSingleSelect(option.value)
                                                }
                                                className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${
                                                    isSelected
                                                        ? 'border-sky-400 bg-sky-50 shadow-lg shadow-sky-100'
                                                        : 'border-gray-200 bg-white hover:border-sky-200 hover:bg-sky-50/50'
                                                }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                    isSelected
                                                        ? 'border-sky-500 bg-sky-500'
                                                        : 'border-gray-300'
                                                }`}>
                                                    {isSelected && <Check className="w-4 h-4 text-white" />}
                                                </div>
                                                <span className={`font-medium ${isSelected ? 'text-sky-700' : 'text-gray-700'}`}>
                                                    {option.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 md:relative md:bg-transparent md:border-none md:mt-12">
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className={`flex items-center gap-2 px-8 py-3 font-semibold rounded-xl transition-all ${
                                canProceed()
                                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200 hover:shadow-xl'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {currentStep === questions.length - 1 ? 'Find Partners' : 'Continue'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
