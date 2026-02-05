# 🎯 Módulo 4: Planes de Beneficios Definidos
## El Reto Máximo de la Contabilidad de Beneficios

---

## 🎬 Escenario: La Herencia Complicada

<div class="scenario-intro">

**Fecha:** 15 de diciembre de 2024
**Lugar:** Oficina de María González, CFO

María te muestra un documento polvoriento:

> "Acabo de descubrir algo preocupante. En 1995, cuando Azteca Tech era 'Manufacturas Azteca', se firmó un contrato colectivo que promete una pensión vitalicia del 70% del último salario a empleados con 25+ años de servicio. Tenemos 45 empleados que califican en los próximos 5 años. Nunca se ha registrado este pasivo. El auditor está preguntando y necesito respuestas AHORA."

**El problema:**
- 📜 Obligación contractual de 1995
- 👥 45 empleados próximos a calificar
- 💰 Pasivo no registrado (~$150 millones estimados)
- 📊 Impacto material en estados financieros
- ⚠️ Opinión de auditoría en riesgo

**Tu misión:** Calcular, registrar y proponer un plan de acción para esta bomba actuarial.

</div>

---

## 📖 ¿Qué es un Plan de Beneficios Definidos?

<div class="definition-critical">

### Definición IAS 19:
> "Planes de beneficios post-empleo distintos a los planes de contribución definida"

### La Diferencia Crítica:
La empresa **PROMETE UN BENEFICIO ESPECÍFICO** al retiro:
- Monto fijo mensual
- Porcentaje del salario final
- Fórmula basada en años de servicio

### ⚠️ El Riesgo es de la Empresa:
```
Promesa: Pensión de $20,000/mes de por vida
Pregunta: ¿Cuánto debo tener hoy para cumplir?
Respuesta: Depende de...
  - ¿Cuánto vivirá? (riesgo actuarial)
  - ¿Qué rendimiento obtendré? (riesgo de inversión)
  - ¿Cuál será su salario final? (riesgo salarial)
  - ¿Cuál será la inflación? (riesgo económico)
```

</div>

---

## 🧮 La Matemática Actuarial Simplificada

<div class="actuarial-basics">

### Fórmula del Beneficio en Azteca Tech:
```
Pensión Mensual = Salario Final × 70% × (Años de Servicio / 25)
```

### Ejemplo: Juan Rodríguez (58 años, 23 años en la empresa)

**Datos actuales:**
- Salario actual: $40,000/mes
- Años para retiro: 2 (se retira a los 60)
- Años de servicio al retiro: 25
- Incremento salarial esperado: 5% anual

**Cálculo del beneficio:**
```
Salario proyectado al retiro = $40,000 × (1.05)² = $44,100
Pensión mensual = $44,100 × 70% × (25/25) = $30,870/mes
```

**Valor presente de la obligación:**
```
Esperanza de vida post-retiro: 20 años
Pagos totales: $30,870 × 12 × 20 = $7,408,800
Tasa de descuento: 8% anual

Valor Presente = $7,408,800 / (1.08)² = $6,355,144
```

### 🎯 Multiplicado por 45 empleados ≈ $150-200 millones

</div>

---

## 📊 Componentes del Costo de Beneficio Definido

<div class="cost-components">

### Los 3 Componentes en Resultados (P&L):

#### 1. 💼 Costo por Servicios
**Corriente:** Costo del beneficio ganado este año
**Pasado:** Cambios al plan o reconocimiento inicial

#### 2. 💰 Costo Financiero Neto
Interés sobre el pasivo neto por beneficios definidos

#### 3. 🔄 Remediciones (van a OCI, no P&L)
- Ganancias/pérdidas actuariales
- Rendimiento de activos del plan (exceso sobre interés)

### Ejemplo Numérico Anual:

```
Obligación por Beneficios Definidos (DBO):
  Saldo inicial (1 enero)         $100,000,000
  + Costo servicio corriente        $8,000,000
  + Costo financiero (8%)           $8,000,000
  + Pérdida actuarial               $5,000,000
  - Beneficios pagados             ($3,000,000)
  = Saldo final (31 dic)          $118,000,000

Activos del Plan:
  Saldo inicial                    $60,000,000
  + Rendimiento esperado (8%)       $4,800,000
  + Contribuciones                 $10,000,000
  + Rendimiento real extra          $2,000,000
  - Beneficios pagados             ($3,000,000)
  = Saldo final                    $73,800,000

Pasivo Neto = $118,000,000 - $73,800,000 = $44,200,000
```

</div>

---

## 🇲🇽 Contexto Mexicano: Prima de Antigüedad y Más

<div class="mexican-db-plans">

### Beneficios Definidos Comunes en México:

#### 1. Prima de Antigüedad (Obligatoria)
- **Base:** 12 días de salario por año
- **Tope:** 2 veces salario mínimo general
- **Condiciones:** 15+ años de servicio
- **Tratamiento:** Plan de beneficio definido

#### 2. Indemnización Legal
- **Despido injustificado:** 3 meses + 20 días/año
- **Integración:** Salario integrado
- **Probabilidad:** Análisis estadístico requerido

#### 3. Planes de Pensiones Tradicionales
- **Sector:** Principalmente gobierno y grandes corporativos
- **Tendencia:** Migración a contribución definida
- **Ejemplos:** CFE, PEMEX, Banca tradicional

### Caso Azteca Tech - Cálculo Prima de Antigüedad:

```
Empleados: 500
Antigüedad promedio: 5 años
Salario promedio: $10,000/mes
Rotación anual: 15%

Obligación estimada por empleado que llegue a 15 años:
= 12 días × 15 años × ($10,000/30) = $60,000

Probabilidad de llegar a 15 años: 30%
Valor presente por empleado = $60,000 × 30% × factor descuento

Total estimado = $9,000,000
```

</div>

---

## 📝 Contabilización Completa: El Proceso

<div class="accounting-process">

### Paso 1: Valuación Actuarial (Anual mínimo)

**Contratar actuario certificado que determine:**
- Obligación por Beneficios Definidos (DBO)
- Costo del servicio corriente
- Supuestos actuariales
- Análisis de sensibilidad

### Paso 2: Registro Inicial (Azteca Tech)

**Reconocimiento del pasivo no registrado:**
```
Dr. Resultados Acumulados      $150,000,000
    Cr. Obligación por BD           $150,000,000

Nota: Afectación a utilidades retenidas por ser error de años anteriores
```

### Paso 3: Registros Mensuales 2024

**Cada mes (1/12 del costo anual):**
```
Dr. Costo por Servicios          $666,667
Dr. Costo Financiero              $1,000,000
    Cr. Obligación por BD            $1,666,667
```

### Paso 4: Remediciones (Trimestral/Anual)

**Al cierre, ajuste por cambios actuariales:**
```
Dr. OCI - Pérdidas Actuariales   $5,000,000
    Cr. Obligación por BD            $5,000,000

Nota: NO se reclasifica a resultados posteriormente
```

### Paso 5: Contribuciones y Pagos

**Si se aporta a un fondo:**
```
Dr. Activos del Plan             $10,000,000
    Cr. Bancos                       $10,000,000
```

**Pago de pensiones:**
```
Dr. Obligación por BD            $3,000,000
    Cr. Activos del Plan             $3,000,000
```

</div>

---

## 🎯 Supuestos Actuariales: El Arte y la Ciencia

<div class="actuarial-assumptions">

### Supuestos Demográficos:

#### 📊 Mortalidad
- Tabla: EMSSA 09 (México)
- Mejora anual: 1.5%
- Diferencial H/M: -3 años mujeres

#### 👥 Rotación
- 0-2 años: 25% anual
- 2-5 años: 15% anual
- 5-10 años: 8% anual
- 10+ años: 3% anual

#### 🎂 Retiro
- Normal: 60 años
- Anticipado: 55 (con reducción 5% por año)
- Diferido: 65 (con incremento 3% por año)

### Supuestos Financieros:

#### 💹 Tasa de Descuento
- Base: Bonos corporativos AA en México
- Diciembre 2024: 9.5%
- Duración matching: 15 años

#### 📈 Incremento Salarial
- Inflación esperada: 4%
- Mérito/Antigüedad: 2%
- Total: 6% anual

#### 💊 Inflación Médica
- General: 8% anual
- Decreciente a inflación + 2% en 10 años

### Análisis de Sensibilidad Requerido:

| Supuesto | Base | +1% | -1% | Impacto |
|----------|------|-----|-----|---------|
| Tasa descuento | 9.5% | 10.5% | 8.5% | ±12% DBO |
| Incremento salarial | 6% | 7% | 5% | ±8% DBO |
| Mortalidad | Tabla | +1 año | -1 año | ±5% DBO |

</div>

---

## 💰 Estrategias de Fondeo

<div class="funding-strategies">

### Opción 1: Sin Fondeo (Unfunded)
**Pros:**
- No requiere efectivo inmediato
- Flexibilidad total

**Contras:**
- ❌ Riesgo de liquidez futuro
- ❌ Sin deducibilidad fiscal hasta pago
- ❌ Percepción negativa

### Opción 2: Fideicomiso (Trust)
**Pros:**
- ✅ Deducible fiscalmente
- ✅ Activos protegidos
- ✅ Mejor calificación crediticia

**Contras:**
- Requiere efectivo
- Costos de administración

### Opción 3: Seguro de Grupo
**Pros:**
- ✅ Transferencia de riesgo
- ✅ Garantía de pago
- ✅ Administración externa

**Contras:**
- Costo adicional (profit del asegurador)
- Menos flexibilidad

### Recomendación para Azteca Tech:

```
Estrategia Híbrida:
1. Fideicomiso para obligaciones actuales: $50M
2. Contribuciones anuales: $15M
3. Seguro para longevidad extrema
4. Revisión anual de estrategia
```

</div>

---

## 📊 Impacto en Estados Financieros

<div class="financial-statement-impact">

### Estado de Situación Financiera:

```
ACTIVOS
Activos del Plan (si existe)         $50,000,000

PASIVOS
Pasivo por Beneficios Definidos     $200,000,000
  Porción circulante                  $5,000,000
  Porción no circulante             $195,000,000

CAPITAL
OCI - Remediciones acumuladas       ($25,000,000)
```

### Estado de Resultados:

```
Costo de Ventas (empleados producción)
  Costo servicio corriente            $3,000,000

Gastos de Operación (empleados admin)
  Costo servicio corriente            $5,000,000

Gastos Financieros
  Interés neto sobre pasivo          $15,000,000

IMPACTO TOTAL EN UTILIDAD            $23,000,000
```

### Otros Resultados Integrales (OCI):

```
Remediciones del período:
  Pérdidas actuariales               ($8,000,000)
  Ganancia en activos                  $2,000,000
  
IMPACTO NETO EN OCI                 ($6,000,000)

Nota: No se reclasifica a resultados
```

</div>

---

## 🔮 Caso Práctico: Proyección a 5 Años

<div class="five-year-projection">

### Escenario Base - Azteca Tech:

| Año | DBO Inicio | Costo Servicio | Interés | Pagos | DBO Fin |
|-----|------------|----------------|---------|-------|---------|
| 2024 | $150M | $8M | $14M | ($3M) | $169M |
| 2025 | $169M | $9M | $16M | ($5M) | $189M |
| 2026 | $189M | $10M | $18M | ($8M) | $209M |
| 2027 | $209M | $11M | $20M | ($12M) | $228M |
| 2028 | $228M | $12M | $22M | ($18M) | $244M |

### Escenarios Alternativos:

#### 🚀 Optimista (Cierre del plan a nuevos)
- Congelar beneficios actuales
- Migrar a contribución definida
- DBO máximo: $180M

#### 😰 Pesimista (Sin acción)
- Más empleados califican
- Incrementos salariales altos
- DBO proyectado: $350M

### Plan de Acción Recomendado:

1. **Inmediato:** Registro contable completo
2. **Q1 2025:** Negociar cierre a nuevos entrantes
3. **Q2 2025:** Implementar fondeo gradual
4. **Q3 2025:** Ofrecer buyouts voluntarios
5. **2026+:** Migración completa a CD

</div>

---

## 🎮 Simulador: Calcula tu DBO

<div class="dbo-calculator">

### Ingresa los Datos:

**Empleado:**
- Edad actual: [45]
- Años de servicio: [10]
- Salario mensual: [$30,000]
- Edad de retiro: [60]

**Plan:**
- % del salario final: [70%]
- Años requeridos: [25]

**Supuestos:**
- Tasa descuento: [9.5%]
- Incremento salarial: [6%]
- Esperanza de vida post-retiro: [20 años]

### Resultados:

```
Años para retiro: 15
Años servicio al retiro: 25
Salario proyectado: $71,843

Pensión mensual: $50,290
Pensión anual: $603,481

Valor presente de pagos futuros: $6,234,891
Descuento a hoy: $1,577,142

DBO ACTUAL: $1,577,142
```

### Sensibilidades:
- Si tasa descuento 8.5%: $1,789,234 (+13%)
- Si incremento salarial 7%: $1,698,445 (+8%)
- Si vive 5 años más: $1,834,567 (+16%)

</div>

---

## 🎯 Quiz del Módulo 4

<div class="module-quiz">

### Pregunta 1
¿Quién asume el riesgo en un plan de beneficios definidos?
- a) El empleado
- b) El gobierno
- c) La empresa ✓
- d) El fondo de pensiones

### Pregunta 2
¿Dónde se registran las remediciones actuariales?
- a) En resultados del período
- b) En otros resultados integrales (OCI) ✓
- c) Directamente en capital
- d) Como activo diferido

### Pregunta 3
La tasa de descuento debe basarse en:
- a) Tasa de interés bancaria
- b) Inflación esperada
- c) Bonos corporativos de alta calidad ✓
- d) Rendimiento esperado de activos

### Pregunta 4
¿Cuál NO es componente del costo en resultados?
- a) Costo servicio corriente
- b) Costo servicio pasado
- c) Interés neto
- d) Remediciones actuariales ✓

### Pregunta 5
La prima de antigüedad en México es:
- a) 15 días por año
- b) 12 días por año ✓
- c) 20 días por año
- d) 30 días por año

</div>

---

## 💼 Caso Final: Presentación de Crisis

<div class="crisis-presentation">

### Memorándum Urgente para el CEO:

```
PARA: Consejo de Administración
DE: María González, CFO
FECHA: 15 Diciembre 2024
RE: ACCIÓN URGENTE - Pasivo No Registrado por Pensiones

SITUACIÓN CRÍTICA:
- Pasivo no registrado: $150-200M
- Impacto en capital: -40%
- Riesgo: Opinión con salvedad del auditor

IMPACTO INMEDIATO:
- Utilidades retenidas: -$150M
- Covenants bancarios: Posible incumplimiento
- Calificación crediticia: Bajo revisión

PLAN DE ACCIÓN (Aprobación requerida HOY):

1. REGISTRO INMEDIATO (Dic 2024)
   - Reconocer pasivo completo
   - Afectar utilidades retenidas
   - Costo: $150M one-time

2. NEGOCIACIÓN SINDICAL (Ene 2025)
   - Cerrar plan a nuevos
   - Ofrecer buyouts 
   - Meta: Reducir DBO 30%

3. FONDEO GRADUAL (2025-2030)
   - Fideicomiso inicial: $20M
   - Aportaciones anuales: $15M
   - Meta: 60% fondeado en 5 años

4. COMUNICACIÓN
   - Call con inversionistas: Lunes
   - Comunicado de prensa: Martes
   - Town hall empleados: Miércoles

SOLICITO:
✓ Aprobación para registro contable
✓ Autorización para contratar actuario
✓ Mandato para renegociar plan
✓ Presupuesto de $20M fondeo inicial

Tiempo de respuesta: INMEDIATO
```

</div>

---

## 📚 Resumen del Módulo

<div class="module-summary">

### ✅ Conceptos Dominados:
- Naturaleza y riesgos de planes BD
- Componentes del costo (servicio, interés, remediciones)
- Tratamiento contable completo
- Supuestos actuariales clave
- Estrategias de fondeo y mitigación

### 🎯 Habilidades Desarrolladas:
- Interpretar valuaciones actuariales
- Calcular DBO básico
- Registrar asientos contables complejos
- Evaluar impacto financiero
- Proponer estrategias de gestión

### 💡 Lecciones Clave:
1. **Los planes BD son bombas de tiempo** si no se gestionan
2. **El registro es obligatorio** aunque no esté fondeado
3. **Las remediciones van a OCI**, no a resultados
4. **La tasa de descuento** es el supuesto más sensible
5. **La tendencia mundial** es migrar a CD

### ⚠️ Alertas Rojas:
- Planes antiguos no registrados
- Cambios demográficos (longevidad)
- Tasas de interés bajas
- Concentración de retiros
- Compromisos sindicales

</div>

---

<div class="navigation-buttons">
  <button onclick="location.href='modulo-3-planes-contribucion.md'">← Módulo 3</button>
  <button class="primary" onclick="location.href='modulo-5-otros-beneficios.md'">Módulo 5 →</button>
</div>

---

*© 2024 Dafel Technologies - Curso Interactivo IAS 19 & NIF D-3*