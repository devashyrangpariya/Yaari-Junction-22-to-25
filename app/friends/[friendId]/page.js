'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    HiArrowLeft,
    HiHeart,
    HiCalendar,
    HiPhotograph,
    HiUsers,
    HiShare,
    HiDownload
} from 'react-icons/hi';
import { FRIENDS_DATA } from '../../../lib/constants';
import SocialLinks from '../../../components/friends/SocialLinks';
import { containerVariants, staggerItem } from '../../../lib/animations';

export default function FriendProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Find the friend by ID
    const friend = useMemo(() => {
        return FRIENDS_DATA.find(f => f.id === params.friendId);
    }, [params.friendId]);

    // Get related friends (friends who share memories)
    const relatedFriends = useMemo(() => {
        if (!friend || !friend.favoriteMemories) return [];

        return FRIENDS_DATA.filter(f =>
            f.id !== friend.id &&
            f.favoriteMemories?.some(memory =>
                friend.favoriteMemories.includes(memory)
            )
        ).slice(0, 4); // Show max 4 related friends
    }, [friend]);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // Here you would typically save to localStorage or API
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${friend.name} - College Memory Gallery`,
                    text: `Check out ${friend.name}'s profile in our college memory gallery!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            // You could show a toast notification here
        }
    };

    if (!friend) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Friend Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The friend you're looking for doesn't exist.
                    </p>
                    <Link
                        href="/friends"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <HiArrowLeft className="w-4 h-4 mr-2" />
                        Back to Friends
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                <div className="absolute inset-0 bg-black/20" />

                {/* Navigation */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/friends"
                            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors duration-200"
                        >
                            <HiArrowLeft className="w-4 h-4 mr-2" />
                            Back to Friends
                        </Link>

                        <div className="flex items-center space-x-3">
                            <motion.button
                                onClick={handleShare}
                                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title="Share profile"
                            >
                                <HiShare className="w-5 h-5" />
                            </motion.button>

                            <motion.button
                                onClick={toggleFavorite}
                                className={`p-2 backdrop-blur-sm rounded-lg transition-colors duration-200 ${isFavorite
                                        ? 'bg-red-500/20 text-red-200'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <HiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Profile Header */}
                <motion.div
                    className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
                        {/* Profile Image */}
                        <motion.div
                            className="relative w-40 h-40 md:w-48 md:h-48"
                            variants={staggerItem}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-200 rounded-full p-2">
                                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                    {!imageError ? (
                                        <Image
                                            src={friend.profileImage}
                                            alt={`${friend.name} profile`}
                                            fill
                                            className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                                }`}
                                            onLoad={() => setImageLoaded(true)}
                                            onError={() => setImageError(true)}
                                            sizes="(max-width: 768px) 160px, 192px"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                            <span className="text-white text-4xl md:text-5xl font-bold">
                                                {friend.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}

                                    {!imageLoaded && !imageError && (
                                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Profile Info */}
                        <motion.div
                            className="flex-1 text-center md:text-left text-white"
                            variants={staggerItem}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                {friend.name}
                            </h1>
                            {friend.nickname !== friend.name && (
                                <p className="text-xl md:text-2xl text-white/90 mb-3">
                                    "{friend.nickname}"
                                </p>
                            )}
                            <p className="text-lg md:text-xl font-medium bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 inline-block mb-4">
                                {friend.funnyName}
                            </p>
                            <p className="text-white/90 text-lg max-w-2xl">
                                {friend.bio}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* College Journey */}
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
                            variants={staggerItem}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <HiCalendar className="w-6 h-6 mr-3 text-green-500" />
                                College Journey
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        Joined College
                                    </h3>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {friend.joinYear}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        Years Together
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {new Date().getFullYear() - friend.joinYear + 1} years
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Favorite Memories */}
                        {friend.favoriteMemories && friend.favoriteMemories.length > 0 && (
                            <motion.div
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
                                variants={staggerItem}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <HiPhotograph className="w-6 h-6 mr-3 text-purple-500" />
                                    Favorite Memories
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {friend.favoriteMemories.map((memory, index) => (
                                        <motion.div
                                            key={index}
                                            className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                        >
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                {memory}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                One of the most cherished moments from our college journey together.
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Social Links */}
                        {friend.socialLinks && Object.keys(friend.socialLinks).length > 0 && (
                            <motion.div
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                                variants={staggerItem}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Connect with {friend.name}
                                </h3>
                                <SocialLinks
                                    socialLinks={friend.socialLinks}
                                    size="large"
                                    layout="vertical"
                                    showLabels={true}
                                    className="space-y-3"
                                />
                            </motion.div>
                        )}

                        {/* Related Friends */}
                        {relatedFriends.length > 0 && (
                            <motion.div
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                                variants={staggerItem}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <HiUsers className="w-5 h-5 mr-2 text-blue-500" />
                                    Shared Memories With
                                </h3>
                                <div className="space-y-3">
                                    {relatedFriends.map((relatedFriend, index) => (
                                        <Link
                                            key={relatedFriend.id}
                                            href={`/friends/${relatedFriend.id}`}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">
                                                    {relatedFriend.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {relatedFriend.name}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {relatedFriend.funnyName}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Quick Stats */}
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                            variants={staggerItem}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Quick Stats
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Memories</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {friend.favoriteMemories?.length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Social Links</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {Object.keys(friend.socialLinks || {}).length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">College Years</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {new Date().getFullYear() - friend.joinYear + 1}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}