'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Input,
  Badge,
  Container,
  Grid,
  Section,
  Stack,
  TiltCard,
  GlowCard,
  MagneticButton,
  RippleButton,
  FloatingActionButton,
  AIBrainIcon,
  DatabaseIcon,
  CloudIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  ZapIcon,
  RocketIcon,
  CheckCircleIcon,
  cn,
} from './ui';

export const DesignSystemShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = React.useState<string>('colors');

  const demos = [
    { id: 'colors', label: 'Color Palette', icon: <ZapIcon size="sm" /> },
    { id: 'typography', label: 'Typography', icon: <AIBrainIcon size="sm" /> },
    { id: 'components', label: 'Components', icon: <DatabaseIcon size="sm" /> },
    { id: 'interactions', label: 'Interactions', icon: <RocketIcon size="sm" /> },
    { id: 'layouts', label: 'Layouts', icon: <CloudIcon size="sm" /> },
  ];

  const colorPalettes = [
    {
      name: 'Primary',
      colors: [
        { name: '50', value: 'var(--color-primary-50)', class: 'bg-primary-50' },
        { name: '100', value: 'var(--color-primary-100)', class: 'bg-primary-100' },
        { name: '200', value: 'var(--color-primary-200)', class: 'bg-primary-200' },
        { name: '300', value: 'var(--color-primary-300)', class: 'bg-primary-300' },
        { name: '400', value: 'var(--color-primary-400)', class: 'bg-primary-400' },
        { name: '500', value: 'var(--color-primary-500)', class: 'bg-primary-500' },
        { name: '600', value: 'var(--color-primary-600)', class: 'bg-primary-600' },
        { name: '700', value: 'var(--color-primary-700)', class: 'bg-primary-700' },
        { name: '800', value: 'var(--color-primary-800)', class: 'bg-primary-800' },
        { name: '900', value: 'var(--color-primary-900)', class: 'bg-primary-900' },
      ],
    },
    {
      name: 'Secondary',
      colors: [
        { name: '50', value: 'var(--color-secondary-50)', class: 'bg-secondary-50' },
        { name: '100', value: 'var(--color-secondary-100)', class: 'bg-secondary-100' },
        { name: '200', value: 'var(--color-secondary-200)', class: 'bg-secondary-200' },
        { name: '300', value: 'var(--color-secondary-300)', class: 'bg-secondary-300' },
        { name: '400', value: 'var(--color-secondary-400)', class: 'bg-secondary-400' },
        { name: '500', value: 'var(--color-secondary-500)', class: 'bg-secondary-500' },
        { name: '600', value: 'var(--color-secondary-600)', class: 'bg-secondary-600' },
        { name: '700', value: 'var(--color-secondary-700)', class: 'bg-secondary-700' },
        { name: '800', value: 'var(--color-secondary-800)', class: 'bg-secondary-800' },
        { name: '900', value: 'var(--color-secondary-900)', class: 'bg-secondary-900' },
      ],
    },
    {
      name: 'Accent',
      colors: [
        { name: '50', value: 'var(--color-accent-50)', class: 'bg-accent-50' },
        { name: '100', value: 'var(--color-accent-100)', class: 'bg-accent-100' },
        { name: '200', value: 'var(--color-accent-200)', class: 'bg-accent-200' },
        { name: '300', value: 'var(--color-accent-300)', class: 'bg-accent-300' },
        { name: '400', value: 'var(--color-accent-400)', class: 'bg-accent-400' },
        { name: '500', value: 'var(--color-accent-500)', class: 'bg-accent-500' },
        { name: '600', value: 'var(--color-accent-600)', class: 'bg-accent-600' },
        { name: '700', value: 'var(--color-accent-700)', class: 'bg-accent-700' },
        { name: '800', value: 'var(--color-accent-800)', class: 'bg-accent-800' },
        { name: '900', value: 'var(--color-accent-900)', class: 'bg-accent-900' },
      ],
    },
  ];

  const renderColorDemo = () => (
    <div className="space-y-8">
      {colorPalettes.map((palette) => (
        <div key={palette.name} className="space-y-4">
          <h3 className="text-xl font-semibold">{palette.name} Palette</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {palette.colors.map((color) => (
              <motion.div
                key={color.name}
                className="group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={cn('w-full h-16 rounded-lg border border-border', color.class)}
                />
                <div className="mt-1 text-xs text-center text-muted-foreground">
                  {color.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTypographyDemo = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Display Typography</h3>
        <div className="space-y-4">
          <div className="text-display-2xl">Display 2XL</div>
          <div className="text-display-xl">Display XL</div>
          <div className="text-display-lg">Display Large</div>
          <div className="text-display-md">Display Medium</div>
          <div className="text-display-sm">Display Small</div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Headings</h3>
        <div className="space-y-4">
          <h1>Heading 1 - Main Title</h1>
          <h2>Heading 2 - Section Title</h2>
          <h3>Heading 3 - Subsection</h3>
          <h4>Heading 4 - Component Title</h4>
          <h5>Heading 5 - Small Title</h5>
          <h6>Heading 6 - Micro Title</h6>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Body Text</h3>
        <div className="space-y-4">
          <p className="text-lead">
            Lead text - This is a lead paragraph that introduces the main content.
          </p>
          <p className="text-large">
            Large text - This is large body text for important content.
          </p>
          <p>
            Regular text - This is the standard body text used throughout the application.
          </p>
          <p className="text-small">
            Small text - This is smaller text used for secondary information.
          </p>
          <p className="text-muted">
            Muted text - This is muted text for less important information.
          </p>
        </div>
      </div>
    </div>
  );

  const renderComponentsDemo = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="sm">Primary Small</Button>
          <Button variant="primary" size="md">Primary Medium</Button>
          <Button variant="primary" size="lg">Primary Large</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Badges</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Inputs</h3>
        <div className="max-w-md space-y-4">
          <Input placeholder="Default input" />
          <Input 
            label="Email Address"
            placeholder="Enter your email"
            hint="We'll never share your email"
          />
          <Input 
            label="Password"
            type="password"
            error="Password must be at least 8 characters"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Cards</h3>
        <Grid cols={3} responsive={{ xs: 1, md: 2, lg: 3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Basic Card</CardTitle>
              <CardDescription>A simple card with basic content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area.</p>
            </CardContent>
          </Card>
          
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>A card with glassmorphism effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has a glass-like appearance.</p>
            </CardContent>
          </Card>
          
          <Card variant="interactive">
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>A card with hover effects</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card responds to interactions.</p>
            </CardContent>
          </Card>
        </Grid>
      </div>
    </div>
  );

  const renderInteractionsDemo = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Magnetic Button</h3>
        <MagneticButton>
          Hover me - I follow your cursor!
        </MagneticButton>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Ripple Button</h3>
        <RippleButton>
          Click me for ripple effect!
        </RippleButton>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Tilt Cards</h3>
        <Grid cols={2} responsive={{ xs: 1, md: 2 }}>
          <TiltCard className="p-6 text-center">
            <h4 className="text-lg font-semibold mb-2">Tilt Card 1</h4>
            <p>Hover over me to see the 3D tilt effect!</p>
          </TiltCard>
          
          <GlowCard className="p-6 text-center">
            <h4 className="text-lg font-semibold mb-2">Glow Card</h4>
            <p>Move your cursor around to see the glow effect!</p>
          </GlowCard>
        </Grid>
      </div>
    </div>
  );

  const renderLayoutsDemo = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Grid System</h3>
        <Grid cols={4} gap="md" responsive={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <Card key={i} className="p-4 text-center">
              <span className="text-sm text-muted-foreground">Grid Item {i + 1}</span>
            </Card>
          ))}
        </Grid>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Stack Layout</h3>
        <Stack gap="md">
          <Card className="p-4">
            <span className="text-sm">Stacked Item 1</span>
          </Card>
          <Card className="p-4">
            <span className="text-sm">Stacked Item 2</span>
          </Card>
          <Card className="p-4">
            <span className="text-sm">Stacked Item 3</span>
          </Card>
        </Stack>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeDemo) {
      case 'colors':
        return renderColorDemo();
      case 'typography':
        return renderTypographyDemo();
      case 'components':
        return renderComponentsDemo();
      case 'interactions':
        return renderInteractionsDemo();
      case 'layouts':
        return renderLayoutsDemo();
      default:
        return renderColorDemo();
    }
  };

  return (
    <Section size="lg" className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Container size="2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-primary">
              <ShieldCheckIcon size="lg" />
              <span className="text-sm font-medium uppercase tracking-wide">Enterprise Grade</span>
            </div>
            <h1 className="text-display-lg gradient-text">
              Dafel Technologies
            </h1>
            <h2 className="text-display-sm">
              Premium Design System
            </h2>
            <p className="text-lead max-w-2xl mx-auto">
              A comprehensive design system inspired by Stripe, Figma, Linear, and Notion. 
              Built for enterprise-grade applications with sophisticated micro-interactions.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-2">
            {demos.map((demo) => (
              <Button
                key={demo.id}
                variant={activeDemo === demo.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveDemo(demo.id)}
                icon={demo.icon}
                iconPosition="left"
              >
                {demo.label}
              </Button>
            ))}
          </div>

          {/* Content */}
          <Card className="p-8">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {renderContent()}
            </motion.div>
          </Card>

          {/* Footer */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircleIcon size="sm" color="success" />
                <span>Enterprise Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon size="sm" color="success" />
                <span>Accessible</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon size="sm" color="success" />
                <span>Performance Optimized</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, Tailwind CSS, Framer Motion, and TypeScript
            </p>
          </div>
        </motion.div>
      </Container>
      
      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<TrendingUpIcon size="sm" />}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </Section>
  );
};