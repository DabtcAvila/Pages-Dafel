'use client';

import { lazy, Suspense, ComponentType, HTMLAttributes } from 'react';
import { HTMLMotionProps } from 'framer-motion';

// Lazy load framer-motion components
const LazyMotionDiv = lazy(() => 
  import('framer-motion').then(mod => ({ default: mod.motion.div }))
);
const LazyMotionNav = lazy(() => 
  import('framer-motion').then(mod => ({ default: mod.motion.nav }))
);
const LazyAnimatePresence = lazy(() =>
  import('framer-motion').then(mod => ({ default: mod.AnimatePresence }))
);

// Loading fallback components
const FallbackDiv = ({ children, className, style, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={className} style={style} {...props}>{children}</div>
);

const FallbackNav = ({ children, className, style, ...props }: HTMLAttributes<HTMLElement>) => (
  <nav className={className} style={style} {...props}>{children}</nav>
);

// Wrapper components with Suspense
export const MotionDiv = (props: HTMLMotionProps<'div'>) => (
  <Suspense fallback={<FallbackDiv {...props} />}>
    <LazyMotionDiv {...props} />
  </Suspense>
);

export const MotionNav = (props: HTMLMotionProps<'nav'>) => (
  <Suspense fallback={<FallbackNav {...props} />}>
    <LazyMotionNav {...props} />
  </Suspense>
);

export const AnimatePresence = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
  <Suspense fallback={<>{children}</>}>
    <LazyAnimatePresence {...props}>
      {children}
    </LazyAnimatePresence>
  </Suspense>
);

export default { MotionDiv, MotionNav, AnimatePresence };