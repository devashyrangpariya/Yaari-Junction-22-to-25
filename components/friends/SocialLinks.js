// components/friends/SocialLinks.js
'use client';

import { motion } from 'framer-motion';
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

const socialConfig = {
  instagram: {
    icon: FaInstagram,
    color: 'text-pink-500',
    hoverColor: 'hover:text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    hoverBgColor: 'hover:bg-pink-100 dark:hover:bg-pink-900/30',
    label: 'Instagram',
  },
  twitter: {
    icon: FaTwitter,
    color: 'text-blue-400',
    hoverColor: 'hover:text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    hoverBgColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    label: 'Twitter',
  },
  linkedin: {
    icon: FaLinkedin,
    color: 'text-blue-600',
    hoverColor: 'hover:text-blue-700',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    hoverBgColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    label: 'LinkedIn',
  },
  facebook: {
    icon: FaFacebook,
    color: 'text-blue-700',
    hoverColor: 'hover:text-blue-800',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    hoverBgColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    label: 'Facebook',
  },
};

export default function SocialLinks({ 
  socialLinks, 
  size = 'medium', 
  layout = 'horizontal', 
  showLabels = false,
  className = '' 
}) {
  if (!socialLinks || Object.keys(socialLinks).length === 0) {
    return null;
  }

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const containerClasses = {
    small: 'p-1.5',
    medium: 'p-2',
    large: 'p-3',
  };

  const handleSocialClick = (url, platform) => {
    // Track social media click analytics here if needed
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col space-y-2' : 'space-x-2'} ${className}`}>
      {Object.entries(socialLinks).map(([platform, url]) => {
        const config = socialConfig[platform];
        if (!config) return null;

        const { icon: IconComponent, color, hoverColor, bgColor, hoverBgColor, label } = config;

        return (
          <motion.button
            key={platform}
            onClick={() => handleSocialClick(url, platform)}
            className={`
              inline-flex items-center justify-center rounded-full transition-all duration-200
              ${containerClasses[size]} ${bgColor} ${hoverBgColor} ${color} ${hoverColor}
              ${showLabels ? 'px-4 py-2 space-x-2' : ''}
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={`Visit ${label} profile`}
            aria-label={`Visit ${label} profile`}
          >
            <IconComponent className={sizeClasses[size]} />
            {showLabels && (
              <span className="text-sm font-medium capitalize">
                {platform}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}