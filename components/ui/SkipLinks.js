'use client';

import React from 'react';
import { generateSkipLinks } from '@/lib/accessibility';

/**
 * Skip links component for keyboard accessibility
 * Allows keyboard users to skip to main content areas
 */
const SkipLinks = () => {
  const skipLinks = generateSkipLinks();
  
  return (
    <div className="skip-links">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded-md"
          onClick={(e) => {
            // Ensure the target exists
            const target = document.querySelector(link.href);
            if (target) {
              e.preventDefault();
              target.setAttribute('tabindex', '-1');
              target.focus();
              
              // Remove tabindex after focus
              setTimeout(() => {
                target.removeAttribute('tabindex');
              }, 1000);
            }
          }}
        >
          {link.text}
        </a>
      ))}
      
      <style jsx>{`
        .skip-links {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }
      `}</style>
    </div>
  );
};

export default SkipLinks;