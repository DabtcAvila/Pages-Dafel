'use client';

import { memo, useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { VirtualList } from './VirtualList';

// Memoized component for expensive renders
export const MemoizedCard = memo(function Card({ 
  title, 
  content, 
  onClick,
  isSelected 
}: { 
  title: string; 
  content: string; 
  onClick: (id: string) => void;
  isSelected: boolean;
}) {
  // Memoize the click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    onClick(title);
  }, [onClick, title]);

  return (
    <div
      className={`
        p-4 rounded-lg border transition-all duration-200
        ${isSelected ? 'bg-primary-50 border-primary-500' : 'bg-white border-gray-200'}
        hover:shadow-md cursor-pointer
      `}
      onClick={handleClick}
    >
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );
});

// Optimized list component with virtual scrolling
export const OptimizedDataList = memo(function OptimizedDataList({
  data,
  onItemClick,
  selectedItem
}: {
  data: Array<{ id: string; title: string; content: string }>;
  onItemClick: (id: string) => void;
  selectedItem?: string;
}) {
  // Memoize the render function to prevent re-creation
  const renderItem = useCallback((item: { id: string; title: string; content: string }, index: number) => (
    <MemoizedCard
      key={item.id}
      title={item.title}
      content={item.content}
      onClick={onItemClick}
      isSelected={selectedItem === item.id}
    />
  ), [onItemClick, selectedItem]);

  // Only use virtual scrolling for large datasets
  if (data.length > 100) {
    return (
      <VirtualList
        items={data}
        itemHeight={120}
        containerHeight={600}
        renderItem={renderItem}
        getItemKey={(item) => item.id}
        className="space-y-2 p-4"
      />
    );
  }

  // Regular rendering for smaller datasets
  return (
    <div className="space-y-2 p-4">
      {data.map((item, index) => (
        <div key={item.id}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
});

// Debounced search component
export function DebouncedSearch({
  onSearch,
  placeholder = "Search...",
  debounceMs = 300
}: {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}) {
  const [query, setQuery] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search effect
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, onSearch, debounceMs]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    />
  );
}

// Lazy loaded component
export function LazyLoadComponent({
  children,
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  rootMargin = '50px'
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isIntersecting ? children : fallback}
    </div>
  );
}

// Performance monitoring hook
export function usePerformanceMonitoring(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
}

// Heavy computation with useMemo
export function useExpensiveComputation<T>(
  data: T[],
  computeFn: (data: T[]) => any,
  deps: React.DependencyList
) {
  return useMemo(() => {
    const start = performance.now();
    const result = computeFn(data);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Expensive computation took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }, [data, ...deps]);
}