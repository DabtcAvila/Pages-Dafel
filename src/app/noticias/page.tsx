'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CalendarIcon, ClockIcon, TagIcon, UserIcon, ChevronRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { articles, getLatestArticles } from '@/data/articles';

export default function NoticiasPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
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
  
  // Define priority tags where DAFEL has authority (based on specialized service pages)
  const priorityTagMappings = {
    'NIF D-3': ['NIF D-3', 'NIF D3'],
    'IAS-19': ['IAS-19', 'IFRS 19', 'IAS 19'],
    'Pasivos Laborales': ['Pasivos Laborales', 'Beneficios Laborales'],
    'Planes de Pensiones': ['Planes de Pensiones', 'Pensiones'],
    'US GAAP': ['US GAAP', 'USGAAP']
  };
  
  // Get all unique tags
  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)));
  
  // Filter to show only DAFEL authority tags that exist in articles
  const filteredTags = Object.keys(priorityTagMappings).filter(displayTag => {
    const variations = priorityTagMappings[displayTag];
    return variations.some(variation => allTags.includes(variation));
  });
  
  // Filter articles by selected tag
  const filteredArticles = selectedTag 
    ? articles.filter(article => {
        const variations = priorityTagMappings[selectedTag] || [selectedTag];
        return variations.some(variation => article.tags.includes(variation));
      })
    : articles;

  // Sort articles by date (newest first)
  const sortedArticles = filteredArticles.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
                <Link href="/boletines" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Inicio
                </Link>
                <span 
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors relative cursor-default"
                  style={{
                    color: '#9fc8fc',
                    backgroundColor: '#f0f7fe',
                    fontWeight: '600'
                  }}
                >
                  Noticias
                  <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{backgroundColor: '#9fc8fc'}}></span>
                </span>
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

      <div className="min-h-screen bg-gray-50 pt-24 sm:pt-32">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tags Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTag === null
                  ? 'text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              style={selectedTag === null ? {backgroundColor: '#9fc8fc'} : {}}
            >
              Todos los artículos
            </button>
            {filteredTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTag === tag
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                style={selectedTag === tag ? {backgroundColor: '#9fc8fc'} : {}}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Article Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-white px-3 py-1 rounded-full text-sm font-medium" style={{backgroundColor: '#9fc8fc'}}>
                    {article.tags[0]}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
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
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h2 
                  className="text-lg sm:text-xl font-light text-gray-900 mb-3 line-clamp-2"
                  dangerouslySetInnerHTML={{ 
                    __html: article.title
                      .replace(/(\d{4})/g, '<span class="font-semibold">$1</span>')
                      .replace(/(NIF D-3|IFRS[\s-]*19|US GAAP|UMA|ESG)/g, '<span class="font-semibold">$1</span>')
                      .replace(/(Regulaciones|Tendencias|Impacto|Revolución|Nueva Era)/g, '<span class="font-semibold">$1</span>')
                      .replace(/(Planes de Pensiones|Beneficios|Telecomunicaciones|Sostenible)/g, '<span class="font-semibold">$1</span>')
                  }}
                />

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <UserIcon className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>

                  <Link
                    href={`/noticias/${article.slug}`}
                    className="inline-flex items-center gap-2 font-medium text-sm transition-colors hover:opacity-80"
                    style={{color: '#9fc8fc'}}
                  >
                    Leer más
                    <ChevronRightIcon className="h-4 w-4" />
                  </Link>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md"
                      style={{backgroundColor: '#f0f7fe', color: '#4a90e2'}}
                    >
                      <TagIcon className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* No Articles Found */}
        {sortedArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <TagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No se encontraron artículos
              </h3>
              <p className="text-gray-500">
                No hay artículos disponibles para la etiqueta seleccionada.
              </p>
            </div>
          </div>
        )}

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 rounded-xl p-8 mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Quiere recibir nuestras noticias directamente?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Suscríbase a nuestro newsletter y reciba las últimas actualizaciones sobre 
            normativas contables, tendencias actuariales y mejores prácticas en beneficios laborales.
          </p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
          >
            Suscribirse ahora
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
      </div>
    </>
  );
}