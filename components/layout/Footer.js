'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  HiHeart,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiExternalLink
} from 'react-icons/hi';
import { 
  FaInstagram, 
  FaTwitter, 
  FaFacebook, 
  FaLinkedin,
  FaGithub
} from 'react-icons/fa';
import { APP_METADATA, NAVIGATION_ITEMS } from '../../lib/constants';
import { containerVariants, staggerItem } from '../../lib/animations';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/college-memories',
      icon: FaInstagram,
      color: 'hover:text-pink-500',
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/college-memories',
      icon: FaTwitter,
      color: 'hover:text-blue-400',
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/college-memories',
      icon: FaFacebook,
      color: 'hover:text-blue-600',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/college-memories',
      icon: FaLinkedin,
      color: 'hover:text-blue-700',
    },
    {
      name: 'GitHub',
      href: 'https://github.com/college-memories',
      icon: FaGithub,
      color: 'hover:text-gray-900 dark:hover:text-white',
    },
  ];

  const contactInfo = [
    {
      icon: HiMail,
      label: 'Email',
      value: 'memories@college.edu',
      href: 'mailto:memories@college.edu',
    },
    {
      icon: HiPhone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: HiLocationMarker,
      label: 'Location',
      value: 'College Campus, City, State',
      href: 'https://maps.google.com',
    },
  ];

  return (
    <motion.footer
      className="bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div variants={staggerItem} className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">CM</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">College Memories</h3>
                <p className="text-gray-400 text-sm">2022-2025</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Preserving and celebrating the unforgettable moments of our college journey. 
              From friendships to achievements, every memory tells our story.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-gray-800 text-gray-400 transition-all duration-200 ${social.color} hover:bg-gray-700 hover:scale-110`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={staggerItem}>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {item.name}
                    </span>
                    <HiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={staggerItem}>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-4">
              {contactInfo.map((contact) => {
                const Icon = contact.icon;
                return (
                  <li key={contact.label}>
                    <a
                      href={contact.href}
                      className="flex items-start space-x-3 text-gray-400 hover:text-white transition-colors duration-200 group"
                    >
                      <Icon className="w-5 h-5 mt-0.5 text-blue-400 group-hover:text-blue-300" />
                      <div>
                        <p className="text-sm font-medium text-gray-300">{contact.label}</p>
                        <p className="text-sm">{contact.value}</p>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* College Info */}
          <motion.div variants={staggerItem}>
            <h4 className="text-lg font-semibold mb-4">College Journey</h4>
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h5 className="font-medium text-blue-400 mb-2">Our Story</h5>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Four amazing years of growth, friendship, and unforgettable memories 
                  at {APP_METADATA.collegeName}.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">13</p>
                  <p className="text-xs text-gray-400">Friends</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">4</p>
                  <p className="text-xs text-gray-400">Years</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-800 mt-12 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <HiHeart className="w-4 h-4 text-red-500" />
              </motion.div>
              <span>by the College Memory Gallery Team</span>
            </div>
            
            <div className="text-sm text-gray-400">
              <p>&copy; {currentYear} College Memory Gallery. All rights reserved.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}