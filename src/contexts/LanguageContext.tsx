'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
  messages: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Mensajes estáticos para el sitio estático
const messages = {
  navbar: {
    login: 'Iniciar Sesión',
  },
  hero: {
    title: 'Dafel Technologies',
    subtitle: 'Consultoría empresarial especializada en planes de beneficios corporativos',
  },
  services: {
    title: 'Nuestros Servicios',
    subtitle: 'Soluciones integrales para su empresa',
  },
  footer: {
    rights: '© 2025 Todos los derechos reservados'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('es');

  return (
    <LanguageContext.Provider value={{ locale, setLocale, messages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}