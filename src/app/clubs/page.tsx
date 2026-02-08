'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Navigation';
import { MapView } from '@/components/MapView';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { mockClubs, mockCurrentUser, mockPlayers } from '@/lib/mock-data';
import { Club } from '@/types';
import { getSkillLabel } from '@/lib/utils';
import {
    Users,
    MapPin,
    Calendar,
    Activity,
    Map,
    List,
    Lock,
    Unlock,
    Star,
    CheckCircle,
} from 'lucide-react';

export default function ClubsPage() {
    const [clubs] = useState<Club[]>(mockClubs);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    const [joinedClubs, setJoinedClubs] = useState<Set<string>>(new Set(['c2', 'c4'])); // User already in Aston Shuttlers and Weekend Warriors
    
    // Current user ID for identifying created clubs
    const currentUserId = mockCurrentUser.id;

    const userLocation = { lat: 52.4862, lng: -1.8904 };
    
    // Filter clubs into categories
    const myCreatedClubs = clubs.filter(c => c.createdBy === currentUserId);
    const myJoinedClubs = clubs.filter(c => joinedClubs.has(c.id) && c.createdBy !== currentUserId);
    const discoverClubs = clubs.filter(c => !joinedClubs.has(c.id) && c.createdBy !== currentUserId);

    const handleJoin = (club: Club) => {
        if (club.isOpen) {
            setJoinedClubs(prev => new Set([...prev, club.id]));
            alert(`🎉 Welcome to ${club.name}!`);
        } else {
            alert(`📩 Request sent to join ${club.name}. The admin will review your application.`);
        }
        setSelectedClub(null);
    };

    const getActivityColor = (level: string) => {
        switch (level) {
            case 'high': return 'text-green-500';
            case 'medium': return 'text-yellow-500';
            case 'low': return 'text-red-500';
            default: return 'text-muted-foreground';
        }
    };

    // Get member avatars for a club
    const getMemberAvatars = (club: Club) => {
        return mockPlayers.filter(p => club.members.includes(p.id)).slice(0, 3);
    };

    return (
        <div className="min-h-screen pb-20">
            <Header
                title="Clubs"
                subtitle={`${clubs.length} clubs near you`}
                rightElement={
                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('list')}
                        >
                            <List size={20} />
                        </Button>
                        <Button
                            variant={viewMode === 'map' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('map')}
                        >
                            <Map size={20} />
                        </Button>
                    </div>
                }
            />

            <div className="max-w-lg mx-auto px-4 pt-4">
                <AnimatePresence mode="wait">
                    {viewMode === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            {/* My Clubs - Created by User */}
                            {myCreatedClubs.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                        <Star size={14} className="text-amber-500" />
                                        My Clubs (Created by you)
                                    </h2>
                                    <div className="grid grid-cols-3 gap-3">
                                        {myCreatedClubs.map((club) => (
                                            <motion.div 
                                                key={club.id} 
                                                whileHover={{ scale: 1.05 }}
                                                className="cursor-pointer"
                                                onClick={() => setSelectedClub(club)}
                                            >
                                                <div className="flex flex-col items-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all">
                                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg mb-2">
                                                        👑
                                                    </div>
                                                    <h3 className="font-medium text-sm text-center truncate w-full">{club.name}</h3>
                                                    <span className="text-xs text-muted-foreground">{club.memberCount} members</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Joined Clubs - Member but not owner */}
                            {myJoinedClubs.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        Joined Clubs
                                    </h2>
                                    <div className="grid grid-cols-3 gap-3">
                                        {myJoinedClubs.map((club) => (
                                            <motion.div 
                                                key={club.id} 
                                                whileHover={{ scale: 1.05 }}
                                                className="cursor-pointer"
                                                onClick={() => setSelectedClub(club)}
                                            >
                                                <div className="flex flex-col items-center p-3 rounded-2xl bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all">
                                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg mb-2 overflow-hidden">
                                                        {club.avatarUrl ? (
                                                            <img src={club.avatarUrl} alt={club.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            '🏟️'
                                                        )}
                                                    </div>
                                                    <h3 className="font-medium text-sm text-center truncate w-full">{club.name}</h3>
                                                    <span className="text-xs text-muted-foreground">{club.memberCount} members</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Discover Clubs */}
                            {discoverClubs.length > 0 && (
                            <div>
                                <h2 className="text-sm font-medium text-muted-foreground mb-3">Discover Clubs</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {discoverClubs.map((club, index) => (
                                        <motion.div
                                            key={club.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ scale: 1.05 }}
                                            className="cursor-pointer"
                                            onClick={() => setSelectedClub(club)}
                                        >
                                            <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-800 border border-white/10 hover:border-white/20 hover:bg-slate-700/50 transition-all">
                                                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg mb-2 overflow-hidden">
                                                    {club.avatarUrl ? (
                                                        <img src={club.avatarUrl} alt={club.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        '🏟️'
                                                    )}
                                                    {/* Lock icon for invite-only */}
                                                    {!club.isOpen && (
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                                            <Lock size={10} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="font-medium text-sm text-center truncate w-full">{club.name}</h3>
                                                <span className="text-xs text-muted-foreground">{club.memberCount} members</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="h-[600px] w-full">
                                <MapView
                                    clubs={clubs}
                                    userLocation={userLocation}
                                    onClubClick={setSelectedClub}
                                    showPlayers={false}
                                    showTournaments={false}
                                    showClubs={true}
                                    className="h-full"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Club detail modal */}
            <Dialog open={!!selectedClub} onOpenChange={() => setSelectedClub(null)}>
                <DialogContent className="max-w-md mx-auto">
                    {selectedClub && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg overflow-hidden">
                                        {selectedClub.avatarUrl ? (
                                            <img src={selectedClub.avatarUrl} alt={selectedClub.name} className="w-full h-full object-cover" />
                                        ) : (
                                            '🏟️'
                                        )}
                                    </div>
                                    <div>
                                        <DialogTitle className="flex items-center gap-2">
                                            {selectedClub.name}
                                            {selectedClub.isOpen ? (
                                                <Badge variant="secondary" className="bg-green-500/20 text-green-600">Open</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">Invite Only</Badge>
                                            )}
                                        </DialogTitle>
                                        <DialogDescription className="flex items-center gap-2 mt-1">
                                            <Star size={14} className="text-yellow-500" />
                                            {selectedClub.activityLevel} activity
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    {selectedClub.description}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Users size={18} className="text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Members</p>
                                            <p className="font-medium">{selectedClub.memberCount}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Activity size={18} className="text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Activity</p>
                                            <p className="font-medium capitalize">{selectedClub.activityLevel}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <Card>
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-2">
                                            <MapPin size={18} className="text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedClub.location.address}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Meeting days */}
                                <div>
                                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                        <Calendar size={16} />
                                        Meeting Days
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                                            const fullDay = {
                                                Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
                                                Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
                                            }[day];
                                            const isActive = selectedClub.meetingDays.includes(fullDay!);
                                            return (
                                                <Badge
                                                    key={day}
                                                    variant={isActive ? 'default' : 'outline'}
                                                    className={isActive ? 'bg-primary' : 'opacity-50'}
                                                >
                                                    {day}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Skill level range */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Skill Level Range</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">
                                            {getSkillLabel(selectedClub.skillLevelRange[0])}
                                        </Badge>
                                        <span className="text-muted-foreground">to</span>
                                        <Badge variant="secondary">
                                            {getSkillLabel(selectedClub.skillLevelRange[1])}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Members preview */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Members</p>
                                    <div className="flex items-center">
                                        <div className="flex -space-x-3">
                                            {getMemberAvatars(selectedClub).map((member) => (
                                                <Avatar key={member.id} className="w-10 h-10 border-2 border-background">
                                                    <AvatarImage src={member.avatarUrl} />
                                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                        {selectedClub.memberCount > 3 && (
                                            <span className="text-sm text-muted-foreground ml-3">
                                                +{selectedClub.memberCount - 3} more members
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="pt-2">
                                    {joinedClubs.has(selectedClub.id) ? (
                                        <Button className="w-full" variant="outline" disabled>
                                            <CheckCircle size={18} className="mr-2" />
                                            You're a Member
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                            onClick={() => handleJoin(selectedClub)}
                                        >
                                            {selectedClub.isOpen ? 'Join Club' : 'Request to Join'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
