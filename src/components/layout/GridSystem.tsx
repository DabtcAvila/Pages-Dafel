'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// === CONTAINER COMPONENT ===
export interface ContainerProps extends HTMLMotionProps<'div'> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
  children?: React.ReactNode;
}

const containerSizes = {
  sm: 'container-sm',
  md: 'container-md',
  lg: 'container-lg',
  xl: 'container-xl',
  '2xl': 'container-2xl',
  full: 'w-full',
};

const containerPadding = {
  none: '',
  sm: 'px-4',
  md: 'px-6 lg:px-8',
  lg: 'px-8 lg:px-12',
};

export const Container: React.FC<ContainerProps> = ({
  size = 'xl',
  padding = 'md',
  center = true,
  className,
  children,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        'w-full',
        containerSizes[size],
        containerPadding[padding],
        center && 'mx-auto',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// === GRID COMPONENT ===
export interface GridProps extends HTMLMotionProps<'div'> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' | 'fit';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    xs?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    '2xl'?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
  minItemWidth?: string;
  children?: React.ReactNode;
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
  auto: 'grid-cols-auto',
  fit: 'grid-cols-fit',
};

const gridGaps = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

const responsiveGridCols = {
  xs: {
    1: 'xs:grid-cols-1',
    2: 'xs:grid-cols-2',
    3: 'xs:grid-cols-3',
    4: 'xs:grid-cols-4',
    5: 'xs:grid-cols-5',
    6: 'xs:grid-cols-6',
    12: 'xs:grid-cols-12',
  },
  sm: {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
    6: 'sm:grid-cols-6',
    12: 'sm:grid-cols-12',
  },
  md: {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
    12: 'md:grid-cols-12',
  },
  lg: {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
    12: 'lg:grid-cols-12',
  },
  xl: {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6',
    12: 'xl:grid-cols-12',
  },
  '2xl': {
    1: '2xl:grid-cols-1',
    2: '2xl:grid-cols-2',
    3: '2xl:grid-cols-3',
    4: '2xl:grid-cols-4',
    5: '2xl:grid-cols-5',
    6: '2xl:grid-cols-6',
    12: '2xl:grid-cols-12',
  },
};

export const Grid: React.FC<GridProps> = ({
  cols = 'auto',
  gap = 'md',
  responsive = {},
  minItemWidth,
  className,
  children,
  style,
  ...props
}) => {
  const responsiveClasses = Object.entries(responsive)
    .map(([breakpoint, cols]) => 
      responsiveGridCols[breakpoint as keyof typeof responsiveGridCols]?.[cols as keyof typeof responsiveGridCols.xs]
    )
    .filter(Boolean);

  const gridStyle = minItemWidth
    ? { 
        ...style,
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))` 
      }
    : style;

  return (
    <motion.div
      className={cn(
        'grid',
        typeof cols === 'string' && cols !== 'auto' && cols !== 'fit' ? gridCols[cols] : gridCols[cols as keyof typeof gridCols],
        gridGaps[gap],
        ...responsiveClasses,
        className
      )}
      style={gridStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// === FLEX COMPONENT ===
export interface FlexProps extends HTMLMotionProps<'div'> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean | 'reverse';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    xs?: Partial<Pick<FlexProps, 'direction' | 'align' | 'justify'>>;
    sm?: Partial<Pick<FlexProps, 'direction' | 'align' | 'justify'>>;
    md?: Partial<Pick<FlexProps, 'direction' | 'align' | 'justify'>>;
    lg?: Partial<Pick<FlexProps, 'direction' | 'align' | 'justify'>>;
    xl?: Partial<Pick<FlexProps, 'direction' | 'align' | 'justify'>>;
  };
  children?: React.ReactNode;
}

const flexDirection = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
};

const flexAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const flexJustify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const flexGaps = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

export const Flex: React.FC<FlexProps> = ({
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'md',
  responsive = {},
  className,
  children,
  ...props
}) => {
  const wrapClass = wrap === true ? 'flex-wrap' : wrap === 'reverse' ? 'flex-wrap-reverse' : 'flex-nowrap';

  const responsiveClasses = Object.entries(responsive).flatMap(([breakpoint, styles]) => {
    const prefix = breakpoint === 'xs' ? 'xs:' : `${breakpoint}:`;
    const classes = [];
    
    if (styles?.direction) classes.push(`${prefix}${flexDirection[styles.direction]}`);
    if (styles?.align) classes.push(`${prefix}${flexAlign[styles.align]}`);
    if (styles?.justify) classes.push(`${prefix}${flexJustify[styles.justify]}`);
    
    return classes;
  });

  return (
    <motion.div
      className={cn(
        'flex',
        flexDirection[direction],
        flexAlign[align],
        flexJustify[justify],
        wrapClass,
        flexGaps[gap],
        ...responsiveClasses,
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// === STACK COMPONENT ===
export interface StackProps extends Omit<FlexProps, 'direction'> {
  horizontal?: boolean;
  children?: React.ReactNode;
}

export const Stack: React.FC<StackProps> = ({
  horizontal = false,
  children,
  ...props
}) => {
  return (
    <Flex direction={horizontal ? 'row' : 'col'} {...props}>
      {children}
    </Flex>
  );
};

// === SECTION COMPONENT ===
export interface SectionProps extends HTMLMotionProps<'section'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'muted' | 'card' | 'primary' | 'gradient';
  fullHeight?: boolean;
  children?: React.ReactNode;
}

const sectionSizes = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
};

const sectionBackgrounds = {
  transparent: 'bg-transparent',
  muted: 'bg-muted',
  card: 'bg-card',
  primary: 'bg-primary text-primary-foreground',
  gradient: 'bg-gradient-to-br from-primary/5 via-transparent to-accent/5',
};

export const Section: React.FC<SectionProps> = ({
  size = 'md',
  background = 'transparent',
  fullHeight = false,
  className,
  children,
  ...props
}) => {
  return (
    <motion.section
      className={cn(
        sectionSizes[size],
        sectionBackgrounds[background],
        fullHeight && 'min-h-screen flex items-center',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      {...props}
    >
      {children}
    </motion.section>
  );
};

// === MASONRY GRID COMPONENT ===
export interface MasonryProps extends HTMLMotionProps<'div'> {
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    xs?: 1 | 2 | 3;
    sm?: 1 | 2 | 3 | 4;
    md?: 2 | 3 | 4 | 5;
    lg?: 2 | 3 | 4 | 5 | 6;
    xl?: 3 | 4 | 5 | 6;
  };
  children?: React.ReactNode;
}

const masonryColumns = {
  2: 'columns-2',
  3: 'columns-3',
  4: 'columns-4',
  5: 'columns-5',
  6: 'columns-6',
};

const masonryGaps = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

export const Masonry: React.FC<MasonryProps> = ({
  columns = 3,
  gap = 'md',
  responsive = {},
  className,
  children,
  ...props
}) => {
  const responsiveClasses = Object.entries(responsive)
    .map(([breakpoint, cols]) => {
      const prefix = breakpoint === 'xs' ? 'xs:' : `${breakpoint}:`;
      return `${prefix}columns-${cols}`;
    });

  return (
    <motion.div
      className={cn(
        masonryColumns[columns],
        masonryGaps[gap],
        ...responsiveClasses,
        'space-y-4',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="break-inside-avoid"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// === PRESET LAYOUTS ===
export const HeroLayout: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <Section size="xl" fullHeight className={cn('text-center', className)}>
    <Container>
      <Stack align="center" gap="lg">
        {children}
      </Stack>
    </Container>
  </Section>
);

export const FeatureGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <Section size="lg" className={className}>
    <Container>
      <Grid 
        cols={3} 
        gap="lg"
        responsive={{
          xs: 1,
          md: 2,
          lg: 3,
        }}
      >
        {children}
      </Grid>
    </Container>
  </Section>
);

export const TwoColumnLayout: React.FC<{ 
  left: React.ReactNode; 
  right: React.ReactNode; 
  reverse?: boolean;
  className?: string;
}> = ({ left, right, reverse = false, className }) => (
  <Section size="lg" className={className}>
    <Container>
      <Grid 
        cols={2} 
        gap="xl"
        responsive={{
          xs: 1,
          lg: 2,
        }}
        className={reverse ? 'lg:grid-flow-col-dense' : ''}
      >
        <div className={reverse ? 'lg:col-start-2' : ''}>{left}</div>
        <div className={reverse ? 'lg:col-start-1' : ''}>{right}</div>
      </Grid>
    </Container>
  </Section>
);