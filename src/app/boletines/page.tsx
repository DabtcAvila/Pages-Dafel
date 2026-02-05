'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CalendarIcon, ChevronRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { articles, getLatestArticles } from '@/data/articles';

export default function BoletinesPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavButtonsVisible, setIsNavButtonsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;

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
                  width="107"
                  height="64"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                {/* Default Navigation Buttons */}
                <span 
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors relative cursor-default"
                  style={{
                    color: '#9fc8fc',
                    backgroundColor: '#f0f7fe',
                    fontWeight: '600'
                  }}
                >
                  Inicio
                  <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{backgroundColor: '#9fc8fc'}}></span>
                </span>
                <Link href="/noticias" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Noticias
                </Link>
                <Link href="/publicaciones" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Publicaciones
                </Link>
                <Link href="/legal" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Legal
                </Link>
                <Link href="/recursos" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Recursos
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
                href="/recursos" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Recursos
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

      <div className="min-h-screen bg-white pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* Top Navigation Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4"
          >
            <Link href="/noticias" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{backgroundColor: '#f0f7fe', color: '#4a90e2'}}>
              Noticias
            </Link>
            <Link href="/publicaciones" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{backgroundColor: '#f0f7fe', color: '#4a90e2'}}>
              Publicaciones
            </Link>
            <Link href="/legal" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{backgroundColor: '#f0f7fe', color: '#4a90e2'}}>
              Legal
            </Link>
            {filteredTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedTag === tag ? {backgroundColor: '#9fc8fc'} : {}}
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Main Content Area (3 columns) */}
            <div className="lg:col-span-3">
              
              {/* Hero Article */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
              >
                <Link href={`/boletines/${sortedArticles[0]?.slug}`} className="group block">
                  <div className="relative h-72 overflow-hidden rounded-lg">
                    <img
                      src={sortedArticles[0]?.image}
                      alt={sortedArticles[0]?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-white px-3 py-1 rounded-full text-sm font-medium" style={{backgroundColor: '#9fc8fc'}}>
                        {sortedArticles[0]?.tags[0]}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h1 
                        className="text-3xl font-bold text-white mb-2 line-clamp-2"
                        dangerouslySetInnerHTML={{ 
                          __html: sortedArticles[0]?.title
                            .replace(/(\d{4})/g, '<span class="font-bold">$1</span>')
                            .replace(/(NIF D-3|IFRS[\s-]*19|US GAAP|UMA|ESG)/g, '<span class="font-bold">$1</span>')
                        }}
                      />
                      <p className="text-gray-200 line-clamp-2">{sortedArticles[0]?.excerpt}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
                        <span>{sortedArticles[0]?.author}</span>
                        <span>•</span>
                        <span>{sortedArticles[0]?.readTime}</span>
                        <span>•</span>
                        <span>{new Date(sortedArticles[0]?.date).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Secondary Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {sortedArticles.slice(1, 5).map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                    className="group"
                  >
                    <Link href={`/boletines/${article.slug}`}>
                      <div className="relative h-48 overflow-hidden rounded-lg mb-3">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="text-white px-2 py-1 rounded-md text-xs font-medium" style={{backgroundColor: '#9fc8fc'}}>
                            {article.tags[0]}
                          </span>
                        </div>
                      </div>
                      <h2 
                        className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
                        dangerouslySetInnerHTML={{ 
                          __html: article.title
                            .replace(/(\d{4})/g, '<span class="font-bold">$1</span>')
                            .replace(/(NIF D-3|IFRS[\s-]*19|US GAAP|UMA|ESG)/g, '<span class="font-bold">$1</span>')
                        }}
                      />
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{article.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>{new Date(article.date).toLocaleDateString('es-ES')}</span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Article List */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6">
                  Todos los Artículos
                </h2>
                
                {/* Paginated Articles */}
                {(() => {
                  const allArticles = sortedArticles.slice(5);
                  const startIndex = (currentPage - 1) * articlesPerPage;
                  const endIndex = startIndex + articlesPerPage;
                  const paginatedArticles = allArticles.slice(startIndex, endIndex);
                  
                  return paginatedArticles.map((article, index) => (
                    <div key={article.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                      <Link href={`/boletines/${article.slug}`} className="flex gap-4 w-full">
                        <div className="flex-shrink-0 w-24 h-16 overflow-hidden rounded">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 text-xs font-medium rounded" style={{backgroundColor: '#f0f7fe', color: '#4a90e2'}}>
                              {article.tags[0]}
                            </span>
                            <span className="text-xs text-gray-500">{article.readTime}</span>
                          </div>
                          <h3 
                            className="text-base font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors"
                            dangerouslySetInnerHTML={{ 
                              __html: article.title
                                .replace(/(\d{4})/g, '<span class="font-bold">$1</span>')
                                .replace(/(NIF D-3|IFRS[\s-]*19|US GAAP|UMA|ESG)/g, '<span class="font-bold">$1</span>')
                            }}
                          />
                          <p className="text-sm text-gray-600 line-clamp-1 mt-1">{article.excerpt}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>{article.author}</span>
                            <span>•</span>
                            <span>{new Date(article.date).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ));
                })()}
                
                {/* Pagination */}
                {(() => {
                  const allArticles = sortedArticles.slice(5);
                  const totalPages = Math.ceil(allArticles.length / articlesPerPage);
                  
                  if (totalPages <= 1) return null;
                  
                  return (
                    <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-200">
                      {/* Previous button */}
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            currentPage === page
                              ? 'text-white shadow-md'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                          style={currentPage === page ? {backgroundColor: '#9fc8fc'} : {}}
                        >
                          {page}
                        </button>
                      ))}
                      
                      {/* Next button */}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            </div>

            {/* Sidebar (1 column) */}
            <div className="lg:col-span-1">
              
              {/* Fechas Importantes */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-50 rounded-lg p-6 mb-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Fechas Importantes</h3>
                <div className="space-y-3">
                  
                  {/* Enero 2026 */}
                  <div className="bg-white p-3 rounded-lg border-l-4" style={{borderLeftColor: '#9fc8fc'}}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-white px-2 py-1 rounded" style={{backgroundColor: '#9fc8fc'}}>
                            31 ENE
                          </span>
                          <span className="text-xs text-gray-500">2026</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          Vencimiento Reportes Anuales CNSF
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Estados financieros dictaminados
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Febrero 2026 */}
                  <div className="bg-white p-3 rounded-lg border-l-4" style={{borderLeftColor: '#9fc8fc'}}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-white px-2 py-1 rounded" style={{backgroundColor: '#9fc8fc'}}>
                            28 FEB
                          </span>
                          <span className="text-xs text-gray-500">2026</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          Reporte Actuarial Anual
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Seguros de vida y pensiones
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Marzo 2026 */}
                  <div className="bg-white p-3 rounded-lg border-l-4" style={{borderLeftColor: '#9fc8fc'}}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-white px-2 py-1 rounded" style={{backgroundColor: '#9fc8fc'}}>
                            31 MAR
                          </span>
                          <span className="text-xs text-gray-500">2026</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          Estados Financieros NIF D-3
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Beneficios a empleados
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Abril 2026 */}
                  <div className="bg-white p-3 rounded-lg border-l-4" style={{borderLeftColor: '#9fc8fc'}}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-white px-2 py-1 rounded" style={{backgroundColor: '#9fc8fc'}}>
                            30 ABR
                          </span>
                          <span className="text-xs text-gray-500">2026</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          Declaración Anual ISR
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Personas morales
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mayo 2026 */}
                  <div className="bg-white p-3 rounded-lg border-l-4" style={{borderLeftColor: '#9fc8fc'}}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-white px-2 py-1 rounded" style={{backgroundColor: '#9fc8fc'}}>
                            31 MAY
                          </span>
                          <span className="text-xs text-gray-500">2026</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          Reporte Solvencia II
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Instituciones de seguros
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
                
                {/* Quick Access */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 text-sm mb-3">Acceso Rápido</h4>
                  <div className="space-y-2">
                    <Link href="/#servicios" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      <span>Servicios Completos</span>
                    </Link>
                    <Link href="/#contacto" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      <span>Consultoría Directa</span>
                    </Link>
                    <Link href="/nosotros" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      <span>Conocer DAFEL</span>
                    </Link>
                  </div>
                </div>
              </motion.div>


              {/* Servicios Especializados */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-gray-50 rounded-lg p-6 mb-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Servicios DAFEL</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Link href="/nif-d3" className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors">
                    NIF D-3
                  </Link>
                  <Link href="/ias-19" className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors">
                    IAS-19
                  </Link>
                  <Link href="/us-gaap" className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors">
                    US GAAP
                  </Link>
                  <Link href="/pasivos-laborales" className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors">
                    Pasivos Laborales
                  </Link>
                  <Link href="/prima-antiguedad" className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors">
                    Prima Antigüedad
                  </Link>
                  <Link href="/indemnizaciones" className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors">
                    Indemnizaciones
                  </Link>
                  <Link href="/planes-pensiones" className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors">
                    Planes de Pensiones
                  </Link>
                  <Link href="/gastos-medicos-retiro" className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors">
                    Gastos Médicos de Retiro
                  </Link>
                  <Link href="/normativas-contables" className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors">
                    Normativas Contables
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href="/#servicios"
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{color: '#9fc8fc'}}
                  >
                    Ver todos los servicios →
                  </Link>
                </div>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">Newsletter DAFEL</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Recibe las últimas actualizaciones actuariales directamente en tu bandeja de entrada.
                </p>
                <Link
                  href="/#contacto"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Suscribirse
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </motion.div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-lg font-sans font-semibold text-gray-900">
                  DAFEL - Consultoría Actuarial
                </span>
                <p className="mt-1 text-sm font-sans text-gray-700">
                  Especialistas en NIF D-3, IAS-19 y US GAAP
                </p>
                <p className="mt-2 text-sm font-sans text-gray-600">
                  © 2025 Dafel Consulting Services. Todos los derechos reservados.
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="/privacidad" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacidad
                </a>
                <a href="/terminos" className="text-sm text-gray-600 hover:text-gray-900">
                  Términos
                </a>
                <a href="/cookies" className="text-sm text-gray-600 hover:text-gray-900">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}