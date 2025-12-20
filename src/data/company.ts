import { CompanyInfo } from '@/types/landing';

export const companyInfo: CompanyInfo = {
  name: 'Dafel Technologies',
  foundedYear: 2009,
  yearsOfExperience: 15,
  dataAnalysisRange: '5-15 años',
  employeeCount: '15+ expertos',
  clientsServed: '500+ empresas',
  certifications: [
    {
      name: 'Actuario Certificado',
      issuer: 'Colegio Nacional de Actuarios',
      year: 2009,
      description: 'Certificación profesional en ciencias actuariales'
    },
    {
      name: 'Especialista en Pensiones',
      issuer: 'CONSAR',
      year: 2012,
      description: 'Autorización para consultoría en sistemas de pensiones'
    },
    {
      name: 'Consultor Financiero Certificado',
      issuer: 'AMAFORE',
      year: 2015,
      description: 'Especialización en productos financieros y seguros'
    }
  ],
  achievements: [
    {
      title: 'Primer análisis histórico de 15 años',
      description: 'Pioneros en México en análisis actuarial histórico predictivo',
      year: 2018,
      type: 'milestone'
    },
    {
      title: 'Reconocimiento Excelencia Actuarial',
      description: 'Premio a la innovación en análisis de datos actuariales',
      year: 2021,
      type: 'award'
    },
    {
      title: '$50M+ en oportunidades identificadas',
      description: 'Valor total identificado en análisis históricos para clientes',
      year: 2024,
      type: 'milestone'
    }
  ],
  contact: {
    email: 'contacto@dafel.com.mx',
    phone: '+52 55 1234 5678',
    address: 'Ciudad de México, México',
    socialMedia: [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/company/dafel-technologies'
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com/dafel_tech'
      }
    ]
  }
};