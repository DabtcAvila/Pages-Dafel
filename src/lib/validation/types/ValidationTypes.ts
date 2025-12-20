export type ValidationSeverity = 'critical' | 'warning' | 'info';
export type ValidationStatus = 'success' | 'warning' | 'error' | 'processing';

export interface ValidationResult {
  agent: string;
  field: string;
  message: string;
  severity: ValidationSeverity;
  status: ValidationStatus;
  suggestion?: string;
  affectedRows?: number[];
  metadata?: Record<string, any>;
}

export interface EmployeeRecord {
  rowIndex: number;
  employeeCode?: string;
  employeeName?: string;
  gender?: string;
  hireDate?: Date | string;
  birthDate?: Date | string;
  rfc?: string;
  nss?: string;
  employeeType?: string;
  baseSalary?: number;
  integratedSalary?: number;
  position?: string;
  plant?: string;
  contractType?: string;
  [key: string]: any;
}

export interface TerminationRecord {
  rowIndex: number;
  employeeCode?: string;
  employeeName?: string;
  birthDate?: Date | string;
  rfc?: string;
  hireDate?: Date | string;
  terminationDate?: Date | string;
  terminationCause?: string;
  lastBaseSalary?: number;
  lastIntegratedSalary?: number;
  seniorityPayment?: number;
  indemnificationPayment?: number;
  [key: string]: any;
}

export interface MappedData {
  activePersonnel: EmployeeRecord[];
  terminations: TerminationRecord[];
  columnMapping: {
    activePersonnel: Record<string, number>;
    terminations: Record<string, number>;
  };
  metadata: {
    totalRows: number;
    activePersonnelRows: number;
    terminationsRows: number;
    detectedColumns: {
      activePersonnel: string[];
      terminations: string[];
    };
  };
}

export interface ValidationContext {
  data: MappedData;
  validationId: string;
  userId: string;
  timestamp: Date;
}

export interface AgentConfiguration {
  name: string;
  description: string;
  priority: number;
  dependencies: string[];
  timeout: number;
}

// Mexican regulatory patterns
export const MEXICAN_RFC_PATTERN = /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/;
export const MEXICAN_NSS_PATTERN = /^\d{11}$/;

// Actuarial constants
export const MIN_WORKING_AGE = 16;
export const MAX_WORKING_AGE = 70;
export const STANDARD_RETIREMENT_AGE = 65;
export const MIN_SERVICE_DAYS = 1;
export const MAX_SERVICE_YEARS = 50;

// Salary validation constants  
export const MIN_SALARY_MXN = 172.87; // 2025 minimum wage
export const MAX_REASONABLE_SALARY_MXN = 1000000; // 1M MXN monthly
export const IMSS_SALARY_CAP_2025 = 92831; // IMSS cap for 2025

// Date validation constants
export const MIN_BIRTH_YEAR = 1940;
export const MAX_BIRTH_YEAR = 2010;
export const MIN_HIRE_YEAR = 1970;

// Mexican employee type classifications
export const VALID_EMPLOYEE_TYPES = [
  'CONFIDENCIAL',
  'CONFIANZA', 
  'SINDICALIZADO',
  'EJECUTIVO',
  'OPERATIVO',
  'ADMINISTRATIVO',
  'VENDEDOR',
  'SUPERVISOR'
];

export const VALID_CONTRACT_TYPES = [
  'PERMANENTE',
  'EVENTUAL',
  'TEMPORAL',
  'DETERMINADO',
  'INDETERMINADO'
];

// Termination causes
export const VALID_TERMINATION_CAUSES = [
  'RENUNCIA',
  'DESPIDO',
  'JUBILACION',
  'PENSION',
  'DEFUNCION',
  'INVALIDEZ',
  'RESCISION',
  'VENCIMIENTO_CONTRATO',
  'MUTUO_ACUERDO'
];