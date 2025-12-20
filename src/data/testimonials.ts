import { Testimonial } from '@/types/landing';

export const testimonials: Testimonial[] = [
  {
    id: 'ana-martinez-grupo-manufacturero',
    name: 'Ana Martínez',
    position: 'CFO',
    company: 'Grupo Manufacturero del Bajío',
    content: 'Teníamos 12 años de reportes actuariales guardados. Dafel los transformó en nuestro activo más estratégico. Descubrimos oportunidades de ahorro fiscal de $2.3M que estaban ocultas en nuestros reportes históricos.',
    rating: 5,
    industry: 'Manufactura',
    projectType: 'Análisis Histórico + Optimización Fiscal',
    results: [
      {
        metric: 'Oportunidades identificadas',
        value: '$2.3M MXN',
        description: 'En ahorro fiscal y optimización de reservas'
      },
      {
        metric: 'Optimización de beneficios',
        value: '23%',
        description: 'Reestructuración de plan de beneficios laborales'
      },
      {
        metric: 'Anticipación estratégica',
        value: '18 meses',
        description: 'Planificación avanzada de jubilaciones masivas'
      }
    ]
  },
  {
    id: 'carlos-rodriguez-servicios-corporativos',
    name: 'Carlos Rodríguez',
    position: 'Director de Finanzas',
    company: 'Servicios Corporativos Integrados',
    content: 'El análisis de nuestros 8 años de data reveló patrones que nunca habíamos visto. Ahora nuestras proyecciones tienen 89% de precisión vs el 34% que teníamos antes. Es como tener una bola de cristal actuarial.',
    rating: 5,
    industry: 'Servicios Corporativos',
    projectType: 'Modelado Predictivo Personalizado',
    results: [
      {
        metric: 'Precisión de proyecciones',
        value: '89%',
        description: 'Vs 34% con métodos tradicionales'
      },
      {
        metric: 'Reducción de varianza',
        value: '67%',
        description: 'En estimaciones de pasivos laborales'
      },
      {
        metric: 'Ahorro en auditorías',
        value: '$450K MXN',
        description: 'Por año en costos de auditoría externa'
      }
    ]
  },
  {
    id: 'maria-gonzalez-holding-empresarial',
    name: 'María González',
    position: 'VP Recursos Humanos',
    company: 'Holding Empresarial del Norte',
    content: 'Gestionar beneficios para 5 empresas del grupo era un caos. Dafel consolidó 15 años de información dispersa y creó estrategias específicas para cada empresa. Ahora tenemos control total y visión estratégica.',
    rating: 5,
    industry: 'Holding Empresarial',
    projectType: 'Consolidación Multi-entidad',
    results: [
      {
        metric: 'Empresas consolidadas',
        value: '5',
        description: 'Análisis unificado de todo el holding'
      },
      {
        metric: 'Eficiencia operativa',
        value: '45%',
        description: 'Reducción en tiempo de generación de reportes'
      },
      {
        metric: 'Ahorro administrativo',
        value: '$1.2M MXN',
        description: 'Anual por optimización de procesos'
      }
    ]
  },
  {
    id: 'roberto-Silva-tecnologia-avanzada',
    name: 'Roberto Silva',
    position: 'CEO',
    company: 'Tecnología Avanzada S.A.',
    content: 'Como empresa tech, necesitábamos un socio que entendiera tanto de actuaría como de tecnología. La plataforma de Dafel se integró perfecto con nuestros sistemas y ahora tenemos dashboards en tiempo real de toda nuestra info actuarial.',
    rating: 5,
    industry: 'Tecnología',
    projectType: 'Integración Tecnológica + Dashboard',
    results: [
      {
        metric: 'Integración API',
        value: '100%',
        description: 'Conectado con SAP y sistemas internos'
      },
      {
        metric: 'Tiempo de generación reportes',
        value: '5 minutos',
        description: 'Vs 2 semanas anteriormente'
      },
      {
        metric: 'Disponibilidad datos',
        value: '24/7',
        description: 'Acceso ejecutivo desde cualquier dispositivo'
      }
    ]
  },
  {
    id: 'patricia-morales-retail-nacional',
    name: 'Patricia Morales',
    position: 'Directora Administrativa',
    company: 'Retail Nacional',
    content: 'Con 2,500 empleados y alta rotación, nuestros cálculos actuariales eran un dolor de cabeza. El análisis histórico de Dafel identificó patrones de rotación por región y diseñó beneficios específicos. Increíble.',
    rating: 5,
    industry: 'Retail',
    projectType: 'Análisis Demográfico + Diseño de Beneficios',
    results: [
      {
        metric: 'Reducción rotación',
        value: '32%',
        description: 'Mediante beneficios personalizados por región'
      },
      {
        metric: 'Empleados analizados',
        value: '2,500',
        description: 'Análisis individual y por cohortes'
      },
      {
        metric: 'Regiones optimizadas',
        value: '12',
        description: 'Estrategias específicas por zona geográfica'
      }
    ]
  },
  {
    id: 'eduardo-ramirez-construccion-pesada',
    name: 'Eduardo Ramírez',
    position: 'Gerente General',
    company: 'Construcción Pesada MX',
    content: 'En construcción, la demografía cambia mucho por proyecto. Dafel analizó 10 años de nuestros datos y creó un modelo que predice costos laborales por tipo de obra. Ahora nuestras licitaciones son mucho más precisas.',
    rating: 5,
    industry: 'Construcción',
    projectType: 'Modelado Predictivo Sectorial',
    results: [
      {
        metric: 'Precisión en licitaciones',
        value: '94%',
        description: 'Predicción de costos laborales por proyecto'
      },
      {
        metric: 'Proyectos analizados',
        value: '180',
        description: 'Base histórica de 10 años'
      },
      {
        metric: 'Ventaja competitiva',
        value: '15%',
        description: 'Mayor tasa de éxito en licitaciones'
      }
    ]
  }
];