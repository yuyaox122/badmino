'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { matchesAPI } from '@/lib/api/client';
import { PartnerMatch, Message, Player } from '@/types';
import { getSkillLabel, getSkillColor, timeAgo } from '@/lib/utils';
import { MessageCircle, Send, Phone, Video, MoreVertical, ArrowLeft, Calendar, UserX, Flag, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MatchesPage() {
    const router = useRouter();
    const { user } = useUser();
    const [matches, setMatches] = useState<PartnerMatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMatch, setSelectedMatch] = useState<PartnerMatch | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(false);

    // Fetch matches from database
    useEffect(() => {
        matchesAPI.getAll()
            .then(data => setMatches(data))
            .catch(err => console.error('Failed to load matches:', err))
            .finally(() => setIsLoading(false));
    }, []);

    // Load messages when a match is selected
    const loadMessages = useCallback(async (matchId: string) => {
        setMessagesLoading(true);
        try {
            const data = await matchesAPI.getMessages(matchId);
            setMessages(data);
        } catch (err) {
            console.error('Failed to load messages:', err);
        } finally {
            setMessagesLoading(false);
        }
    }, []);

    const handleSelectMatch = (match: PartnerMatch) => {
        setSelectedMatch(match);
        setMessages([]);
        loadMessages(match.id);
    };

    const getOtherPlayer = (match: PartnerMatch): Player | undefined => {
        if (!user) return match.player2;
        return match.player1Id === user.id ? match.player2 : match.player1;
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedMatch) return;

        const content = message;
        setMessage('');

        try {
            const newMsg = await matchesAPI.sendMessage(selectedMatch.id, content);
            setMessages(prev => [...prev, newMsg]);
        } catch (err) {
            console.error('Failed to send message:', err);
            setMessage(content); // Restore message on failure
        }
    };

    // Chat view
    if (selectedMatch) {
        const otherPlayer = getOtherPlayer(selectedMatch);

        return (
            <div className="min-h-screen flex flex-col">
                {/* Chat header */}
                <header className="sticky top-0 z-30 bg-card border-b border-border">
                    <div className="max-w-lg mx-auto px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedMatch(null)}
                            >
                                <ArrowLeft size={20} />
                            </Button>

                            <Avatar className="h-10 w-10">
                                <AvatarImage src={otherPlayer?.avatarUrl} />
                                <AvatarFallback>{otherPlayer?.name[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <p className="font-semibold">{otherPlayer?.name}</p>
                                <p className="text-xs text-green-500">Online</p>
                            </div>

                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon">
                                    <Phone size={18} />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Video size={18} />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical size={18} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem
                                            onClick={() => router.push(`/partners/scheduling?partnerId=${otherPlayer?.id}&partnerName=${encodeURIComponent(otherPlayer?.name || '')}`)}
                                            className="cursor-pointer"
                                        >
                                            <Calendar className="mr-2 h-4 w-4 text-sky-500" />
                                            <span>Schedule a session</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Volume2 className="mr-2 h-4 w-4" />
                                            <span>Mute notifications</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer text-orange-600">
                                            <Flag className="mr-2 h-4 w-4" />
                                            <span>Report user</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer text-red-600">
                                            <UserX className="mr-2 h-4 w-4" />
                                            <span>Block user</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                    <div className="max-w-lg mx-auto">
                        {/* Match banner */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-full">
                                <span className="text-2xl">🏸</span>
                                <span className="text-sm text-green-500 font-medium">
                                    You matched with {otherPlayer?.name}!
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {timeAgo(selectedMatch.matchedAt)}
                            </p>
                        </div>

                        {messagesLoading ? (
                            <div className="text-center text-muted-foreground py-8">
                                Loading messages...
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                No messages yet. Say hello!
                            </div>
                        ) : (
                            /* Message bubbles */
                            messages.map((msg) => {
                                const isMe = msg.senderId === user?.id;
                                const msgTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] px-4 py-2 rounded-2xl ${isMe
                                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                                : 'bg-muted rounded-bl-md'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                                }`}>
                                                {msgTime}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Message input */}
                <div className="sticky bottom-0 bg-card border-t border-border p-4">
                    <div className="max-w-lg mx-auto flex gap-2">
                        <Input
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1"
                        />
                        <Button onClick={handleSendMessage} size="icon">
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen pb-20">
                <Header title="Matches" subtitle="Loading..." />
                <div className="max-w-lg mx-auto px-4 pt-4">
                    <div className="animate-pulse text-center py-20 text-muted-foreground">
                        Loading matches...
                    </div>
                </div>
            </div>
        );
    }

    // Matches list view
    return (
        <div className="min-h-screen pb-20">
            <Header
                title="Matches"
                subtitle={`${matches.length} connections`}
            />

            <div className="max-w-lg mx-auto px-4 pt-4">
                {matches.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Start swiping to find your perfect badminton partner!
                        </p>
                        <Button asChild>
                            <a href="/partners/swipe">Find Partners</a>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* All matches */}
                        <div>
                            <h2 className="text-sm font-medium text-muted-foreground mb-3">Your Matches</h2>
                            <div className="space-y-2">
                                {matches.map((match) => {
                                    const otherPlayer = getOtherPlayer(match);
                                    return (
                                        <motion.div
                                            key={match.id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <Card
                                                className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                                                onClick={() => handleSelectMatch(match)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-14 w-14">
                                                        <AvatarImage src={otherPlayer?.avatarUrl} />
                                                        <AvatarFallback>{otherPlayer?.name?.[0]}</AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <p className="font-semibold">{otherPlayer?.name}</p>
                                                            <span className="text-xs text-muted-foreground">
                                                                {timeAgo(match.matchedAt)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-[10px] px-1.5"
                                                                style={{
                                                                    backgroundColor: `${getSkillColor(otherPlayer?.skillLevel || 5)}20`,
                                                                    color: getSkillColor(otherPlayer?.skillLevel || 5),
                                                                }}
                                                            >
                                                                {getSkillLabel(otherPlayer?.skillLevel || 5)}
                                                            </Badge>
                                                            <span className="text-sm text-muted-foreground truncate">
                                                                {match.compatibility}% compatible
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <MessageCircle size={20} className="text-muted-foreground" />
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
