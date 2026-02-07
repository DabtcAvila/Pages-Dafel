'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type CourseProgress = {
  completedLessons: string[];
  passedChallenges: string[];
  certificateEarned: boolean;
  certificateName?: string;
  certificateDate?: string;
  certificateId?: string;
};

const STORAGE_KEY = 'dafel-ias19-progress';

function loadProgress(): CourseProgress {
  if (typeof window === 'undefined') return { completedLessons: [], passedChallenges: [], certificateEarned: false };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { completedLessons: [], passedChallenges: [], certificateEarned: false };
}

function saveProgress(progress: CourseProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}
import { Bars3Icon, XMarkIcon, ChevronDownIcon, ChevronRightIcon, LockClosedIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { TrophyIcon as TrophySolid } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

type LessonData = {
  id: string;
  title: string;
};

type ModuleData = {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  lessons: LessonData[];
  available: boolean;
};

const courseStructure: ModuleData[] = [
  {
    id: 'nivel-1',
    level: 1,
    title: 'Fundamentos',
    subtitle: '¿Qué le debo a mis empleados?',
    lessons: [
      { id: '1.1', title: 'Qué es IAS 19 y por qué importa' },
      { id: '1.2', title: 'Las 4 categorías de beneficios a empleados' },
      { id: '1.3', title: 'Beneficios a corto plazo: reconocimiento y medición' },
      { id: '1.4', title: 'Planes de contribución definida vs beneficio definido' },
      { id: '1.5', title: 'Contabilización de planes DC' },
      { id: 'challenge-1', title: 'Challenge Nivel 1' },
    ],
    available: true,
  },
  {
    id: 'nivel-2',
    level: 2,
    title: 'Medición',
    subtitle: '¿Cuánto le debo?',
    lessons: [
      { id: '2.1', title: 'El enfoque de 6 pasos para planes DB' },
      { id: '2.2', title: 'Paso 1: Atribución de beneficios' },
      { id: '2.3', title: 'Paso 2: Projected Unit Credit Method' },
      { id: '2.4', title: 'Paso 3: Valor razonable de activos del plan' },
      { id: '2.5', title: 'Paso 4: Pasivo (activo) neto de beneficio definido' },
      { id: 'challenge-2', title: 'Challenge Nivel 2' },
    ],
    available: true,
  },
  {
    id: 'nivel-3',
    level: 3,
    title: 'Registro',
    subtitle: '¿Cómo lo registro?',
    lessons: [
      { id: '3.1', title: 'Contribuciones pagadas y beneficios pagados' },
      { id: '3.2', title: 'Costo del servicio actual' },
      { id: '3.3', title: 'Interés neto sobre el pasivo (activo) neto DB' },
      { id: '3.4', title: 'Retorno de activos del plan' },
      { id: '3.5', title: 'Remediciones en OCI' },
      { id: '3.6', title: 'Contribuciones de empleados a planes DB' },
      { id: '3.7', title: 'Ejemplo integral: tabla de movimientos DB' },
      { id: 'challenge-3', title: 'Challenge Nivel 3' },
    ],
    available: true,
  },
  {
    id: 'nivel-4',
    level: 4,
    title: 'Casos Complejos',
    subtitle: '¿Qué pasa cuando se complica?',
    lessons: [
      { id: '4.1', title: 'Otros beneficios a largo plazo' },
      { id: '4.2', title: 'Costo del servicio pasado en otros beneficios LP' },
      { id: '4.3', title: 'Beneficios por terminación: definición y formas' },
      { id: '4.4', title: 'Beneficios por terminación: reconocimiento' },
      { id: 'challenge-4', title: 'Challenge Nivel 4' },
    ],
    available: true,
  },
  {
    id: 'nivel-5',
    level: 5,
    title: 'Maestría',
    subtitle: 'Dominio total + certificación',
    lessons: [
      { id: '5.1', title: 'Mapa conceptual: IAS 19 completo' },
      { id: 'challenge-5', title: 'Evaluación Final' },
    ],
    available: true,
  },
];

function getAllLessons(): { lesson: LessonData; module: ModuleData }[] {
  const all: { lesson: LessonData; module: ModuleData }[] = [];
  courseStructure.forEach((mod) => {
    mod.lessons.forEach((les) => {
      all.push({ lesson: les, module: mod });
    });
  });
  return all;
}

function QuizInline({ question, options, correctIndex, explanation }: {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="my-10 border border-gray-100 rounded-xl p-6 sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Evaluaci&oacute;n r&aacute;pida</span>
      <p className="mt-3 text-base font-medium text-gray-900">{question}</p>

      <div className="mt-5 space-y-2">
        {options.map((opt, i) => {
          let style = 'border-gray-100 hover:border-gray-200 hover:bg-gray-50';
          if (submitted) {
            if (i === correctIndex) style = 'border-green-200 bg-green-50';
            else if (i === selected) style = 'border-red-200 bg-red-50';
          } else if (i === selected) {
            style = 'border-[#004B87]/30 bg-blue-50/50';
          }

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                  submitted && i === correctIndex ? 'border-green-500 bg-green-500 text-white' :
                  submitted && i === selected ? 'border-red-400 bg-red-400 text-white' :
                  i === selected ? 'border-[#004B87] text-[#004B87]' :
                  'border-gray-200 text-gray-400'
                }`}>
                  {submitted && i === correctIndex ? '✓' : String.fromCharCode(65 + i)}
                </span>
                <span className={submitted && i === correctIndex ? 'text-green-900 font-medium' : submitted && i === selected ? 'text-red-800' : 'text-gray-700'}>
                  {opt}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={() => selected !== null && setSubmitted(true)}
          disabled={selected === null}
          className="mt-5 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-30"
          style={{ backgroundColor: '#004B87' }}
        >
          Verificar
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-5 px-4 py-3 rounded-lg text-sm leading-relaxed ${
            selected === correctIndex ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-amber-50 text-amber-800 border border-amber-100'
          }`}
        >
          {selected === correctIndex ? <span className="font-semibold">Correcto. </span> : <span className="font-semibold">Incorrecto. </span>}
          {explanation}
        </motion.div>
      )}
    </div>
  );
}

function KeyConcept({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="my-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#004B87' }} />
        <span className="text-sm font-bold text-gray-900">{title}</span>
      </div>
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}

function Lesson11() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Antes de entrar en detalles t&eacute;cnicos, necesitas entender <em>por qu&eacute;</em> existe 
          esta norma y qu&eacute; problema resuelve. IAS 19 es una de las normas m&aacute;s relevantes 
          en la pr&aacute;ctica contable internacional, y su impacto directo en los estados financieros 
          la hace indispensable para cualquier profesional.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        &iquest;Qu&eacute; es IAS 19?
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        IAS 19 es la norma internacional (IFRS) que establece c&oacute;mo debe un empleador contabilizar 
        los beneficios a empleados. Su objetivo es prescribir el tratamiento contable y las revelaciones 
        necesarias para <strong>todas las formas de compensaci&oacute;n</strong> que una entidad entrega 
        a cambio del servicio prestado por sus empleados, o por la terminaci&oacute;n del empleo.
      </p>

      <KeyConcept title="Principio fundamental">
        El costo de proveer beneficios a empleados debe reconocerse en el periodo en que el 
        empleado presta el servicio, <strong>no cuando se paga</strong>. Este principio de devengo 
        es la base de toda la norma.
      </KeyConcept>

      <p className="text-base text-gray-600 leading-relaxed">
        Esto significa que si un empleado trabaj&oacute; durante 2024, el gasto correspondiente a sus 
        beneficios se registra en 2024, incluso si el pago real ocurre en 2025 o despu&eacute;s. 
        La norma detalla c&oacute;mo medir cada categor&iacute;a de beneficio, con atenci&oacute;n 
        especial a los beneficios post-empleo.
      </p>

      <div className="my-12 py-10 px-6 sm:px-10 rounded-2xl bg-gradient-to-br from-[#004B87] to-[#0066CC] text-white">
        <h3 className="text-lg font-semibold mb-8">Flujo fundamental de IAS 19</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          <div className="bg-white/15 rounded-xl px-6 py-5 text-center backdrop-blur-sm min-w-[120px]">
            <span className="font-semibold">Empleador</span>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-white/50">Beneficios</span>
              <svg className="w-24 sm:w-32 h-5" viewBox="0 0 128 20" fill="none">
                <path d="M4 10h112" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M108 4l8 6-8 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="sm:hidden text-xs text-white/50">Beneficios</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="sm:hidden text-xs text-white/50">Servicios</span>
              <svg className="w-24 sm:w-32 h-5" viewBox="0 0 128 20" fill="none">
                <path d="M124 10H12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M20 4l-8 6 8 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden sm:inline text-xs text-white/50">Servicios</span>
            </div>
          </div>

          <div className="bg-white/15 rounded-xl px-6 py-5 text-center backdrop-blur-sm min-w-[120px]">
            <span className="font-semibold">Empleado</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-sm text-white/70 text-center leading-relaxed">
          El empleador entrega <span className="text-white font-medium">beneficios</span> a cambio 
          de los <span className="text-white font-medium">servicios</span> prestados por el empleado.
          <br className="hidden sm:block" />
          IAS 19 establece c&oacute;mo reconocer el costo de esos beneficios.
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Alcance de la norma
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        IAS 19 aplica a <strong>todos los beneficios a empleados</strong>, excepto los que est&aacute;n 
        cubiertos por IFRS 2 (pagos basados en acciones). La norma no se limita a contratos formales; 
        tambi&eacute;n cubre obligaciones que surgen de:
      </p>

      <div className="my-6 grid gap-3">
        <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-100">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold" style={{ color: '#004B87' }}>1</span>
          <div>
            <span className="text-sm font-medium text-gray-900">Planes formales</span>
            <p className="text-sm text-gray-500 mt-0.5">Acuerdos escritos entre la entidad y los empleados o sus representantes</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-100">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold" style={{ color: '#004B87' }}>2</span>
          <div>
            <span className="text-sm font-medium text-gray-900">Requisitos legales</span>
            <p className="text-sm text-gray-500 mt-0.5">Legislaci&oacute;n laboral o acuerdos sectoriales (ej. Ley Federal del Trabajo en M&eacute;xico)</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-100">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold" style={{ color: '#004B87' }}>3</span>
          <div>
            <span className="text-sm font-medium text-gray-900">Pr&aacute;cticas informales</span>
            <p className="text-sm text-gray-500 mt-0.5">Costumbres que generan una obligaci&oacute;n impl&iacute;cita (constructive obligation)</p>
          </div>
        </div>
      </div>

      <KeyConcept title="Exclusi&oacute;n importante">
        IAS 19 <strong>no</strong> trata la informaci&oacute;n financiera de los planes de beneficios 
        como tales (eso lo cubre IAS 26). IAS 19 se enfoca exclusivamente en c&oacute;mo el 
        <strong> empleador</strong> contabiliza las obligaciones.
      </KeyConcept>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        &iquest;Por qu&eacute; importa tanto?
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        En el entorno econ&oacute;mico actual, los beneficios a empleados representan una de las 
        partidas m&aacute;s significativas en los estados financieros. Dos factores han intensificado 
        la atenci&oacute;n sobre esta &aacute;rea:
      </p>

      <div className="my-6 grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-red-100 bg-red-50/50">
          <span className="text-sm font-semibold text-red-800">Obligaciones mayores</span>
          <p className="text-sm text-red-700/80 mt-1">Tasas de descuento bajas incrementan el valor presente de las obligaciones futuras</p>
        </div>
        <div className="p-5 rounded-xl border border-red-100 bg-red-50/50">
          <span className="text-sm font-semibold text-red-800">Fondos insuficientes</span>
          <p className="text-sm text-red-700/80 mt-1">Los activos del plan no alcanzan a cubrir las obligaciones con los empleados</p>
        </div>
      </div>

      <p className="text-base text-gray-600 leading-relaxed">
        Aplicar correctamente IAS 19 revela si los planes de beneficio de una entidad est&aacute;n 
        en d&eacute;ficit, lo cual puede afectar adversamente el patrimonio reportado. Esto hace 
        que la norma tenga un impacto directo en la percepci&oacute;n de los inversionistas, 
        acreedores y reguladores.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Relevancia en M&eacute;xico: NIF D-3
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        En M&eacute;xico, la norma equivalente es la <strong>NIF D-3 &mdash; Beneficios a los empleados</strong>, 
        emitida por el CINIF. Aunque NIF D-3 ha convergido significativamente con IAS 19, existen 
        diferencias puntuales en el tratamiento de remediciones y en la aplicaci&oacute;n del m&eacute;todo 
        de banda de fluctuaci&oacute;n. Dominar IAS 19 te da la base internacional para comprender 
        ambos marcos normativos.
      </p>

      <QuizInline
        question="&iquest;Cu&aacute;l es el principio fundamental de IAS 19?"
        options={[
          'Los beneficios a empleados se reconocen cuando se pagan en efectivo',
          'El costo de los beneficios se reconoce en el periodo en que el empleado presta el servicio',
          'Solo los beneficios formalizados en contrato deben reconocerse',
          'Los beneficios post-empleo no requieren reconocimiento anticipado',
        ]}
        correctIndex={1}
        explanation="IAS 19 establece que el costo de proveer beneficios debe reconocerse cuando el empleado presta el servicio, no cuando el pago se realiza. Este principio de devengo aplica a todas las categorías de beneficios."
      />

      <QuizInline
        question="&iquest;Cu&aacute;l de los siguientes est&aacute; FUERA del alcance de IAS 19?"
        options={[
          'Vacaciones pagadas establecidas por contrato colectivo',
          'Prima de antigüedad bajo la Ley Federal del Trabajo',
          'Opciones sobre acciones otorgadas a empleados (IFRS 2)',
          'Bono anual por práctica informal de la empresa',
        ]}
        correctIndex={2}
        explanation="Los pagos basados en acciones (share-based payments) están cubiertos por IFRS 2, no por IAS 19. Todos los demás beneficios —ya sean formales, legales o por práctica informal— caen dentro del alcance de IAS 19."
      />
    </>
  );
}

function DragDropClassifier({ instruction, categories, items, correctMapping, explanations }: {
  instruction: string;
  categories: string[];
  items: string[];
  correctMapping: Record<string, string>;
  explanations: Record<string, string>;
}) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const unassigned = items.filter((item) => !assignments[item]);
  const getItemsInCategory = (cat: string) => items.filter((item) => assignments[item] === cat);

  const score = submitted
    ? items.filter((item) => assignments[item] === correctMapping[item]).length
    : 0;

  const handleDragStart = (item: string) => setDragging(item);

  const handleDrop = (category: string) => {
    if (dragging && !submitted) {
      setAssignments((prev) => ({ ...prev, [dragging]: category }));
      setDragging(null);
    }
  };

  const handleRemove = (item: string) => {
    if (!submitted) {
      setAssignments((prev) => {
        const next = { ...prev };
        delete next[item];
        return next;
      });
    }
  };

  const handleTap = (item: string, category?: string) => {
    if (submitted) return;
    if (category) {
      handleRemove(item);
    } else {
      const availableCategories = categories.filter(
        (cat) => !assignments[item] || assignments[item] !== cat
      );
      if (availableCategories.length > 0) {
        const targetIndex = categories.indexOf(assignments[item] || '');
        const nextCat = categories[(targetIndex + 1) % categories.length];
        setAssignments((prev) => ({ ...prev, [item]: nextCat }));
      }
    }
  };

  return (
    <div className="my-10 border border-gray-100 rounded-xl p-6 sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Ejercicio interactivo</span>
      <p className="mt-3 text-base font-medium text-gray-900">{instruction}</p>

      {unassigned.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {unassigned.map((item) => (
            <button
              key={item}
              draggable={!submitted}
              onDragStart={() => handleDragStart(item)}
              onClick={() => handleTap(item)}
              className={`px-3 py-2 rounded-lg border text-sm cursor-grab active:cursor-grabbing transition-all ${
                dragging === item ? 'border-[#004B87] bg-blue-50 scale-95' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <div className={`mt-6 grid gap-4 ${categories.length === 2 ? 'sm:grid-cols-2' : categories.length === 3 ? 'sm:grid-cols-3' : 'grid-cols-1'}`}>
        {categories.map((cat) => {
          const catItems = getItemsInCategory(cat);
          return (
            <div
              key={cat}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={() => handleDrop(cat)}
              className={`rounded-xl border-2 border-dashed p-4 min-h-[120px] transition-colors ${
                dragging ? 'border-[#004B87]/30 bg-blue-50/30' : 'border-gray-200 bg-gray-50/50'
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-3">{cat}</span>
              <div className="space-y-2">
                {catItems.map((item) => {
                  let itemStyle = 'border-gray-200 bg-white';
                  if (submitted) {
                    itemStyle = assignments[item] === correctMapping[item]
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50';
                  }
                  return (
                    <div
                      key={item}
                      onClick={() => handleTap(item, cat)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-all ${itemStyle} ${!submitted ? 'cursor-pointer hover:border-gray-300' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{item}</span>
                        {submitted && (
                          <span className="text-xs flex-shrink-0">
                            {assignments[item] === correctMapping[item] ? '✓' : '✗'}
                          </span>
                        )}
                        {!submitted && (
                          <span className="text-gray-300 text-xs flex-shrink-0">✕</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-400">Arrastra cada elemento a su categoría, o toca para asignar. Toca un elemento asignado para removerlo.</p>

      {!submitted ? (
        <button
          onClick={() => unassigned.length === 0 && setSubmitted(true)}
          disabled={unassigned.length > 0}
          className="mt-5 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-30"
          style={{ backgroundColor: '#004B87' }}
        >
          Verificar
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-5 px-4 py-3 rounded-lg text-sm leading-relaxed ${
            score === items.length
              ? 'bg-green-50 text-green-800 border border-green-100'
              : 'bg-amber-50 text-amber-800 border border-amber-100'
          }`}
        >
          <span className="font-semibold">{score}/{items.length} correctas. </span>
          {score === items.length ? 'Excelente trabajo.' : 'Revisa los elementos marcados con ✗.'}
          {Object.keys(explanations).length > 0 && (
            <div className="mt-3 space-y-1">
              {items.filter((item) => assignments[item] !== correctMapping[item]).map((item) => (
                <p key={item}><span className="font-medium">{item}:</span> {explanations[item] || `Pertenece a "${correctMapping[item]}".`}</p>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function Lesson12() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          IAS 19 organiza todos los beneficios a empleados en <strong>cuatro categorías</strong> fundamentales.
          Entender esta clasificación es esencial porque cada categoría tiene un tratamiento contable distinto.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Las 4 categorías
      </h2>

      <div className="my-8 space-y-4">
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 flex items-start gap-4" style={{ backgroundColor: '#f0f7fe' }}>
            <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#004B87' }}>1</span>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Beneficios a corto plazo</h3>
              <p className="text-sm text-gray-600 mt-1">
                Se espera que se liquiden <strong>totalmente dentro de los 12 meses</strong> posteriores 
                al cierre del periodo anual en que el empleado prestó el servicio.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Salarios</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Seguridad social</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Vacaciones pagadas</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Licencias por enfermedad</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Bonos a corto plazo</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Beneficios no monetarios</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 flex items-start gap-4" style={{ backgroundColor: '#f0f7fe' }}>
            <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#004B87' }}>2</span>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Beneficios post-empleo</h3>
              <p className="text-sm text-gray-600 mt-1">
                Pagaderos <strong>después de que termina la relación laboral</strong>. 
                No incluyen beneficios por terminación ni beneficios a corto plazo.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Pensiones</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Seguros de vida post-empleo</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Asistencia médica post-empleo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 flex items-start gap-4" style={{ backgroundColor: '#f0f7fe' }}>
            <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#004B87' }}>3</span>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Otros beneficios a largo plazo</h3>
              <p className="text-sm text-gray-600 mt-1">
                Todo lo que <strong>no es corto plazo, ni post-empleo, ni terminación</strong>. 
                Son beneficios vigentes durante la relación laboral pero con horizonte mayor a 12 meses.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Licencias sabáticas</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Bonos por aniversario</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Bonos por servicio prolongado</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600 border border-gray-100">Compensación diferida {'>'}12 meses</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 flex items-start gap-4" style={{ backgroundColor: '#f0f7fe' }}>
            <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#004B87' }}>4</span>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Beneficios por terminación</h3>
              <p className="text-sm text-gray-600 mt-1">
                Resultado de la <strong>decisión de la entidad</strong> de terminar el empleo antes 
                de la fecha normal de retiro, o de la decisión del empleado de aceptar una 
                separacion voluntaria.
              </p>
              <p className="text-xs text-gray-400 mt-2 italic">Se cubren a profundidad en el Nivel 4.</p>
            </div>
          </div>
        </div>
      </div>

      <KeyConcept title="Regla de los 12 meses">
        La línea divisoria principal es el <strong>periodo de 12 meses</strong> posterior al cierre 
        del ejercicio. Si el beneficio se liquidará completamente dentro de esos 12 meses, es de 
        corto plazo. Si no, hay que evaluar si es post-empleo, otro beneficio a largo plazo, o por terminación.
      </KeyConcept>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Mapa visual de clasificación
      </h2>

      <div className="my-8 py-8 px-6 sm:px-10 rounded-2xl bg-gradient-to-br from-[#004B87] to-[#0066CC] text-white">
        <div className="text-center mb-6">
          <span className="text-sm font-semibold">Beneficio a empleado</span>
          <div className="w-px h-6 bg-white/30 mx-auto mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <span className="text-xs text-white/60 block mb-1">¿Se liquida {'<'} 12 meses?</span>
            <span className="font-semibold text-sm">Sí → Corto plazo</span>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <span className="text-xs text-white/60 block mb-1">¿Es por terminar el empleo?</span>
            <span className="font-semibold text-sm">Sí → Terminación</span>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <span className="text-xs text-white/60 block mb-1">¿Se paga después del empleo?</span>
            <span className="font-semibold text-sm">Sí → Post-empleo</span>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <span className="text-xs text-white/60 block mb-1">¿Ninguno de los anteriores?</span>
            <span className="font-semibold text-sm">→ Otro largo plazo</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        La diferencia clave: ¿durante o después del empleo?
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        Más allá de los 12 meses, la distinción principal entre categorías es <strong>cuándo se 
        paga el beneficio en relación con el empleo</strong>:
      </p>

      <div className="my-6 grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50">
          <span className="text-sm font-semibold text-gray-900">Durante el empleo</span>
          <p className="text-sm text-gray-600 mt-1">
            Si el beneficio se relaciona con el periodo activo del empleado (bonos por 
            antigüedad, licencias sabáticas), es un <strong>otro beneficio a largo plazo</strong>.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50">
          <span className="text-sm font-semibold text-gray-900">Después del empleo</span>
          <p className="text-sm text-gray-600 mt-1">
            Si el beneficio se paga una vez que termina la relación laboral (pensiones, seguro 
            médico de jubilados), es un <strong>beneficio post-empleo</strong>.
          </p>
        </div>
      </div>

      <DragDropClassifier
        instruction="Clasifica cada beneficio en su categoría correcta según IAS 19."
        categories={['Corto plazo', 'Post-empleo', 'Otro largo plazo', 'Terminación']}
        items={[
          'Aguinaldo pagadero en diciembre',
          'Plan de pensiones para jubilados',
          'Bono por 20 años de servicio',
          'Seguro médico para empleados activos',
          'Indemnización por despido',
          'Compensación diferida a 18 meses',
          'Seguro de vida post-retiro',
          'Vacaciones anuales',
        ]}
        correctMapping={{
          'Aguinaldo pagadero en diciembre': 'Corto plazo',
          'Plan de pensiones para jubilados': 'Post-empleo',
          'Bono por 20 años de servicio': 'Otro largo plazo',
          'Seguro médico para empleados activos': 'Corto plazo',
          'Indemnización por despido': 'Terminación',
          'Compensación diferida a 18 meses': 'Otro largo plazo',
          'Seguro de vida post-retiro': 'Post-empleo',
          'Vacaciones anuales': 'Corto plazo',
        }}
        explanations={{
          'Aguinaldo pagadero en diciembre': 'Se liquida dentro de los 12 meses → corto plazo.',
          'Plan de pensiones para jubilados': 'Se paga después de terminada la relación laboral → post-empleo.',
          'Bono por 20 años de servicio': 'Es un beneficio vigente durante el empleo pero a más de 12 meses → otro largo plazo.',
          'Seguro médico para empleados activos': 'Es un beneficio no monetario para empleados actuales, liquidado en el periodo → corto plazo.',
          'Indemnización por despido': 'Surge de la decisión de la entidad de terminar el empleo → terminación.',
          'Compensación diferida a 18 meses': 'Se paga más de 12 meses después del periodo → otro largo plazo.',
          'Seguro de vida post-retiro': 'Se paga después de terminada la relación laboral → post-empleo.',
          'Vacaciones anuales': 'Se liquidan dentro de los 12 meses posteriores al cierre → corto plazo.',
        }}
      />

      <QuizInline
        question="Una empresa paga un bono especial a empleados que cumplan 15 años de servicio. ¿En qué categoría se clasifica?"
        options={[
          'Beneficio a corto plazo',
          'Beneficio post-empleo',
          'Otro beneficio a largo plazo',
          'Beneficio por terminación',
        ]}
        correctIndex={2}
        explanation="El bono por antigüedad (jubilee) se otorga durante la relación laboral activa, pero con un horizonte mayor a 12 meses. No es post-empleo porque el empleado aún trabaja cuando lo recibe. Es un otro beneficio a largo plazo."
      />

      <QuizInline
        question="¿Cuál es el criterio principal para distinguir un beneficio a corto plazo de los demás?"
        options={[
          'Si el beneficio es monetario o no monetario',
          'Si se espera liquidar totalmente dentro de los 12 meses posteriores al cierre del periodo',
          'Si el beneficio está formalizado en un contrato',
          'Si el beneficio involucra un plan de inversión',
        ]}
        correctIndex={1}
        explanation="El criterio es temporal: si se espera que el beneficio se liquide totalmente dentro de los 12 meses posteriores al cierre del periodo anual en que se prestó el servicio, es de corto plazo. No importa si es monetario o contractual."
      />

      <QuizInline
        question="Un empleado recibe seguro de gastos médicos que cubre tanto su periodo activo como su jubilación. ¿Cómo se clasifica?"
        options={[
          'Todo como beneficio a corto plazo',
          'Todo como beneficio post-empleo',
          'La parte activa como corto plazo, la parte de jubilación como post-empleo',
          'Todo como otro beneficio a largo plazo',
        ]}
        correctIndex={2}
        explanation="Se clasifican por separado: el seguro médico durante el empleo activo es un beneficio a corto plazo (se consume en el periodo). La cobertura médica post-retiro es un beneficio post-empleo porque se paga después de terminada la relación laboral."
      />
    </>
  );
}

function VacationSimulator() {
  const [employees, setEmployees] = useState('');
  const [dailySalary, setDailySalary] = useState('');
  const [entitlement, setEntitlement] = useState('');
  const [avgTaken, setAvgTaken] = useState('');
  const [calculated, setCalculated] = useState(false);

  const numEmployees = parseFloat(employees) || 0;
  const numDailySalary = parseFloat(dailySalary) || 0;
  const numEntitlement = parseFloat(entitlement) || 0;
  const numAvgTaken = parseFloat(avgTaken) || 0;

  const unusedDays = Math.max(0, numEntitlement - numAvgTaken);
  const totalUnusedDays = unusedDays * numEmployees;
  const liability = totalUnusedDays * numDailySalary;

  const canCalculate = numEmployees > 0 && numDailySalary > 0 && numEntitlement > 0 && avgTaken !== '';

  return (
    <div className="my-10 border border-gray-100 rounded-xl p-6 sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Simulador</span>
      <p className="mt-3 text-base font-medium text-gray-900">Calculadora de pasivo por vacaciones acumuladas</p>
      <p className="mt-1 text-sm text-gray-500">Ingresa los datos para calcular el pasivo que debe reconocerse al cierre del periodo.</p>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">N&uacute;mero de empleados</label>
          <input
            type="number"
            value={employees}
            onChange={(e) => { setEmployees(e.target.value); setCalculated(false); }}
            placeholder="50"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Salario diario promedio ($)</label>
          <input
            type="number"
            value={dailySalary}
            onChange={(e) => { setDailySalary(e.target.value); setCalculated(false); }}
            placeholder="800"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">D&iacute;as de vacaciones anuales</label>
          <input
            type="number"
            value={entitlement}
            onChange={(e) => { setEntitlement(e.target.value); setCalculated(false); }}
            placeholder="15"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">D&iacute;as promedio tomados en el periodo</label>
          <input
            type="number"
            value={avgTaken}
            onChange={(e) => { setAvgTaken(e.target.value); setCalculated(false); }}
            placeholder="12"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20 transition-colors"
          />
        </div>
      </div>

      <button
        onClick={() => canCalculate && setCalculated(true)}
        disabled={!canCalculate}
        className="mt-5 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-30"
        style={{ backgroundColor: '#004B87' }}
      >
        Calcular pasivo
      </button>

      <AnimatePresence>
        {calculated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100"
          >
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-500">D&iacute;as no utilizados por empleado</span>
                <span className="font-mono font-medium text-gray-900">{unusedDays} d&iacute;as</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-500">Total d&iacute;as acumulados ({numEmployees} empleados)</span>
                <span className="font-mono font-medium text-gray-900">{totalUnusedDays} d&iacute;as</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-500">Salario diario promedio</span>
                <span className="font-mono font-medium text-gray-900">${numDailySalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-blue-50 -mx-5 px-5 rounded-lg" style={{ marginTop: '12px' }}>
                <span className="font-semibold" style={{ color: '#004B87' }}>Pasivo a reconocer</span>
                <span className="font-mono font-bold text-lg" style={{ color: '#004B87' }}>${liability.toLocaleString()}</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400 leading-relaxed">
              F&oacute;rmula: ({numEntitlement} - {numAvgTaken}) d&iacute;as &times; {numEmployees} empleados &times; ${numDailySalary.toLocaleString()} = <strong>${liability.toLocaleString()}</strong>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Lesson13() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Ya sabes qu&eacute; son los beneficios a corto plazo. Ahora aprenderás <strong>c&oacute;mo 
          se reconocen y miden</strong> en los estados financieros, incluyendo el tratamiento 
          espec&iacute;fico para vacaciones y bonos.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Regla general de reconocimiento
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        La entidad reconoce el monto <strong>no descontado</strong> de los beneficios a corto plazo 
        que espera pagar a cambio del servicio prestado durante el periodo:
      </p>

      <div className="my-6 grid gap-3">
        <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-100">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold" style={{ color: '#004B87' }}>1</span>
          <div>
            <span className="text-sm font-medium text-gray-900">Como pasivo (gasto acumulado)</span>
            <p className="text-sm text-gray-500 mt-0.5">Despu&eacute;s de deducir cualquier monto ya pagado. Si el pago excede el beneficio, el exceso se reconoce como activo (gasto prepagado).</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-100">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold" style={{ color: '#004B87' }}>2</span>
          <div>
            <span className="text-sm font-medium text-gray-900">Como gasto en resultados</span>
            <p className="text-sm text-gray-500 mt-0.5">A menos que otra norma IFRS permita incluirlo en el costo de un activo (ej. IAS 16 para propiedad, planta y equipo).</p>
          </div>
        </div>
      </div>

      <KeyConcept title="Sin descuento">
        A diferencia de los beneficios a largo plazo, los de corto plazo se miden al <strong>monto 
        no descontado</strong>. No se aplica valor presente porque el horizonte temporal es menor a 
        12 meses y el efecto del descuento ser&iacute;a inmaterial.
      </KeyConcept>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Ausencias compensadas
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        Las ausencias compensadas (vacaciones, licencias por enfermedad, maternidad) tienen un 
        tratamiento espec&iacute;fico seg&uacute;n sean <strong>acumulables</strong> o <strong>no acumulables</strong>.
      </p>

      <div className="my-8 grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border-2 border-[#004B87]/20 bg-blue-50/30">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Acumulables</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Se pueden transferir a periodos futuros si no se utilizan en el periodo actual.
          </p>
          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-100">
            <span className="text-xs font-semibold" style={{ color: '#004B87' }}>¿Cuándo reconocer?</span>
            <p className="text-xs text-gray-600 mt-1">Cuando el empleado presta servicio que <strong>incrementa</strong> su derecho a ausencias futuras.</p>
          </div>
          <div className="mt-2 p-3 bg-white rounded-lg border border-gray-100">
            <span className="text-xs font-semibold" style={{ color: '#004B87' }}>Ejemplo</span>
            <p className="text-xs text-gray-600 mt-1">Vacaciones anuales que se acumulan si no se toman.</p>
          </div>
        </div>
        <div className="p-5 rounded-xl border-2 border-gray-200 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900 mb-2">No acumulables</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            No se transfieren. Si no se usan, se pierden al cierre del periodo o cuando el empleado se va.
          </p>
          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-100">
            <span className="text-xs font-semibold text-gray-500">¿Cuándo reconocer?</span>
            <p className="text-xs text-gray-600 mt-1">Cuando la ausencia <strong>ocurre</strong>, porque el servicio no incrementa el beneficio.</p>
          </div>
          <div className="mt-2 p-3 bg-white rounded-lg border border-gray-100">
            <span className="text-xs font-semibold text-gray-500">Ejemplo</span>
            <p className="text-xs text-gray-600 mt-1">Licencia de maternidad, incapacidad por enfermedad.</p>
          </div>
        </div>
      </div>

      <KeyConcept title="Implicación clave de las ausencias acumulables">
        Si los empleados tienen derecho a un pago en efectivo por el saldo no utilizado al dejar la 
        entidad (vested entitlement), se acumulan <strong>todos los d&iacute;as no utilizados</strong>. 
        Si no tienen ese derecho, la probabilidad de que se vayan afecta la <strong>medici&oacute;n</strong> de 
        la obligaci&oacute;n, pero no su existencia.
      </KeyConcept>

      <VacationSimulator />

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Bonos y participaci&oacute;n de utilidades
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        Los planes de bonos y participaci&oacute;n de utilidades (PTU en M&eacute;xico) que se liquidan 
        a corto plazo se reconocen cuando se cumplen <strong>dos condiciones simult&aacute;neas</strong>:
      </p>

      <div className="my-6 grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold mb-3" style={{ color: '#004B87' }}>A</div>
          <span className="text-sm font-semibold text-gray-900">Obligaci&oacute;n presente</span>
          <p className="text-sm text-gray-600 mt-1">
            La entidad tiene una obligaci&oacute;n legal o impl&iacute;cita de pagar, como resultado de eventos pasados.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold mb-3" style={{ color: '#004B87' }}>B</div>
          <span className="text-sm font-semibold text-gray-900">Estimaci&oacute;n confiable</span>
          <p className="text-sm text-gray-600 mt-1">
            Se puede hacer una estimaci&oacute;n confiable del monto de la obligaci&oacute;n.
          </p>
        </div>
      </div>

      <KeyConcept title="Obligaci&oacute;n impl&iacute;cita en bonos">
        Si una empresa ha pagado bonos consistentemente durante a&ntilde;os aunque no tenga 
        obligaci&oacute;n contractual, genera una <strong>obligaci&oacute;n impl&iacute;cita</strong> 
        (constructive obligation). Los empleados esperan razonablemente recibir ese bono y la 
        entidad debe reconocer el pasivo.
      </KeyConcept>

      <QuizInline
        question="Una empresa tiene 30 empleados con 12 días de vacaciones anuales. En promedio tomaron 10 días cada uno. El salario diario promedio es $500. ¿Cuánto pasivo debe reconocerse por vacaciones acumuladas?"
        options={[
          '$6,000',
          '$15,000',
          '$30,000',
          '$180,000',
        ]}
        correctIndex={2}
        explanation="Días no utilizados: 12 - 10 = 2 por empleado. Total: 2 × 30 = 60 días. Pasivo: 60 × $500 = $30,000. Se reconoce el monto no descontado de los días acumulados."
      />

      <QuizInline
        question="¿Cuándo debe reconocerse el gasto por licencia de maternidad (ausencia no acumulable)?"
        options={[
          'Cuando la empleada informa que está embarazada',
          'Cuando la empleada presta servicio durante el año',
          'Cuando la ausencia efectivamente ocurre',
          'Al inicio del periodo anual',
        ]}
        correctIndex={2}
        explanation="Las ausencias no acumulables se reconocen cuando la ausencia ocurre, porque el servicio del empleado no incrementa el derecho al beneficio. No se genera pasivo anticipado."
      />
    </>
  );
}

function Lesson14() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Los beneficios post-empleo se canalizan a trav&eacute;s de <strong>planes</strong>. 
          IAS 19 clasifica estos planes en dos tipos fundamentales seg&uacute;n su sustancia 
          econ&oacute;mica: <strong>contribuci&oacute;n definida (DC)</strong> y <strong>beneficio 
          definido (DB)</strong>. Esta distinci&oacute;n determina todo el tratamiento contable.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Planes de contribuci&oacute;n definida (DC)
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        En un plan DC, la entidad paga contribuciones fijas a un fondo separado y <strong>no tiene 
        obligaci&oacute;n adicional</strong> si el fondo resulta insuficiente para cubrir los beneficios. 
        Los t&eacute;rminos del plan definen <em>cu&aacute;nto se aporta</em>, no cu&aacute;nto 
        recibir&aacute; el empleado.
      </p>

      <div className="my-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-xs">✓</span>
            </span>
            <p className="text-sm text-gray-700">La obligaci&oacute;n de la entidad se <strong>limita</strong> al monto que acord&oacute; contribuir</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-xs">✓</span>
            </span>
            <p className="text-sm text-gray-700">El beneficio final depende de las contribuciones pagadas <strong>m&aacute;s los rendimientos</strong> de inversi&oacute;n</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 text-xs">!</span>
            </span>
            <p className="text-sm text-gray-700">El riesgo actuarial y de inversi&oacute;n recae en el <strong>empleado</strong></p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Planes de beneficio definido (DB)
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        En un plan DB, la entidad se compromete a pagar un <strong>beneficio espec&iacute;fico</strong> al 
        empleado tras su retiro, generalmente calculado con una f&oacute;rmula basada en factores como 
        a&ntilde;os de servicio y salario final. El plan define <em>cu&aacute;nto recibir&aacute;</em> el 
        empleado, no cu&aacute;nto aporta la entidad.
      </p>

      <div className="my-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xs">!</span>
            </span>
            <p className="text-sm text-gray-700">La entidad est&aacute; obligada a proveer los beneficios acordados a empleados actuales <strong>y anteriores</strong></p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xs">!</span>
            </span>
            <p className="text-sm text-gray-700">El riesgo actuarial y de inversi&oacute;n recae en la <strong>entidad</strong></p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xs">!</span>
            </span>
            <p className="text-sm text-gray-700">Requiere <strong>estimaciones actuariales</strong> complejas y el m&eacute;todo de Cr&eacute;dito Unitario Proyectado</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Comparaci&oacute;n directa
      </h2>

      <div className="my-8 rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200" style={{ backgroundColor: '#f0f7fe' }}>
              <th className="text-left px-5 py-3 font-semibold text-gray-900">Aspecto</th>
              <th className="text-left px-5 py-3 font-semibold" style={{ color: '#004B87' }}>DC</th>
              <th className="text-left px-5 py-3 font-semibold" style={{ color: '#004B87' }}>DB</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-5 py-3 text-gray-600 font-medium">Se define...</td>
              <td className="px-5 py-3 text-gray-700">La contribuci&oacute;n</td>
              <td className="px-5 py-3 text-gray-700">El beneficio</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-5 py-3 text-gray-600 font-medium">Obligaci&oacute;n de la entidad</td>
              <td className="px-5 py-3 text-gray-700">Limitada a la contribuci&oacute;n</td>
              <td className="px-5 py-3 text-gray-700">Proveer el beneficio prometido</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-5 py-3 text-gray-600 font-medium">Riesgo actuarial</td>
              <td className="px-5 py-3 text-gray-700">Empleado</td>
              <td className="px-5 py-3 text-gray-700">Entidad</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-5 py-3 text-gray-600 font-medium">Riesgo de inversi&oacute;n</td>
              <td className="px-5 py-3 text-gray-700">Empleado</td>
              <td className="px-5 py-3 text-gray-700">Entidad</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-5 py-3 text-gray-600 font-medium">Complejidad contable</td>
              <td className="px-5 py-3 text-gray-700">Baja</td>
              <td className="px-5 py-3 text-gray-700">Alta (actuario requerido)</td>
            </tr>
            <tr>
              <td className="px-5 py-3 text-gray-600 font-medium">Ejemplo</td>
              <td className="px-5 py-3 text-gray-700">&quot;5% del salario al fondo&quot;</td>
              <td className="px-5 py-3 text-gray-700">&quot;2% del salario final &times; a&ntilde;os de servicio&quot;</td>
            </tr>
          </tbody>
        </table>
      </div>

      <KeyConcept title="La prueba definitiva">
        Si la entidad puede operar despu&eacute;s de hacer sus contribuciones sin importar lo que 
        pase con el fondo, es <strong>DC</strong>. Si la entidad retiene la obligaci&oacute;n de que 
        el empleado reciba un beneficio espec&iacute;fico sin importar lo que pase con el fondo, es <strong>DB</strong>.
      </KeyConcept>

      <div className="my-12 py-10 px-6 sm:px-10 rounded-2xl bg-gradient-to-br from-[#004B87] to-[#0066CC] text-white">
        <h3 className="text-lg font-semibold mb-6">¿D&oacute;nde recae el riesgo?</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
            <span className="text-xs text-white/60 block mb-2">Contribuci&oacute;n Definida</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">DC</span>
              <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-sm">Riesgo en el <strong>empleado</strong></span>
            </div>
            <p className="text-xs text-white/50 mt-2">Si el fondo no rinde lo suficiente, el empleado recibe menos pensi&oacute;n. La entidad ya cumpli&oacute;.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
            <span className="text-xs text-white/60 block mb-2">Beneficio Definido</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">DB</span>
              <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm">Riesgo en la <strong>entidad</strong></span>
            </div>
            <p className="text-xs text-white/50 mt-2">Si el fondo no alcanza, la entidad debe cubrir la diferencia. El empleado recibe su beneficio prometido.</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Casos especiales de clasificaci&oacute;n
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        Algunos planes no encajan directamente en la definici&oacute;n b&aacute;sica de DC o DB. 
        IAS 19 da gu&iacute;a espec&iacute;fica para tres tipos:
      </p>

      <div className="my-6 space-y-3">
        <div className="p-5 rounded-xl border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Planes multi-empleador</h3>
          <p className="text-sm text-gray-600 mt-1">
            Agrupan activos de varias entidades sin control com&uacute;n. Si es DB, cada entidad 
            contabiliza su parte proporcional. Si no hay informaci&oacute;n suficiente para tratamiento 
            DB, se usa contabilidad DC con revelaciones adicionales.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Planes estatales</h3>
          <p className="text-sm text-gray-600 mt-1">
            Establecidos por legislaci&oacute;n (ej. IMSS en M&eacute;xico, seguridad social). Se 
            contabilizan igual que los multi-empleador. La mayor&iacute;a son DC: la &uacute;nica 
            obligaci&oacute;n es pagar las contribuciones cuando se devengan.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Beneficios asegurados</h3>
          <p className="text-sm text-gray-600 mt-1">
            La entidad paga primas de seguro para fondear el plan. Se trata como DC, <strong>a 
            menos que</strong> la entidad retenga la obligaci&oacute;n de pagar directamente al 
            empleado o de cubrir faltantes del asegurador — en cuyo caso es DB.
          </p>
        </div>
      </div>

      <KeyConcept title="Regla para beneficios asegurados">
        El factor determinante es si la entidad retiene riesgo. Pagar una prima no elimina la 
        obligaci&oacute;n autom&aacute;ticamente. Si el empleado puede exigir el pago a la entidad 
        (no solo al asegurador), el plan es <strong>DB</strong> independientemente de que est&eacute; 
        asegurado.
      </KeyConcept>

      <DragDropClassifier
        instruction="Clasifica cada plan como Contribución Definida o Beneficio Definido."
        categories={['Contribución Definida', 'Beneficio Definido']}
        items={[
          'La empresa aporta 5% del salario a un fondo, sin obligación adicional',
          'El empleado recibirá una pensión del 2% del salario final por año de servicio',
          'Cuotas al IMSS (seguridad social)',
          'La empresa paga primas de seguro pero garantiza el beneficio al empleado si la aseguradora no paga',
          'Fondo de ahorro donde la empresa iguala el ahorro del empleado, sin más obligación',
        ]}
        correctMapping={{
          'La empresa aporta 5% del salario a un fondo, sin obligación adicional': 'Contribución Definida',
          'El empleado recibirá una pensión del 2% del salario final por año de servicio': 'Beneficio Definido',
          'Cuotas al IMSS (seguridad social)': 'Contribución Definida',
          'La empresa paga primas de seguro pero garantiza el beneficio al empleado si la aseguradora no paga': 'Beneficio Definido',
          'Fondo de ahorro donde la empresa iguala el ahorro del empleado, sin más obligación': 'Contribución Definida',
        }}
        explanations={{
          'La empresa aporta 5% del salario a un fondo, sin obligación adicional': 'Contribución fija sin obligación posterior → DC.',
          'El empleado recibirá una pensión del 2% del salario final por año de servicio': 'Se promete un beneficio específico basado en fórmula → DB.',
          'Cuotas al IMSS (seguridad social)': 'Plan estatal donde la obligación es solo pagar las cuotas → DC.',
          'La empresa paga primas de seguro pero garantiza el beneficio al empleado si la aseguradora no paga': 'La entidad retiene la obligación → DB aunque esté asegurado.',
          'Fondo de ahorro donde la empresa iguala el ahorro del empleado, sin más obligación': 'Contribución fija (matching) sin obligación adicional → DC.',
        }}
      />

      <QuizInline
        question="¿Cuál es la definición de un plan de beneficio definido según IAS 19?"
        options={[
          'Un plan donde la entidad paga contribuciones fijas a un fondo',
          'Cualquier plan post-empleo que no cumpla la definición de contribución definida',
          'Un plan donde el empleado asume el riesgo actuarial',
          'Un plan establecido por legislación gubernamental',
        ]}
        correctIndex={1}
        explanation="IAS 19 define los planes DB por exclusión: son todos los planes post-empleo que NO cumplen la definición de contribución definida. Esto significa que si hay cualquier obligación retenida más allá de las contribuciones fijas, el plan es DB."
      />

      <QuizInline
        question="Una empresa paga primas a una aseguradora para fondear pensiones. ¿Cuándo se clasifica como DB?"
        options={[
          'Siempre que involucre una aseguradora',
          'Cuando la prima excede cierto porcentaje del salario',
          'Cuando la entidad retiene la obligación de pagar al empleado o cubrir faltantes de la aseguradora',
          'Cuando el plan cubre a más de 100 empleados',
        ]}
        correctIndex={2}
        explanation="Un plan asegurado es DB cuando la entidad retiene obligación legal o implícita de pagar directamente al empleado o de cubrir faltantes si la aseguradora no paga todos los beneficios. El factor clave es si la entidad retiene riesgo."
      />

      <QuizInline
        question="En un plan DC, ¿qué determina el monto del beneficio que recibirá el empleado?"
        options={[
          'Una fórmula basada en años de servicio y salario final',
          'La decisión del consejo de administración al momento del retiro',
          'Las contribuciones pagadas más los rendimientos de inversión del fondo',
          'El cálculo actuarial de la obligación de la entidad',
        ]}
        correctIndex={2}
        explanation="En un plan DC, el beneficio que recibe el empleado depende enteramente de cuánto se aportó al fondo y cuánto rindieron esas inversiones. La entidad no garantiza un monto específico."
      />
    </>
  );
}

function DCSimulator() {
  const [salaries, setSalaries] = useState('');
  const [rate, setRate] = useState('');
  const [paid, setPaid] = useState('');
  const [priorLiability, setPriorLiability] = useState('');
  const [calculated, setCalculated] = useState(false);

  const numSalaries = parseFloat(salaries) || 0;
  const numRate = parseFloat(rate) || 0;
  const numPaid = parseFloat(paid) || 0;
  const numPriorLiab = parseFloat(priorLiability) || 0;

  const contributionDue = numSalaries * (numRate / 100);
  const totalObligation = contributionDue + numPriorLiab;
  const netPosition = numPaid - totalObligation;
  const isAsset = netPosition > 0;
  const isLiability = netPosition < 0;

  const canCalculate = numSalaries > 0 && numRate > 0 && paid !== '';

  return (
    <div className="my-10 border border-gray-100 rounded-xl p-6 sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Simulador</span>
      <p className="mt-3 text-base font-medium text-gray-900">Contabilizaci&oacute;n de plan DC</p>
      <p className="mt-1 text-sm text-gray-500">Ingresa los datos del plan para generar el asiento contable.</p>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Total salarios del periodo ($)</label>
          <input
            type="number"
            value={salaries}
            onChange={(e) => { setSalaries(e.target.value); setCalculated(false); }}
            placeholder="900,000"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Tasa de contribuci&oacute;n (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => { setRate(e.target.value); setCalculated(false); }}
            placeholder="5"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Monto pagado al plan ($)</label>
          <input
            type="number"
            value={paid}
            onChange={(e) => { setPaid(e.target.value); setCalculated(false); }}
            placeholder="40,000"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Pasivo pendiente del periodo anterior ($)</label>
          <input
            type="number"
            value={priorLiability}
            onChange={(e) => { setPriorLiability(e.target.value); setCalculated(false); }}
            placeholder="0"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20 transition-colors"
          />
        </div>
      </div>

      <button
        onClick={() => canCalculate && setCalculated(true)}
        disabled={!canCalculate}
        className="mt-5 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-30"
        style={{ backgroundColor: '#004B87' }}
      >
        Generar asiento
      </button>

      <AnimatePresence>
        {calculated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">C&aacute;lculo</span>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">Contribuci&oacute;n del periodo</span>
                  <span className="font-mono font-medium text-gray-900">${numSalaries.toLocaleString()} &times; {numRate}% = ${contributionDue.toLocaleString()}</span>
                </div>
                {numPriorLiab > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-500">+ Pasivo anterior pendiente</span>
                    <span className="font-mono font-medium text-gray-900">${numPriorLiab.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">Total obligaci&oacute;n</span>
                  <span className="font-mono font-medium text-gray-900">${totalObligation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">Monto pagado</span>
                  <span className="font-mono font-medium text-gray-900">${numPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 font-medium">Posici&oacute;n neta</span>
                  <span className={`font-mono font-bold ${isAsset ? 'text-green-700' : isLiability ? 'text-red-700' : 'text-gray-900'}`}>
                    {isAsset ? `Activo (prepago): $${netPosition.toLocaleString()}` : isLiability ? `Pasivo: $${Math.abs(netPosition).toLocaleString()}` : 'Sin saldo'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 p-5" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#004B87' }}>Asiento contable</span>
              <div className="mt-4 font-mono text-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">Débito: Gasto por pensiones</span>
                  <span className="font-medium text-gray-900">${contributionDue.toLocaleString()}</span>
                </div>
                {numPriorLiab > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900">Débito: Pasivo acumulado (anterior)</span>
                    <span className="font-medium text-gray-900">${numPriorLiab.toLocaleString()}</span>
                  </div>
                )}
                {isAsset && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900">Débito: Gasto prepagado</span>
                    <span className="font-medium text-gray-900">${netPosition.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 pl-8">Crédito: Efectivo</span>
                    <span className="font-medium text-gray-500">${numPaid.toLocaleString()}</span>
                  </div>
                  {isLiability && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-500 pl-8">Crédito: Pasivo acumulado</span>
                      <span className="font-medium text-gray-500">${Math.abs(netPosition).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Lesson15() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          La contabilizaci&oacute;n de planes DC es la m&aacute;s sencilla de IAS 19. La obligaci&oacute;n 
          de la entidad se determina por el monto a contribuir en el periodo — sin c&aacute;lculos 
          actuariales, sin valor presente, sin remediciones.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Principio b&aacute;sico
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        Cuando un empleado ha prestado servicio durante un periodo, la entidad reconoce la 
        contribuci&oacute;n pagadera a cambio de ese servicio en tres posibles formas:
      </p>

      <div className="my-6 space-y-3">
        <div className="p-5 rounded-xl border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold" style={{ color: '#004B87' }}>1</span>
            <div>
              <span className="text-sm font-semibold text-gray-900">Gasto en resultados</span>
              <p className="text-sm text-gray-600 mt-1">
                La contribuci&oacute;n del periodo se reconoce como gasto en P&L, a menos que otra 
                norma IFRS permita capitalizarla (ej. IAS 2 Inventarios, IAS 16 PPE).
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold" style={{ color: '#004B87' }}>2</span>
            <div>
              <span className="text-sm font-semibold text-gray-900">Pasivo (si falta pagar)</span>
              <p className="text-sm text-gray-600 mt-1">
                Si al cierre del periodo la entidad no ha pagado toda la contribuci&oacute;n debida, 
                reconoce un <strong>pasivo acumulado</strong> por la diferencia.
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold" style={{ color: '#004B87' }}>3</span>
            <div>
              <span className="text-sm font-semibold text-gray-900">Activo (si pag&oacute; de m&aacute;s)</span>
              <p className="text-sm text-gray-600 mt-1">
                Si el pago excede la contribuci&oacute;n debida, el exceso se reconoce como 
                <strong> activo prepagado</strong>, siempre que sea recuperable (v&iacute;a reducci&oacute;n 
                de pagos futuros o reembolso).
              </p>
            </div>
          </div>
        </div>
      </div>

      <KeyConcept title="Simplicidad del plan DC">
        No hay c&aacute;lculos actuariales, no hay descuento a valor presente, no hay remediciones. 
        La contabilidad DC se reduce a: <strong>¿cu&aacute;nto deb&iacute;a contribuir?</strong> vs 
        <strong> ¿cu&aacute;nto pagu&eacute;?</strong> La diferencia es pasivo o activo.
      </KeyConcept>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Los tres escenarios posibles
      </h2>

      <div className="my-8 rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200" style={{ backgroundColor: '#f0f7fe' }}>
              <th className="text-left px-5 py-3 font-semibold text-gray-900">Escenario</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-900">Resultado</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-900">Asiento</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-5 py-3 text-gray-600">Pago = Contribuci&oacute;n</td>
              <td className="px-5 py-3 text-gray-700">Sin saldo</td>
              <td className="px-5 py-3 font-mono text-xs text-gray-700">Débito: Gasto / Crédito: Efectivo</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-5 py-3 text-gray-600">Pago {'<'} Contribuci&oacute;n</td>
              <td className="px-5 py-3 text-red-700 font-medium">Pasivo</td>
              <td className="px-5 py-3 font-mono text-xs text-gray-700">Débito: Gasto / Crédito: Efectivo + Crédito: Pasivo</td>
            </tr>
            <tr>
              <td className="px-5 py-3 text-gray-600">Pago {'>'} Contribuci&oacute;n</td>
              <td className="px-5 py-3 text-green-700 font-medium">Activo</td>
              <td className="px-5 py-3 font-mono text-xs text-gray-700">Débito: Gasto + Débito: Activo / Crédito: Efectivo</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
        Ejemplo paso a paso
      </h2>
      <p className="text-base text-gray-600 leading-relaxed">
        Consideremos una empresa mexicana con un plan DC donde aporta el 5% de los salarios a un 
        fondo de pensiones:
      </p>

      <div className="my-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Total salarios del a&ntilde;o</span>
            <span className="font-mono text-gray-900">$900,000</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Tasa de contribuci&oacute;n</span>
            <span className="font-mono text-gray-900">5%</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Contribuci&oacute;n debida</span>
            <span className="font-mono font-medium text-gray-900">$900,000 &times; 5% = $45,000</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Monto pagado al plan</span>
            <span className="font-mono text-gray-900">$40,000</span>
          </div>
          <div className="flex justify-between py-2 mt-2 border-t border-gray-200">
            <span className="text-gray-700 font-medium">Faltante</span>
            <span className="font-mono font-bold text-red-700">$5,000 (pasivo)</span>
          </div>
        </div>
      </div>

      <div className="my-6 rounded-xl border-2 p-5" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#004B87' }}>Asiento contable</span>
        <div className="mt-4 font-mono text-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-900">Débito: Gasto por pensiones</span>
            <span className="font-medium text-gray-900">$45,000</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 pl-8">Crédito: Efectivo</span>
              <span className="font-medium text-gray-500">$40,000</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-500 pl-8">Crédito: Pasivo acumulado</span>
              <span className="font-medium text-gray-500">$5,000</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-base text-gray-600 leading-relaxed">
        El gasto siempre es la contribuci&oacute;n <strong>debida</strong> ($45,000), no lo pagado. 
        La diferencia entre lo debido y lo pagado genera el pasivo de $5,000.
      </p>

      <DCSimulator />

      <QuizInline
        question="Una empresa tiene un plan DC con tasa del 8% sobre salarios de $500,000. Pagó $42,000 al fondo. ¿Cuál es el gasto y la posición en balance?"
        options={[
          'Gasto $42,000; sin saldo en balance',
          'Gasto $40,000; activo prepagado $2,000',
          'Gasto $40,000; pasivo $2,000',
          'Gasto $40,000; activo prepagado $2,000',
        ]}
        correctIndex={1}
        explanation="Contribución debida: $500,000 × 8% = $40,000. El gasto es $40,000 (lo debido). Pagó $42,000, es decir $2,000 de más → activo prepagado de $2,000 recuperable en periodos futuros."
      />

      <QuizInline
        question="En un plan DC, ¿cuándo puede la entidad capitalizar la contribución en vez de reconocerla como gasto?"
        options={[
          'Nunca, siempre es gasto en resultados',
          'Cuando otra norma IFRS lo requiera o permita (ej. IAS 2, IAS 16)',
          'Cuando la contribución excede el 10% de los salarios',
          'Cuando el plan tiene más de 5 años de antigüedad',
        ]}
        correctIndex={1}
        explanation="IAS 19 permite que la contribución se incluya en el costo de un activo si otra norma IFRS lo requiere o permite. Por ejemplo, la contribución DC de empleados que fabrican inventario podría capitalizarse bajo IAS 2."
      />
    </>
  );
}

function LessonView({ lessonId, onBack, onNavigate }: {
  lessonId: string;
  onBack: () => void;
  onNavigate: (id: string) => void;
}) {
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex((l) => l.lesson.id === lessonId);
  const current = allLessons[currentIndex];
  const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (!current) return null;

  const renderContent = () => {
    switch (lessonId) {
      case '1.1': return <Lesson11 />;
      case '1.2': return <Lesson12 />;
      case '1.3': return <Lesson13 />;
      case '1.4': return <Lesson14 />;
      case '1.5': return <Lesson15 />;
      case 'challenge-1': return null;
      case '2.1': return <Lesson21 />;
      case '2.2': return <Lesson22 />;
      case '2.3': return <Lesson23 />;
      case '2.4': return <Lesson24 />;
      case '2.5': return <Lesson25 />;
      case 'challenge-2': return null;
      case '3.1': return <Lesson31 />;
      case '3.2': return <Lesson32 />;
      case '3.3': return <Lesson33 />;
      case '3.4': return <Lesson34 />;
      case '3.5': return <Lesson35 />;
      case '3.6': return <Lesson36 />;
      case '3.7': return <Lesson37 />;
      case 'challenge-3': return null;
      case '4.1': return <Lesson41 />;
      case '4.2': return <Lesson42 />;
      case '4.3': return <Lesson43 />;
      case '4.4': return <Lesson44 />;
      case 'challenge-4': return null;
      case '5.1': return <Lesson51 />;
      case 'challenge-5': return null;
      default: return (
        <div className="py-20 text-center">
          <span className="text-6xl mb-6 block">🚧</span>
          <p className="text-lg text-gray-500">Esta lecci&oacute;n est&aacute; en desarrollo.</p>
          <p className="text-sm text-gray-400 mt-2">Pr&oacute;ximamente disponible.</p>
        </div>
      );
    }
  };

  return (
    <main className="pt-16">
      <div className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al &iacute;ndice
          </button>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#004B87' }}>
              Nivel {current.module.level} &middot; {current.module.title}
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-sm font-mono text-gray-300">{current.lesson.id}</span>
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              {current.lesson.title}
            </h1>
          </div>
        </header>

        {renderContent()}

        <nav className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
          {prev ? (
            <button
              onClick={() => onNavigate(prev.lesson.id)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="text-left">
                <span className="block text-xs text-gray-400">{prev.lesson.id.startsWith('challenge-') ? <TrophyIcon className="w-3.5 h-3.5 inline" /> : prev.lesson.id}</span>
                <span className="block">{prev.lesson.title}</span>
              </div>
            </button>
          ) : <div />}

          {next && next.module.available !== false ? (
            <button
              onClick={() => onNavigate(next.lesson.id)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors text-right"
            >
              <div>
                <span className="block text-xs text-gray-400">{next.lesson.id.startsWith('challenge-') ? <TrophyIcon className="w-3.5 h-3.5 inline" /> : next.lesson.id}</span>
                <span className="block">{next.lesson.title}</span>
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : <div />}
        </nav>
      </article>
    </main>
  );
}

function SidebarLevel({ module, expandedLevel, setExpandedLevel, activeLesson, onSelectLesson, completedLessons, passedChallenges }: {
  module: ModuleData;
  expandedLevel: string | null;
  setExpandedLevel: (id: string | null) => void;
  activeLesson: string | null;
  onSelectLesson: (id: string) => void;
  completedLessons: string[];
  passedChallenges: string[];
}) {
  const isExpanded = expandedLevel === module.id;
  const completedCount = module.lessons.filter(l => 
    l.id.startsWith('challenge-') ? passedChallenges.includes(l.id) : completedLessons.includes(l.id)
  ).length;
  const allComplete = completedCount === module.lessons.length;

  return (
    <div>
      <button
        onClick={() => setExpandedLevel(isExpanded ? null : module.id)}
        className="w-full flex items-center justify-between py-3 px-3 rounded-lg text-left transition-colors hover:bg-gray-50 group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${allComplete ? 'ring-2 ring-green-400 ring-offset-1' : ''}`}
            style={{ backgroundColor: allComplete ? '#22c55e' : module.available ? '#004B87' : '#CBD5E1' }}
          >
            {allComplete ? '✓' : module.level}
          </span>
          <div className="min-w-0">
            <span className={`block text-sm font-semibold truncate ${module.available ? 'text-gray-900' : 'text-gray-400'}`}>
              {module.title}
            </span>
            <span className={`block text-xs truncate ${module.available ? 'text-gray-500' : 'text-gray-300'}`}>
              {completedCount > 0 ? `${completedCount}/${module.lessons.length} completado` : module.subtitle}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          {!module.available ? (
            <LockClosedIcon className="w-4 h-4 text-gray-300" />
          ) : isExpanded ? (
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && module.available && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-12 pr-3 pb-2 space-y-0.5">
              {module.lessons.map((lesson) => {
                const isComplete = lesson.id.startsWith('challenge-') ? passedChallenges.includes(lesson.id) : completedLessons.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className={`w-full text-left py-2 px-3 rounded-md text-sm transition-colors flex items-center ${
                      activeLesson === lesson.id
                        ? 'text-[#004B87] bg-blue-50/60 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {lesson.id.startsWith('challenge-') ? (
                      isComplete ? (
                        <TrophySolid className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-yellow-500" />
                      ) : (
                        <TrophyIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" style={{ color: '#004B87' }} />
                      )
                    ) : (
                      <span className={`text-xs mr-2 ${isComplete ? 'text-green-500 font-bold' : 'text-gray-400'}`}>
                        {isComplete ? '✓' : lesson.id}
                      </span>
                    )}
                    <span className={isComplete ? 'text-gray-700' : ''}>{lesson.title}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Lesson21() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    { num: 1, title: 'Atribuir beneficios', desc: 'Usar técnicas actuariales para estimar los beneficios ganados por servicio en periodos actuales y anteriores.', nivel: '2', leccion: '2.2' },
    { num: 2, title: 'Descontar los beneficios', desc: 'Aplicar el método PUC (Projected Unit Credit) para obtener el valor presente de la obligación de beneficio definido.', nivel: '2', leccion: '2.3' },
    { num: 3, title: 'Valor razonable de activos del plan', desc: 'Medir los activos del plan a valor razonable bajo IFRS 13, deducirlos de la obligación.', nivel: '2', leccion: '2.4' },
    { num: 4, title: 'Pasivo (activo) neto de BD', desc: 'Calcular PV de la obligación − FV de activos del plan, ajustado por el techo del activo (asset ceiling).', nivel: '2', leccion: '2.5' },
    { num: 5, title: 'Montos en resultados (P&L)', desc: 'Costo del servicio actual, costo del servicio pasado, ganancias/pérdidas por liquidación, e interés neto.', nivel: '3', leccion: '3.2–3.3' },
    { num: 6, title: 'Remediciones en OCI', desc: 'Ganancias/pérdidas actuariales, retorno de activos del plan (neto), y cambios en el efecto del techo del activo.', nivel: '3', leccion: '3.5' },
  ];

  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          La contabilizaci&oacute;n de planes de beneficio definido es el tema m&aacute;s complejo de IAS 19. A diferencia 
          de los planes DC donde el gasto es simplemente la contribuci&oacute;n, en los planes DB la empresa tiene una 
          <strong> obligaci&oacute;n a largo plazo</strong> cuyo monto depende de variables futuras: salarios finales, 
          longevidad, rotaci&oacute;n, rendimientos de inversi&oacute;n.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">El mapa completo: 6 pasos</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-8">
        IAS 19 establece un enfoque sistem&aacute;tico de 6 pasos para contabilizar cada plan DB. Los pasos 1-4 
        determinan <strong>cu&aacute;nto reconocer</strong> en el balance, mientras que los pasos 5-6 determinan 
        <strong> d&oacute;nde</strong> se reconocen los cambios (resultados u OCI).
      </p>

      <div className="space-y-3 mb-10">
        {steps.map((step) => (
          <div key={step.num}>
            <button
              onClick={() => setActiveStep(activeStep === step.num ? null : step.num)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all text-left ${
                activeStep === step.num
                  ? 'border-[#004B87]/30 bg-blue-50/50 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: step.num <= 4 ? '#004B87' : '#94A3B8' }}
              >
                {step.num}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-gray-900">{step.title}</span>
                <span className="ml-2 text-xs text-gray-400">Lecci&oacute;n {step.leccion}</span>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${activeStep === step.num ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {activeStep === step.num && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-4 ml-[3.25rem] border-l-2 border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                      step.num <= 4 ? 'bg-blue-50 text-[#004B87]' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {step.num <= 4 ? 'Este nivel' : 'Nivel 3'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <KeyConcept title="Estructura del enfoque">
        Los pasos 1-4 construyen el n&uacute;mero que aparece en el <strong>estado de situaci&oacute;n financiera</strong> (balance). 
        Los pasos 5-6 explican <strong>c&oacute;mo cambi&oacute;</strong> ese n&uacute;mero durante el periodo: lo que va a resultados 
        (P&amp;L) y lo que va a otro resultado integral (OCI).
      </KeyConcept>

      <h2 className="text-xl font-semibold text-gray-900 mt-12 mb-4">&iquest;Por qu&eacute; es tan complejo?</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        En un plan DC, la empresa aporta y se desentiende. En un plan DB, la empresa <em>promete un resultado</em>. 
        Para saber cu&aacute;nto debe hoy por esa promesa, necesita estimar cu&aacute;nto costar&aacute; cumplirla en 
        el futuro y traer ese monto a valor presente. Eso requiere supuestos sobre:
      </p>
      <div className="grid grid-cols-2 gap-3 mb-10">
        {[
          { label: 'Tasa de descuento', detail: 'Bonos corporativos de alta calidad' },
          { label: 'Incrementos salariales', detail: 'Proyección de salarios futuros' },
          { label: 'Mortalidad', detail: 'Tablas de esperanza de vida' },
          { label: 'Rotación', detail: 'Probabilidad de retiro anticipado' },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
            <span className="text-sm font-semibold text-gray-900 block">{item.label}</span>
            <span className="text-xs text-gray-500">{item.detail}</span>
          </div>
        ))}
      </div>

      <QuizInline
        question="¿Cuál es la diferencia fundamental entre los pasos 1-4 y los pasos 5-6 del enfoque de 6 pasos?"
        options={[
          'Los pasos 1-4 se hacen anualmente y los 5-6 trimestralmente',
          'Los pasos 1-4 determinan el monto en balance; los 5-6 determinan dónde reconocer los cambios (P&L u OCI)',
          'Los pasos 1-4 son obligatorios y los 5-6 opcionales',
          'Los pasos 1-4 usan valores de mercado y los 5-6 valores históricos',
        ]}
        correctIndex={1}
        explanation="Los pasos 1-4 construyen el pasivo (o activo) neto de beneficio definido que se reconoce en el balance. Los pasos 5-6 desglosan cómo cambió ese saldo durante el periodo: qué parte va a resultados (P&L) y qué parte va a otro resultado integral (OCI)."
      />
    </>
  );
}

function Lesson22() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          El primer paso es determinar <strong>cu&aacute;nto beneficio</strong> han ganado los empleados por su servicio. 
          Esto requiere <em>atribuir</em> (asignar) el beneficio total prometido a cada periodo de servicio, 
          usando t&eacute;cnicas actuariales.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">La regla general: f&oacute;rmula del plan</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        Normalmente, el beneficio se atribuye seg&uacute;n la <strong>f&oacute;rmula del plan</strong>. Si el plan dice 
        &ldquo;2% del salario final por cada a&ntilde;o de servicio&rdquo;, entonces cada a&ntilde;o se atribuye exactamente 2%.
      </p>

      <div className="my-8 rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Ejemplo: F&oacute;rmula del plan</span>
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-600 mb-4">Plan: <strong>2% del salario final &times; a&ntilde;os de servicio</strong></p>
          <div className="flex items-end gap-1 h-32 mt-2">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${(i + 1) * 10}%`,
                    backgroundColor: i < 5 ? '#004B87' : '#93C5FD',
                  }}
                />
                <span className="text-[10px] text-gray-400 mt-1">{i + 1}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Cada a&ntilde;o = 2% adicional. La obligaci&oacute;n crece linealmente.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-12 mb-4">La excepci&oacute;n: l&iacute;nea recta</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        Si el servicio en a&ntilde;os posteriores genera un beneficio <strong>materialmente mayor</strong> que en a&ntilde;os 
        anteriores, la norma exige atribuir el beneficio en <strong>l&iacute;nea recta</strong>, desde la fecha en que el 
        servicio genera beneficios hasta la fecha en que el servicio adicional ya no genera beneficios materiales adicionales.
      </p>

      <div className="my-8 rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Ejemplo: L&iacute;nea recta</span>
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-600 mb-3">
            Plan m&eacute;dico post-empleo: reembolsa 10% si el empleado se va entre 10 y 20 a&ntilde;os de servicio, 
            y 50% si se va despu&eacute;s de 20 a&ntilde;os.
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
              <span className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#004B87' }}>A</span>
              <span className="text-gray-700">Empleados que se espera se vayan despu&eacute;s de 20+ a&ntilde;os: atribuir <strong>2.5% por a&ntilde;o</strong> (50% &divide; 20 a&ntilde;os) en l&iacute;nea recta.</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-bold flex items-center justify-center">B</span>
              <span className="text-gray-700">Empleados que se espera se vayan entre 10-20 a&ntilde;os: atribuir <strong>1% por a&ntilde;o</strong> (10% &divide; 10 a&ntilde;os) en los primeros 10.</span>
            </div>
          </div>
        </div>
      </div>

      <KeyConcept title="Obligación implícita y vesting">
        La probabilidad de que algunos empleados no cumplan los criterios de vesting (adquisici&oacute;n de derechos) 
        afecta la <strong>medici&oacute;n</strong> de la obligaci&oacute;n, pero no su <strong>existencia</strong>. Es decir, 
        siempre se reconoce una obligaci&oacute;n, ajustada por la probabilidad de que no todos los empleados lleguen a cobrar.
      </KeyConcept>

      <QuizInline
        question="Un plan promete una pensión del 3% del salario final por cada año de servicio, con un tope de 30 años. ¿Cómo se atribuye el beneficio?"
        options={[
          'Línea recta sobre 30 años, porque hay un tope',
          'Según la fórmula del plan: 3% por cada año, hasta 30 años',
          'Línea recta desde el ingreso hasta la jubilación',
          'No se atribuye hasta que el empleado cumpla los 30 años',
        ]}
        correctIndex={1}
        explanation="Cuando cada año de servicio genera un nivel similar de beneficio (3% uniforme), se usa la fórmula del plan directamente. El tope de 30 años simplemente significa que después de 30 años no se atribuyen más beneficios."
      />

      <QuizInline
        question="¿Cuándo debe una entidad usar atribución en línea recta en vez de la fórmula del plan?"
        options={[
          'Siempre que el plan tenga más de 10 años de vigencia',
          'Cuando el servicio en años posteriores genera un beneficio materialmente mayor que en años anteriores',
          'Cuando el empleado aún no ha adquirido derechos (vesting)',
          'Cuando la tasa de descuento cambia significativamente',
        ]}
        correctIndex={1}
        explanation="La excepción de línea recta aplica cuando el beneficio se concentra desproporcionadamente en años posteriores, creando un 'salto' material. En ese caso, se distribuye uniformemente desde que el servicio genera beneficios hasta que deja de hacerlo."
      />
    </>
  );
}

function Lesson23() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Una vez atribuidos los beneficios a cada periodo de servicio, el siguiente paso es 
          <strong> descontarlos</strong> para obtener su valor presente. IAS 19 exige un m&eacute;todo 
          espec&iacute;fico: el <strong>M&eacute;todo de la Unidad de Cr&eacute;dito Proyectada</strong> (Projected Unit Credit &mdash; PUC).
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">&iquest;Qu&eacute; es el PUC?</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        Este m&eacute;todo actuarial trata cada periodo de servicio como generador de una <strong>unidad 
        adicional</strong> de derecho a beneficio. Cada unidad se mide por separado y se descuenta a valor 
        presente, para construir la obligaci&oacute;n total.
      </p>

      <div className="my-10 rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Visualizaci&oacute;n: Construcci&oacute;n de la obligaci&oacute;n con PUC</span>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">Cada bloque representa la unidad de beneficio ganada en ese a&ntilde;o, descontada a valor presente:</p>
          <div className="flex items-end gap-2 h-40">
            {[
              { year: 1, pv: 18, nominal: 25 },
              { year: 2, pv: 20, nominal: 25 },
              { year: 3, pv: 22, nominal: 25 },
              { year: 4, pv: 24, nominal: 25 },
              { year: 5, pv: 25, nominal: 25 },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative flex flex-col justify-end" style={{ height: '100%' }}>
                  <div className="w-full rounded-t border border-dashed border-gray-300" style={{ height: `${item.nominal * 4}%` }} />
                  <div className="w-full rounded-t absolute bottom-0" style={{ height: `${item.pv * 4}%`, backgroundColor: '#004B87' }} />
                </div>
                <span className="text-[10px] text-gray-400">A&ntilde;o {item.year}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#004B87' }} />
              <span>Valor presente (descontado)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm border border-dashed border-gray-300" />
              <span>Valor nominal (sin descontar)</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-12 mb-4">Tasa de descuento</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        La tasa de descuento se determina con referencia a los rendimientos de <strong>bonos corporativos 
        de alta calidad</strong> al cierre del periodo, con plazos y moneda consistentes con la obligaci&oacute;n. 
        En mercados donde no existen bonos corporativos con suficiente profundidad (como M&eacute;xico), se usan 
        <strong> bonos gubernamentales</strong>.
      </p>

      <KeyConcept title="Resultado del Paso 2">
        El resultado del PUC es el <strong>valor presente de la obligaci&oacute;n de beneficio definido</strong> (PV of DBO). 
        Este es el monto que la empresa reconocer&iacute;a como pasivo <em>si no existieran activos del plan</em>.
      </KeyConcept>

      <div className="my-8 rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Ejemplo num&eacute;rico simplificado</span>
        </div>
        <div className="p-5 text-sm text-gray-600 space-y-3">
          <p>Un empleado ganar&aacute; una pensi&oacute;n de <strong>$10,000 anuales</strong> al jubilarse en 5 a&ntilde;os. Tasa de descuento: <strong>6%</strong>.</p>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
            <p>VP = $10,000 &divide; (1.06)<sup>5</sup></p>
            <p className="mt-1">VP = $10,000 &divide; 1.3382</p>
            <p className="mt-1 font-bold" style={{ color: '#004B87' }}>VP = $7,473</p>
          </div>
          <p>La empresa reconoce <strong>$7,473</strong> hoy (no $10,000), porque tiene 5 a&ntilde;os para que el dinero crezca con el paso del tiempo.</p>
        </div>
      </div>

      <QuizInline
        question="¿Cuál es el resultado principal del Método de la Unidad de Crédito Proyectada (PUC)?"
        options={[
          'El valor nominal total de los beneficios prometidos',
          'El valor presente de la obligación de beneficio definido (PV of DBO)',
          'El monto de efectivo que la empresa debe depositar al fondo',
          'La ganancia o pérdida actuarial del periodo',
        ]}
        correctIndex={1}
        explanation="El PUC produce el valor presente de la obligación de beneficio definido (PV of DBO). Cada unidad de servicio se mide y descuenta por separado, y la suma de todas las unidades es la obligación total."
      />
    </>
  );
}

function Lesson24() {
  const [pvObligation, setPvObligation] = useState('');
  const [fvAssets, setFvAssets] = useState('');
  const calculated = pvObligation && fvAssets;
  const pv = parseFloat(pvObligation) || 0;
  const fv = parseFloat(fvAssets) || 0;
  const diff = fv - pv;
  const isDeficit = diff < 0;
  const isSurplus = diff > 0;

  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          El paso 3 es directo: los <strong>activos del plan</strong> se miden a <strong>valor razonable</strong> (fair value) 
          seg&uacute;n IFRS 13. Estos activos son los recursos que la empresa ha separado en un fondo para cubrir su 
          obligaci&oacute;n futura.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">&iquest;Qu&eacute; son los activos del plan?</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        Son inversiones mantenidas por un fondo separado (fideicomiso, fundaci&oacute;n, etc.) cuyo &uacute;nico 
        prop&oacute;sito es pagar los beneficios a los empleados. Pueden incluir bonos, acciones, bienes ra&iacute;ces, 
        y otros instrumentos financieros.
      </p>

      <KeyConcept title="Valor razonable (IFRS 13)">
        El valor razonable es el precio que se recibir&iacute;a por vender un activo en una transacci&oacute;n ordenada 
        entre participantes del mercado a la fecha de medici&oacute;n. Para activos del plan, generalmente se usan 
        <strong> precios de mercado cotizados</strong>.
      </KeyConcept>

      <h2 className="text-xl font-semibold text-gray-900 mt-12 mb-4">D&eacute;ficit vs. Super&aacute;vit</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        Al comparar el valor presente de la obligaci&oacute;n (Paso 2) con el valor razonable de los activos (Paso 3), 
        se determina si existe un <strong>d&eacute;ficit</strong> o un <strong>super&aacute;vit</strong>.
      </p>

      <div className="my-8 rounded-xl border border-gray-100 p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Simulador: D&eacute;ficit o super&aacute;vit</span>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">PV de la obligaci&oacute;n ($)</label>
            <input
              type="number"
              value={pvObligation}
              onChange={(e) => setPvObligation(e.target.value)}
              placeholder="ej. 1,000,000"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">FV de activos del plan ($)</label>
            <input
              type="number"
              value={fvAssets}
              onChange={(e) => setFvAssets(e.target.value)}
              placeholder="ej. 800,000"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20"
            />
          </div>
        </div>

        {calculated && pv > 0 && fv >= 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <div className="flex gap-3 items-end h-36 mb-4">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full rounded-t" style={{ height: '100%', backgroundColor: '#EF4444', opacity: 0.8 }} />
                <span className="text-xs text-gray-500 mt-1">Obligaci&oacute;n</span>
                <span className="text-xs font-mono text-gray-700">${pv.toLocaleString()}</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full rounded-t" style={{ height: `${Math.min((fv / pv) * 100, 100)}%`, backgroundColor: '#22C55E', opacity: 0.8 }} />
                <span className="text-xs text-gray-500 mt-1">Activos</span>
                <span className="text-xs font-mono text-gray-700">${fv.toLocaleString()}</span>
              </div>
            </div>
            <div className={`rounded-lg p-4 text-sm ${isDeficit ? 'bg-red-50 border border-red-200' : isSurplus ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <span className="font-semibold">{isDeficit ? 'Déficit' : isSurplus ? 'Superávit' : 'Equilibrio'}: </span>
              <span className="font-mono">${Math.abs(diff).toLocaleString()}</span>
              <span className="text-gray-500 ml-1">
                {isDeficit && '→ La empresa reconoce un pasivo neto de beneficio definido'}
                {isSurplus && '→ La empresa tiene un activo neto (sujeto al techo del activo)'}
                {!isDeficit && !isSurplus && '→ Sin saldo neto en balance'}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <QuizInline
        question="Una empresa tiene una obligación de beneficio definido con valor presente de $2,000,000 y activos del plan con valor razonable de $1,700,000. ¿Cuál es la situación?"
        options={[
          'Superávit de $300,000 — activo neto de BD',
          'Déficit de $300,000 — pasivo neto de BD',
          'Se reconocen ambos por separado: pasivo de $2M y activo de $1.7M',
          'No se reconoce nada hasta que se paguen los beneficios',
        ]}
        correctIndex={1}
        explanation="PV obligación ($2M) > FV activos ($1.7M) = Déficit de $300,000. La empresa reconoce un pasivo neto de beneficio definido de $300,000 en su estado de situación financiera."
      />
    </>
  );
}

function Lesson25() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          El paso 4 combina los resultados de los pasos anteriores en un solo n&uacute;mero que se reconoce 
          en el <strong>estado de situaci&oacute;n financiera</strong>: el <strong>pasivo (activo) neto de 
          beneficio definido</strong>.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">La f&oacute;rmula</h2>
      <div className="my-6 rounded-xl border-2 p-6" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
        <div className="text-center">
          <span className="text-sm font-mono text-gray-600">Pasivo (Activo) Neto de BD</span>
          <div className="mt-3 text-lg font-semibold" style={{ color: '#004B87' }}>
            PV de la obligaci&oacute;n &minus; FV de activos del plan &plusmn; Efecto del techo del activo
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Tres escenarios posibles</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-4 text-left font-semibold text-gray-900">Escenario</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900">Resultado</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900">Reconocimiento</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-gray-600">PV obligaci&oacute;n &gt; FV activos</td>
              <td className="py-3 px-4 font-semibold text-red-600">D&eacute;ficit</td>
              <td className="py-3 px-4 text-gray-600">Pasivo neto de BD en balance</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-gray-600">FV activos &gt; PV obligaci&oacute;n</td>
              <td className="py-3 px-4 font-semibold text-green-600">Super&aacute;vit</td>
              <td className="py-3 px-4 text-gray-600">Activo neto de BD (sujeto al techo)</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-gray-600">PV obligaci&oacute;n = FV activos</td>
              <td className="py-3 px-4 font-semibold text-gray-500">Equilibrio</td>
              <td className="py-3 px-4 text-gray-600">Sin saldo neto</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">El techo del activo (Asset Ceiling)</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        Cuando existe un super&aacute;vit, la empresa podr&iacute;a reconocer un activo. Sin embargo, IAS 19 limita 
        este activo al <strong>valor presente de los beneficios econ&oacute;micos</strong> disponibles para la 
        entidad en forma de reembolsos del plan o reducciones en contribuciones futuras. Este l&iacute;mite se conoce 
        como el <strong>techo del activo</strong> (asset ceiling).
      </p>

      <KeyConcept title="¿Por qué limitar el activo?">
        Si una empresa tiene un super&aacute;vit de $500,000 en el fondo, pero solo puede recuperar $200,000 
        (v&iacute;a reembolsos o menores contribuciones futuras), no tiene sentido econ&oacute;mico reconocer un 
        activo de $500,000. El techo del activo asegura que solo se reconozca lo que realmente beneficiar&aacute; 
        a la entidad.
      </KeyConcept>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Ejemplo integral</h2>
      <div className="my-6 rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Datos al 31 de diciembre</span>
        </div>
        <div className="p-5 text-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <span className="text-xs text-red-600 font-medium block">PV de la obligaci&oacute;n</span>
              <span className="text-lg font-bold text-red-700">$860,000</span>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <span className="text-xs text-green-600 font-medium block">FV de activos del plan</span>
              <span className="text-lg font-bold text-green-700">$1,305,000</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
            <p>Neto = $1,305,000 &minus; $860,000 = <strong className="text-green-700">$445,000 (super&aacute;vit)</strong></p>
            <p className="mt-1 text-gray-500">→ Se reconoce un activo neto de BD de $445,000 (sujeto al techo del activo).</p>
          </div>
        </div>
      </div>

      <QuizInline
        question="Una empresa tiene PV de obligación de $5,000,000 y FV de activos de $5,800,000. El valor presente de los beneficios económicos recuperables es $600,000. ¿Cuál es el activo neto reconocido?"
        options={[
          '$800,000 (el superávit total)',
          '$600,000 (limitado por el techo del activo)',
          '$5,800,000 (el valor de los activos)',
          '$200,000 (diferencia entre superávit y techo)',
        ]}
        correctIndex={1}
        explanation="El superávit es $800,000 ($5.8M − $5M), pero el techo del activo limita el reconocimiento a $600,000 (los beneficios económicos recuperables). Se reconoce un activo neto de BD de $600,000, no $800,000."
      />

      <QuizInline
        question="¿Dónde se reconoce el pasivo (activo) neto de beneficio definido?"
        options={[
          'En resultados del periodo (P&L)',
          'En otro resultado integral (OCI)',
          'En el estado de situación financiera (balance)',
          'En las notas a los estados financieros, sin reconocimiento en balance',
        ]}
        correctIndex={2}
        explanation="El pasivo (activo) neto de beneficio definido se reconoce en el estado de situación financiera. Los cambios en este saldo se desglosan en P&L (paso 5) y OCI (paso 6) en los niveles siguientes."
      />
    </>
  );
}

function Lesson31() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          En el Nivel 2 aprendiste a <strong>medir</strong> la obligaci&oacute;n y los activos del plan. 
          Ahora toca <strong>registrar</strong> los movimientos contables. Empezamos con las dos transacciones 
          m&aacute;s b&aacute;sicas: contribuir dinero al fondo y pagar beneficios a los empleados.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Contribuciones pagadas al plan</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-4">
        Cuando la empresa deposita dinero en el fondo de pensiones, <strong>incrementa los activos del plan</strong>. 
        Este movimiento <strong>no impacta</strong> la obligaci&oacute;n: el efecto en la obligaci&oacute;n se reconoce 
        cuando el empleado presta servicio (v&iacute;a costo del servicio), no cuando la empresa paga.
      </p>

      <div className="my-6 rounded-xl border-2 p-5" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#004B87' }}>Asiento contable</span>
        <p className="text-xs text-gray-500 mt-1 mb-3">Contribuci&oacute;n de $100,000 al fondo de pensiones</p>
        <div className="font-mono text-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-900">Débito: Activos del plan</span>
            <span className="font-medium text-gray-900">$100,000</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 pl-8">Crédito: Efectivo</span>
              <span className="font-medium text-gray-500">$100,000</span>
            </div>
          </div>
        </div>
      </div>

      <KeyConcept title="Cuentas separadas para entender">
        En los asientos de IAS 19, tratamos la obligaci&oacute;n de BD y los activos del plan como <strong>cuentas 
        separadas</strong> para fines did&aacute;cticos. En el estado de situaci&oacute;n financiera, ambos se presentan 
        como un solo saldo neto (pasivo o activo neto de BD).
      </KeyConcept>

      <h2 className="text-xl font-semibold text-gray-900 mt-12 mb-4">Beneficios pagados a empleados</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-4">
        Cuando el fondo paga pensiones a los jubilados, se liquida parcialmente la obligaci&oacute;n de la empresa. 
        Los activos del plan disminuyen (sale dinero del fondo) y la obligaci&oacute;n tambi&eacute;n disminuye 
        (la empresa ya cumpli&oacute; parte de su promesa).
      </p>

      <div className="my-6 rounded-xl border-2 p-5" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#004B87' }}>Asiento contable</span>
        <p className="text-xs text-gray-500 mt-1 mb-3">Pago de beneficios de $120,000 a jubilados</p>
        <div className="font-mono text-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-900">Débito: Obligaci&oacute;n de BD</span>
            <span className="font-medium text-gray-900">$120,000</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 pl-8">Crédito: Activos del plan</span>
              <span className="font-medium text-gray-500">$120,000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="my-8 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-4 text-left font-semibold text-gray-900">Transacci&oacute;n</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900">Obligaci&oacute;n</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900">Activos del plan</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900">Efectivo</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-gray-600">Contribuci&oacute;n al fondo</td>
              <td className="py-3 px-4 text-gray-400">Sin efecto</td>
              <td className="py-3 px-4 text-green-600 font-medium">&uarr; Aumenta</td>
              <td className="py-3 px-4 text-red-600 font-medium">&darr; Disminuye</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-gray-600">Pago de beneficios</td>
              <td className="py-3 px-4 text-green-600 font-medium">&darr; Disminuye</td>
              <td className="py-3 px-4 text-red-600 font-medium">&darr; Disminuye</td>
              <td className="py-3 px-4 text-gray-400">Sin efecto</td>
            </tr>
          </tbody>
        </table>
      </div>

      <QuizInline
        question="Una empresa deposita $250,000 en su fondo de pensiones de beneficio definido. ¿Cuál es el asiento contable correcto?"
        options={[
          'Débito: Gasto de beneficio definido $250,000 / Crédito: Efectivo $250,000',
          'Débito: Activos del plan $250,000 / Crédito: Efectivo $250,000',
          'Débito: Obligación de BD $250,000 / Crédito: Efectivo $250,000',
          'Débito: Activos del plan $250,000 / Crédito: Obligación de BD $250,000',
        ]}
        correctIndex={1}
        explanation="La contribución al fondo incrementa los activos del plan y reduce el efectivo. No afecta directamente la obligación ni el gasto — esos movimientos se reconocen por separado a través del costo del servicio."
      />

      <QuizInline
        question="El fondo de pensiones paga $80,000 en beneficios a jubilados. ¿Cuál es el efecto en el balance?"
        options={[
          'Aumenta el gasto en P&L por $80,000',
          'Disminuye la obligación y disminuyen los activos del plan en $80,000 cada uno',
          'Disminuyen los activos del plan en $80,000, sin efecto en la obligación',
          'Disminuye el efectivo de la empresa en $80,000',
        ]}
        correctIndex={1}
        explanation="El pago de beneficios reduce tanto la obligación (la empresa cumplió parte de su promesa) como los activos del plan (salió dinero del fondo). El neto en balance no cambia — es un movimiento simétrico."
      />
    </>
  );
}

function Lesson32() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          El <strong>costo del servicio actual</strong> (Current Service Cost) es el componente central del gasto 
          de beneficio definido. Representa cu&aacute;nto <em>aument&oacute;</em> la obligaci&oacute;n de la empresa 
          porque sus empleados trabajaron un a&ntilde;o m&aacute;s.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Definici&oacute;n</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        Es el incremento en el valor presente de la obligaci&oacute;n de BD resultante del servicio del empleado 
        en el <strong>periodo actual</strong>. Se calcula usando los supuestos actuariales al inicio del periodo anual 
        (con excepci&oacute;n de enmiendas o liquidaciones, donde se usan supuestos actualizados).
      </p>

      <div className="my-6 rounded-xl border-2 p-5" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#004B87' }}>Asiento contable</span>
        <p className="text-xs text-gray-500 mt-1 mb-3">Costo del servicio actual de $50,000</p>
        <div className="font-mono text-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-900">Débito: Gasto de beneficio definido (P&amp;L)</span>
            <span className="font-medium text-gray-900">$50,000</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 pl-8">Crédito: Obligaci&oacute;n de BD</span>
              <span className="font-medium text-gray-500">$50,000</span>
            </div>
          </div>
        </div>
      </div>

      <KeyConcept title="Destino: Resultados (P&L)">
        El costo del servicio actual siempre va a <strong>resultados</strong> (P&amp;L), nunca a OCI. Es el costo &ldquo;real&rdquo; 
        de operar el plan durante el periodo. Junto con el inter&eacute;s neto, forma el gasto total de beneficio definido en P&amp;L.
      </KeyConcept>

      <h2 className="text-xl font-semibold text-gray-900 mt-12 mb-4">Costo del servicio pasado</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-4">
        Cuando la empresa <strong>modifica</strong> el plan (enmienda) o lo <strong>reduce</strong> (curtailment), 
        cambia el valor presente de la obligaci&oacute;n. Este cambio se llama <strong>costo del servicio pasado</strong> 
        y se reconoce <strong>inmediatamente como gasto</strong> en P&amp;L.
      </p>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        El costo del servicio pasado se reconoce al <strong>menor</strong> entre: (a) cuando ocurre la enmienda/curtailment, 
        o (b) cuando la entidad reconoce costos de reestructuraci&oacute;n relacionados bajo IAS 37.
      </p>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <span className="text-sm font-semibold text-gray-900 block mb-1">Enmienda (Plan Amendment)</span>
          <p className="text-xs text-gray-600 leading-relaxed">
            La empresa mejora o reduce los beneficios prometidos. Ej.: subir la pensi&oacute;n del 2% al 2.5% por a&ntilde;o de servicio.
          </p>
        </div>
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <span className="text-sm font-semibold text-gray-900 block mb-1">Reducci&oacute;n (Curtailment)</span>
          <p className="text-xs text-gray-600 leading-relaxed">
            La empresa reduce significativamente el n&uacute;mero de empleados cubiertos. Ej.: cerrar una planta y dejar de acumular beneficios.
          </p>
        </div>
      </div>

      <QuizInline
        question="El actuario calcula que el costo del servicio actual del periodo es $75,000. ¿Cuál es el asiento correcto?"
        options={[
          'Débito: OCI $75,000 / Crédito: Obligación de BD $75,000',
          'Débito: Gasto de beneficio definido $75,000 / Crédito: Obligación de BD $75,000',
          'Débito: Gasto de beneficio definido $75,000 / Crédito: Activos del plan $75,000',
          'Débito: Gasto de beneficio definido $75,000 / Crédito: Efectivo $75,000',
        ]}
        correctIndex={1}
        explanation="El costo del servicio actual se reconoce en P&L (gasto) contra un incremento en la obligación de BD. No afecta los activos del plan ni el efectivo directamente."
      />

      <QuizInline
        question="Una empresa mejora su plan de pensiones, incrementando la obligación en $200,000. ¿Cómo se registra?"
        options={[
          'Se amortiza en los próximos 10 años como gasto',
          'Se reconoce inmediatamente como gasto (costo del servicio pasado) en P&L',
          'Se reconoce en OCI y se reclasifica gradualmente a P&L',
          'No se registra hasta que los empleados se jubilen',
        ]}
        correctIndex={1}
        explanation="El costo del servicio pasado por enmienda del plan se reconoce inmediatamente como gasto en resultados (P&L). IAS 19 no permite diferirlo ni amortizarlo."
      />
    </>
  );
}

function Lesson33() {
  const [pvOblStart, setPvOblStart] = useState('');
  const [fvAssetsStart, setFvAssetsStart] = useState('');
  const [discountRate, setDiscountRate] = useState('');

  const pvO = parseFloat(pvOblStart) || 0;
  const fvA = parseFloat(fvAssetsStart) || 0;
  const rate = (parseFloat(discountRate) || 0) / 100;
  const calculated = pvO > 0 && fvA >= 0 && rate > 0;

  const interestOnObl = pvO * rate;
  const interestOnAssets = fvA * rate;
  const netInterest = interestOnObl - interestOnAssets;

  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          El <strong>inter&eacute;s neto</strong> es el cambio en el pasivo (activo) neto de BD que surge 
          simplemente por el <strong>paso del tiempo</strong>. No tiene que ver con el desempe&ntilde;o real 
          de las inversiones ni con cambios en supuestos &mdash; es puro efecto financiero.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">La f&oacute;rmula</h2>
      <div className="my-6 rounded-xl border-2 p-6" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
        <div className="text-center space-y-2">
          <span className="text-sm font-mono text-gray-600 block">Inter&eacute;s neto = Pasivo (activo) neto de BD al inicio &times; Tasa de descuento</span>
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-200 mt-3 space-y-1">
            <p>= (PV obligaci&oacute;n inicio &times; tasa) &minus; (FV activos inicio &times; tasa)</p>
            <p>= Inter&eacute;s sobre la obligaci&oacute;n &minus; Inter&eacute;s sobre los activos</p>
          </div>
        </div>
      </div>

      <p className="text-base text-gray-600 leading-relaxed mb-6">
        Se puede ver como dos componentes: el <strong>inter&eacute;s sobre la obligaci&oacute;n</strong> (incrementa 
        el pasivo) y el <strong>inter&eacute;s sobre los activos del plan</strong> (incrementa los activos). La 
        diferencia neta es lo que va a P&amp;L.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Tasa de descuento</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-gray-100">
          <span className="text-sm font-semibold text-gray-900 block mb-1">&iquest;C&oacute;mo se determina?</span>
          <p className="text-xs text-gray-600 leading-relaxed">
            Rendimientos de mercado de bonos corporativos de alta calidad al cierre del periodo. Si no hay mercado 
            profundo (como M&eacute;xico): bonos gubernamentales.
          </p>
        </div>
        <div className="p-4 rounded-xl border border-gray-100">
          <span className="text-sm font-semibold text-gray-900 block mb-1">&iquest;Qu&eacute; refleja?</span>
          <p className="text-xs text-gray-600 leading-relaxed">
            El valor del dinero en el tiempo &mdash; pero <strong>no</strong> el riesgo actuarial ni de inversi&oacute;n. 
            Moneda y plazo consistentes con la obligaci&oacute;n.
          </p>
        </div>
      </div>

      <div className="my-8 rounded-xl border border-gray-100 p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Calculadora de inter&eacute;s neto</span>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">PV obligaci&oacute;n inicio ($)</label>
            <input type="number" value={pvOblStart} onChange={(e) => setPvOblStart(e.target.value)} placeholder="ej. 1,000,000"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">FV activos inicio ($)</label>
            <input type="number" value={fvAssetsStart} onChange={(e) => setFvAssetsStart(e.target.value)} placeholder="ej. 800,000"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Tasa de descuento (%)</label>
            <input type="number" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)} placeholder="ej. 5"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20" />
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Inter&eacute;s sobre obligaci&oacute;n</span><span className="text-red-600">${interestOnObl.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Inter&eacute;s sobre activos</span><span className="text-green-600">(${interestOnAssets.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span></div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
                <span className="text-gray-900">Inter&eacute;s neto</span>
                <span style={{ color: netInterest >= 0 ? '#EF4444' : '#22C55E' }}>{netInterest >= 0 ? '' : '('}${Math.abs(netInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })}{netInterest < 0 ? ')' : ''}</span>
              </div>
            </div>
            <div className="rounded-lg p-4 text-sm border" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
              <span className="font-semibold text-gray-900">Asiento: </span>
              {netInterest >= 0 ? (
                <span className="text-gray-600">Débito: Gasto de BD (P&amp;L) ${Math.abs(netInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })} / Crédito: Pasivo neto de BD ${Math.abs(netInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              ) : (
                <span className="text-gray-600">Débito: Activo neto de BD ${Math.abs(netInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })} / Crédito: Ingreso de BD (P&amp;L) ${Math.abs(netInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <QuizInline
        question="Una empresa tiene PV de obligación de $2,000,000 y FV de activos de $1,500,000 al inicio del periodo. Tasa de descuento: 5%. ¿Cuál es el interés neto?"
        options={[
          '$100,000 (gasto en P&L)',
          '$25,000 (gasto en P&L)',
          '$75,000 (ingreso en P&L)',
          '$25,000 (reconocido en OCI)',
        ]}
        correctIndex={1}
        explanation="Interés sobre obligación: $2M × 5% = $100,000. Interés sobre activos: $1.5M × 5% = $75,000. Interés neto = $100,000 − $75,000 = $25,000 (costo neto → gasto en P&L)."
      />

      <QuizInline
        question="¿Qué refleja la tasa de descuento usada para calcular el interés neto?"
        options={[
          'El riesgo actuarial del plan',
          'El retorno esperado de los activos del plan',
          'El valor del dinero en el tiempo, sin riesgo actuarial ni de inversión',
          'La tasa de inflación esperada',
        ]}
        correctIndex={2}
        explanation="La tasa de descuento refleja únicamente el valor del dinero en el tiempo. NO incorpora riesgo actuarial ni riesgo de inversión. Se basa en bonos corporativos de alta calidad (o gubernamentales si no hay mercado profundo)."
      />
    </>
  );
}

function Lesson34() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Los activos del plan generan rendimientos: intereses, dividendos, ganancias de capital. 
          Pero <strong>no todo el retorno va al mismo lugar</strong> en los estados financieros. 
          IAS 19 divide el retorno en dos partes con destinos diferentes.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">&iquest;Qu&eacute; comprende el retorno?</h2>
      <div className="space-y-2 mb-8">
        {[
          'Intereses y dividendos recibidos',
          'Ganancias y pérdidas realizadas y no realizadas',
          'Menos: costos de administración del plan',
          'Menos: impuestos pagados por el plan',
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-medium">{i < 2 ? '+' : '−'}</span>
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">La divisi&oacute;n clave: P&amp;L vs OCI</h2>
      <div className="my-8 rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#004B87' }} />
              <span className="text-sm font-bold text-gray-900">Parte en P&amp;L</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              El inter&eacute;s sobre los activos calculado con la <strong>tasa de descuento</strong>. 
              Ya lo contabilizamos en la lecci&oacute;n 3.3 como parte del inter&eacute;s neto.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs">
              FV activos inicio &times; Tasa de descuento
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-sm font-bold text-gray-900">Parte en OCI</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              La diferencia entre el retorno <strong>real</strong> y el retorno calculado con la tasa de descuento. 
              Es una <strong>remedici&oacute;n</strong>.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs">
              Retorno real &minus; (FV activos inicio &times; Tasa)
            </div>
          </div>
        </div>
      </div>

      <KeyConcept title="¿Por qué dividir el retorno?">
        IAS 19 asume que los activos del plan rinden exactamente la tasa de descuento (para efectos de P&amp;L). 
        Cualquier diferencia entre el retorno real y esta &ldquo;expectativa&rdquo; es volatilidad que va a OCI, 
        evitando distorsiones en los resultados operativos.
      </KeyConcept>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Ejemplo</h2>
      <div className="my-6 rounded-xl border border-gray-100 p-5 text-sm space-y-3">
        <p className="text-gray-600">FV activos al inicio: <strong>$1,000,000</strong>. Tasa de descuento: <strong>5%</strong>. Retorno real: <strong>$80,000</strong>.</p>
        <div className="bg-gray-50 rounded-lg p-4 font-mono space-y-1">
          <p>Inter&eacute;s en P&amp;L = $1,000,000 &times; 5% = <span style={{ color: '#004B87' }}>$50,000</span></p>
          <p>Remedici&oacute;n en OCI = $80,000 &minus; $50,000 = <span className="text-green-600">$30,000 (ganancia)</span></p>
        </div>
        <p className="text-gray-500 text-xs">Los activos rindieron $30,000 m&aacute;s de lo &ldquo;esperado&rdquo;. Esa diferencia es remedici&oacute;n en OCI.</p>
      </div>

      <QuizInline
        question="Los activos del plan tienen FV de $2,000,000 al inicio. Tasa de descuento: 4%. El retorno real fue $60,000. ¿Cuánto va a OCI como remedición?"
        options={[
          '$60,000 (todo el retorno va a OCI)',
          '$80,000 (interés esperado a la tasa de descuento)',
          '($20,000) — pérdida en OCI, porque el retorno real fue menor al esperado',
          '$20,000 — ganancia en OCI',
        ]}
        correctIndex={2}
        explanation="Interés esperado: $2M × 4% = $80,000. Retorno real: $60,000. Diferencia: $60,000 − $80,000 = −$20,000. El retorno fue $20,000 menor al esperado, lo que genera una pérdida por remedición reconocida en OCI."
      />
    </>
  );
}

function Lesson35() {
  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Las <strong>remediciones</strong> capturan todo lo que no fue anticipado por los supuestos actuariales 
          al inicio del periodo. Son el &ldquo;ajuste a la realidad&rdquo; del plan, y se reconocen 
          <strong> &iacute;ntegramente en OCI</strong>, nunca en P&amp;L.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Tres componentes de las remediciones</h2>
      <div className="space-y-4 mb-8">
        <div className="p-5 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#004B87' }}>1</span>
            <span className="text-sm font-semibold text-gray-900">Ganancias y p&eacute;rdidas actuariales</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed pl-8">
            Cambios en el PV de la obligaci&oacute;n por ajustes de experiencia (la realidad difiri&oacute; de los 
            supuestos) o cambios en los supuestos actuariales.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#004B87' }}>2</span>
            <span className="text-sm font-semibold text-gray-900">Retorno de activos (neto del inter&eacute;s)</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed pl-8">
            La diferencia entre el retorno real de los activos y el calculado con la tasa de descuento 
            (lo que vimos en la lecci&oacute;n 3.4).
          </p>
        </div>
        <div className="p-5 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#004B87' }}>3</span>
            <span className="text-sm font-semibold text-gray-900">Cambios en el efecto del techo del activo</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed pl-8">
            Variaciones en el l&iacute;mite del activo neto reconocible, excluyendo lo incluido en inter&eacute;s neto.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Supuestos actuariales</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-gray-100">
          <span className="text-sm font-semibold text-gray-900 block mb-2">Demogr&aacute;ficos</span>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>&bull; Mortalidad y esperanza de vida</li>
            <li>&bull; Rotaci&oacute;n de personal</li>
            <li>&bull; Discapacidad</li>
            <li>&bull; Tasas de reclamo (planes m&eacute;dicos)</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl border border-gray-100">
          <span className="text-sm font-semibold text-gray-900 block mb-2">Financieros</span>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>&bull; Tasa de descuento</li>
            <li>&bull; Incrementos salariales futuros</li>
            <li>&bull; Costos m&eacute;dicos futuros</li>
            <li>&bull; Impuestos del plan</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Causas comunes de ganancias/p&eacute;rdidas actuariales</h2>
      <div className="space-y-2 mb-8">
        {[
          'Rotación de personal mayor o menor a la esperada',
          'Retiros anticipados no previstos',
          'Cambios en tablas de mortalidad',
          'Incrementos salariales diferentes a los proyectados',
          'Cambios en la tasa de descuento al cierre',
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-400 font-mono w-4">{i + 1}</span>
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>

      <KeyConcept title="Regla de oro: nunca a P&L">
        Las remediciones se reconocen <strong>inmediatamente en OCI</strong> y <strong>nunca se reclasifican</strong> a 
        resultados en periodos posteriores. Pueden transferirse dentro del patrimonio (ej. a utilidades retenidas), 
        pero nunca pasan por P&amp;L.
      </KeyConcept>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">La cifra de cuadre</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-4">
        En la pr&aacute;ctica, la ganancia/p&eacute;rdida actuarial sobre la obligaci&oacute;n se calcula como 
        <strong> cifra de cuadre</strong> en la tabla de movimientos:
      </p>
      <div className="my-6 rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-3 px-4 text-left font-semibold text-gray-900">Movimiento</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-900">PV Obligaci&oacute;n</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100"><td className="py-2 px-4 text-gray-600">Saldo inicial</td><td className="py-2 px-4 text-right font-mono">(X)</td></tr>
            <tr className="border-b border-gray-100"><td className="py-2 px-4 text-gray-600">+ Inter&eacute;s sobre obligaci&oacute;n</td><td className="py-2 px-4 text-right font-mono">(X)</td></tr>
            <tr className="border-b border-gray-100"><td className="py-2 px-4 text-gray-600">+ Costo del servicio actual</td><td className="py-2 px-4 text-right font-mono">(X)</td></tr>
            <tr className="border-b border-gray-100"><td className="py-2 px-4 text-gray-600">&minus; Beneficios pagados</td><td className="py-2 px-4 text-right font-mono">X</td></tr>
            <tr className="border-b border-gray-100 bg-amber-50"><td className="py-2 px-4 font-semibold text-amber-800">= Ganancia (p&eacute;rdida) actuarial</td><td className="py-2 px-4 text-right font-mono font-bold text-amber-800">???</td></tr>
            <tr><td className="py-2 px-4 font-semibold text-gray-900">Saldo final</td><td className="py-2 px-4 text-right font-mono font-bold">(X)</td></tr>
          </tbody>
        </table>
      </div>

      <QuizInline
        question="¿Cuál de los siguientes eventos genera una ganancia o pérdida actuarial?"
        options={[
          'La empresa paga contribuciones al fondo durante el periodo',
          'La tasa de rotación real fue mayor que la estimada al inicio del periodo',
          'El costo del servicio actual se reconoce en resultados',
          'Los activos del plan generan intereses iguales a la tasa de descuento',
        ]}
        correctIndex={1}
        explanation="Cuando la rotación real difiere de la estimada, la obligación cambia de forma no anticipada. Esta diferencia entre la experiencia real y los supuestos genera una ganancia o pérdida actuarial, reconocida en OCI."
      />

      <QuizInline
        question="Las remediciones del pasivo neto de beneficio definido reconocidas en OCI:"
        options={[
          'Se reclasifican a resultados (P&L) en el siguiente periodo',
          'Se amortizan a resultados sobre la vida esperada de los empleados',
          'Nunca se reclasifican a resultados, pero pueden transferirse dentro del patrimonio',
          'Se reclasifican a resultados cuando el plan se liquida',
        ]}
        correctIndex={2}
        explanation="IAS 19 prohíbe explícitamente la reclasificación de remediciones a P&L. Pueden transferirse dentro del patrimonio (por ejemplo, de OCI acumulado a utilidades retenidas), pero nunca pasan por resultados."
      />
    </>
  );
}

function Lesson36() {
  const [step, setStep] = useState(0);
  const [path, setPath] = useState<string[]>([]);

  const tree = [
    { question: '¿Las contribuciones están establecidas en los términos formales del plan (o surgen de una obligación implícita)?', options: ['Sí', 'No (discrecionales)'] },
    { question: '¿Las contribuciones están vinculadas al servicio del empleado?', options: ['Sí, vinculadas al servicio', 'No vinculadas al servicio'] },
    { question: '¿El monto depende del número de años de servicio?', options: ['Sí, depende de los años', 'No, independiente de los años'] },
  ];

  const getResult = () => {
    if (path[0] === 'No (discrecionales)') return { title: 'Discrecionales', color: 'amber', desc: 'Reducen el costo del servicio al momento del pago.' };
    if (path[1] === 'No vinculadas al servicio') return { title: 'No vinculadas al servicio', color: 'purple', desc: 'Afectan las remediciones del pasivo neto de BD (reconocidas en OCI).' };
    if (path[2] === 'Sí, depende de los años') return { title: 'Vinculadas al servicio, dependientes de años', color: 'blue', desc: 'Se atribuyen usando el método de atribución: fórmula del plan o línea recta, igual que el beneficio bruto.' };
    if (path[2] === 'No, independiente de los años') return { title: 'Vinculadas al servicio, independientes de años', color: 'green', desc: 'Reducen el costo del servicio en el periodo en que se presta el servicio relacionado. Ej.: un porcentaje fijo del salario.' };
    return null;
  };

  const handleAnswer = (answer: string) => {
    const newPath = [...path, answer];
    setPath(newPath);
    if (answer === 'No (discrecionales)' || (step === 1 && answer === 'No vinculadas al servicio') || step === 2) {
      setStep(-1);
    } else {
      setStep(step + 1);
    }
  };

  const handleReset = () => { setStep(0); setPath([]); };
  const result = getResult();

  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Algunos planes DB requieren que los <strong>empleados</strong> o terceros contribuyan al costo del plan. 
          El tratamiento contable depende de la naturaleza de esas contribuciones.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">&Aacute;rbol de decisi&oacute;n</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        IAS 19 clasifica las contribuciones de empleados en 4 categor&iacute;as seg&uacute;n dos criterios: 
        si est&aacute;n en los t&eacute;rminos del plan y si est&aacute;n vinculadas al servicio.
      </p>

      <div className="my-8 rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Clasificador interactivo</span>
          {path.length > 0 && (
            <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Reiniciar</button>
          )}
        </div>

        {step >= 0 && step < tree.length && (
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            <p className="text-sm font-medium text-gray-900 mb-4">{tree[step].question}</p>
            <div className="space-y-2">
              {tree[step].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-[#004B87]/30 hover:bg-blue-50/30 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              {path.map((p, i) => (
                <span key={i} className="flex items-center gap-1 text-xs text-gray-400">
                  {i > 0 && <span>&rarr;</span>}
                  <span className="px-2 py-0.5 bg-gray-100 rounded">{p}</span>
                </span>
              ))}
            </div>
            <div className={`rounded-lg p-4 border ${
              result.color === 'blue' ? 'bg-blue-50 border-blue-200' :
              result.color === 'green' ? 'bg-green-50 border-green-200' :
              result.color === 'purple' ? 'bg-purple-50 border-purple-200' :
              'bg-amber-50 border-amber-200'
            }`}>
              <span className={`text-sm font-bold ${
                result.color === 'blue' ? 'text-blue-900' :
                result.color === 'green' ? 'text-green-900' :
                result.color === 'purple' ? 'text-purple-900' :
                'text-amber-900'
              }`}>{result.title}</span>
              <p className={`text-sm mt-1 ${
                result.color === 'blue' ? 'text-blue-700' :
                result.color === 'green' ? 'text-green-700' :
                result.color === 'purple' ? 'text-purple-700' :
                'text-amber-700'
              }`}>{result.desc}</p>
            </div>
          </motion.div>
        )}
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Resumen de los 4 tratamientos</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-4 text-left font-semibold text-gray-900">Tipo</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900">Tratamiento</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-gray-600">Vinculadas, dependientes de a&ntilde;os</td>
              <td className="py-3 px-4 text-gray-600">Atribuir con f&oacute;rmula del plan o l&iacute;nea recta</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-gray-600">Vinculadas, independientes de a&ntilde;os</td>
              <td className="py-3 px-4 text-gray-600">Reducci&oacute;n del costo del servicio del periodo</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-gray-600">No vinculadas al servicio</td>
              <td className="py-3 px-4 text-gray-600">Afectan remediciones (OCI)</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-gray-600">Discrecionales</td>
              <td className="py-3 px-4 text-gray-600">Reducen costo del servicio al momento del pago</td>
            </tr>
          </tbody>
        </table>
      </div>

      <QuizInline
        question="Un plan DB requiere que cada empleado contribuya el 3% de su salario (porcentaje fijo, independiente de antigüedad). ¿Cómo se contabilizan estas contribuciones?"
        options={[
          'Se atribuyen usando la fórmula del plan o línea recta',
          'Se reconocen como reducción del costo del servicio en el periodo',
          'Afectan las remediciones en OCI',
          'Se reconocen cuando el empleado se jubila',
        ]}
        correctIndex={1}
        explanation="Contribuciones vinculadas al servicio pero independientes del número de años (porcentaje fijo del salario) se reconocen como reducción del costo del servicio en el periodo en que se presta el servicio."
      />

      <QuizInline
        question="Un empleado decide voluntariamente aportar $500 adicionales al fondo de pensiones (no está en los términos del plan). ¿Cómo se contabiliza?"
        options={[
          'Reduce el costo del servicio actual',
          'Se atribuye a los años de servicio restantes',
          'Reduce el costo del servicio al momento del pago (discrecional)',
          'No se registra bajo IAS 19',
        ]}
        correctIndex={2}
        explanation="Las contribuciones discrecionales (no establecidas en los términos del plan ni por obligación implícita) reducen el costo del servicio al momento en que se pagan al plan."
      />
    </>
  );
}

function Lesson37() {
  const [inputs, setInputs] = useState({
    pvOblStart: '1000000',
    fvAssetsStart: '800000',
    rate: '5',
    contributions: '120000',
    benefitsPaid: '90000',
    currentServiceCost: '60000',
    pvOblEnd: '1080000',
    fvAssetsEnd: '895000',
  });

  const pvS = parseFloat(inputs.pvOblStart) || 0;
  const fvS = parseFloat(inputs.fvAssetsStart) || 0;
  const r = (parseFloat(inputs.rate) || 0) / 100;
  const contrib = parseFloat(inputs.contributions) || 0;
  const bPaid = parseFloat(inputs.benefitsPaid) || 0;
  const csc = parseFloat(inputs.currentServiceCost) || 0;
  const pvE = parseFloat(inputs.pvOblEnd) || 0;
  const fvE = parseFloat(inputs.fvAssetsEnd) || 0;

  const intObl = pvS * r;
  const intAssets = fvS * r;
  const netInt = intObl - intAssets;

  const pvExpected = pvS + intObl + csc - bPaid;
  const actuarialGL = pvE - pvExpected;
  const fvExpected = fvS + intAssets + contrib - bPaid;
  const returnRemeasurement = fvE - fvExpected;
  const totalOCI = -actuarialGL + returnRemeasurement;

  const plTotal = csc + netInt;
  const netStart = pvS - fvS;
  const netEnd = pvE - fvE;

  const fmt = (n: number) => {
    const abs = Math.abs(n);
    const str = abs.toLocaleString(undefined, { maximumFractionDigits: 0 });
    return n < 0 ? `(${str})` : str;
  };

  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Es hora de integrar todo. En esta lecci&oacute;n construir&aacute;s la <strong>tabla completa de 
          movimientos</strong> de un plan DB, paso a paso. Cada celda genera un asiento contable y al final 
          ver&aacute;s el resumen de lo reconocido en balance, P&amp;L y OCI.
        </p>
      </div>

      <div className="my-8 rounded-xl border border-gray-100 p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Datos del ejercicio (editables)</span>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'pvOblStart', label: 'Valor presente obligación inicio' },
            { key: 'fvAssetsStart', label: 'Valor razonable activos inicio' },
            { key: 'rate', label: 'Tasa descuento (%)' },
            { key: 'currentServiceCost', label: 'Costo servicio actual' },
            { key: 'contributions', label: 'Contribuciones pagadas' },
            { key: 'benefitsPaid', label: 'Beneficios pagados' },
            { key: 'pvOblEnd', label: 'Valor presente obligación final' },
            { key: 'fvAssetsEnd', label: 'Valor razonable activos final' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="text-[10px] font-medium text-gray-500 mb-1 block">{label}</label>
              <input
                type="number"
                value={inputs[key as keyof typeof inputs]}
                onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]/20"
              />
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Tabla de movimientos</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Movimiento</th>
              <th className="py-3 px-3 text-right font-semibold text-red-600">Obligaci&oacute;n</th>
              <th className="py-3 px-3 text-right font-semibold text-green-600">Activos</th>
              <th className="py-3 px-3 text-right font-semibold" style={{ color: '#004B87' }}>Neto</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            <tr className="border-b border-gray-100 bg-gray-50">
              <td className="py-2 px-3 font-sans font-medium text-gray-900">Saldo inicial</td>
              <td className="py-2 px-3 text-right text-red-600">({fmt(pvS)})</td>
              <td className="py-2 px-3 text-right text-green-600">{fmt(fvS)}</td>
              <td className="py-2 px-3 text-right" style={{ color: '#004B87' }}>({fmt(netStart)})</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 font-sans text-gray-600">Inter&eacute;s sobre obligaci&oacute;n</td>
              <td className="py-2 px-3 text-right text-red-600">({fmt(intObl)})</td>
              <td className="py-2 px-3 text-right text-gray-300">&mdash;</td>
              <td className="py-2 px-3 text-right" style={{ color: '#004B87' }}>({fmt(intObl)})</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 font-sans text-gray-600">Inter&eacute;s sobre activos</td>
              <td className="py-2 px-3 text-right text-gray-300">&mdash;</td>
              <td className="py-2 px-3 text-right text-green-600">{fmt(intAssets)}</td>
              <td className="py-2 px-3 text-right text-green-600">{fmt(intAssets)}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 font-sans text-gray-600">Costo del servicio actual</td>
              <td className="py-2 px-3 text-right text-red-600">({fmt(csc)})</td>
              <td className="py-2 px-3 text-right text-gray-300">&mdash;</td>
              <td className="py-2 px-3 text-right" style={{ color: '#004B87' }}>({fmt(csc)})</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 font-sans text-gray-600">Contribuciones pagadas</td>
              <td className="py-2 px-3 text-right text-gray-300">&mdash;</td>
              <td className="py-2 px-3 text-right text-green-600">{fmt(contrib)}</td>
              <td className="py-2 px-3 text-right text-green-600">{fmt(contrib)}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 font-sans text-gray-600">Beneficios pagados</td>
              <td className="py-2 px-3 text-right text-green-600">{fmt(bPaid)}</td>
              <td className="py-2 px-3 text-right text-red-600">({fmt(bPaid)})</td>
              <td className="py-2 px-3 text-right text-gray-300">&mdash;</td>
            </tr>
            <tr className="border-b border-gray-100 bg-amber-50">
              <td className="py-2 px-3 font-sans font-medium text-amber-800">Remedici&oacute;n — obligaci&oacute;n</td>
              <td className="py-2 px-3 text-right font-bold text-amber-700">{actuarialGL >= 0 ? `(${fmt(actuarialGL)})` : fmt(Math.abs(actuarialGL))}</td>
              <td className="py-2 px-3 text-right text-gray-300">&mdash;</td>
              <td className="py-2 px-3 text-right font-bold text-amber-700">{actuarialGL >= 0 ? `(${fmt(actuarialGL)})` : fmt(Math.abs(actuarialGL))}</td>
            </tr>
            <tr className="border-b border-gray-100 bg-amber-50">
              <td className="py-2 px-3 font-sans font-medium text-amber-800">Remedici&oacute;n — activos</td>
              <td className="py-2 px-3 text-right text-gray-300">&mdash;</td>
              <td className="py-2 px-3 text-right font-bold text-amber-700">{fmt(returnRemeasurement)}</td>
              <td className="py-2 px-3 text-right font-bold text-amber-700">{fmt(returnRemeasurement)}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-3 px-3 font-sans font-bold text-gray-900">Saldo final</td>
              <td className="py-3 px-3 text-right font-bold text-red-600">({fmt(pvE)})</td>
              <td className="py-3 px-3 text-right font-bold text-green-600">{fmt(fvE)}</td>
              <td className="py-3 px-3 text-right font-bold" style={{ color: '#004B87' }}>({fmt(netEnd)})</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Resumen de reconocimiento</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl border-2" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#004B87' }}>Balance</span>
          <div className="mt-2 text-lg font-bold text-gray-900">Pasivo neto: ${fmt(netEnd)}</div>
        </div>
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">P&amp;L (Resultados)</span>
          <div className="mt-2 text-lg font-bold text-gray-900">Gasto: ${fmt(plTotal)}</div>
          <div className="text-xs text-gray-500 mt-1">Costo servicio: ${fmt(csc)} + Inter&eacute;s neto: ${fmt(netInt)}</div>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">OCI (Remediciones)</span>
          <div className="mt-2 text-lg font-bold text-gray-900">${fmt(totalOCI)}</div>
          <div className="text-xs text-gray-500 mt-1">G/P actuarial: ${fmt(-actuarialGL)} + Retorno activos: ${fmt(returnRemeasurement)}</div>
        </div>
      </div>

      <KeyConcept title="Verificación">
        El cambio en el pasivo neto = P&amp;L + OCI + Contribuciones &minus; Beneficios netos. 
        Si la tabla cuadra, los saldos finales coinciden con los datos del actuario.
      </KeyConcept>
    </>
  );
}

function Lesson41() {
  const [showComparison, setShowComparison] = useState(false);

  const comparisonData = [
    { concept: 'Costo del servicio', postEmpleo: 'P&L', otrosLP: 'P&L' },
    { concept: 'Interés neto', postEmpleo: 'P&L', otrosLP: 'P&L' },
    { concept: 'Remediciones', postEmpleo: 'OCI', otrosLP: 'P&L' },
    { concept: 'Costo servicio pasado', postEmpleo: 'P&L (inmediato)', otrosLP: 'P&L (inmediato)' },
  ];

  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Hasta ahora hemos hablado de beneficios <strong>post-empleo</strong> (pensiones, seguros m&eacute;dicos de jubilados). 
          Pero IAS 19 tambi&eacute;n cubre <strong>otros beneficios a largo plazo</strong>: bonos por antig&uuml;edad, 
          a&ntilde;os sab&aacute;ticos, licencias a largo plazo y seguros de incapacidad.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Ejemplos de otros beneficios a largo plazo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { title: 'Bonos por aniversario', desc: 'Pago &uacute;nico al cumplir 10, 15 o 20 a&ntilde;os de servicio.' },
          { title: 'A&ntilde;o sab&aacute;tico', desc: 'Licencia con goce de sueldo despu&eacute;s de X a&ntilde;os.' },
          { title: 'Licencias largas', desc: 'Ausencias remuneradas que no se esperan usar totalmente en 12 meses.' },
          { title: 'Participaci&oacute;n en utilidades diferida', desc: 'Bonos que se pagan m&aacute;s de 12 meses despu&eacute;s del cierre.' },
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-100">
            <span className="text-sm font-semibold text-gray-900 block mb-1">{item.title}</span>
            <p className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: item.desc }} />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">La diferencia clave: &iquest;d&oacute;nde van las remediciones?</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        La contabilizaci&oacute;n de otros beneficios a largo plazo es <strong>casi id&eacute;ntica</strong> a la de planes DB 
        post-empleo, con una diferencia fundamental: las <strong>remediciones van directo a P&amp;L</strong>, no a OCI.
      </p>

      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border-2 border-amber-200 bg-amber-50/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm font-bold text-amber-900">Planes DB post-empleo</span>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            Remediciones &rarr; <strong>OCI</strong><br />
            (nunca se reclasifican a P&amp;L)
          </p>
        </div>
        <div className="p-5 rounded-xl border-2" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#004B87' }} />
            <span className="text-sm font-bold" style={{ color: '#004B87' }}>Otros beneficios a largo plazo</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#004B87' }}>
            Remediciones &rarr; <strong>P&amp;L</strong><br />
            (impacto inmediato en resultados)
          </p>
        </div>
      </div>

      <KeyConcept title="&iquest;Por qu&eacute; diferente?">
        Otros beneficios a largo plazo involucran <strong>menos incertidumbre</strong> que las pensiones 
        (plazos m&aacute;s cortos, menos supuestos actuariales). Por eso, IAS 19 considera aceptable reconocer 
        toda la volatilidad en P&amp;L de inmediato, en vez de suavizarla en OCI.
      </KeyConcept>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Tabla comparativa</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-4">
        Haz clic en el bot&oacute;n para revelar d&oacute;nde se reconoce cada componente:
      </p>

      <div className="my-6">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="mb-4 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#004B87' }}
        >
          {showComparison ? 'Ocultar tabla' : 'Mostrar comparaci\u00f3n'}
        </button>

        {showComparison && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-left font-semibold text-gray-900">Componente</th>
                  <th className="py-3 px-4 text-center font-semibold text-amber-700">DB Post-empleo</th>
                  <th className="py-3 px-4 text-center font-semibold" style={{ color: '#004B87' }}>Otros LP</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${row.concept === 'Remediciones' ? 'bg-yellow-50' : ''}`}>
                    <td className="py-3 px-4 text-gray-700">{row.concept}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        row.postEmpleo === 'OCI' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                      }`}>{row.postEmpleo}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100" style={{ color: '#004B87' }}>{row.otrosLP}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Balance y P&amp;L</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Balance</span>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            Valor presente de la obligaci&oacute;n<br />
            <strong>&minus;</strong> Valor razonable de activos del plan<br />
            <strong>=</strong> Pasivo (activo) neto
          </p>
        </div>
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">P&amp;L (todo aqu&iacute;)</span>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            Costo del servicio<br />
            <strong>+</strong> Inter&eacute;s neto<br />
            <strong>+</strong> Remediciones
          </p>
        </div>
      </div>

      <QuizInline
        question="&iquest;Cu&aacute;l es la diferencia principal en el reconocimiento entre planes DB post-empleo y otros beneficios a largo plazo?"
        options={[
          'Los otros beneficios LP no requieren supuestos actuariales',
          'Las remediciones de otros beneficios LP van a P&L en vez de OCI',
          'Los otros beneficios LP no generan pasivo en el balance',
          'El costo del servicio de otros beneficios LP se difiere',
        ]}
        correctIndex={1}
        explanation="La diferencia clave es que las remediciones de otros beneficios a largo plazo se reconocen directamente en P&L, mientras que en planes DB post-empleo van a OCI."
      />

      <QuizInline
        question="Un bono por antig&uuml;edad de $15,000 pagadero a los 10 a&ntilde;os de servicio es un ejemplo de:"
        options={[
          'Beneficio a corto plazo',
          'Beneficio post-empleo',
          'Otro beneficio a largo plazo',
          'Beneficio por terminación',
        ]}
        correctIndex={2}
        explanation="Los bonos por aniversario son otros beneficios a largo plazo: se pagan durante el empleo (no post-empleo), pero más de 12 meses después de que el empleado presta el servicio."
      />
    </>
  );
}

function Lesson42() {
  const [inputs, setInputs] = useState({
    originalBenefit: '1500',
    newBenefit: '3000',
    yearsToVest: '15',
    group1Count: '10',
    group1YearsWorked: '15',
    group2Count: '25',
    group2YearsWorked: '8',
  });

  const original = parseFloat(inputs.originalBenefit) || 0;
  const newBen = parseFloat(inputs.newBenefit) || 0;
  const yearsToVest = parseFloat(inputs.yearsToVest) || 1;
  const g1Count = parseFloat(inputs.group1Count) || 0;
  const g1Years = parseFloat(inputs.group1YearsWorked) || 0;
  const g2Count = parseFloat(inputs.group2Count) || 0;
  const g2Years = parseFloat(inputs.group2YearsWorked) || 0;

  const additionalPerYear = (newBen - original) / yearsToVest;
  const g1PastService = g1Count * Math.min(g1Years, yearsToVest) * additionalPerYear;
  const g2PastService = g2Count * Math.min(g2Years, yearsToVest) * additionalPerYear;
  const totalPastService = g1PastService + g2PastService;

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Cuando la empresa <strong>mejora</strong> un beneficio a largo plazo existente (como subir el bono por antig&uuml;edad), 
          surge un <strong>costo del servicio pasado</strong>. &iquest;C&oacute;mo se contabiliza? Exactamente igual que en planes DB 
          post-empleo: <strong>inmediatamente en P&amp;L</strong>.
        </p>
      </div>

      <KeyConcept title="Regla simple">
        Todo el costo del servicio pasado de otros beneficios a largo plazo se reconoce en P&amp;L 
        <strong> de inmediato</strong>. No hay distribuci&oacute;n en periodos futuros.
      </KeyConcept>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Simulador: mejora de bono por antig&uuml;edad</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-4">
        Imagina que tu empresa tiene un bono pagadero al cumplir ciertos a&ntilde;os de servicio. 
        Modifica los valores para ver el impacto en P&amp;L:
      </p>

      <div className="my-6 rounded-xl border border-gray-100 p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Par&aacute;metros del plan</span>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Bono original ($)</label>
            <input type="number" value={inputs.originalBenefit} onChange={(e) => setInputs({ ...inputs, originalBenefit: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87]" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Bono nuevo ($)</label>
            <input type="number" value={inputs.newBenefit} onChange={(e) => setInputs({ ...inputs, newBenefit: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87]" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">A&ntilde;os para obtenerlo</label>
            <input type="number" value={inputs.yearsToVest} onChange={(e) => setInputs({ ...inputs, yearsToVest: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87]" />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Grupos de empleados</span>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Grupo 1: # empleados</label>
              <input type="number" value={inputs.group1Count} onChange={(e) => setInputs({ ...inputs, group1Count: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Grupo 1: a&ntilde;os trabajados</label>
              <input type="number" value={inputs.group1YearsWorked} onChange={(e) => setInputs({ ...inputs, group1YearsWorked: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Grupo 2: # empleados</label>
              <input type="number" value={inputs.group2Count} onChange={(e) => setInputs({ ...inputs, group2Count: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Grupo 2: a&ntilde;os trabajados</label>
              <input type="number" value={inputs.group2YearsWorked} onChange={(e) => setInputs({ ...inputs, group2YearsWorked: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004B87]" />
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 pt-4 border-t border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">C&aacute;lculo del costo del servicio pasado</span>
          <div className="mt-4 bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-2">
            <p className="text-gray-600">Incremento por a&ntilde;o = (${fmt(newBen)} &minus; ${fmt(original)}) &divide; {yearsToVest} = <strong>${fmt(additionalPerYear)}</strong></p>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <p className="text-gray-600">Grupo 1: {g1Count} empleados &times; {Math.min(g1Years, yearsToVest)} a&ntilde;os &times; ${fmt(additionalPerYear)} = <strong>${fmt(g1PastService)}</strong></p>
              <p className="text-gray-600">Grupo 2: {g2Count} empleados &times; {Math.min(g2Years, yearsToVest)} a&ntilde;os &times; ${fmt(additionalPerYear)} = <strong>${fmt(g2PastService)}</strong></p>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl border-2" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: '#004B87' }}>Costo del servicio pasado total</span>
              <span className="text-xl font-bold" style={{ color: '#004B87' }}>${fmt(totalPastService)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Este monto se reconoce <strong>inmediatamente</strong> como gasto en P&amp;L.</p>
          </div>
        </motion.div>
      </div>

      <div className="my-6 rounded-xl border-2 p-5" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#004B87' }}>Asiento contable</span>
        <p className="text-xs text-gray-500 mt-1 mb-3">Reconocimiento del costo del servicio pasado</p>
        <div className="font-mono text-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-900">D&eacute;bito: Gasto de beneficios a LP (P&amp;L)</span>
            <span className="font-medium text-gray-900">${fmt(totalPastService)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 pl-8">Cr&eacute;dito: Pasivo por beneficios a LP</span>
              <span className="font-medium text-gray-500">${fmt(totalPastService)}</span>
            </div>
          </div>
        </div>
      </div>

      <QuizInline
        question="Una empresa mejora su bono por 10 a&ntilde;os de servicio de $2,000 a $5,000. Hay 20 empleados que ya tienen 10+ a&ntilde;os y 30 empleados con 5 a&ntilde;os promedio. &iquest;Cu&aacute;l es el costo del servicio pasado?"
        options={[
          '$60,000 (solo empleados actuales con 10+ años)',
          '$60,000 + $45,000 = $105,000 (todos los empleados)',
          'Se calcula y reconoce gradualmente en los próximos 5 años',
          '$150,000 (30 empleados × $5,000)',
        ]}
        correctIndex={1}
        explanation="Incremento por año = $3,000 ÷ 10 = $300. Grupo 1: 20 × 10 × $300 = $60,000. Grupo 2: 30 × 5 × $300 = $45,000. Total = $105,000, reconocido inmediatamente en P&L."
      />
    </>
  );
}

function Lesson43() {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const cases = [
    {
      scenario: 'La empresa ofrece $50,000 a empleados que acepten retirarse voluntariamente antes de los 60 a&ntilde;os.',
      isTermination: true,
      explanation: 'Es beneficio por terminaci&oacute;n: el pago es resultado de la decisi&oacute;n del empleado de aceptar separacion voluntaria.',
    },
    {
      scenario: 'Un empleado cumple 65 a&ntilde;os y recibe su pensi&oacute;n mensual seg&uacute;n el plan de la empresa.',
      isTermination: false,
      explanation: 'Es beneficio post-empleo: el pago es por jubilaci&oacute;n normal, no por terminaci&oacute;n anticipada.',
    },
    {
      scenario: 'La empresa cierra una planta y paga 3 meses de sueldo a los 200 empleados despedidos.',
      isTermination: true,
      explanation: 'Es beneficio por terminaci&oacute;n: el pago es resultado de la decisi&oacute;n de la empresa de terminar el empleo antes de la fecha normal de retiro.',
    },
    {
      scenario: 'Un empleado renuncia y recibe el aguinaldo proporcional que le corresponde por ley.',
      isTermination: false,
      explanation: 'Es beneficio a corto plazo: el aguinaldo se debe independientemente de la raz&oacute;n de salida.',
    },
  ];

  const handleSelect = (i: number) => {
    setSelectedCase(i);
    setShowAnswer(false);
  };

  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Los <strong>beneficios por terminaci&oacute;n</strong> son pagos especiales que surgen cuando el empleo 
          termina <em>antes</em> de lo normal. No confundas: la <strong>forma</strong> del pago no determina si es 
          terminaci&oacute;n &mdash; lo que importa es la <strong>raz&oacute;n</strong>.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Definici&oacute;n</h2>
      <div className="my-6 p-5 rounded-xl border-2" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
        <p className="text-sm leading-relaxed" style={{ color: '#004B87' }}>
          <strong>Beneficios por terminaci&oacute;n</strong> son beneficios pagaderos como resultado de:
        </p>
        <ul className="mt-3 space-y-2 text-sm" style={{ color: '#004B87' }}>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold" style={{ color: '#004B87' }}>1</span>
            <span>La decisi&oacute;n de la <strong>empresa</strong> de terminar el empleo <strong>antes</strong> de la fecha normal de retiro</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold" style={{ color: '#004B87' }}>2</span>
            <span>La decisi&oacute;n del <strong>empleado</strong> de aceptar separacion voluntaria a cambio de esos beneficios</span>
          </li>
        </ul>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Formas t&iacute;picas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { title: 'Pago &uacute;nico', desc: 'Liquidaci&oacute;n o finiquito extraordinario por despido o retiro voluntario anticipado.' },
          { title: 'Mejora de pensi&oacute;n', desc: 'Incremento en beneficios post-empleo como incentivo para aceptar la terminaci&oacute;n.' },
          { title: 'Salario sin servicio', desc: 'Pago del sueldo durante el periodo de aviso aunque el empleado ya no trabaje.' },
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-100">
            <span className="text-sm font-semibold text-gray-900 block mb-1" dangerouslySetInnerHTML={{ __html: item.title }} />
            <p className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: item.desc }} />
          </div>
        ))}
      </div>

      <KeyConcept title="Distinci&oacute;n cr&iacute;tica">
        La <strong>forma</strong> del beneficio (pago &uacute;nico, mejora de pensi&oacute;n, etc.) NO determina 
        si es beneficio por terminaci&oacute;n. Lo que importa es la <strong>raz&oacute;n</strong>: &iquest;se 
        paga por servicio prestado o por la terminaci&oacute;n del empleo?
      </KeyConcept>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Clasificador de casos</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-4">
        Selecciona un escenario y decide: &iquest;es beneficio por terminaci&oacute;n o no?
      </p>

      <div className="my-6 space-y-3">
        {cases.map((c, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selectedCase === i ? 'border-[#004B87] bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: c.scenario }} />
          </button>
        ))}
      </div>

      {selectedCase !== null && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="my-6">
          {!showAnswer ? (
            <div className="flex gap-3">
              <button
                onClick={() => setShowAnswer(true)}
                className="flex-1 py-3 rounded-lg text-sm font-medium border-2 border-green-200 text-green-700 hover:bg-green-50 transition-colors"
              >
                S&iacute;, es terminaci&oacute;n
              </button>
              <button
                onClick={() => setShowAnswer(true)}
                className="flex-1 py-3 rounded-lg text-sm font-medium border-2 border-red-200 text-red-700 hover:bg-red-50 transition-colors"
              >
                No es terminaci&oacute;n
              </button>
            </div>
          ) : (
            <div className={`p-4 rounded-xl border ${cases[selectedCase].isTermination ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${cases[selectedCase].isTermination ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
                  {cases[selectedCase].isTermination ? 'S\u00cd es terminaci\u00f3n' : 'NO es terminaci\u00f3n'}
                </span>
              </div>
              <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: cases[selectedCase].explanation }} />
              <button
                onClick={() => { setSelectedCase(null); setShowAnswer(false); }}
                className="mt-3 text-xs text-gray-400 hover:text-gray-600"
              >
                Probar otro caso
              </button>
            </div>
          )}
        </motion.div>
      )}

      <QuizInline
        question="&iquest;Cu&aacute;l de los siguientes es un beneficio por terminaci&oacute;n?"
        options={[
          'Pensión mensual pagada a un jubilado de 65 años',
          'Pago único a empleados que aceptan retiro voluntario anticipado',
          'Bono anual pagado a todos los empleados activos',
          'Prima de antigüedad pagada al cumplir 15 años de servicio',
        ]}
        correctIndex={1}
        explanation="El pago único por retiro voluntario anticipado es beneficio por terminación porque se paga como resultado de la decisión del empleado de aceptar separacion voluntaria."
      />

      <QuizInline
        question="Un empleado recibe mejora en su pensi&oacute;n como incentivo para aceptar retiro anticipado. &iquest;C&oacute;mo se clasifica?"
        options={[
          'Beneficio post-empleo (porque es pensión)',
          'Beneficio por terminación (porque incentiva la salida anticipada)',
          'Otro beneficio a largo plazo',
          'Beneficio a corto plazo',
        ]}
        correctIndex={1}
        explanation="Aunque la forma es una mejora de pensión, la razón es incentivar la terminación anticipada. La razón determina la clasificación, no la forma."
      />
    </>
  );
}

function Lesson44() {
  const [checklist, setChecklist] = useState([false, false, false]);
  const allChecked = checklist.every(Boolean);

  const criteria = [
    {
      title: 'Acciones indican improbabilidad de cambios',
      desc: 'Las acciones requeridas para completar el plan indican que es improbable que haya cambios significativos.',
    },
    {
      title: 'Identifica empleados afectados',
      desc: 'El plan identifica el n&uacute;mero de empleados, sus clasificaciones o funciones, y sus ubicaciones.',
    },
    {
      title: 'Detalle suficiente de beneficios',
      desc: 'El plan establece los beneficios con suficiente detalle para que los empleados determinen el tipo y monto que recibir&aacute;n.',
    },
  ];

  const toggleCheck = (i: number) => {
    const newChecklist = [...checklist];
    newChecklist[i] = !newChecklist[i];
    setChecklist(newChecklist);
  };

  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          A diferencia de otros beneficios, los de terminaci&oacute;n <strong>no surgen del servicio</strong> del 
          empleado, sino de la terminaci&oacute;n misma. Por eso, se reconocen de inmediato cuando se cumplen 
          ciertas condiciones espec&iacute;ficas.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">&iquest;Cu&aacute;ndo reconocer?</h2>
      <div className="my-6 p-5 rounded-xl border-2" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
        <p className="text-sm font-semibold mb-3" style={{ color: '#004B87' }}>Se reconoce pasivo y gasto al <strong>primero</strong> de:</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <span className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#004B87' }}>A</span>
            <span className="text-sm text-gray-700">Cuando la entidad <strong>ya no puede retirar</strong> la oferta de esos beneficios</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <span className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#004B87' }}>B</span>
            <span className="text-sm text-gray-700">Cuando reconoce costos de <strong>reestructuraci&oacute;n</strong> (IAS 37) que involucran beneficios por terminaci&oacute;n</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">&iquest;Cu&aacute;ndo ya no puede retirar la oferta?</h2>
      
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
          <span className="text-sm font-bold text-amber-900 block mb-2">Redundancia voluntaria</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            Al <strong>primero</strong> de:<br />
            &bull; Cuando el empleado <strong>acepta</strong> la oferta<br />
            &bull; Cuando una restricci&oacute;n (legal, contractual) <strong>toma efecto</strong>
          </p>
        </div>
        <div className="p-4 rounded-xl border" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
          <span className="text-sm font-bold block mb-2" style={{ color: '#004B87' }}>Terminaci&oacute;n por decisi&oacute;n de la empresa</span>
          <p className="text-xs leading-relaxed" style={{ color: '#004B87' }}>
            Cuando ha <strong>comunicado</strong> un plan que cumple <strong>3 criterios</strong> espec&iacute;ficos &darr;
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Los 3 criterios para planes de terminaci&oacute;n</h2>
      <p className="text-base text-gray-600 leading-relaxed mb-4">
        Cuando la empresa decide terminar empleados, debe comunicar un plan que cumpla <strong>todos</strong> estos criterios 
        para reconocer el pasivo:
      </p>

      <div className="my-6 rounded-xl border border-gray-100 p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Checklist interactivo</span>
        <p className="text-xs text-gray-400 mt-1 mb-4">Marca cada criterio para evaluar si un plan cumple los requisitos</p>
        
        <div className="space-y-3">
          {criteria.map((c, i) => (
            <button
              key={i}
              onClick={() => toggleCheck(i)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                checklist[i] ? 'border-green-300 bg-green-50' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  checklist[i] ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'
                }`}>
                  {checklist[i] && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                </span>
                <div>
                  <span className="text-sm font-semibold text-gray-900 block">{c.title}</span>
                  <p className="text-xs text-gray-500 mt-1" dangerouslySetInnerHTML={{ __html: c.desc }} />
                </div>
              </div>
            </button>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className={`mt-4 p-4 rounded-lg ${allChecked ? 'bg-green-100 border border-green-200' : 'bg-gray-50 border border-gray-100'}`}
        >
          {allChecked ? (
            <p className="text-sm text-green-800 font-medium">
              ✓ Los 3 criterios se cumplen. La empresa debe reconocer el pasivo y gasto por beneficios de terminaci&oacute;n.
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Faltan {3 - checklist.filter(Boolean).length} criterio(s). Sin los 3 criterios, no se puede reconocer el pasivo.
            </p>
          )}
        </motion.div>
      </div>

      <div className="my-6 rounded-xl border-2 p-5" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#004B87' }}>Asiento contable</span>
        <p className="text-xs text-gray-500 mt-1 mb-3">Reconocimiento de beneficios por terminaci&oacute;n</p>
        <div className="font-mono text-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-900">D&eacute;bito: Gasto por terminaci&oacute;n (P&amp;L)</span>
            <span className="font-medium text-gray-900">$XXX</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 pl-8">Cr&eacute;dito: Pasivo por beneficios de terminaci&oacute;n</span>
              <span className="font-medium text-gray-500">$XXX</span>
            </div>
          </div>
        </div>
      </div>

      <KeyConcept title="Consistencia con IAS 37">
        El enfoque de IAS 19 para beneficios por terminaci&oacute;n es consistente con IAS 37 (Provisiones). 
        Ambos requieren que el plan sea espec&iacute;fico y que la empresa est&eacute; comprometida antes de reconocer el pasivo.
      </KeyConcept>

      <QuizInline
        question="Una empresa anuncia que cerrar&aacute; una planta y ofrecer&aacute; liquidaciones a 100 empleados. &iquest;Cu&aacute;ndo reconoce el pasivo?"
        options={[
          'Inmediatamente al anunciar el cierre',
          'Cuando cada empleado acepta la liquidación',
          'Cuando comunica un plan que cumple los 3 criterios específicos',
          'Al final del año fiscal',
        ]}
        correctIndex={2}
        explanation="Para terminaciones por decisión de la empresa, el pasivo se reconoce cuando comunica un plan que: (1) indica improbabilidad de cambios, (2) identifica empleados afectados, y (3) detalla los beneficios."
      />

      <QuizInline
        question="Un empleado acepta una oferta de retiro voluntario anticipado el 15 de marzo. &iquest;Cu&aacute;ndo reconoce la empresa el pasivo?"
        options={[
          'Cuando ofreció el programa (1 de enero)',
          'Cuando el empleado aceptó (15 de marzo)',
          'Cuando el empleado deja de trabajar (30 de abril)',
          'Al pagar la liquidación (15 de mayo)',
        ]}
        correctIndex={1}
        explanation="Para separacion voluntaria, el pasivo se reconoce cuando el empleado acepta la oferta, porque es cuando la empresa ya no puede retirarla."
      />
    </>
  );
}

function Lesson51() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const conceptMap = [
    {
      id: 'categorias',
      title: '4 Categorías de Beneficios',
      color: '#004B87',
      items: [
        { name: 'Corto plazo', desc: 'Pagaderos dentro de 12 meses. Reconocimiento: gasto cuando se presta el servicio.' },
        { name: 'Post-empleo', desc: 'Después del empleo. DC: gasto = contribución. DB: método PUC, pasivo neto.' },
        { name: 'Otros largo plazo', desc: 'Durante el empleo, >12 meses. Igual que DB pero remediciones a P&L.' },
        { name: 'Terminación', desc: 'Por terminación anticipada. Pasivo cuando no puede retirar oferta.' },
      ],
    },
    {
      id: 'db-medicion',
      title: 'Medición de Planes DB',
      color: '#059669',
      items: [
        { name: '6 pasos', desc: '1) Atribuir beneficios 2) Descontar (PUC) 3) FV activos 4) Pasivo neto 5) P&L 6) OCI' },
        { name: 'PUC Method', desc: 'Cada año de servicio genera una unidad de beneficio, descontada individualmente.' },
        { name: 'Pasivo neto', desc: 'PV obligación − FV activos. Si negativo, limitado por asset ceiling.' },
        { name: 'Tasa descuento', desc: 'Bonos corporativos alta calidad (o gubernamentales si no hay mercado).' },
      ],
    },
    {
      id: 'db-registro',
      title: 'Registro Contable DB',
      color: '#D97706',
      items: [
        { name: 'P&L: Costo servicio', desc: 'Actual + pasado. Incremento en obligación por servicio del periodo.' },
        { name: 'P&L: Interés neto', desc: '(PV obl × tasa) − (FV activos × tasa). Efecto del paso del tiempo.' },
        { name: 'OCI: Remediciones', desc: 'G/L actuariales + retorno activos (neto de interés) + cambios asset ceiling.' },
        { name: 'Regla OCI', desc: 'Remediciones NUNCA se reclasifican a P&L. Pueden transferirse en patrimonio.' },
      ],
    },
    {
      id: 'transacciones',
      title: 'Transacciones del Plan',
      color: '#7C3AED',
      items: [
        { name: 'Contribuciones', desc: 'Débito: Activos plan / Crédito: Efectivo. No afecta obligación.' },
        { name: 'Beneficios pagados', desc: 'Débito: Obligación / Crédito: Activos plan. Neto sin cambio.' },
        { name: 'Contrib. empleados', desc: 'Depende: vinculadas/no, dependientes de años. 4 tratamientos posibles.' },
      ],
    },
    {
      id: 'terminacion',
      title: 'Beneficios por Terminación',
      color: '#DC2626',
      items: [
        { name: 'Definición', desc: 'Por decisión de empresa (antes de retiro) o aceptación de redundancia.' },
        { name: 'Reconocimiento', desc: 'Al primero de: no puede retirar oferta, o reconoce reestructuración IAS 37.' },
        { name: '3 criterios (empresa)', desc: 'Plan improbable de cambiar, identifica empleados, detalla beneficios.' },
      ],
    },
  ];

  return (
    <>
      <div className="mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Has completado los 4 niveles de contenido. Este mapa conceptual resume <strong>todo IAS 19</strong> en una 
          sola vista. &Uacute;salo como referencia r&aacute;pida antes de tu evaluaci&oacute;n final.
        </p>
      </div>

      <div className="my-8 p-6 rounded-2xl border-2" style={{ borderColor: '#004B87', backgroundColor: '#f8fbff' }}>
        <div className="text-center mb-6">
          <span className="text-2xl font-bold" style={{ color: '#004B87' }}>IAS 19</span>
          <p className="text-sm text-gray-500 mt-1">Beneficios a Empleados</p>
        </div>

        <div className="space-y-4">
          {conceptMap.map((section) => (
            <div key={section.id} className="rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: section.color }} />
                  <span className="font-semibold text-gray-900">{section.title}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${expanded === section.id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expanded === section.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-4 space-y-3">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex-shrink-0 w-1.5 rounded-full mt-1.5" style={{ backgroundColor: section.color, height: '1rem' }} />
                        <div>
                          <span className="text-sm font-medium text-gray-900">{item.name}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      <KeyConcept title="Listo para la evaluación">
        La evaluación final tiene <strong>20 preguntas</strong> que cubren todos los niveles. 
        Necesitas <strong>75% (15/20)</strong> para obtener tu certificado de completación.
      </KeyConcept>

      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-green-900 block">Repaso completado</span>
            <p className="text-xs text-green-700 mt-0.5">Continúa a la Evaluación Final cuando estés listo.</p>
          </div>
        </div>
      </div>
    </>
  );
}

const challengeNivel2Questions: ChallengeQuestion[] = [
  {
    topic: 'Enfoque de 6 pasos',
    question: '¿Cuál es el orden correcto de los primeros tres pasos para contabilizar un plan de beneficio definido?',
    options: [
      'Medir activos → Atribuir beneficios → Descontar beneficios',
      'Atribuir beneficios → Descontar beneficios → Determinar valor razonable de activos del plan',
      'Descontar beneficios → Atribuir beneficios → Calcular pasivo neto',
      'Calcular pasivo neto → Medir activos → Reconocer en P&L',
    ],
    correctIndex: 1,
    explanation: 'El orden correcto es: (1) Atribuir beneficios a periodos de servicio, (2) Descontar los beneficios con el PUC para obtener el PV de la obligación, (3) Determinar el valor razonable de los activos del plan.',
  },
  {
    topic: 'Atribución de beneficios',
    question: 'Un plan médico post-empleo reembolsa 0% si el empleado se va antes de 15 años y 100% después de 15 años. ¿Cómo se atribuye el beneficio para empleados que se espera cumplan 15+ años?',
    options: [
      'Todo el beneficio se atribuye al año 15',
      'En línea recta sobre los primeros 15 años (6.67% por año)',
      'Según la fórmula del plan: 0% hasta año 14 y 100% en año 15',
      'No se reconoce hasta que el empleado cumpla 15 años',
    ],
    correctIndex: 1,
    explanation: 'Cuando el beneficio "salta" materialmente en años posteriores, IAS 19 exige atribución en línea recta. El 100% se distribuye uniformemente sobre los 15 años de servicio que generan el derecho: 100% ÷ 15 = 6.67% por año.',
  },
  {
    topic: 'Projected Unit Credit',
    question: '¿Cuál es la característica principal del Método de la Unidad de Crédito Proyectada (PUC)?',
    options: [
      'Descuenta la obligación total al inicio del plan',
      'Trata cada periodo de servicio como generador de una unidad adicional de beneficio y las descuenta individualmente',
      'Calcula el costo del plan dividiendo el beneficio total entre los años de servicio esperados',
      'Mide solo el beneficio ganado hasta la fecha, sin proyecciones futuras',
    ],
    correctIndex: 1,
    explanation: 'El PUC mide cada unidad de servicio por separado, la descuenta a valor presente, y suma todas las unidades para construir la obligación total (PV of DBO). Esto permite reconocer el costo del servicio actual de forma precisa.',
  },
  {
    topic: 'Activos del plan',
    question: 'Los activos de un plan de beneficio definido se miden a:',
    options: [
      'Costo histórico',
      'Valor en libros según la contabilidad del fondo',
      'Valor razonable bajo IFRS 13',
      'Valor presente usando la misma tasa de descuento de la obligación',
    ],
    correctIndex: 2,
    explanation: 'IAS 19 requiere que los activos del plan se midan a valor razonable, aplicando los principios de IFRS 13 Fair Value Measurement. Para instrumentos cotizados, esto generalmente es el precio de mercado.',
  },
  {
    topic: 'Pasivo (activo) neto',
    question: 'Una empresa tiene PV de obligación de $3,200,000 y FV de activos de $3,900,000. Los beneficios económicos recuperables son $500,000. ¿Cuál es el activo neto de BD reconocido?',
    options: [
      '$700,000',
      '$500,000',
      '$3,900,000',
      '$200,000',
    ],
    correctIndex: 1,
    explanation: 'Superávit = $3.9M − $3.2M = $700,000. Pero el techo del activo (asset ceiling) limita el reconocimiento a los beneficios económicos recuperables: $500,000. Se reconoce un activo neto de $500,000.',
  },
  {
    topic: 'Reconocimiento en balance',
    question: 'La fórmula completa del pasivo (activo) neto de beneficio definido es:',
    options: [
      'FV de activos − PV de obligación',
      'PV de obligación − Contribuciones pagadas',
      'PV de obligación − FV de activos ± Efecto del techo del activo',
      'Costo del servicio actual + Interés neto − Contribuciones',
    ],
    correctIndex: 2,
    explanation: 'El pasivo (activo) neto = PV de la obligación − FV de activos del plan, ajustado por el efecto del techo del activo si aplica. Este es el monto que se reconoce en el estado de situación financiera.',
  },
];

function ChallengeNivel2({ onPass }: { onPass?: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(6).fill(null));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);

  const questions = challengeNivel2Questions;
  const question = questions[currentQ];
  const totalQuestions = questions.length;

  const handleConfirm = () => {
    if (selectedOption === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedOption;
    setAnswers(newAnswers);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      const correct = answers.filter((a, i) => a === questions[i].correctIndex).length + (selectedOption === questions[totalQuestions - 1].correctIndex ? 1 : 0);
      if (correct >= 5 && !hasPassed) {
        setHasPassed(true);
        onPass?.();
      }
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setAnswers(new Array(6).fill(null));
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
  };

  const correctCount = answers.reduce((acc, a, i) => acc + (a === questions[i].correctIndex ? 1 : 0), 0);
  const passed = correctCount >= 5;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  if (showResults) {
    return (
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className={`rounded-2xl p-8 sm:p-12 text-center ${passed ? 'bg-green-50 border-2 border-green-200' : 'bg-amber-50 border-2 border-amber-200'}`}>
            <div className="mb-6 flex justify-center">{passed ? <TrophySolid className="w-16 h-16 text-green-500" /> : <TrophyIcon className="w-16 h-16 text-amber-400" />}</div>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${passed ? 'text-green-900' : 'text-amber-900'}`}>
              {passed ? '¡Nivel 2 completado!' : 'Casi lo logras'}
            </h2>
            <p className={`text-lg mb-8 ${passed ? 'text-green-700' : 'text-amber-700'}`}>
              {passed
                ? 'Has demostrado dominio de la medición de planes DB.'
                : 'Necesitas 75% para aprobar. Repasa las lecciones e intenta de nuevo.'}
            </p>
            <div className="inline-flex items-center gap-6 bg-white rounded-xl px-8 py-5 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`}>{correctCount}/{totalQuestions}</div>
                <div className="text-xs text-gray-500 mt-1">Correctas</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`}>{percentage}%</div>
                <div className="text-xs text-gray-500 mt-1">Calificaci&oacute;n</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-500'}`}>{passed ? '✓' : '✗'}</div>
                <div className="text-xs text-gray-500 mt-1">{passed ? 'Aprobado' : 'No aprobado'}</div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Desglose por pregunta</h3>
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex;
              return (
                <div key={i} className={`rounded-lg border p-4 ${isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${isCorrect ? 'bg-green-500' : 'bg-red-400'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{q.topic}</span>
                      <p className="text-sm text-gray-800 mt-1">{q.question}</p>
                      {!isCorrect && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                          <span className="font-semibold">Tu respuesta:</span> {q.options[answers[i]!]} <br />
                          <span className="font-semibold text-green-700">Correcta:</span> {q.options[q.correctIndex]}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!passed && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#004B87' }}
              >
                Reintentar challenge
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            {passed && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">Nivel 3 estar&aacute; disponible pr&oacute;ximamente.</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-400">
                  <LockClosedIcon className="w-4 h-4" />
                  Nivel 3: Registro — Pr&oacute;ximamente
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">
            Pregunta {currentQ + 1} de {totalQuestions}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            {question.topic}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#004B87' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <p className="text-lg font-medium text-gray-900 leading-relaxed mb-8">{question.question}</p>

      <div className="space-y-3">
        {question.options.map((opt, i) => {
          let style = 'border-gray-100 hover:border-gray-200 hover:bg-gray-50';
          if (isAnswered) {
            if (i === question.correctIndex) style = 'border-green-200 bg-green-50';
            else if (i === selectedOption) style = 'border-red-200 bg-red-50';
            else style = 'border-gray-100 opacity-50';
          } else if (i === selectedOption) {
            style = 'border-[#004B87]/30 bg-blue-50/50';
          }

          return (
            <button
              key={i}
              onClick={() => !isAnswered && setSelectedOption(i)}
              className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  isAnswered && i === question.correctIndex ? 'border-green-500 bg-green-500 text-white' :
                  isAnswered && i === selectedOption ? 'border-red-400 bg-red-400 text-white' :
                  i === selectedOption ? 'border-[#004B87] text-[#004B87]' :
                  'border-gray-200 text-gray-400'
                }`}>
                  {isAnswered && i === question.correctIndex ? '✓' : String.fromCharCode(65 + i)}
                </span>
                <span className={
                  isAnswered && i === question.correctIndex ? 'text-green-900 font-medium' :
                  isAnswered && i === selectedOption && i !== question.correctIndex ? 'text-red-800' :
                  'text-gray-700'
                }>
                  {opt}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 px-5 py-4 rounded-xl text-sm leading-relaxed ${
            selectedOption === question.correctIndex
              ? 'bg-green-50 text-green-800 border border-green-100'
              : 'bg-amber-50 text-amber-800 border border-amber-100'
          }`}
        >
          <span className="font-semibold">{selectedOption === question.correctIndex ? 'Correcto. ' : 'Incorrecto. '}</span>
          {question.explanation}
        </motion.div>
      )}

      <div className="mt-8 flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-30"
            style={{ backgroundColor: '#004B87' }}
          >
            Confirmar respuesta
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#004B87' }}
          >
            {currentQ < totalQuestions - 1 ? 'Siguiente pregunta' : 'Ver resultados'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}

const challengeNivel3Questions: ChallengeQuestion[] = [
  {
    topic: 'Contribuciones al plan',
    question: 'Una empresa deposita $150,000 en el fondo de pensiones de beneficio definido. ¿Cuál es el asiento contable correcto?',
    options: [
      'Débito: Gasto de BD $150,000 / Crédito: Efectivo $150,000',
      'Débito: Activos del plan $150,000 / Crédito: Efectivo $150,000',
      'Débito: Obligación de BD $150,000 / Crédito: Efectivo $150,000',
      'Débito: OCI $150,000 / Crédito: Efectivo $150,000',
    ],
    correctIndex: 1,
    explanation: 'Las contribuciones al fondo incrementan los activos del plan y reducen el efectivo. No afectan directamente la obligación ni el gasto en P&L.',
  },
  {
    topic: 'Costo del servicio actual',
    question: 'El costo del servicio actual de un plan DB se reconoce en:',
    options: [
      'Otro resultado integral (OCI)',
      'Directamente en el patrimonio',
      'Resultados del periodo (P&L)',
      'Como reducción de los activos del plan',
    ],
    correctIndex: 2,
    explanation: 'El costo del servicio actual siempre va a P&L como parte del gasto de beneficio definido. Junto con el interés neto, forma el componente reconocido en resultados.',
  },
  {
    topic: 'Costo del servicio pasado',
    question: 'Una empresa mejora los beneficios de su plan, incrementando la obligación en $300,000. ¿Cuándo se reconoce este costo del servicio pasado?',
    options: [
      'Se amortiza en la vida laboral restante de los empleados',
      'Se reconoce inmediatamente como gasto en P&L',
      'Se reconoce en OCI al cierre del periodo',
      'Se difiere hasta que los empleados se jubilen',
    ],
    correctIndex: 1,
    explanation: 'IAS 19 requiere que el costo del servicio pasado (por enmienda o curtailment) se reconozca inmediatamente como gasto en P&L. No se permite diferirlo ni amortizarlo.',
  },
  {
    topic: 'Interés neto',
    question: 'PV obligación inicio: $3,000,000. FV activos inicio: $2,400,000. Tasa: 6%. ¿Cuál es el interés neto reconocido en P&L?',
    options: [
      '$180,000 (gasto)',
      '$36,000 (gasto)',
      '$144,000 (ingreso)',
      '$36,000 (ingreso)',
    ],
    correctIndex: 1,
    explanation: 'Interés sobre obligación: $3M × 6% = $180,000. Interés sobre activos: $2.4M × 6% = $144,000. Interés neto = $180,000 − $144,000 = $36,000 (gasto neto en P&L).',
  },
  {
    topic: 'Retorno de activos',
    question: 'FV activos inicio: $1,500,000. Tasa descuento: 5%. Retorno real: $90,000. ¿Cuánto se reconoce en OCI como remedición?',
    options: [
      '$90,000 (ganancia en OCI)',
      '$75,000 (parte que va a P&L)',
      '$15,000 (ganancia en OCI)',
      '($15,000) — pérdida en OCI',
    ],
    correctIndex: 2,
    explanation: 'Interés esperado en P&L: $1.5M × 5% = $75,000. Retorno real: $90,000. Diferencia: $90,000 − $75,000 = $15,000. El retorno superó la expectativa → ganancia en OCI.',
  },
  {
    topic: 'Remediciones en OCI',
    question: '¿Qué tratamiento tienen las remediciones del pasivo neto de BD reconocidas en OCI en periodos posteriores?',
    options: [
      'Se reclasifican a P&L cuando el plan se liquida',
      'Se amortizan a P&L sobre la vida laboral promedio',
      'Nunca se reclasifican a P&L, pero pueden transferirse dentro del patrimonio',
      'Se revierten automáticamente en el periodo siguiente',
    ],
    correctIndex: 2,
    explanation: 'IAS 19 prohíbe la reclasificación (recycling) de remediciones a P&L. Permanecen en OCI acumulado y pueden transferirse dentro del patrimonio (ej. a utilidades retenidas).',
  },
  {
    topic: 'Contribuciones de empleados',
    question: 'Un plan DB requiere que los empleados contribuyan un monto que aumenta $100 por cada año de servicio. ¿Cómo se contabiliza?',
    options: [
      'Reducción del costo del servicio en el periodo',
      'Se atribuye usando la fórmula del plan o línea recta',
      'Afecta las remediciones en OCI',
      'Se reconoce al momento del pago como discrecional',
    ],
    correctIndex: 1,
    explanation: 'Las contribuciones vinculadas al servicio y dependientes del número de años se atribuyen a los periodos de servicio usando el método de atribución (fórmula del plan o línea recta).',
  },
  {
    topic: 'Tabla de movimientos',
    question: 'En la tabla de movimientos de la obligación DB, la ganancia/pérdida actuarial se calcula como:',
    options: [
      'PV obligación final − PV obligación inicio',
      'PV obligación final − (inicio + interés + CSC − beneficios pagados)',
      'Retorno real de activos − interés esperado',
      'Interés neto − costo del servicio actual',
    ],
    correctIndex: 1,
    explanation: 'La ganancia/pérdida actuarial sobre la obligación es la cifra de cuadre: PV final − (PV inicio + interés sobre obligación + CSC − beneficios pagados). Es la diferencia entre el saldo final real y el esperado.',
  },
];

function ChallengeNivel3({ onPass }: { onPass?: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(8).fill(null));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);

  const questions = challengeNivel3Questions;
  const question = questions[currentQ];
  const totalQuestions = questions.length;

  const handleConfirm = () => {
    if (selectedOption === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedOption;
    setAnswers(newAnswers);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      const correct = answers.filter((a, i) => a === questions[i].correctIndex).length + (selectedOption === questions[totalQuestions - 1].correctIndex ? 1 : 0);
      if (correct >= 6 && !hasPassed) {
        setHasPassed(true);
        onPass?.();
      }
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setAnswers(new Array(8).fill(null));
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
  };

  const correctCount = answers.reduce((acc, a, i) => acc + (a === questions[i].correctIndex ? 1 : 0), 0);
  const passed = correctCount >= 6;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  if (showResults) {
    return (
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className={`rounded-2xl p-8 sm:p-12 text-center ${passed ? 'bg-green-50 border-2 border-green-200' : 'bg-amber-50 border-2 border-amber-200'}`}>
            <div className="mb-6 flex justify-center">{passed ? <TrophySolid className="w-16 h-16 text-green-500" /> : <TrophyIcon className="w-16 h-16 text-amber-400" />}</div>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${passed ? 'text-green-900' : 'text-amber-900'}`}>
              {passed ? '¡Nivel 3 completado!' : 'Casi lo logras'}
            </h2>
            <p className={`text-lg mb-8 ${passed ? 'text-green-700' : 'text-amber-700'}`}>
              {passed
                ? 'Has demostrado dominio del registro contable de planes DB.'
                : 'Necesitas 75% para aprobar. Repasa las lecciones e intenta de nuevo.'}
            </p>
            <div className="inline-flex items-center gap-6 bg-white rounded-xl px-8 py-5 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`}>{correctCount}/{totalQuestions}</div>
                <div className="text-xs text-gray-500 mt-1">Correctas</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`}>{percentage}%</div>
                <div className="text-xs text-gray-500 mt-1">Calificaci&oacute;n</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-500'}`}>{passed ? '✓' : '✗'}</div>
                <div className="text-xs text-gray-500 mt-1">{passed ? 'Aprobado' : 'No aprobado'}</div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Desglose por pregunta</h3>
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex;
              return (
                <div key={i} className={`rounded-lg border p-4 ${isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${isCorrect ? 'bg-green-500' : 'bg-red-400'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{q.topic}</span>
                      <p className="text-sm text-gray-800 mt-1">{q.question}</p>
                      {!isCorrect && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                          <span className="font-semibold">Tu respuesta:</span> {q.options[answers[i]!]} <br />
                          <span className="font-semibold text-green-700">Correcta:</span> {q.options[q.correctIndex]}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!passed && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#004B87' }}
              >
                Reintentar challenge
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            {passed && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">Nivel 4 estar&aacute; disponible pr&oacute;ximamente.</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-400">
                  <LockClosedIcon className="w-4 h-4" />
                  Nivel 4: Casos Complejos — Pr&oacute;ximamente
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">
            Pregunta {currentQ + 1} de {totalQuestions}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            {question.topic}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#004B87' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <p className="text-lg font-medium text-gray-900 leading-relaxed mb-8">{question.question}</p>

      <div className="space-y-3">
        {question.options.map((opt, i) => {
          let style = 'border-gray-100 hover:border-gray-200 hover:bg-gray-50';
          if (isAnswered) {
            if (i === question.correctIndex) style = 'border-green-200 bg-green-50';
            else if (i === selectedOption) style = 'border-red-200 bg-red-50';
            else style = 'border-gray-100 opacity-50';
          } else if (i === selectedOption) {
            style = 'border-[#004B87]/30 bg-blue-50/50';
          }

          return (
            <button
              key={i}
              onClick={() => !isAnswered && setSelectedOption(i)}
              className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  isAnswered && i === question.correctIndex ? 'border-green-500 bg-green-500 text-white' :
                  isAnswered && i === selectedOption ? 'border-red-400 bg-red-400 text-white' :
                  i === selectedOption ? 'border-[#004B87] text-[#004B87]' :
                  'border-gray-200 text-gray-400'
                }`}>
                  {isAnswered && i === question.correctIndex ? '✓' : String.fromCharCode(65 + i)}
                </span>
                <span className={
                  isAnswered && i === question.correctIndex ? 'text-green-900 font-medium' :
                  isAnswered && i === selectedOption && i !== question.correctIndex ? 'text-red-800' :
                  'text-gray-700'
                }>
                  {opt}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 px-5 py-4 rounded-xl text-sm leading-relaxed ${
            selectedOption === question.correctIndex
              ? 'bg-green-50 text-green-800 border border-green-100'
              : 'bg-amber-50 text-amber-800 border border-amber-100'
          }`}
        >
          <span className="font-semibold">{selectedOption === question.correctIndex ? 'Correcto. ' : 'Incorrecto. '}</span>
          {question.explanation}
        </motion.div>
      )}

      <div className="mt-8 flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-30"
            style={{ backgroundColor: '#004B87' }}
          >
            Confirmar respuesta
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#004B87' }}
          >
            {currentQ < totalQuestions - 1 ? 'Siguiente pregunta' : 'Ver resultados'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}

type ChallengeQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
};

const challengeNivel1Questions: ChallengeQuestion[] = [
  {
    topic: 'Alcance de IAS 19',
    question: 'Una empresa otorga opciones sobre acciones a sus ejecutivos como parte de su paquete de compensación. ¿Bajo qué norma se contabiliza este beneficio?',
    options: [
      'IAS 19 — Employee Benefits',
      'IFRS 2 — Share-based Payment',
      'IAS 1 — Presentation of Financial Statements',
      'IAS 19 si es post-empleo, IFRS 2 si es durante el empleo',
    ],
    correctIndex: 1,
    explanation: 'IAS 19 excluye explícitamente de su alcance los pagos basados en acciones, que se contabilizan bajo IFRS 2. Esto aplica independientemente de si el pago se liquida en acciones o en efectivo referenciado a acciones.',
  },
  {
    topic: 'Clasificación de beneficios',
    question: 'Un empleado tiene derecho a 15 días de vacaciones al año. Al cierre del periodo ha tomado solo 10 días, y la política permite acumular los días no utilizados para el siguiente periodo. ¿Cómo se clasifican los 5 días restantes?',
    options: [
      'Beneficio post-empleo porque se pagarán después',
      'Beneficio a corto plazo — ausencia compensada acumulable',
      'Otro beneficio a largo plazo por exceder los 12 meses',
      'Beneficio por terminación',
    ],
    correctIndex: 1,
    explanation: 'Las vacaciones pagadas acumulables son un beneficio a corto plazo. La clave es que el derecho se acumula: si no se usa, se arrastra o se paga. La empresa reconoce un pasivo al cierre por los días no utilizados.',
  },
  {
    topic: 'Reconocimiento de ausencias',
    question: 'Una empresa concede 5 días de licencia por paternidad. Si el empleado no tiene hijos en el periodo, no puede transferir ni cobrar esos días. ¿Cuándo reconoce la empresa el gasto?',
    options: [
      'Al inicio del periodo, cuando el derecho se otorga',
      'Al cierre del periodo, como pasivo acumulado por los 5 días',
      'Cuando el empleado efectivamente toma la licencia',
      'Proporcionalmente durante los 12 meses del periodo',
    ],
    correctIndex: 2,
    explanation: 'Esta es una ausencia compensada NO acumulable: el derecho no se transfiere ni se paga si no se usa. Por tanto, el gasto se reconoce cuando la ausencia ocurre, no antes.',
  },
  {
    topic: 'Planes DC vs DB',
    question: 'Una empresa aporta el 6% del salario de cada empleado a un fondo de pensiones administrado por un tercero. Si los rendimientos del fondo son insuficientes para cubrir las pensiones futuras, la empresa NO tiene obligación adicional. ¿Qué tipo de plan es?',
    options: [
      'Plan de beneficio definido, porque el beneficio futuro está comprometido',
      'Plan de contribución definida, porque la obligación se limita a las aportaciones',
      'Plan multi-empleador, porque lo administra un tercero',
      'Plan asegurado, porque el riesgo se transfiere',
    ],
    correctIndex: 1,
    explanation: 'Es un plan DC porque la obligación de la empresa se limita al monto que acuerda contribuir. El riesgo actuarial (que los activos sean insuficientes) y el riesgo de inversión recaen en el empleado.',
  },
  {
    topic: 'Distribución del riesgo',
    question: '¿En cuál de los siguientes escenarios el riesgo actuarial recae sobre la entidad (empresa)?',
    options: [
      'La empresa aporta $500 mensuales por empleado a una AFORE',
      'La empresa promete pagar una pensión del 60% del último salario',
      'La empresa contrata un seguro colectivo de vida sin obligación residual',
      'La empresa aporta el 2% del salario a un fondo individual por empleado',
    ],
    correctIndex: 1,
    explanation: 'Prometer una pensión basada en el salario final es un plan de beneficio definido. El riesgo actuarial (longevidad, incrementos salariales) y el riesgo de inversión recaen en la empresa, que debe cubrir cualquier déficit.',
  },
  {
    topic: 'Planes multi-empleador y estatales',
    question: 'Las contribuciones al IMSS en México (cuota patronal) se contabilizan generalmente como:',
    options: [
      'Plan de beneficio definido, porque el IMSS promete beneficios específicos',
      'Plan de contribución definida, porque la empresa no tiene obligación más allá de la cuota',
      'Beneficio a corto plazo, porque se paga mensualmente',
      'No se contabiliza bajo IAS 19 porque es obligación gubernamental',
    ],
    correctIndex: 1,
    explanation: 'Los planes estatales (como IMSS) se contabilizan igual que los multi-empleador. Dado que la empresa no tiene obligación legal ni implícita de cubrir déficits del IMSS, se tratan como planes DC: el gasto es la contribución debida en el periodo.',
  },
  {
    topic: 'Contabilización DC — cálculo',
    question: 'Una empresa tiene un plan DC con tasa del 5% sobre nómina de $1,200,000. Durante el periodo pagó $55,000 al fondo. ¿Cuál es el gasto en resultados y la posición en el balance?',
    options: [
      'Gasto $55,000; sin saldo en balance',
      'Gasto $60,000; pasivo acumulado de $5,000',
      'Gasto $60,000; activo prepagado de $5,000',
      'Gasto $55,000; pasivo acumulado de $5,000',
    ],
    correctIndex: 1,
    explanation: 'Contribución debida: $1,200,000 × 5% = $60,000. El gasto siempre es lo debido ($60,000), no lo pagado. Como pagó $55,000 (menos que lo debido), queda un pasivo acumulado de $5,000 ($60,000 − $55,000).',
  },
  {
    topic: 'Principio fundamental IAS 19',
    question: '¿Cuál es el principio fundamental que subyace toda la norma IAS 19?',
    options: [
      'Los beneficios deben registrarse cuando se pagan al empleado',
      'El costo debe reconocerse en el periodo donde el empleado presta el servicio',
      'Solo los beneficios contractuales generan obligación contable',
      'Los beneficios post-empleo se reconocen al momento de la jubilación',
    ],
    correctIndex: 1,
    explanation: 'El principio fundamental de IAS 19 es el principio de devengo: el costo del beneficio se reconoce en el periodo donde el empleado presta el servicio que genera el derecho, no cuando se paga. Este principio aplica a todas las categorías de beneficios.',
  },
];

function ChallengeNivel1({ onPass }: { onPass?: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(8).fill(null));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);

  const questions = challengeNivel1Questions;
  const question = questions[currentQ];
  const totalQuestions = questions.length;

  const handleConfirm = () => {
    if (selectedOption === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedOption;
    setAnswers(newAnswers);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      const correct = answers.filter((a, i) => a === questions[i].correctIndex).length + (selectedOption === questions[totalQuestions - 1].correctIndex ? 1 : 0);
      if (correct >= 6 && !hasPassed) {
        setHasPassed(true);
        onPass?.();
      }
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setAnswers(new Array(8).fill(null));
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
  };

  const correctCount = answers.reduce((acc, a, i) => acc + (a === questions[i].correctIndex ? 1 : 0), 0);
  const passed = correctCount >= 6;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  if (showResults) {
    return (
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className={`rounded-2xl p-8 sm:p-12 text-center ${passed ? 'bg-green-50 border-2 border-green-200' : 'bg-amber-50 border-2 border-amber-200'}`}>
            <div className="mb-6 flex justify-center">{passed ? <TrophySolid className="w-16 h-16 text-green-500" /> : <TrophyIcon className="w-16 h-16 text-amber-400" />}</div>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${passed ? 'text-green-900' : 'text-amber-900'}`}>
              {passed ? '¡Nivel 1 completado!' : 'Casi lo logras'}
            </h2>
            <p className={`text-lg mb-8 ${passed ? 'text-green-700' : 'text-amber-700'}`}>
              {passed
                ? 'Has demostrado dominio de los fundamentos de IAS 19.'
                : 'Necesitas 75% para aprobar. Repasa las lecciones e intenta de nuevo.'}
            </p>

            <div className="inline-flex items-center gap-6 bg-white rounded-xl px-8 py-5 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`}>{correctCount}/{totalQuestions}</div>
                <div className="text-xs text-gray-500 mt-1">Correctas</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`}>{percentage}%</div>
                <div className="text-xs text-gray-500 mt-1">Calificaci&oacute;n</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-500'}`}>{passed ? '✓' : '✗'}</div>
                <div className="text-xs text-gray-500 mt-1">{passed ? 'Aprobado' : 'No aprobado'}</div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Desglose por pregunta</h3>
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex;
              return (
                <div key={i} className={`rounded-lg border p-4 ${isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${isCorrect ? 'bg-green-500' : 'bg-red-400'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{q.topic}</span>
                      <p className="text-sm text-gray-800 mt-1">{q.question}</p>
                      {!isCorrect && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                          <span className="font-semibold">Tu respuesta:</span> {q.options[answers[i]!]} <br />
                          <span className="font-semibold text-green-700">Correcta:</span> {q.options[q.correctIndex]}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!passed && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#004B87' }}
              >
                Reintentar challenge
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            {passed && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">Nivel 2 estar&aacute; disponible pr&oacute;ximamente.</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-400">
                  <LockClosedIcon className="w-4 h-4" />
                  Nivel 2: Medici&oacute;n — Pr&oacute;ximamente
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">
            Pregunta {currentQ + 1} de {totalQuestions}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            {question.topic}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#004B87' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <p className="text-lg font-medium text-gray-900 leading-relaxed mb-8">{question.question}</p>

      <div className="space-y-3">
        {question.options.map((opt, i) => {
          let style = 'border-gray-100 hover:border-gray-200 hover:bg-gray-50';
          if (isAnswered) {
            if (i === question.correctIndex) style = 'border-green-200 bg-green-50';
            else if (i === selectedOption) style = 'border-red-200 bg-red-50';
            else style = 'border-gray-100 opacity-50';
          } else if (i === selectedOption) {
            style = 'border-[#004B87]/30 bg-blue-50/50';
          }

          return (
            <button
              key={i}
              onClick={() => !isAnswered && setSelectedOption(i)}
              className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  isAnswered && i === question.correctIndex ? 'border-green-500 bg-green-500 text-white' :
                  isAnswered && i === selectedOption ? 'border-red-400 bg-red-400 text-white' :
                  i === selectedOption ? 'border-[#004B87] text-[#004B87]' :
                  'border-gray-200 text-gray-400'
                }`}>
                  {isAnswered && i === question.correctIndex ? '✓' : String.fromCharCode(65 + i)}
                </span>
                <span className={
                  isAnswered && i === question.correctIndex ? 'text-green-900 font-medium' :
                  isAnswered && i === selectedOption && i !== question.correctIndex ? 'text-red-800' :
                  'text-gray-700'
                }>
                  {opt}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 px-5 py-4 rounded-xl text-sm leading-relaxed ${
            selectedOption === question.correctIndex
              ? 'bg-green-50 text-green-800 border border-green-100'
              : 'bg-amber-50 text-amber-800 border border-amber-100'
          }`}
        >
          <span className="font-semibold">{selectedOption === question.correctIndex ? 'Correcto. ' : 'Incorrecto. '}</span>
          {question.explanation}
        </motion.div>
      )}

      <div className="mt-8 flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-30"
            style={{ backgroundColor: '#004B87' }}
          >
            Confirmar respuesta
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#004B87' }}
          >
            {currentQ < totalQuestions - 1 ? 'Siguiente pregunta' : 'Ver resultados'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}

const challengeNivel4Questions: ChallengeQuestion[] = [
  {
    topic: 'Otros beneficios LP vs DB post-empleo',
    question: '¿Cuál es la diferencia principal entre otros beneficios a largo plazo y planes DB post-empleo?',
    options: [
      'Los otros beneficios LP no generan pasivo',
      'Las remediciones de otros beneficios LP van a P&L, no a OCI',
      'Los otros beneficios LP no requieren actuario',
      'El costo del servicio de otros beneficios LP se difiere',
    ],
    correctIndex: 1,
    explanation: 'La diferencia clave es que las remediciones de otros beneficios a largo plazo se reconocen en P&L inmediatamente, mientras que en planes DB post-empleo van a OCI.',
  },
  {
    topic: 'Ejemplos de otros beneficios LP',
    question: '¿Cuál de los siguientes es un ejemplo de otro beneficio a largo plazo?',
    options: [
      'Pensión mensual al jubilarse',
      'Aguinaldo anual',
      'Bono por 15 años de antigüedad',
      'Seguro médico para jubilados',
    ],
    correctIndex: 2,
    explanation: 'Los bonos por antigüedad son otros beneficios a largo plazo: se pagan durante el empleo (no post-empleo), pero más de 12 meses después de prestar el servicio.',
  },
  {
    topic: 'Costo servicio pasado - otros LP',
    question: 'Una empresa mejora su bono por 10 años de servicio de $1,000 a $2,500. ¿Cómo se reconoce el costo del servicio pasado?',
    options: [
      'Se amortiza en los próximos 10 años',
      'Se reconoce inmediatamente en P&L',
      'Se reconoce en OCI',
      'Se difiere hasta que los empleados cumplan 10 años',
    ],
    correctIndex: 1,
    explanation: 'Todo el costo del servicio pasado de otros beneficios a largo plazo se reconoce inmediatamente en P&L. No hay diferimiento ni amortización.',
  },
  {
    topic: 'Definición terminación',
    question: 'Los beneficios por terminación son pagaderos como resultado de:',
    options: [
      'El servicio prestado por el empleado durante el año',
      'La jubilación normal del empleado',
      'La decisión de terminar el empleo antes de la fecha normal de retiro',
      'El cumplimiento de años de antigüedad',
    ],
    correctIndex: 2,
    explanation: 'Los beneficios por terminación surgen de la decisión de la empresa de terminar el empleo antes del retiro normal, o de la aceptación del empleado de separacion voluntaria.',
  },
  {
    topic: 'Forma vs razón',
    question: 'Un empleado recibe mejora de pensión como incentivo para aceptar retiro anticipado. ¿Cómo se clasifica?',
    options: [
      'Beneficio post-empleo (porque es pensión)',
      'Beneficio por terminación (porque incentiva la salida anticipada)',
      'Otro beneficio a largo plazo',
      'Beneficio a corto plazo',
    ],
    correctIndex: 1,
    explanation: 'La forma del beneficio (mejora de pensión) no determina la clasificación. Lo que importa es la razón: incentivar la terminación anticipada.',
  },
  {
    topic: 'Reconocimiento terminación',
    question: 'Para beneficios por terminación, ¿cuándo reconoce la empresa el pasivo?',
    options: [
      'Al final del año fiscal',
      'Al primero de: cuando ya no puede retirar la oferta, o cuando reconoce costos de reestructuración',
      'Cuando paga la liquidación',
      'Cuando el empleado deja de trabajar',
    ],
    correctIndex: 1,
    explanation: 'El pasivo se reconoce al primero de: (a) cuando la empresa ya no puede retirar la oferta, o (b) cuando reconoce costos de reestructuración bajo IAS 37.',
  },
];

function ChallengeNivel4({ onPass }: { onPass?: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(6).fill(null));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);

  const questions = challengeNivel4Questions;
  const question = questions[currentQ];
  const totalQuestions = questions.length;

  const handleConfirm = () => {
    if (selectedOption === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedOption;
    setAnswers(newAnswers);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      const correct = answers.filter((a, i) => a === questions[i].correctIndex).length + (selectedOption === questions[totalQuestions - 1].correctIndex ? 1 : 0);
      if (correct >= 5 && !hasPassed) {
        setHasPassed(true);
        onPass?.();
      }
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setAnswers(new Array(6).fill(null));
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
  };

  const correctCount = answers.reduce((acc, a, i) => acc + (a === questions[i].correctIndex ? 1 : 0), 0);
  const passed = correctCount >= 5;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  if (showResults) {
    return (
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className={`rounded-2xl p-8 sm:p-12 text-center ${passed ? 'bg-green-50 border-2 border-green-200' : 'bg-amber-50 border-2 border-amber-200'}`}>
            <div className="mb-6 flex justify-center">{passed ? <TrophySolid className="w-16 h-16 text-green-500" /> : <TrophyIcon className="w-16 h-16 text-amber-400" />}</div>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${passed ? 'text-green-900' : 'text-amber-900'}`}>
              {passed ? '¡Nivel 4 completado!' : 'Casi lo logras'}
            </h2>
            <p className={`text-lg mb-8 ${passed ? 'text-green-700' : 'text-amber-700'}`}>
              {passed
                ? 'Dominas otros beneficios LP y beneficios por terminación.'
                : 'Necesitas 75% para aprobar. Repasa las lecciones e intenta de nuevo.'}
            </p>
            <div className="inline-flex items-center gap-6 bg-white rounded-xl px-8 py-5 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`}>{correctCount}/{totalQuestions}</div>
                <div className="text-xs text-gray-500 mt-1">Correctas</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`}>{percentage}%</div>
                <div className="text-xs text-gray-500 mt-1">Calificaci&oacute;n</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-500'}`}>{passed ? '✓' : '✗'}</div>
                <div className="text-xs text-gray-500 mt-1">{passed ? 'Aprobado' : 'No aprobado'}</div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Desglose por pregunta</h3>
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex;
              return (
                <div key={i} className={`rounded-lg border p-4 ${isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${isCorrect ? 'bg-green-500' : 'bg-red-400'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{q.topic}</span>
                      <p className="text-sm text-gray-800 mt-1">{q.question}</p>
                      {!isCorrect && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                          <span className="font-semibold">Tu respuesta:</span> {q.options[answers[i]!]} <br />
                          <span className="font-semibold text-green-700">Correcta:</span> {q.options[q.correctIndex]}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!passed && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#004B87' }}
              >
                Reintentar challenge
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            {passed && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">Nivel 5 estar&aacute; disponible pr&oacute;ximamente.</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-400">
                  <LockClosedIcon className="w-4 h-4" />
                  Nivel 5: Maestr&iacute;a — Pr&oacute;ximamente
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">
            Pregunta {currentQ + 1} de {totalQuestions}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            {question.topic}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#004B87' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <p className="text-lg font-medium text-gray-900 leading-relaxed mb-8">{question.question}</p>

      <div className="space-y-3">
        {question.options.map((opt, i) => {
          let style = 'border-gray-100 hover:border-gray-200 hover:bg-gray-50';
          if (isAnswered) {
            if (i === question.correctIndex) style = 'border-green-200 bg-green-50';
            else if (i === selectedOption) style = 'border-red-200 bg-red-50';
            else style = 'border-gray-100 opacity-50';
          } else if (i === selectedOption) {
            style = 'border-[#004B87]/30 bg-blue-50/50';
          }

          return (
            <button
              key={i}
              onClick={() => !isAnswered && setSelectedOption(i)}
              className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  isAnswered && i === question.correctIndex ? 'border-green-500 bg-green-500 text-white' :
                  isAnswered && i === selectedOption ? 'border-red-400 bg-red-400 text-white' :
                  i === selectedOption ? 'border-[#004B87] text-[#004B87]' :
                  'border-gray-200 text-gray-400'
                }`}>
                  {isAnswered && i === question.correctIndex ? '✓' : String.fromCharCode(65 + i)}
                </span>
                <span className={
                  isAnswered && i === question.correctIndex ? 'text-green-900 font-medium' :
                  isAnswered && i === selectedOption && i !== question.correctIndex ? 'text-red-800' :
                  'text-gray-700'
                }>
                  {opt}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 px-5 py-4 rounded-xl text-sm leading-relaxed ${
            selectedOption === question.correctIndex
              ? 'bg-green-50 text-green-800 border border-green-100'
              : 'bg-amber-50 text-amber-800 border border-amber-100'
          }`}
        >
          <span className="font-semibold">{selectedOption === question.correctIndex ? 'Correcto. ' : 'Incorrecto. '}</span>
          {question.explanation}
        </motion.div>
      )}

      <div className="mt-8 flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-30"
            style={{ backgroundColor: '#004B87' }}
          >
            Confirmar respuesta
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#004B87' }}
          >
            {currentQ < totalQuestions - 1 ? 'Siguiente pregunta' : 'Ver resultados'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}

const evaluacionFinalQuestions: ChallengeQuestion[] = [
  { topic: 'Nivel 1', question: 'IAS 19 cubre todos los beneficios a empleados EXCEPTO:', options: ['Pensiones de beneficio definido', 'Vacaciones y aguinaldo', 'Pagos basados en acciones (IFRS 2)', 'Beneficios por terminación'], correctIndex: 2, explanation: 'Los pagos basados en acciones se contabilizan bajo IFRS 2, no IAS 19.' },
  { topic: 'Nivel 1', question: '¿Cuál es la característica principal de un plan de contribución definida?', options: ['La empresa garantiza un monto de pensión', 'El riesgo actuarial lo asume el empleado', 'Las contribuciones se reconocen en OCI', 'Se requiere cálculo actuarial anual'], correctIndex: 1, explanation: 'En DC, la empresa solo se compromete a contribuir; el empleado asume el riesgo de inversión y longevidad.' },
  { topic: 'Nivel 1', question: 'Los beneficios a corto plazo se reconocen:', options: ['Cuando el empleado se jubila', 'Como gasto cuando el empleado presta el servicio', 'Solo al final del año fiscal', 'Cuando se pagan en efectivo'], correctIndex: 1, explanation: 'Los beneficios a corto plazo se reconocen como gasto en el periodo en que el empleado presta el servicio.' },
  { topic: 'Nivel 1', question: 'Un plan donde la empresa paga 5% del salario a un fondo y no garantiza el monto final de pensión es:', options: ['Beneficio definido', 'Contribución definida', 'Otro beneficio a largo plazo', 'Beneficio por terminación'], correctIndex: 1, explanation: 'Si la empresa solo se compromete a contribuir un monto fijo sin garantizar el beneficio final, es DC.' },
  { topic: 'Nivel 2', question: 'El método PUC (Projected Unit Credit) se usa para:', options: ['Calcular contribuciones a planes DC', 'Medir la obligación de beneficio definido', 'Determinar el retorno de activos del plan', 'Calcular beneficios a corto plazo'], correctIndex: 1, explanation: 'El PUC es el método actuarial requerido por IAS 19 para medir la obligación de planes DB.' },
  { topic: 'Nivel 2', question: 'La tasa de descuento para obligaciones DB se basa en:', options: ['Tasa de inflación esperada', 'Retorno esperado de los activos del plan', 'Bonos corporativos de alta calidad (o gubernamentales)', 'Tasa libre de riesgo del banco central'], correctIndex: 2, explanation: 'IAS 19 requiere usar rendimientos de bonos corporativos de alta calidad, o gubernamentales si no hay mercado profundo.' },
  { topic: 'Nivel 2', question: 'El pasivo neto de beneficio definido es:', options: ['PV obligación + FV activos del plan', 'PV obligación − FV activos del plan', 'Solo el PV de la obligación', 'FV activos − contribuciones pagadas'], correctIndex: 1, explanation: 'El pasivo neto = PV de la obligación menos el valor razonable de los activos del plan.' },
  { topic: 'Nivel 2', question: 'Si un plan tiene beneficios que "saltan" en años posteriores, la atribución debe ser:', options: ['Según la fórmula exacta del plan', 'En línea recta sobre los años de servicio', 'Todo al año del salto', 'No se requiere atribución'], correctIndex: 1, explanation: 'Cuando el beneficio salta materialmente, IAS 19 requiere atribución en línea recta para evitar back-loading.' },
  { topic: 'Nivel 3', question: 'Las contribuciones pagadas al plan de pensiones:', options: ['Reducen la obligación de BD', 'Aumentan los activos del plan', 'Se reconocen como gasto en P&L', 'Afectan el OCI'], correctIndex: 1, explanation: 'Las contribuciones incrementan los activos del plan (Débito: Activos plan / Crédito: Efectivo).' },
  { topic: 'Nivel 3', question: 'El interés neto se calcula como:', options: ['FV activos × tasa de descuento', 'Pasivo neto inicio × tasa de descuento', 'PV obligación × retorno real', 'Contribuciones × tasa de inflación'], correctIndex: 1, explanation: 'Interés neto = (PV obligación − FV activos) al inicio × tasa de descuento.' },
  { topic: 'Nivel 3', question: 'PV obligación: $5M, FV activos: $4M, tasa: 6%. ¿Cuál es el interés neto?', options: ['$300,000 gasto', '$240,000 gasto', '$60,000 gasto', '$60,000 ingreso'], correctIndex: 2, explanation: 'Interés sobre obligación: $5M×6%=$300K. Sobre activos: $4M×6%=$240K. Neto: $300K−$240K=$60K gasto.' },
  { topic: 'Nivel 3', question: 'El costo del servicio pasado por enmienda del plan se reconoce:', options: ['Amortizado en la vida laboral restante', 'Inmediatamente en P&L', 'En OCI y luego reclasificado', 'Cuando los empleados se jubilan'], correctIndex: 1, explanation: 'IAS 19 requiere reconocimiento inmediato del costo del servicio pasado en P&L.' },
  { topic: 'Nivel 3', question: 'Las remediciones de planes DB post-empleo:', options: ['Se reclasifican a P&L en periodos futuros', 'Se reconocen en OCI y nunca se reclasifican a P&L', 'Se amortizan a P&L', 'Se reconocen directamente en P&L'], correctIndex: 1, explanation: 'Las remediciones van a OCI y nunca se reclasifican a P&L (pueden transferirse dentro del patrimonio).' },
  { topic: 'Nivel 3', question: 'FV activos inicio: $3M, tasa: 5%, retorno real: $180K. ¿Remedición en OCI?', options: ['$180,000 ganancia', '$150,000 (lo que va a P&L)', '$30,000 ganancia', '$30,000 pérdida'], correctIndex: 2, explanation: 'Interés esperado: $3M×5%=$150K. Retorno real: $180K. Diferencia: $180K−$150K=$30K ganancia en OCI.' },
  { topic: 'Nivel 4', question: 'La diferencia clave entre otros beneficios LP y planes DB post-empleo es:', options: ['Los otros LP no generan pasivo', 'Las remediciones de otros LP van a P&L, no a OCI', 'Los otros LP no requieren actuario', 'El costo del servicio se difiere'], correctIndex: 1, explanation: 'La diferencia principal es que las remediciones de otros beneficios LP se reconocen en P&L, no en OCI.' },
  { topic: 'Nivel 4', question: 'Un bono por 15 años de antigüedad es ejemplo de:', options: ['Beneficio post-empleo', 'Beneficio a corto plazo', 'Otro beneficio a largo plazo', 'Beneficio por terminación'], correctIndex: 2, explanation: 'Los bonos por antigüedad son otros beneficios a largo plazo: durante el empleo, pero >12 meses después del servicio.' },
  { topic: 'Nivel 4', question: 'Los beneficios por terminación se reconocen cuando:', options: ['El empleado renuncia voluntariamente', 'La empresa ya no puede retirar la oferta', 'Se paga la liquidación', 'El empleado cumple años de servicio'], correctIndex: 1, explanation: 'El pasivo se reconoce al primero de: cuando no puede retirar la oferta, o cuando reconoce reestructuración IAS 37.' },
  { topic: 'Nivel 4', question: 'Para reconocer terminación por decisión de la empresa, el plan debe:', options: ['Solo anunciar el cierre de operaciones', 'Cumplir 3 criterios: improbable cambio, identificar empleados, detallar beneficios', 'Pagar inmediatamente las liquidaciones', 'Obtener aprobación del sindicato'], correctIndex: 1, explanation: 'Se requieren 3 criterios específicos antes de reconocer el pasivo por terminación iniciada por la empresa.' },
  { topic: 'Integrador', question: 'Una empresa tiene: obligación $10M, activos $8M, contribuyó $500K, pagó beneficios $300K. El efecto neto en el pasivo por contribuciones y beneficios es:', options: ['Aumenta $200K', 'Disminuye $500K', 'Sin cambio neto', 'Disminuye $200K'], correctIndex: 2, explanation: 'Contribuciones: +activos (no afecta obligación). Beneficios: −obligación y −activos. Ambos son simétricos en el pasivo neto.' },
  { topic: 'Integrador', question: 'En la conciliación del pasivo neto DB, la cifra de cuadre que va a OCI es:', options: ['Costo del servicio actual', 'Interés neto', 'Ganancias y pérdidas actuariales', 'Contribuciones pagadas'], correctIndex: 2, explanation: 'Las G/L actuariales son la cifra de cuadre: saldo final real − saldo esperado. Van a OCI junto con el exceso de retorno.' },
];

function EvaluacionFinal({ onPass, onCertificateEarned, existingCertificate }: { onPass?: () => void; onCertificateEarned?: (name: string, certId: string) => void; existingCertificate?: { name?: string; date?: string; id?: string } }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(20).fill(null));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(existingCertificate ? true : false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certForm, setCertForm] = useState({ fullName: existingCertificate?.name || '', ethicsAccepted: false });
  const [certGenerated, setCertGenerated] = useState(!!existingCertificate);
  const [certId, setCertId] = useState(existingCertificate?.id || '');

  const questions = evaluacionFinalQuestions;
  const question = questions[currentQ];
  const totalQuestions = questions.length;

  const handleConfirm = () => {
    if (selectedOption === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedOption;
    setAnswers(newAnswers);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setAnswers(new Array(20).fill(null));
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
  };

  const generateCertId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'DAFEL-IAS19-';
    for (let i = 0; i < 8; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
  };

  const generatePDF = async (redownload = false) => {
    const nameToUse = redownload && existingCertificate?.name ? existingCertificate.name : certForm.fullName;
    const idToUse = redownload && existingCertificate?.id ? existingCertificate.id : null;
    
    if (!redownload && (!certForm.fullName.trim() || !certForm.ethicsAccepted)) return;
    if (redownload && !nameToUse) return;

    const newCertId = idToUse || generateCertId();
    if (!idToUse) setCertId(newCertId);
    const completionDate = existingCertificate?.date 
      ? new Date(existingCertificate.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);
    const { width, height } = page.getSize();

    const logoResponse = await fetch('/dafel-logo-cert.png');
    const logoBytes = await logoResponse.arrayBuffer();
    const logoImage = await pdfDoc.embedPng(logoBytes);

    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

    const dafelBlue = rgb(0, 0.294, 0.529);
    const gold = rgb(0.78, 0.62, 0.18);
    const darkGray = rgb(0.14, 0.12, 0.12);
    const mediumGray = rgb(0.4, 0.4, 0.4);
    const lightGray = rgb(0.55, 0.55, 0.55);

    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.99, 0.995, 1) });

    page.drawRectangle({ x: 20, y: 20, width: width - 40, height: height - 40, borderColor: dafelBlue, borderWidth: 2 });
    page.drawRectangle({ x: 28, y: 28, width: width - 56, height: height - 56, borderColor: gold, borderWidth: 1 });

    const titleText = 'CERTIFICADO DE LOGRO PROFESIONAL';
    const titleWidth = helveticaBold.widthOfTextAtSize(titleText, 26);
    page.drawText(titleText, { x: width / 2 - titleWidth / 2, y: height - 70, size: 26, font: helveticaBold, color: dafelBlue });

    page.drawLine({ start: { x: width / 2 - 160, y: height - 82 }, end: { x: width / 2 + 160, y: height - 82 }, thickness: 1.5, color: gold });

    const certifyText = 'Este certificado se otorga a';
    const certifyWidth = timesItalic.widthOfTextAtSize(certifyText, 14);
    page.drawText(certifyText, { x: width / 2 - certifyWidth / 2, y: height - 105, size: 14, font: timesItalic, color: mediumGray });

    const nameText = nameToUse.toUpperCase();
    const nameSize = nameText.length > 30 ? 22 : 28;
    const nameWidth = helveticaBold.widthOfTextAtSize(nameText, nameSize);
    page.drawText(nameText, { x: width / 2 - nameWidth / 2, y: height - 140, size: nameSize, font: helveticaBold, color: dafelBlue });

    page.drawLine({ start: { x: width / 2 - 140, y: height - 152 }, end: { x: width / 2 + 140, y: height - 152 }, thickness: 1.5, color: dafelBlue });

    const completedText = 'por haber completado satisfactoriamente el programa de capacitacion';
    const completedWidth = timesRoman.widthOfTextAtSize(completedText, 12);
    page.drawText(completedText, { x: width / 2 - completedWidth / 2, y: height - 175, size: 12, font: timesRoman, color: darkGray });

    const courseText = 'IAS 19 - BENEFICIOS A EMPLEADOS';
    const courseWidth = helveticaBold.widthOfTextAtSize(courseText, 22);
    page.drawText(courseText, { x: width / 2 - courseWidth / 2, y: height - 210, size: 22, font: helveticaBold, color: dafelBlue });

    const subtitleText = 'Norma Internacional de Contabilidad';
    const subtitleWidth = timesItalic.widthOfTextAtSize(subtitleText, 11);
    page.drawText(subtitleText, { x: width / 2 - subtitleWidth / 2, y: height - 228, size: 11, font: timesItalic, color: mediumGray });

    page.drawRectangle({ x: width / 2 - 220, y: height - 340, width: 440, height: 95, color: rgb(0.97, 0.98, 1), borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 0.5 });

    const competenciasTitle = 'Competencias Demostradas:';
    const competenciasTitleWidth = helveticaBold.widthOfTextAtSize(competenciasTitle, 10);
    page.drawText(competenciasTitle, { x: width / 2 - competenciasTitleWidth / 2, y: height - 258, size: 10, font: helveticaBold, color: darkGray });

    const competencias = [
      'Clasificacion de beneficios a empleados segun IAS 19',
      'Planes de contribucion definida y beneficio definido',
      'Metodo de la unidad de credito proyectada (PUC)',
      'Registro contable de obligaciones y activos del plan',
      'Remediciones en Otro Resultado Integral (OCI)',
      'Reconocimiento de beneficios por terminacion'
    ];
    competencias.forEach((comp, i) => {
      const col = i < 3 ? 0 : 1;
      const row = i % 3;
      const xPos = col === 0 ? width / 2 - 210 : width / 2 + 15;
      page.drawText('• ' + comp, { x: xPos, y: height - 278 - (row * 18), size: 9, font: helvetica, color: darkGray });
    });

    const scoreText = `Evaluacion Final: ${percentage}% (${correctCount} de ${totalQuestions} respuestas correctas)`;
    const scoreWidth = helveticaBold.widthOfTextAtSize(scoreText, 11);
    page.drawText(scoreText, { x: width / 2 - scoreWidth / 2, y: height - 360, size: 11, font: helveticaBold, color: percentage >= 90 ? rgb(0.1, 0.5, 0.2) : dafelBlue });

    const hoursText = 'Duracion del programa: 8 horas de contenido interactivo';
    const hoursWidth = helvetica.widthOfTextAtSize(hoursText, 9);
    page.drawText(hoursText, { x: width / 2 - hoursWidth / 2, y: height - 378, size: 9, font: helvetica, color: mediumGray });

    const logoWidth = 90;
    const logoHeight = 54;
    page.drawImage(logoImage, { x: 60, y: 70, width: logoWidth, height: logoHeight });

    page.drawLine({ start: { x: 170, y: 105 }, end: { x: 320, y: 105 }, thickness: 0.8, color: darkGray });
    page.drawLine({ start: { x: width / 2 + 40, y: 105 }, end: { x: width / 2 + 190, y: 105 }, thickness: 0.8, color: darkGray });
    page.drawLine({ start: { x: width - 230, y: 105 }, end: { x: width - 80, y: 105 }, thickness: 0.8, color: darkGray });

    const sig1Label = 'Fecha de Emision';
    const sig1Width = helvetica.widthOfTextAtSize(sig1Label, 9);
    page.drawText(sig1Label, { x: 245 - sig1Width / 2, y: 90, size: 9, font: helvetica, color: darkGray });
    const dateWidth = helveticaBold.widthOfTextAtSize(completionDate, 9);
    page.drawText(completionDate, { x: 245 - dateWidth / 2, y: 78, size: 9, font: helveticaBold, color: mediumGray });

    const sig2Label = 'Director Academico';
    const sig2Width = helvetica.widthOfTextAtSize(sig2Label, 9);
    page.drawText(sig2Label, { x: width / 2 + 115 - sig2Width / 2, y: 90, size: 9, font: helvetica, color: darkGray });
    const sig2Name = 'Dafel Consulting Services';
    const sig2NameWidth = helveticaBold.widthOfTextAtSize(sig2Name, 8);
    page.drawText(sig2Name, { x: width / 2 + 115 - sig2NameWidth / 2, y: 78, size: 8, font: helveticaBold, color: mediumGray });

    const sig3Label = 'Firma del Participante';
    const sig3Width = helvetica.widthOfTextAtSize(sig3Label, 9);
    page.drawText(sig3Label, { x: width - 155 - sig3Width / 2, y: 90, size: 9, font: helvetica, color: darkGray });

    page.drawLine({ start: { x: 50, y: 55 }, end: { x: width - 50, y: 55 }, thickness: 0.3, color: rgb(0.85, 0.85, 0.85) });

    page.drawText(`ID: ${newCertId}`, { x: 55, y: 42, size: 7, font: helvetica, color: lightGray });

    const ethicsText = 'Codigo de Etica Profesional aceptado';
    const ethicsWidth = helvetica.widthOfTextAtSize(ethicsText, 7);
    page.drawText(ethicsText, { x: width - 55 - ethicsWidth, y: 38, size: 7, font: helvetica, color: lightGray });

    const footerText = 'Este certificado acredita la finalizacion exitosa del programa y el compromiso con los estandares eticos de Dafel Consulting Services.';
    const footerWidth = timesItalic.widthOfTextAtSize(footerText, 7);
    page.drawText(footerText, { x: width / 2 - footerWidth / 2, y: 35, size: 7, font: timesItalic, color: rgb(0.5, 0.5, 0.5) });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Certificado_IAS19_${nameToUse.replace(/\s+/g, '_')}.pdf`;
    link.click();

    setCertGenerated(true);
    onPass?.();
    onCertificateEarned?.(certForm.fullName, newCertId);
  };

  const correctCount = existingCertificate ? 20 : answers.reduce((acc, a, i) => acc + (a === questions[i].correctIndex ? 1 : 0), 0);
  const passed = existingCertificate ? true : correctCount >= 15;
  const percentage = existingCertificate ? 100 : Math.round((correctCount / totalQuestions) * 100);

  if (showResults) {
    if (existingCertificate) {
      return (
        <div className="py-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <div className="rounded-2xl p-8 sm:p-12 text-center bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <TrophySolid className="w-24 h-24 text-yellow-500" />
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-green-900">
                Curso Completado
              </h2>
              <p className="text-lg mb-6 text-green-700">
                Ya completaste este curso y obtuviste tu certificado.
              </p>

              <div className="p-6 rounded-xl bg-white border-2 border-green-300 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="text-lg font-bold text-green-900">Tu Certificado</span>
                </div>
                <p className="text-sm text-gray-600">Nombre: <strong>{existingCertificate.name}</strong></p>
                <p className="text-sm text-gray-600">ID: <strong>{existingCertificate.id}</strong></p>
                <p className="text-sm text-gray-600">Fecha: <strong>{existingCertificate.date ? new Date(existingCertificate.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</strong></p>
                <button
                  onClick={() => generatePDF(true)}
                  className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#004B87' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar Certificado PDF
                </button>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQ(0);
                    setAnswers(new Array(20).fill(null));
                    setSelectedOption(null);
                    setIsAnswered(false);
                  }}
                  className="text-sm font-medium text-gray-500 underline hover:text-gray-700"
                >
                  Repetir evaluacion (para practicar)
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="py-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <div className={`rounded-2xl p-8 sm:p-12 text-center ${passed ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300' : 'bg-amber-50 border-2 border-amber-200'}`}>
            <div className="mb-6 flex justify-center">
              {passed ? (
                <div className="relative">
                  <TrophySolid className="w-20 h-20 text-yellow-500" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              ) : (
                <TrophyIcon className="w-16 h-16 text-amber-400" />
              )}
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${passed ? 'text-green-900' : 'text-amber-900'}`}>
              {passed ? '¡Felicidades! Curso completado' : 'Casi lo logras'}
            </h2>
            <p className={`text-lg mb-8 ${passed ? 'text-green-700' : 'text-amber-700'}`}>
              {passed
                ? 'Has demostrado dominio completo de IAS 19 Employee Benefits.'
                : 'Necesitas 75% (15/20) para aprobar. Repasa el material e intenta de nuevo.'}
            </p>
            <div className="inline-flex items-center gap-6 bg-white rounded-xl px-8 py-5 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`}>{correctCount}/{totalQuestions}</div>
                <div className="text-xs text-gray-500 mt-1">Correctas</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`}>{percentage}%</div>
                <div className="text-xs text-gray-500 mt-1">Calificacion</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-500'}`}>{passed ? '✓' : '✗'}</div>
                <div className="text-xs text-gray-500 mt-1">{passed ? 'Aprobado' : 'No aprobado'}</div>
              </div>
            </div>

            {passed && !certGenerated && (
              <div className="mt-8">
                <button
                  onClick={() => setShowCertModal(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90 shadow-lg"
                  style={{ backgroundColor: '#004B87' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Obtener Certificado
                </button>
              </div>
            )}

            {passed && certGenerated && (
              <div className="mt-8 p-6 rounded-xl bg-white border-2 border-green-300 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg font-bold text-green-900">Certificado Generado</span>
                </div>
                <p className="text-sm text-gray-600">Nombre: <strong>{certForm.fullName}</strong></p>
                <p className="text-sm text-gray-600">ID: <strong>{certId}</strong></p>
                <p className="text-xs text-gray-400 mt-2">El PDF se ha descargado automaticamente.</p>
                <button
                  onClick={() => generatePDF(false)}
                  className="mt-4 text-sm font-medium underline"
                  style={{ color: '#004B87' }}
                >
                  Descargar nuevamente
                </button>
              </div>
            )}
          </div>

          <div className="mt-10 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Desglose por pregunta</h3>
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex;
              return (
                <div key={i} className={`rounded-lg border p-4 ${isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${isCorrect ? 'bg-green-500' : 'bg-red-400'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{q.topic}</span>
                      <p className="text-sm text-gray-800 mt-1">{q.question}</p>
                      {!isCorrect && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                          <span className="font-semibold">Tu respuesta:</span> {q.options[answers[i]!]} <br />
                          <span className="font-semibold text-green-700">Correcta:</span> {q.options[q.correctIndex]}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            {!passed && (
              <button onClick={handleRetry} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: '#004B87' }}>
                Reintentar evaluacion
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {showCertModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowCertModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#004B87' }}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Firma tu Certificado</h3>
                  <p className="text-sm text-gray-500 mt-2">Completa los siguientes datos para generar tu certificado oficial.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo (como aparecera en el certificado)</label>
                    <input
                      type="text"
                      value={certForm.fullName}
                      onChange={(e) => setCertForm({ ...certForm, fullName: e.target.value })}
                      placeholder="Ej: Juan Carlos Perez Martinez"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base focus:outline-none focus:border-[#004B87] transition-colors"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Codigo de Etica Profesional</h4>
                    <div className="text-xs text-gray-600 space-y-2 mb-4 max-h-32 overflow-y-auto">
                      <p>Al firmar este certificado, me comprometo a:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Aplicar los conocimientos adquiridos de manera etica y profesional.</li>
                        <li>Mantener la confidencialidad de la informacion financiera de las organizaciones.</li>
                        <li>Actuar con integridad y objetividad en la preparacion de estados financieros.</li>
                        <li>Cumplir con las normas IAS/IFRS en su aplicacion correcta.</li>
                        <li>Continuar mi desarrollo profesional y actualizacion en normatividad contable.</li>
                      </ul>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={certForm.ethicsAccepted}
                        onChange={(e) => setCertForm({ ...certForm, ethicsAccepted: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-[#004B87] focus:ring-[#004B87]"
                      />
                      <span className="text-sm text-gray-700">
                        <strong>Acepto y me comprometo</strong> a cumplir con el Codigo de Etica Profesional de Dafel Technologies.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowCertModal(false)}
                      className="flex-1 px-4 py-3 rounded-xl text-sm font-medium border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => { generatePDF(); setShowCertModal(false); }}
                      disabled={!certForm.fullName.trim() || !certForm.ethicsAccepted}
                      className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                      style={{ backgroundColor: '#004B87' }}
                    >
                      Generar Certificado PDF
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">Pregunta {currentQ + 1} de {totalQuestions}</span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">{question.topic}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ backgroundColor: '#004B87' }} initial={{ width: 0 }} animate={{ width: `${((currentQ + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <p className="text-lg font-medium text-gray-900 leading-relaxed mb-8">{question.question}</p>

      <div className="space-y-3">
        {question.options.map((opt, i) => {
          let style = 'border-gray-100 hover:border-gray-200 hover:bg-gray-50';
          if (isAnswered) {
            if (i === question.correctIndex) style = 'border-green-200 bg-green-50';
            else if (i === selectedOption) style = 'border-red-200 bg-red-50';
            else style = 'border-gray-100 opacity-50';
          } else if (i === selectedOption) {
            style = 'border-[#004B87]/30 bg-blue-50/50';
          }
          return (
            <button key={i} onClick={() => !isAnswered && setSelectedOption(i)} className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all ${style}`}>
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${isAnswered && i === question.correctIndex ? 'border-green-500 bg-green-500 text-white' : isAnswered && i === selectedOption ? 'border-red-400 bg-red-400 text-white' : i === selectedOption ? 'border-[#004B87] text-[#004B87]' : 'border-gray-200 text-gray-400'}`}>
                  {isAnswered && i === question.correctIndex ? '✓' : String.fromCharCode(65 + i)}
                </span>
                <span className={isAnswered && i === question.correctIndex ? 'text-green-900 font-medium' : isAnswered && i === selectedOption && i !== question.correctIndex ? 'text-red-800' : 'text-gray-700'}>{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 px-5 py-4 rounded-xl text-sm leading-relaxed ${selectedOption === question.correctIndex ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-amber-50 text-amber-800 border border-amber-100'}`}>
          <span className="font-semibold">{selectedOption === question.correctIndex ? 'Correcto. ' : 'Incorrecto. '}</span>
          {question.explanation}
        </motion.div>
      )}

      <div className="mt-8 flex justify-end">
        {!isAnswered ? (
          <button onClick={handleConfirm} disabled={selectedOption === null} className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-30" style={{ backgroundColor: '#004B87' }}>
            Confirmar respuesta
          </button>
        ) : (
          <button onClick={handleNext} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: '#004B87' }}>
            {currentQ < totalQuestions - 1 ? 'Siguiente pregunta' : 'Ver resultados'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}

const challengeConfig: Record<string, { level: number; levelTitle: string; description: string; component: () => JSX.Element }> = {
  'challenge-1': {
    level: 1,
    levelTitle: 'Fundamentos',
    description: '8 preguntas que cubren todos los temas del nivel. Necesitas <strong>75% (6/8)</strong> para aprobar y desbloquear el siguiente nivel.',
    component: ChallengeNivel1,
  },
  'challenge-2': {
    level: 2,
    levelTitle: 'Medici\u00f3n',
    description: '6 preguntas sobre los 6 pasos, PUC method y c\u00e1lculo de pasivo/activo neto DB. Necesitas <strong>75% (5/6)</strong> para aprobar.',
    component: ChallengeNivel2,
  },
  'challenge-3': {
    level: 3,
    levelTitle: 'Registro',
    description: '8 preguntas sobre asientos contables, inter\u00e9s neto, remediciones y tabla de movimientos DB. Necesitas <strong>75% (6/8)</strong> para aprobar.',
    component: ChallengeNivel3,
  },
  'challenge-4': {
    level: 4,
    levelTitle: 'Casos Complejos',
    description: '6 preguntas sobre otros beneficios a largo plazo y beneficios por terminaci\u00f3n. Necesitas <strong>75% (5/6)</strong> para aprobar.',
    component: ChallengeNivel4,
  },
  'challenge-5': {
    level: 5,
    levelTitle: 'Maestr\u00eda',
    description: '<strong>Evaluaci\u00f3n Final</strong>: 20 preguntas integrales que cubren todos los niveles. Necesitas <strong>75% (15/20)</strong> para obtener tu certificado.',
    component: EvaluacionFinal,
  },
};

function ChallengeView({ challengeId, onBack, onNavigate, onChallengePass, onCertificateEarned, existingCertificate }: {
  challengeId: string;
  onBack: () => void;
  onNavigate: (id: string) => void;
  onChallengePass: (id: string) => void;
  onCertificateEarned: (name: string, certId: string) => void;
  existingCertificate?: { name?: string; date?: string; id?: string };
}) {
  const config = challengeConfig[challengeId];
  if (!config) return null;
  const ChallengeComponent = config.component;
  const levelNum = config.level;

  return (
    <main className="pt-16">
      <div className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al &iacute;ndice
          </button>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#004B87' }}>
              Nivel {levelNum} &middot; {config.levelTitle}
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#004B87' }}><TrophyIcon className="w-5 h-5 text-white" /></div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              Challenge Nivel {levelNum}
            </h1>
          </div>
          <p className="mt-4 text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: config.description }} />
        </header>

        <ChallengeComponent onPass={() => onChallengePass(challengeId)} onCertificateEarned={onCertificateEarned} existingCertificate={existingCertificate} />
      </article>
    </main>
  );
}

function OverviewView({ onStartLesson }: { onStartLesson: (id: string) => void }) {
  return (
    <main className="pt-16">
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">IAS Standards</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-xs text-gray-400">Actualizado Feb 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-light text-gray-900 leading-tight">
            IAS 19
            <span className="block font-semibold">Employee Benefits</span>
          </h1>

          <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-2xl">
            Domina la norma internacional de beneficios a empleados.
            Desde los fundamentos hasta casos complejos, con simuladores
            interactivos y evaluaciones pr&aacute;cticas.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">5 Niveles</span>
            <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">23 Lecciones</span>
            <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">Simuladores interactivos</span>
            <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">Certificaci&oacute;n</span>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="space-y-6">
            {courseStructure.map((module, index) => (
              <div
                key={module.id}
                className={`group relative ${!module.available ? 'opacity-40' : ''}`}
              >
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white transition-transform ${
                        module.available ? 'group-hover:scale-110' : ''
                      }`}
                      style={{ backgroundColor: module.available ? '#004B87' : '#E2E8F0' }}
                    >
                      {module.available ? module.level : (
                        <LockClosedIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    {index < courseStructure.length - 1 && (
                      <div className="w-px flex-1 bg-gray-100 mt-3" />
                    )}
                  </div>

                  <div className="flex-1 pb-12">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {module.title}
                      </h3>
                      <span className="text-sm text-gray-400 italic">
                        {module.subtitle}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                            module.available ? 'hover:bg-gray-50 cursor-pointer' : ''
                          }`}
                          onClick={() => module.available && onStartLesson(lesson.id)}
                        >
                          {lesson.id.startsWith('challenge-') ? (
                            <TrophyIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#004B87' }} />
                          ) : (
                            <span className="text-xs text-gray-300 font-mono w-6">{lesson.id}</span>
                          )}
                          <span className={`text-sm ${lesson.id.startsWith('challenge-') ? 'font-semibold text-gray-700' : 'text-gray-600'}`}>{lesson.title}</span>
                        </div>
                      ))}
                    </div>

                    {module.available && (
                      <button
                        onClick={() => onStartLesson(module.lessons[0].id)}
                        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: '#004B87' }}
                      >
                        Comenzar nivel
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function CursoIAS19Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState<string | null>('nivel-1');
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [progress, setProgress] = useState<CourseProgress>({ completedLessons: [], passedChallenges: [], certificateEarned: false });

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const markLessonComplete = (lessonId: string) => {
    if (progress.completedLessons.includes(lessonId)) return;
    const updated = { ...progress, completedLessons: [...progress.completedLessons, lessonId] };
    setProgress(updated);
    saveProgress(updated);
  };

  const markChallengePass = (challengeId: string) => {
    if (progress.passedChallenges.includes(challengeId)) return;
    const updated = { ...progress, passedChallenges: [...progress.passedChallenges, challengeId] };
    setProgress(updated);
    saveProgress(updated);
  };

  const earnCertificate = (name: string, certId: string) => {
    const updated = {
      ...progress,
      certificateEarned: true,
      certificateName: name,
      certificateDate: new Date().toISOString(),
      certificateId: certId,
    };
    setProgress(updated);
    saveProgress(updated);
  };

  const handleStartLesson = (id: string) => {
    setActiveLesson(id);
    window.scrollTo({ top: 0 });
    const levelNum = id.split('.')[0];
    setExpandedLevel(`nivel-${levelNum}`);
    if (!id.startsWith('challenge-')) {
      markLessonComplete(id);
    }
  };

  const handleBack = () => {
    setActiveLesson(null);
    window.scrollTo({ top: 0 });
  };

  const handleSidebarSelect = (id: string) => {
    setActiveLesson(id);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0 });
    const levelNum = id.split('.')[0];
    setExpandedLevel(`nivel-${levelNum}`);
    if (!id.startsWith('challenge-')) {
      markLessonComplete(id);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <Link href="/recursos">
              <img
                src="/dafel-logo-optimized.svg"
                alt="Dafel Technologies"
                className="h-16 w-auto"
              />
            </Link>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-expanded={isSidebarOpen}
              aria-label="Índice del curso"
            >
              {isSidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl border-l border-gray-100 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Centro de Recursos</span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-4 border-b border-gray-100">
                <button
                  onClick={() => { setActiveLesson(null); setIsSidebarOpen(false); window.scrollTo({ top: 0 }); }}
                  className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#004B87] to-[#0066CC] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">19</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">IAS 19 &mdash; Employee Benefits</h2>
                    <p className="text-xs text-gray-500">5 niveles &middot; 23 lecciones</p>
                  </div>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3">
                <div className="space-y-1">
                  {courseStructure.map((module) => (
                    <SidebarLevel
                      key={module.id}
                      module={module}
                      expandedLevel={expandedLevel}
                      setExpandedLevel={setExpandedLevel}
                      activeLesson={activeLesson}
                      onSelectLesson={handleSidebarSelect}
                      completedLessons={progress.completedLessons}
                      passedChallenges={progress.passedChallenges}
                    />
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100">
                <Link
                  href="/recursos"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver a Recursos
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {activeLesson?.startsWith('challenge-') ? (
        <ChallengeView
          challengeId={activeLesson}
          onBack={handleBack}
          onNavigate={handleStartLesson}
          onChallengePass={markChallengePass}
          onCertificateEarned={earnCertificate}
          existingCertificate={progress.certificateEarned ? { name: progress.certificateName, date: progress.certificateDate, id: progress.certificateId } : undefined}
        />
      ) : activeLesson ? (
        <LessonView
          lessonId={activeLesson}
          onBack={handleBack}
          onNavigate={handleStartLesson}
        />
      ) : (
        <OverviewView onStartLesson={handleStartLesson} />
      )}
    </div>
  );
}
