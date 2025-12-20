'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface IconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean;
  color?: 'current' | 'primary' | 'secondary' | 'accent' | 'muted' | 'success' | 'warning' | 'error';
}

const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
};

const iconColors = {
  current: 'text-current',
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  muted: 'text-muted-foreground',
  success: 'text-accent-600',
  warning: 'text-warning-500',
  error: 'text-error-500',
};

// Base Icon Component
const BaseIcon: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 'md',
  className,
  animate = false,
  color = 'current',
  children,
}) => {
  const IconWrapper = animate ? motion.svg : 'svg';
  
  const animationProps = animate
    ? {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        transition: { type: 'spring', stiffness: 400, damping: 10 },
      }
    : {};

  return (
    <IconWrapper
      className={cn(
        iconSizes[size],
        iconColors[color],
        'flex-shrink-0',
        className
      )}
      fill="currentColor"
      viewBox="0 0 24 24"
      {...animationProps}
    >
      {children}
    </IconWrapper>
  );
};

// === BUSINESS & TECHNOLOGY ICONS ===

export const AIBrainIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C15.1 7 16 7.9 16 9V10.29C16.39 10.11 16.83 10 17.3 10H18C19.1 10 20 10.9 20 12C20 13.1 19.1 14 18 14H17.3C16.83 14 16.39 13.89 16 13.71V15C16 16.1 15.1 17 14 17H13V18.27C13.6 18.61 14 19.26 14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20C10 19.26 10.4 18.61 11 18.27V17H10C8.9 17 8 16.1 8 15V13.71C7.61 13.89 7.17 14 6.7 14H6C4.9 14 4 13.1 4 12C4 10.9 4.9 10 6 10H6.7C7.17 10 7.61 10.11 8 10.29V9C8 7.9 8.9 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2M12 4.5C11.17 4.5 10.5 3.83 10.5 3C10.5 2.17 11.17 1.5 12 1.5C12.83 1.5 13.5 2.17 13.5 3C13.5 3.83 12.83 4.5 12 4.5Z"/>
  </BaseIcon>
);

export const DatabaseIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </BaseIcon>
);

export const CloudIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
  </BaseIcon>
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
    <path d="m9 12 2 2 4-4"/>
  </BaseIcon>
);

export const TrendingUpIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
    <polyline points="16,7 22,7 22,13"/>
  </BaseIcon>
);

export const ZapIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
  </BaseIcon>
);

export const RocketIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </BaseIcon>
);

// === USER INTERFACE ICONS ===

export const MenuIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="4" x2="20" y1="6" y2="6"/>
    <line x1="4" x2="20" y1="12" y2="12"/>
    <line x1="4" x2="20" y1="18" y2="18"/>
  </BaseIcon>
);

export const CloseIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="m18 6-12 12"/>
    <path d="m6 6 12 12"/>
  </BaseIcon>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="m6 9 6 6 6-6"/>
  </BaseIcon>
);

export const ChevronRightIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="m9 18 6-6-6-6"/>
  </BaseIcon>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </BaseIcon>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </BaseIcon>
);

export const BellIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </BaseIcon>
);

export const UserIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </BaseIcon>
);

// === ACTION ICONS ===

export const PlusIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M5 12h14"/>
    <path d="M12 5v14"/>
  </BaseIcon>
);

export const MinusIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M5 12h14"/>
  </BaseIcon>
);

export const EditIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="m18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
  </BaseIcon>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </BaseIcon>
);

export const SaveIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </BaseIcon>
);

export const CopyIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </BaseIcon>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" x2="12" y1="15" y2="3"/>
  </BaseIcon>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17,8 12,3 7,8"/>
    <line x1="12" x2="12" y1="3" y2="15"/>
  </BaseIcon>
);

// === STATUS ICONS ===

export const CheckIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="20,6 9,17 4,12"/>
  </BaseIcon>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </BaseIcon>
);

export const AlertCircleIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y1="16" y2="16"/>
  </BaseIcon>
);

export const InfoIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10"/>
    <path d="m12 16 0-4"/>
    <path d="m12 8 0 0"/>
  </BaseIcon>
);

export const LoadingIcon: React.FC<IconProps> = ({ animate = true, ...props }) => (
  <BaseIcon {...props} animate={animate}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </BaseIcon>
);

// === BRAND & COMMUNICATION ICONS ===

export const MailIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-10 5L2 7"/>
  </BaseIcon>
);

export const PhoneIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </BaseIcon>
);

export const GlobeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10"/>
    <path d="m2 12 20 0"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </BaseIcon>
);

export const LinkIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </BaseIcon>
);

// === EXPORT ALL ICONS ===
export const icons = {
  // Business & Technology
  AIBrainIcon,
  DatabaseIcon,
  CloudIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  ZapIcon,
  RocketIcon,
  
  // User Interface
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  SettingsIcon,
  BellIcon,
  UserIcon,
  
  // Actions
  PlusIcon,
  MinusIcon,
  EditIcon,
  TrashIcon,
  SaveIcon,
  CopyIcon,
  DownloadIcon,
  UploadIcon,
  
  // Status
  CheckIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  LoadingIcon,
  
  // Brand & Communication
  MailIcon,
  PhoneIcon,
  GlobeIcon,
  LinkIcon,
};

export type IconName = keyof typeof icons;