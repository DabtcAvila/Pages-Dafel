import { ServiceCategory } from '@/types/landing';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'historical-analysis',
    name: 'Análisis Histórico Inteligente',
    description: 'Convertimos 5-15 años de reportes en insights estratégicos accionables',
    icon: 'TrendingUpIcon',
    highlight: true,
    services: [
      {
        id: 'historical-transformation',
        name: 'Transformación de Histórico',
        description: 'Convertimos tus reportes PDF/Excel dispersos en un sistema de inteligencia actuarial',
        features: [
          'Digitalización de reportes históricos',
          'Identificación de patrones y tendencias',
          'Dashboard ejecutivo consolidado',
          'Análisis comparativo multi-anual'
        ],
        benefits: [
          '89% de precisión en proyecciones',
          'Identificación de oportunidades ocultas',
          'Reducción de sorpresas en auditorías',
          'Decisiones basadas en contexto histórico completo'
        ],
        historicalDataYears: 15
      },
      {
        id: 'predictive-modeling',
        name: 'Modelado Predictivo Personalizado',
        description: 'Proyecciones basadas en TU historia específica, no en modelos genéricos',
        features: [
          'Proyecciones a 3-5 años',
          'Modelos basados en tu histórico',
          'Simuladores de escenarios',
          'Alertas predictivas automáticas'
        ],
        benefits: [
          'Presupuestación precisa',
          'Anticipación de jubilaciones masivas',
          'Optimización de reservas',
          'Planificación estratégica informada'
        ],
        historicalDataYears: 10
      }
    ]
  },
  {
    id: 'fiscal-optimization',
    name: 'Optimización Fiscal Histórica',
    description: 'Identificamos oportunidades de ahorro fiscal basadas en tu patrón histórico específico',
    icon: 'CalculatorIcon',
    highlight: true,
    services: [
      {
        id: 'historical-fiscal-analysis',
        name: 'Análisis Fiscal Retroactivo',
        description: 'Revisamos tu histórico para encontrar deducciones y optimizaciones no aprovechadas',
        features: [
          'Análisis de deducciones históricas',
          'Identificación de patrones fiscales',
          'Optimización de estructuras laborales',
          'Recomendaciones específicas por año'
        ],
        benefits: [
          '18% de ahorro fiscal promedio',
          'Recuperación de deducciones perdidas',
          'Estrategias fiscales personalizadas',
          'ROI inmediato demostrable'
        ],
        historicalDataYears: 12
      },
      {
        id: 'compliance-audit',
        name: 'Auditoría de Cumplimiento Histórica',
        description: 'Verificamos cumplimiento normativo y identificamos riesgos en tu histórico',
        features: [
          'Revisión de cumplimiento por año',
          'Identificación de inconsistencias',
          'Análisis de riesgos históricos',
          'Plan de remediación específico'
        ],
        benefits: [
          'Reducción de riesgos normativos',
          'Preparación para auditorías',
          'Documentación completa',
          'Tranquilidad regulatoria'
        ],
        historicalDataYears: 8
      }
    ]
  },
  {
    id: 'actuarial-consulting',
    name: 'Consultoría Actuarial Tradicional',
    description: 'Servicios actuariales certificados con la calidad de siempre, potenciados por análisis histórico',
    icon: 'DocumentTextIcon',
    services: [
      {
        id: 'liability-valuation',
        name: 'Valuación de Pasivos Laborales',
        description: 'Valuaciones actuariales certificadas con contexto histórico enriquecido',
        features: [
          'Valuaciones NIF-D3 y ASC 715',
          'Análisis de sensibilidad',
          'Proyecciones de flujos de efectivo',
          'Reportes ejecutivos'
        ],
        benefits: [
          'Cumplimiento normativo garantizado',
          'Reportes auditables',
          'Análisis de tendencias',
          'Asesoría personalizada'
        ],
        historicalDataYears: 5
      },
      {
        id: 'pension-design',
        name: 'Diseño de Planes de Pensiones',
        description: 'Diseñamos planes óptimos basados en el perfil histórico de tu empresa',
        features: [
          'Análisis demográfico histórico',
          'Diseño de beneficios óptimos',
          'Proyecciones de costos',
          'Implementación gradual'
        ],
        benefits: [
          'Planes adaptados a tu realidad',
          'Costos predecibles',
          'Atracción y retención de talento',
          'Cumplimiento garantizado'
        ],
        historicalDataYears: 10
      }
    ]
  },
  {
    id: 'technology-platform',
    name: 'Plataforma Tecnológica',
    description: 'Acceso 24/7 a tu información histórica con análisis automáticos y reportes inteligentes',
    icon: 'ComputerDesktopIcon',
    services: [
      {
        id: 'dashboard-platform',
        name: 'Dashboard Ejecutivo',
        description: 'Visualiza 15 años de data actuarial en métricas clave para toma de decisiones',
        features: [
          'Acceso web 24/7',
          'Visualizaciones interactivas',
          'Reportes automáticos',
          'Alertas personalizadas'
        ],
        benefits: [
          'Información siempre disponible',
          'Decisiones informadas instantáneas',
          'Seguimiento continuo',
          'Colaboración mejorada'
        ],
        historicalDataYears: 15
      },
      {
        id: 'api-integration',
        name: 'Integración API',
        description: 'Conecta nuestro análisis histórico con tus sistemas empresariales existentes',
        features: [
          'API RESTful segura',
          'Webhooks automáticos',
          'Sincronización en tiempo real',
          'Documentación completa'
        ],
        benefits: [
          'Automatización completa',
          'Integración sin fricciones',
          'Datos siempre actualizados',
          'Eficiencia operativa'
        ],
        historicalDataYears: 5
      }
    ]
  }
];