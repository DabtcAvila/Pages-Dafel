//Configuración para habilitar/deshabilitar secciones de Dafel Technologies
export const technologiesConfig = {
  // Habilita la sección "Dafel" - plataforma de datos e IA
  showDafelSection: false,
  
  // Habilita la sección "Framework" - La fundición ontológica
  showFrameworkSection: false,
  
  // Version de configuración para cache busting
  configVersion: '20260107T1656'
};

export type TechnologiesConfig = typeof technologiesConfig;