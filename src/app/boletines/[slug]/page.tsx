'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  TagIcon, 
  ShareIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getArticleBySlug, getLatestArticles } from '@/data/articles';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const article = getArticleBySlug(slug);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavButtonsVisible, setIsNavButtonsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Cerrar menú móvil y botones de navegación cuando se hace scroll
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      if (isNavButtonsVisible) {
        setIsNavButtonsVisible(false);
      }
      
      // Altura de la navbar (72px = h-18)
      const navbarHeight = 72;
      
      if (currentScrollY > lastScrollY && currentScrollY > navbarHeight) {
        // Scrolling hacia abajo - ocultar navbar
        setNavbarVisible(false);
      } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 10) {
        // Scrolling hacia arriba con movimiento mínimo - mostrar navbar
        setNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen, isNavButtonsVisible]);
  
  // Get related articles (exclude current article)
  const relatedArticles = getLatestArticles(4).filter(a => a.slug !== slug).slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
          <Link 
            href="/boletines" 
            className="text-blue-600 hover:text-blue-700"
          >
            Volver a boletines
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(article.title);
    
    let shareLink = '';
    
    switch (platform) {
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedTitle} ${encodedUrl}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodedTitle}&body=Te comparto este interesante artículo: ${encodedUrl}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
  };

  const formatContent = (content: string) => {
    // Convert markdown-like syntax to HTML
    // Process headers from most specific (####) to least specific (#)
    return content
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-bold text-gray-900 mb-3 mt-4">$1</h4>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-gray-900 mb-3 mt-6">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">$1</h1>')
      .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<div class="my-8"><img src="$2" alt="$1" class="w-full max-w-4xl mx-auto rounded-lg shadow-lg" /></div>')
      .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/- \*\*(.*?)\*\*: (.*$)/gm, '<li class="mb-2"><strong class="font-semibold text-gray-900">$1:</strong> $2</li>')
      .replace(/^- (.*$)/gm, '<li class="mb-1">$1</li>')
      .replace(/^(\d+)\. \*\*(.*?)\*\* (.*)$/gm, '<li class="mb-3"><strong class="font-semibold text-blue-600">$1. $2</strong> $3</li>')
      .replace(/^- \[ \] (.*$)/gm, '<li class="mb-1 flex items-center"><input type="checkbox" class="mr-2" disabled> $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      .replace(/^\n/, '<p class="mb-4 text-gray-700 leading-relaxed">')
      + '</p>';
  };

  return (
    <>
      {/* Traditional Navbar */}
      <motion.nav 
        className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm"
        initial={{ y: 0 }}
        animate={{ y: navbarVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ top: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <img
                  src="/dafel-logo-optimized.svg"
                  alt="Dafel Technologies"
                  className="h-16 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                {/* Default Navigation Buttons */}
                <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Inicio
                </Link>
                <Link 
                  href="/boletines" 
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors relative"
                  style={{
                    color: '#9fc8fc',
                    backgroundColor: '#f0f7fe',
                    fontWeight: '600'
                  }}
                >
                  Boletines
                  <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{backgroundColor: '#9fc8fc'}}></span>
                </Link>
                <Link href="/noticias" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Noticias
                </Link>
                <Link href="/publicaciones" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Publicaciones
                </Link>
                <Link href="/legal" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Legal
                </Link>

                {/* More Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsNavButtonsVisible(!isNavButtonsVisible)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                    aria-expanded={isNavButtonsVisible}
                    aria-label="More options"
                  >
                    <motion.div
                      animate={{ rotate: isNavButtonsVisible ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Bars3Icon className="h-6 w-6" />
                    </motion.div>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isNavButtonsVisible && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        <Link
                          href="/#servicios"
                          onClick={() => setIsNavButtonsVisible(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          Servicios
                        </Link>
                        <Link
                          href="/nosotros"
                          onClick={() => setIsNavButtonsVisible(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          Nosotros
                        </Link>
                        <Link
                          href="/#contacto"
                          onClick={() => setIsNavButtonsVisible(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          Contacto
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-expanded="false"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-lg"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link 
                href="/#servicios" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Servicios
              </Link>
              <Link 
                href="/boletines" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Boletines
              </Link>
              <Link 
                href="/nosotros" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Nosotros
              </Link>
              <Link 
                href="/#contacto" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Contacto
              </Link>
              <Link 
                href="/#contacto"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full mt-4 text-white px-4 py-3 rounded-md text-lg font-medium transition-colors hover:opacity-90 block text-center"
                style={{backgroundColor: '#9fc8fc'}}
              >
                Consultoría
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gray-50">
        {/* Article Header */}
        <div className="bg-white pt-24 sm:pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{new Date(article.date).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>{article.readTime} de lectura</span>
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
            </div>

            {/* Title */}
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6 leading-tight"
              dangerouslySetInnerHTML={{ 
                __html: article.title
                  .replace(/(\d{4})/g, '<span class="font-semibold">$1</span>')
                  .replace(/(NIF D-3|IFRS[\s-]*19|US GAAP|UMA|ESG)/g, '<span class="font-semibold">$1</span>')
                  .replace(/(Regulaciones|Tendencias|Impacto|Revolución|Nueva Era)/g, '<span class="font-semibold">$1</span>')
                  .replace(/(Planes de Pensiones|Beneficios|Telecomunicaciones|Sostenible)/g, '<span class="font-semibold">$1</span>')
                  .replace(/(Cuotas Patronales|Cálculos Actuariales|Beneficios Digitales)/g, '<span class="font-semibold">$1</span>')
              }}
            />

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Tags and Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full" style={{backgroundColor: '#f0f7fe', color: '#9fc8fc'}}
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80" style={{backgroundColor: '#f0f7fe', color: '#9fc8fc'}}
                >
                  <ShareIcon className="h-4 w-4" />
                  Compartir
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        WhatsApp
                      </button>
                      <button
                        onClick={() => handleShare('email')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Email
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden mb-12">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none prose-blue"
            dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
          />
        </div>
      </div>

      {/* Contact CTA */}
      <div style={{backgroundColor: '#9fc8fc'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-4">
              ¿Necesita consultoría especializada?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Nuestros expertos en consultoría actuarial pueden ayudarle a implementar 
              las mejores prácticas para su organización.
            </p>
            <Link
              href="/#contacto"
              className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors" style={{color: '#9fc8fc'}}
            >
              Contactar especialista
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Artículos relacionados
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/boletines/${relatedArticle.slug}`}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(relatedArticle.date).toLocaleDateString('es-ES')}</span>
                      </div>
                      <h4 
                        className="text-lg font-light text-gray-900 mb-2 line-clamp-2"
                        dangerouslySetInnerHTML={{ 
                          __html: relatedArticle.title
                            .replace(/(\d{4})/g, '<span class="font-semibold">$1</span>')
                            .replace(/(NIF D-3|IFRS[\s-]*19|US GAAP|UMA|ESG)/g, '<span class="font-semibold">$1</span>')
                            .replace(/(Regulaciones|Tendencias|Impacto|Revolución|Nueva Era)/g, '<span class="font-semibold">$1</span>')
                            .replace(/(Planes de Pensiones|Beneficios|Telecomunicaciones|Sostenible)/g, '<span class="font-semibold">$1</span>')
                            .replace(/(Cuotas Patronales|Cálculos Actuariales|Beneficios Digitales)/g, '<span class="font-semibold">$1</span>')
                        }}
                      />
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {relatedArticle.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}