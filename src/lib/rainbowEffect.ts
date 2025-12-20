// Windsurf-style rainbow color cycling system
export class RainbowEffect {
  private element: HTMLElement;
  private colors: string[];
  private currentIndex: number;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.colors = [
      'hsl(0deg, 96%, 55%)',    // red
      'hsl(25deg, 100%, 50%)',  // orange  
      'hsl(40deg, 100%, 50%)',  // yellow
      'hsl(130deg, 100%, 40%)', // green
      'hsl(180deg, 100%, 40%)', // cyan
      'hsl(230deg, 100%, 45%)', // blue
      'hsl(260deg, 100%, 55%)', // violet
      'hsl(300deg, 100%, 50%)', // magenta
    ];
    this.currentIndex = 0;
    this.start();
  }

  start() {
    // Initial color setup
    this.updateColors();
    
    // Start color cycling
    this.intervalId = setInterval(() => {
      this.updateColors();
    }, 3000); // Change colors every 3 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private updateColors() {
    const color1 = this.colors[this.currentIndex];
    const color2 = this.colors[(this.currentIndex + 1) % this.colors.length];
    const color3 = this.colors[(this.currentIndex + 2) % this.colors.length];
    const color4 = this.colors[(this.currentIndex + 3) % this.colors.length];
    const color5 = this.colors[(this.currentIndex + 4) % this.colors.length];

    // Register CSS custom properties if Houdini is available
    if ('CSS' in window && 'registerProperty' in (CSS as any)) {
      try {
        (CSS as any).registerProperty({
          name: '--color-1',
          syntax: '<color>',
          inherits: false,
          initialValue: color1
        });
        (CSS as any).registerProperty({
          name: '--color-2',
          syntax: '<color>',
          inherits: false,
          initialValue: color2
        });
        (CSS as any).registerProperty({
          name: '--color-3',
          syntax: '<color>',
          inherits: false,
          initialValue: color3
        });
        (CSS as any).registerProperty({
          name: '--color-4',
          syntax: '<color>',
          inherits: false,
          initialValue: color4
        });
        (CSS as any).registerProperty({
          name: '--color-5',
          syntax: '<color>',
          inherits: false,
          initialValue: color5
        });
      } catch (e) {
        // Properties already registered or not supported
      }
    }

    // Update CSS custom properties
    this.element.style.setProperty('--color-1', color1);
    this.element.style.setProperty('--color-2', color2);
    this.element.style.setProperty('--color-3', color3);
    this.element.style.setProperty('--color-4', color4);
    this.element.style.setProperty('--color-5', color5);

    // Move to next color set
    this.currentIndex = (this.currentIndex + 1) % this.colors.length;
  }
}

// Scroll animation observer
export const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  // Observe all elements with animation class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  return observer;
};

// Initialize rainbow effects on page load
export const initRainbowEffects = () => {
  const rainbowElements = document.querySelectorAll('.rainbow-background');
  const effects: RainbowEffect[] = [];

  rainbowElements.forEach(element => {
    const effect = new RainbowEffect(element as HTMLElement);
    effects.push(effect);
  });

  // Return cleanup function
  return () => {
    effects.forEach(effect => effect.stop());
  };
};

// Performance optimizations
export const optimizeAnimations = () => {
  // Reduce motion for accessibility
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  }

  // Add GPU acceleration to animated elements
  document.querySelectorAll('.rainbow-background, .rainbow-gradient').forEach(element => {
    (element as HTMLElement).style.willChange = 'transform, background-position';
    (element as HTMLElement).style.transform = 'translateZ(0)';
    (element as HTMLElement).style.backfaceVisibility = 'hidden';
  });
};