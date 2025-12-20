'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CardProps } from '@/types/components';

const cardVariants = cva(
  'rounded-xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white border border-dafel-slate-200 shadow-soft',
        elevated: 'bg-white shadow-medium',
        outlined: 'bg-transparent border-2 border-dafel-slate-200',
        glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-soft',
      },
      padding: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

const Card = forwardRef<HTMLDivElement, CardProps & VariantProps<typeof cardVariants>>(
  (
    {
      className,
      variant,
      padding,
      hover = false,
      interactive = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const motionProps = hover || interactive ? {
      whileHover: { 
        y: -4, 
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.3 }
      },
      transition: { duration: 0.3 }
    } : {};

    const Component = onClick ? motion.button : motion.div;

    return (
      <Component
        className={cn(
          cardVariants({ variant, padding }),
          interactive && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dafel-blue-500',
          className
        )}
        ref={ref as any}
        onClick={onClick}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export default Card;