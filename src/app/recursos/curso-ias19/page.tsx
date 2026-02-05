'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, BookOpenIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function CursoIAS19Page() {
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  
  const modules = [
    {
      id: 1,
      title: "Introducción a los Beneficios a Empleados",
      subtitle: "IAS 19 & NIF D-3: Una Perspectiva Integral",
      duration: "30 min",
      topics: ["Definición y alcance", "Clasificación de beneficios", "Contexto mexicano", "Principios fundamentales"],
      color: "#004B87",
      icon: "📚"
    },
    {
      id: 2,
      title: "Beneficios a Corto Plazo",
      subtitle: "Dominando los Beneficios del Día a Día",
      duration: "45 min",
      topics: ["Aguinaldo", "PTU", "Vacaciones y prima vacacional", "IMSS e INFONAVIT"],
      color: "#0066CC",
      icon: "💰"
    },
    {
      id: 3,
      title: "Planes de Contribución Definida",
      subtitle: "El Modelo Simple pero Poderoso",
      duration: "40 min",
      topics: ["Diseño del plan", "Contabilización", "Ventajas fiscales", "Plan Azteca Tech Future"],
      color: "#3399FF",
      icon: "📈"
    },
    {
      id: 4,
      title: "Planes de Beneficios Definidos",
      subtitle: "El Reto Máximo de la Contabilidad",
      duration: "60 min",
      topics: ["Valuación actuarial", "DBO y activos del plan", "Remediciones en OCI", "Prima de antigüedad"],
      color: "#66B2FF",
      icon: "🎯"
    },
    {
      id: 5,
      title: "Otros Beneficios y Terminación",
      subtitle: "Las Piezas Finales del Rompecabezas",
      duration: "50 min",
      topics: ["Bonos por antigüedad", "Beneficios por terminación", "Reestructuración", "Retiro voluntario"],
      color: "#99CCFF",
      icon: "🏁"
    }
  ];

  const handleModuleComplete = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-40 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/recursos" className="flex items-center hover:opacity-80 transition-opacity" style={{color: '#004B87'}}>
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                <span className="text-sm">Volver a Recursos</span>
              </Link>
              <span className="ml-4 text-gray-400">|</span>
              <h1 className="ml-4 text-lg font-semibold" style={{color: '#004B87'}}>
                Curso IAS 19 - Beneficios a Empleados
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm" style={{color: '#666'}}>
                Progreso: <span className="font-semibold">{completedModules.length}/{modules.length}</span>
              </div>
              <div className="w-32 rounded-full h-2" style={{backgroundColor: '#e5e7eb'}}>
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedModules.length / modules.length) * 100}%`, backgroundColor: '#004B87' }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Module Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 flex items-center" style={{color: '#004B87'}}>
                <BookOpenIcon className="h-6 w-6 mr-2" style={{color: '#004B87'}} />
                Módulos del Curso
              </h2>
              
              <nav className="space-y-2">
                {modules.map((module, index) => (
                  <button
                    key={module.id}
                    onClick={() => setCurrentModule(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      currentModule === index
                        ? 'bg-blue-50 border-l-4 text-blue-900 shadow-sm'
                        : 'hover:bg-blue-50/50 text-gray-700'
                    }`}
                    style={currentModule === index ? {borderLeftColor: '#004B87'} : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-sm font-semibold flex items-center gap-2">
                            <span>{module.icon}</span>
                            Módulo {module.id}
                          </span>
                          {completedModules.includes(module.id) && (
                            <CheckCircleIcon className="h-5 w-5 ml-2 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{module.title}</p>
                      </div>
                      <span className="text-xs text-gray-500">{module.duration}</span>
                    </div>
                  </button>
                ))}
              </nav>

              <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: '#f0f7fe'}}>
                <h3 className="text-sm font-semibold mb-2" style={{color: '#004B87'}}>
                  🎯 Objetivo del Curso
                </h3>
                <p className="text-xs" style={{color: '#0066CC'}}>
                  Dominar la contabilización de beneficios a empleados según IAS 19 y NIF D-3, 
                  con casos prácticos del contexto mexicano.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
            >
              {/* Module Header */}
              <div 
                className="px-8 py-6 text-white"
                style={{ backgroundColor: modules[currentModule].color }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm opacity-90">Módulo {modules[currentModule].id}</p>
                    <h2 className="text-2xl font-bold mt-1">{modules[currentModule].title}</h2>
                    <p className="text-base opacity-90 mt-2">{modules[currentModule].subtitle}</p>
                  </div>
                  <AcademicCapIcon className="h-12 w-12 opacity-50" />
                </div>
              </div>

              {/* Module Content */}
              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Temas a Cubrir
                  </h3>
                  <ul className="space-y-3">
                    {modules[currentModule].topics.map((topic, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3" style={{backgroundColor: '#f0f7fe', color: '#004B87'}}>
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Content Placeholder */}
                <div className="border-2 border-dashed rounded-lg p-12 text-center" style={{borderColor: '#004B87', backgroundColor: '#fafbfc'}}>
                  <BookOpenIcon className="h-16 w-16 mx-auto mb-4" style={{color: '#004B87'}} />
                  <h3 className="text-xl font-semibold mb-2" style={{color: '#004B87'}}>
                    Contenido Interactivo
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Aquí se cargará el contenido completo del módulo con:
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm text-gray-600">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                      📚 Teoría y conceptos
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                      💼 Casos prácticos
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                      🧮 Calculadoras
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                      🎯 Ejercicios
                    </div>
                  </div>
                </div>

                {/* Module Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => currentModule > 0 && setCurrentModule(currentModule - 1)}
                    disabled={currentModule === 0}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      currentModule === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <ChevronLeftIcon className="h-5 w-5 mr-1" />
                    Anterior
                  </button>

                  <button
                    onClick={() => handleModuleComplete(modules[currentModule].id)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      completedModules.includes(modules[currentModule].id)
                        ? 'bg-green-100 text-green-700'
                        : 'text-white hover:opacity-90'
                    }`}
                    style={!completedModules.includes(modules[currentModule].id) ? {backgroundColor: '#004B87'} : {}}
                  >
                    {completedModules.includes(modules[currentModule].id) ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                        Completado
                      </>
                    ) : (
                      'Marcar como Completado'
                    )}
                  </button>

                  <button
                    onClick={() => currentModule < modules.length - 1 && setCurrentModule(currentModule + 1)}
                    disabled={currentModule === modules.length - 1}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      currentModule === modules.length - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'text-white hover:opacity-90'
                    }`}
                    style={currentModule < modules.length - 1 ? {backgroundColor: '#004B87'} : {}}
                  >
                    Siguiente
                    <ChevronRightIcon className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Company Context Card */}
            <div className="mt-8 bg-gradient-to-r rounded-xl shadow-lg p-6 text-white" style={{backgroundImage: 'linear-gradient(135deg, #004B87 0%, #0066CC 100%)'}}>
              <h3 className="text-xl font-bold mb-3">
                🏢 Caso de Estudio: Grupo Azteca Tech
              </h3>
              <p className="text-blue-100 mb-4">
                A lo largo del curso, trabajarás con el caso real de Grupo Azteca Tech, 
                una empresa tecnológica mexicana con 500+ empleados en Guadalajara.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-semibold">María González</p>
                  <p className="text-blue-200">Directora de Finanzas</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-semibold">Carlos Mendoza</p>
                  <p className="text-blue-200">Gerente de RRHH</p>
                </div>
              </div>
            </div>

            {/* Certificate Preview */}
            {completedModules.length === modules.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border-2 border-green-200"
              >
                <div className="text-center">
                  <AcademicCapIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-900 mb-2">
                    ¡Felicitaciones!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Has completado todos los módulos del curso IAS 19
                  </p>
                  <button className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md" style={{backgroundColor: '#004B87'}}>
                    Descargar Certificado Dafel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}