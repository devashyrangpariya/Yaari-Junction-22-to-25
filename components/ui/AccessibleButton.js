'use client';

import { forwardRef, useRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { buttonVariants } from '../../lib/animations';
import { KEYBOARD_KEYS, announceToScreenReader } from '../../lib/accessibility';

const AccessibleButton = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  onKeyDown,
  className,
  type = 'button',
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaPressed,
  ariaControls,
  role = 'button',
  tabIndex = 0,
  autoFocus = false,
  loadingText = 'Loading...',
  successText,
  errorText,
  announceActions = false,
  ...props
}, ref) => {
  const buttonRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => buttonRef.current?.focus(),
    blur: () => buttonRef.current?.blur(),
    click: () => buttonRef.current?.click()
  }));

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 active:bg-blue-800',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:focus:ring-gray-400',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500 active:bg-blue-700 active:border-blue-700',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 active:bg-red-800',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 active:bg-green-800',
    gradient: 'gradient-primary text-white hover:opacity-90 focus:ring-blue-500 active:opacity-80',
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm min-h-8',
    medium: 'px-4 py-2 text-base min-h-10',
    large: 'px-6 py-3 text-lg min-h-12',
    xlarge: 'px-8 py-4 text-xl min-h-14',
  };

  // Touch-friendly minimum sizes for mobile
  const touchSizes = {
    small: 'min-h-11 min-w-11 sm:min-h-8 sm:min-w-auto',
    medium: 'min-h-12 min-w-12 sm:min-h-10 sm:min-w-auto',
    large: 'min-h-14 min-w-14 sm:min-h-12 sm:min-w-auto',
    xlarge: 'min-h-16 min-w-16 sm:min-h-14 sm:min-w-auto',
  };
  
  const buttonClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    touchSizes[size],
    className
  );

  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }

    if (announceActions && successText) {
      announceToScreenReader(successText, 'polite');
    }

    onClick?.(event);
  };

  const handleKeyDown = (event) => {
    // Handle keyboard activation
    if (event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE) {
      event.preventDefault();
      handleClick(event);
    }

    onKeyDown?.(event);
  };

  // Generate accessible label
  const getAccessibleLabel = () => {
    if (loading) return loadingText;
    if (ariaLabel) return ariaLabel;
    if (typeof children === 'string') return children;
    return 'Button';
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <motion.div
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      aria-hidden="true"
    />
  );

  return (
    <motion.button
      ref={buttonRef}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type={type}
      role={role}
      tabIndex={disabled ? -1 : tabIndex}
      autoFocus={autoFocus}
      aria-label={getAccessibleLabel()}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      aria-controls={ariaControls}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      variants={buttonVariants}
      initial="idle"
      whileHover={!disabled && !loading ? "hover" : "idle"}
      whileTap={!disabled && !loading ? "tap" : "idle"}
      {...props}
    >
      {loading && <LoadingSpinner />}
      
      {/* Screen reader only loading text */}
      {loading && (
        <span className="sr-only">
          {loadingText}
        </span>
      )}
      
      {/* Button content */}
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
    </motion.button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;

// Specialized button variants with built-in accessibility
export const IconButton = forwardRef(({
  icon: Icon,
  label,
  size = 'medium',
  className,
  ...props
}, ref) => {
  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
    xlarge: 'w-8 h-8'
  };

  return (
    <AccessibleButton
      ref={ref}
      size={size}
      ariaLabel={label}
      className={cn('p-2', className)}
      {...props}
    >
      <Icon className={iconSizes[size]} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </AccessibleButton>
  );
});

IconButton.displayName = 'IconButton';

export const ToggleButton = forwardRef(({
  pressed = false,
  onToggle,
  pressedLabel,
  unpressedLabel,
  children,
  ...props
}, ref) => {
  const handleClick = (event) => {
    onToggle?.(!pressed, event);
  };

  return (
    <AccessibleButton
      ref={ref}
      onClick={handleClick}
      ariaPressed={pressed}
      ariaLabel={pressed ? pressedLabel : unpressedLabel}
      announceActions={true}
      successText={pressed ? pressedLabel : unpressedLabel}
      {...props}
    >
      {children}
    </AccessibleButton>
  );
});

ToggleButton.displayName = 'ToggleButton';

export const MenuButton = forwardRef(({
  expanded = false,
  onToggle,
  menuId,
  children,
  ...props
}, ref) => {
  const handleClick = (event) => {
    onToggle?.(!expanded, event);
  };

  return (
    <AccessibleButton
      ref={ref}
      onClick={handleClick}
      ariaExpanded={expanded}
      ariaControls={menuId}
      ariaLabel={expanded ? 'Close menu' : 'Open menu'}
      {...props}
    >
      {children}
    </AccessibleButton>
  );
});

MenuButton.displayName = 'MenuButton';