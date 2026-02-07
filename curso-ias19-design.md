# CURSO IAS 19 — EMPLOYEE BENEFITS
## Plan de Diseno — Dafel Technologies

**Objetivo**: Crear un curso de nivel profesional (Google/Meta/IBM) basado en el conocimiento academico de IAS 19.
**Enfoque**: Contenido 100% original. Solo extraemos el conocimiento tecnico, NO replicamos ejemplos, personajes, ni preguntas.
**Interactividad**: (A) Contenido rico con quizzes inline + (B) Simuladores con inputs numericos en tiempo real.

---

## ARQUITECTURA DE NIVELES

```
NIVEL 1: FUNDAMENTOS ............... "Que le debo a mis empleados?"
NIVEL 2: MEDICION .................. "Cuanto le debo?"
NIVEL 3: REGISTRO .................. "Como lo registro?"
NIVEL 4: CASOS COMPLEJOS ........... "Que pasa cuando se complica?"
NIVEL 5: MAESTRIA .................. "Dominio total + certificacion"
```

Cada nivel tiene lecciones cortas (5-10 min), evaluaciones integradas, y un challenge para desbloquear el siguiente.

---

# NIVEL 1: FUNDAMENTOS
### "Que le debo a mis empleados?"

**Objetivo del nivel**: El alumno comprende IAS 19 como norma, identifica las 4 categorias de beneficios, y distingue entre planes DC y DB.

---

### Leccion 1.1 — Que es IAS 19 y por que importa
**Conocimiento base Deloitte**: Lineas 69-126
- Definicion de IAS 19: norma IFRS para contabilizar beneficios a empleados
- Objetivo: reconocer el costo en el periodo donde se presta el servicio, no cuando se paga
- Alcance: todos los beneficios excepto IFRS 2 (share-based payment)
- Aplica a: acuerdos formales, legislacion, practicas informales (obligacion implicita)
- Contexto actual: tasas bajas de interes + retornos menores = obligaciones mas grandes + fondos insuficientes
- Relevancia en Mexico: conexion con NIF D-3

**Elemento interactivo**: Infografia animada — flujo Empleador -> Servicios -> Empleado -> Beneficios
**Quiz inline**: 2 preguntas de comprension rapida sobre alcance y principio fundamenta
---

### Leccion 1.2 — Las 4 categorias de beneficios a empleados
**Conocimiento base Deloitte**: Lineas 195-329
- **Categoria 1 — Beneficios a corto plazo**: Liquidacion esperada < 12 meses despues del cierre del periodo (lineas 195-282)
  - Salarios, contribuciones a seguridad social
  - Vacaciones pagadas (acumulables vs no acumulables)
  - Licencias por enfermedad, maternidad
  - Bonos y participacion de utilidades pagaderos a corto plazo
  - Beneficios no monetarios (asistencia medica, vivienda, autos)
- **Categoria 2 — Beneficios post-empleo**: Pagaderos despues de terminada la relacion laboral (lineas 285-314)
  - Pensiones
  - Seguros de vida post-empleo
  - Asistencia medica post-empleo
- **Categoria 3 — Otros beneficios a largo plazo**: Todo lo demas que no es corto plazo, post-empleo, ni terminacion (lineas 316-329)
  - Licencias sabaticas
  - Bonos por aniversario (jubilee)
  - Bonos por servicio prolongado
  - Compensacion diferida >12 meses
- **Categoria 4 — Beneficios por terminacion**: Resultado de la decision de terminar el empleo (cubierto a profundidad en Nivel 4)

**Elemento interactivo**: Ejercicio de clasificacion — el alumno arrastra beneficios a la categoria correcta (concepto similar a Deloitte lineas 546-582, pero con ejemplos 100% originales contextualizados a Mexico)
**Quiz inline**: 3 preguntas — clasificar beneficios reales de empresas mexicanas

---

### Leccion 1.3 — Beneficios a corto plazo: reconocimiento y medicion
**Conocimiento base Deloitte**: Lineas 207-282
- Regla: reconocer el monto NO descontado como pasivo (gasto acumulado) y como gasto
- Si el pago excede el beneficio: reconocer como activo (gasto prepagado)
- **Ausencias compensadas**:
  - Acumulables: reconocer cuando el empleado presta servicio que incrementa su derecho (lineas 233-239)
  - No acumulables: reconocer cuando la ausencia ocurre (lineas 241-247)
- **Planes de bonos y participacion de utilidades** (lineas 274-282):
  - Reconocer cuando: (a) existe obligacion legal o implicita, Y (b) se puede estimar confiablemente

**Elemento interactivo**: Simulador — el alumno ingresa: num. empleados, dias de vacaciones, salario promedio, dias no utilizados -> calcula automaticamente el pasivo por vacaciones acumuladas
**Quiz inline**: 2 preguntas sobre acumulables vs no acumulables

---

### Leccion 1.4 — Planes de contribucion definida vs beneficio definido
**Conocimiento base Deloitte**: Lineas 332-433
- **Planes de contribucion definida (DC)** (lineas 340-347, 360-371):
  - Entidad paga contribuciones fijas a un fondo separado
  - Sin obligacion adicional si el fondo no alcanza
  - Riesgo actuarial e inversional recae en el EMPLEADO
  - Ejemplo conceptual: "La empresa aporta 5% del salario, y ya"
- **Planes de beneficio definido (DB)** (lineas 349-351, 372-381):
  - Entidad se obliga a pagar un beneficio especifico (formula basada en anos de servicio, salario final, etc.)
  - Riesgo actuarial e inversional recae en la ENTIDAD
  - Ejemplo conceptual: "La empresa promete una pension del 2% del salario final por cada ano de servicio"
- **Planes multi-empleador, estatales y asegurados** (lineas 386-433):
  - Multi-empleador: recursos mancomunados de varias entidades sin control comun
  - Estatales: establecidos por legislacion (ej. IMSS en Mexico)
  - Asegurados: primas de seguro, tratamiento DC salvo obligacion retenida

**Elemento interactivo**: Comparador visual lado a lado — DC vs DB con animacion que muestra donde recae el riesgo
**Quiz inline**: 3 preguntas — clasificar planes como DC o DB (concepto similar a Deloitte lineas 436-460, pero con planes mexicanos originales)

---

### Leccion 1.5 — Contabilizacion de planes DC
**Conocimiento base Deloitte**: Lineas 475-527, 757-812
- Principio: la obligacion se determina por el monto a contribuir en el periodo
- Reconocimiento:
  - En P&L como gasto (salvo que otra IFRS permita capitalizarlo)
  - En el balance como pasivo (gasto acumulado) despues de deducir lo pagado
  - Si el pago excede la contribucion: activo (gasto prepagado)
- Asiento contable tipico:
  - Dr. Gasto por pension / Cr. Efectivo (si se paga completo)
  - Dr. Gasto por pension / Cr. Efectivo + Cr. Pasivo (si hay faltante)
  - Dr. Gasto por pension + Dr. Activo prepagado / Cr. Efectivo (si hay excedente)

**Elemento interactivo**: Simulador de asientos contables DC — el alumno ingresa: total salarios, % contribucion, monto pagado, saldo previo -> genera automaticamente el asiento contable y lo explica
**Quiz inline**: 2 preguntas con calculos simples

---

### CHALLENGE NIVEL 1
- 8 preguntas de evaluacion
- Combinacion de: clasificacion, conceptos, y 1 calculo simple DC
- Aprobacion: 75% (6/8)
- Al aprobar: se desbloquea Nivel 2

---
---

# NIVEL 2: MEDICION
### "Cuanto le debo?"

**Objetivo del nivel**: El alumno comprende el enfoque de 6 pasos para planes DB, domina la medicion de la obligacion, los activos del plan, y el pasivo/activo neto de beneficio definido.

---

### Leccion 2.1 — El enfoque de 6 pasos para planes DB
**Conocimiento base Deloitte**: Lineas 909-927
- Vision general del enfoque completo:
  1. Atribuir beneficios a periodos de servicio
  2. Descontar los beneficios (valor presente)
  3. Determinar valor razonable de activos del plan
  4. Calcular el pasivo (activo) neto de beneficio definido
  5. Determinar montos en P&L
  6. Determinar remediciones en OCI
- Este es el mapa completo — los pasos 1-4 se cubren en Nivel 2, los pasos 5-6 en Nivel 3

**Elemento interactivo**: Roadmap visual animado de los 6 pasos — el alumno puede hacer click en cada paso para ver un preview
**Quiz inline**: 1 pregunta de ordenamiento (poner los 6 pasos en orden correcto)

---

### Leccion 2.2 — Paso 1: Atribucion de beneficios
**Conocimiento base Deloitte**: Lineas 928-973
- Se usan tecnicas actuariales para estimar el beneficio ganado por servicio en periodos actuales y anteriores
- Regla general: atribuir segun la formula del plan
- Excepcion: si el servicio en anos posteriores genera un beneficio materialmente mayor, atribuir en linea recta
  - Desde la fecha en que el servicio genera beneficios
  - Hasta la fecha en que el servicio adicional no genera beneficios materiales adicionales
- Obligacion implicita: la probabilidad de que algunos empleados no cumplan criterios de vesting afecta la MEDICION, no la EXISTENCIA de la obligacion

**Elemento interactivo**: Diagrama animado — linea de tiempo mostrando como se atribuyen beneficios en diferentes escenarios (formula del plan vs linea recta)
**Quiz inline**: 2 preguntas sobre cuando usar formula del plan vs linea recta

---

### Leccion 2.3 — Paso 2: Descontar los beneficios (Projected Unit Credit Method)
**Conocimiento base Deloitte**: Lineas 984-995
- Metodo de la Unidad de Credito Proyectada (PUC): obligatorio
- Cada periodo de servicio genera una unidad adicional de derecho a beneficio
- Se mide cada unidad por separado para construir la obligacion final
- Resultado: valor presente de la obligacion de beneficio definido (PV of DBO)

**Elemento interactivo**: Visualizacion animada — bloques que se apilan por cada ano de servicio, mostrando como cada unidad se descuenta al valor presente
**Quiz inline**: 1 pregunta conceptual sobre PUC

---

### Leccion 2.4 — Paso 3: Valor razonable de activos del plan
**Conocimiento base Deloitte**: Lineas 990-995
- Los activos del plan se miden a valor razonable (IFRS 13)
- Se deducen del valor presente de la obligacion para determinar el deficit o superavit

**Elemento interactivo**: Grafica visual — barras comparando PV de obligacion vs FV de activos del plan (deficit vs superavit)
**Quiz inline**: 1 pregunta conceptual

---

### Leccion 2.5 — Paso 4: Pasivo (activo) neto de beneficio definido
**Conocimiento base Deloitte**: Lineas 998-1006
- Formula: PV de la obligacion - FV de activos del plan = Pasivo (Activo) Neto DB
- Se ajusta por el efecto del limite del activo (asset ceiling) si aplica
- Se reconoce en el estado de situacion financiera
- Si PV obligacion > FV activos = PASIVO neto (la empresa debe mas de lo que tiene en el fondo)
- Si FV activos > PV obligacion = ACTIVO neto (el fondo tiene mas de lo necesario)

**Elemento interactivo**: Simulador — el alumno ingresa PV de obligacion y FV de activos -> calcula pasivo/activo neto y muestra visualmente la brecha
**Quiz inline**: 2 preguntas con calculos (concepto similar a Deloitte lineas 1119-1161, pero con datos originales)

---

### CHALLENGE NIVEL 2
- 6 preguntas de evaluacion
- Enfocadas en: los 6 pasos, PUC method, calculo de pasivo/activo neto DB
- Aprobacion: 75% (5/6)
- Al aprobar: se desbloquea Nivel 3

---
---

# NIVEL 3: REGISTRO
### "Como lo registro?"

**Objetivo del nivel**: El alumno domina los asientos contables para planes DB: contribuciones, beneficios pagados, costo del servicio, interes neto, retorno de activos, y remediciones en OCI.

---

### Leccion 3.1 — Contribuciones pagadas y beneficios pagados
**Conocimiento base Deloitte**: Lineas 1166-1193
- **Contribuciones pagadas al plan**:
  - Incrementan el FV de activos del plan
  - NO impactan la obligacion (el efecto se reconoce cuando el empleado presta servicio)
  - Asiento: Dr. Activos del plan / Cr. Efectivo
- **Beneficios pagados a empleados**:
  - Pago de activos del plan en liquidacion parcial de la obligacion
  - Asiento: Dr. Obligacion de beneficio definido / Cr. Activos del plan

**Elemento interactivo**: Constructor de asientos contables — el alumno selecciona cuentas y montos para armar el asiento correcto (drag & drop de debitos y creditos)
**Quiz inline**: 2 preguntas — armar asientos contables

---

### Leccion 3.2 — Paso 5a: Costo del servicio actual (Current Service Cost)
**Conocimiento base Deloitte**: Lineas 1196-1236
- Definicion: incremento en el PV de la obligacion DB por servicio del empleado en el periodo actual
- Determinado usando supuestos actuariales al inicio del periodo anual
- Enmiendas 2018: usar supuestos actualizados despues de enmienda/curtailment/settlement del plan
- Asiento: Dr. Gasto de beneficio definido / Cr. Obligacion de beneficio definido
- Tambien existe el **costo del servicio pasado** (lineas 1022-1038): cambio en PV por enmienda o curtailment del plan — se reconoce como gasto inmediatamente

**Elemento interactivo**: Visualizacion — como el costo del servicio actual incrementa la obligacion periodo a periodo
**Quiz inline**: 2 preguntas — asientos contables para service cost

---

### Leccion 3.3 — Paso 5b: Interes neto sobre el pasivo (activo) neto DB
**Conocimiento base Deloitte**: Lineas 1240-1273
- Definicion: cambio en el pasivo (activo) neto DB por el paso del tiempo
- Calculo: Pasivo (activo) neto DB al inicio del periodo x Tasa de descuento
- La tasa de descuento se determina por referencia a rendimientos de bonos corporativos de alta calidad
  - Si no hay mercado profundo: rendimientos de bonos gubernamentales
  - Moneda y plazo consistentes con las obligaciones
- La tasa refleja: valor del dinero en el tiempo (NO riesgo actuarial ni de inversion)
- Se reconoce en P&L
- Enmiendas 2018: despues de un evento significativo, usar supuestos de la remedicion

**Elemento interactivo**: Calculadora de interes neto — el alumno ingresa: PV obligacion inicio, FV activos inicio, tasa de descuento -> calcula interes neto y lo descompone en: interes sobre obligacion, interes sobre activos, neto
**Quiz inline**: 2 preguntas con calculo numerico (concepto similar a Deloitte lineas 1843-1876, pero con datos originales)

---

### Leccion 3.4 — Paso 6a: Retorno de activos del plan
**Conocimiento base Deloitte**: Lineas 1276-1286
- El retorno comprende:
  - Intereses, dividendos y otros ingresos de los activos del plan
  - Ganancias y perdidas realizadas y no realizadas
  - Menos: costos de administracion e impuestos del plan
- El retorno de activos se divide en dos partes:
  - Parte incluida en interes neto (calculada con la tasa de descuento) -> P&L
  - Diferencia entre retorno real y la parte de interes neto -> OCI como remedicion

**Elemento interactivo**: Diagrama animado — flujo de retorno dividido entre P&L y OCI
**Quiz inline**: 1 pregunta conceptual

---

### Leccion 3.5 — Paso 6b: Remediciones en OCI (ganancias y perdidas actuariales)
**Conocimiento base Deloitte**: Lineas 1288-1377
- **Que son supuestos actuariales** (lineas 1300-1312):
  - Mejor estimacion de las variables que determinan el costo final
  - Demograficos: mortalidad, rotacion, discapacidad
  - Financieros: tasa de descuento, salarios futuros, costos medicos
- **Ganancias y perdidas actuariales**: resultado de cambios en supuestos o ajustes por experiencia (lineas 1314-1325)
  - Causas: rotacion inesperada, retiro anticipado, cambios en mortalidad, cambios en tasa de descuento
- Todas las ganancias/perdidas actuariales se reconocen inmediatamente en OCI
- NUNCA se reclasifican a P&L en periodos posteriores (pueden transferirse dentro del patrimonio)
- **Calculo**: la ganancia/perdida actuarial es la cifra de cuadre en la tabla de movimientos de la obligacion

**Elemento interactivo**: Tabla interactiva de movimientos — el alumno completa la tabla paso a paso (saldo inicial -> interes -> contribuciones -> beneficios pagados -> service cost -> ??? = remedicion) y el sistema calcula la cifra de cuadre
**Quiz inline**: 2 preguntas — fuentes de ganancias/perdidas actuariales + calculo

---

### Leccion 3.6 — Contribuciones de empleados a planes DB
**Conocimiento base Deloitte**: Lineas 1381-1420
- Algunos planes requieren que empleados o terceros contribuyan
- Clasificacion del tratamiento:
  - **Vinculadas al servicio, dependientes de anos**: atribuir usando metodo de atribucion (formula del plan o linea recta)
  - **Vinculadas al servicio, independientes de anos**: reduccion del costo del servicio en el periodo
  - **No vinculadas al servicio**: afectan remediciones del pasivo neto DB
  - **Discrecionales**: reducen costo del servicio al momento del pago

**Elemento interactivo**: Arbol de decision interactivo — el alumno responde preguntas si/no y llega al tratamiento correcto
**Quiz inline**: 2 preguntas de clasificacion

---

### Leccion 3.7 — Ejemplo integral: tabla completa de movimientos DB
**Conocimiento base Deloitte**: Lineas 1486-1997 (la mecanica, no los datos)
- Ejercicio guiado paso a paso donde el alumno construye UNA tabla completa de movimientos
- Datos 100% originales (empresa mexicana ficticia)
- El alumno completa:
  1. Saldo inicial (PV obligacion y FV activos)
  2. Interes neto (calculo con tasa de descuento)
  3. Contribuciones pagadas
  4. Beneficios pagados
  5. Costo del servicio actual
  6. Remediciones (cifra de cuadre)
  7. Saldo final
- Cada paso genera el asiento contable correspondiente
- Al final: resumen completo de lo reconocido en balance, P&L y OCI

**Elemento interactivo**: Simulador de tabla de movimientos DB completo — inputs editables, calculos en tiempo real, asientos contables generados automaticamente, desglose visual P&L vs OCI
**Quiz inline**: integrado en el simulador (el alumno debe completar cada celda correctamente para avanzar)

---

### CHALLENGE NIVEL 3
- 8 preguntas de evaluacion
- Enfocadas en: asientos contables, calculo de interes neto, remediciones, tabla de movimientos
- Aprobacion: 75% (6/8)
- Al aprobar: se desbloquea Nivel 4

---
---

# NIVEL 4: CASOS COMPLEJOS
### "Que pasa cuando se complica?"

**Objetivo del nivel**: El alumno domina otros beneficios a largo plazo y beneficios por terminacion — reconocimiento, medicion, y las diferencias clave con planes DB post-empleo.

---

### Leccion 4.1 — Otros beneficios a largo plazo: reconocimiento y medicion
**Conocimiento base Deloitte**: Lineas 2075-2107
- Diferencias clave vs planes DB post-empleo:
  - La medicion involucra MENOS incertidumbre
  - Las remediciones NO se reconocen en OCI — van directamente a P&L
- **Balance**: PV de la obligacion DB - FV de activos del plan
- **P&L**: Costo del servicio + Interes neto + Remediciones (todo a P&L)
- Comparacion directa: DB post-empleo (remediciones a OCI) vs otros largo plazo (remediciones a P&L)

**Elemento interactivo**: Tabla comparativa interactiva — DB post-empleo vs otros beneficios a largo plazo (donde va cada componente)
**Quiz inline**: 2 preguntas de comparacion

---

### Leccion 4.2 — Otros beneficios a largo plazo: costo del servicio pasado
**Conocimiento base Deloitte**: Lineas 2109-2138
- Cuando se mejora un beneficio a largo plazo existente, surge un costo del servicio pasado
- Todo el costo del servicio pasado para otros beneficios a largo plazo se reconoce en P&L INMEDIATAMENTE
- No hay distribucion en periodos futuros — impacto completo en el periodo de la modificacion

**Elemento interactivo**: Simulador — el alumno modifica un plan de bonos por aniversario y ve el impacto inmediato en P&L (inputs: beneficio original, beneficio nuevo, empleados por antiguedad -> calcula past service cost)
**Quiz inline**: 1 pregunta con calculo

---

### Leccion 4.3 — Beneficios por terminacion: definicion y formas
**Conocimiento base Deloitte**: Lineas 2141-2158
- Definicion: pagaderos como resultado de:
  - Decision de la entidad de terminar el empleo ANTES de la fecha normal de retiro, O
  - Decision del empleado de aceptar redundancia voluntaria
- Formas tipicas:
  - Pagos unicos (lump sum)
  - Mejora de beneficios post-empleo (directa o indirectamente)
  - Salario hasta el final de un periodo de aviso si no se presta mas servicio
- Distincion critica: la FORMA del beneficio no determina si es terminacion — lo determina la RAZON (por servicio vs por terminacion)

**Elemento interactivo**: Casos de clasificacion — el alumno lee escenarios y decide: es beneficio por terminacion o post-empleo?
**Quiz inline**: 2 preguntas de clasificacion

---

### Leccion 4.4 — Beneficios por terminacion: reconocimiento
**Conocimiento base Deloitte**: Lineas 2199-2228
- Se reconoce pasivo y gasto al PRIMERO de:
  - Cuando la entidad ya no puede retirar la oferta, O
  - Cuando reconoce costos de reestructuracion (IAS 37) que involucran beneficios por terminacion
- **Cuando la entidad ya no puede retirar la oferta**:
  - Redundancia voluntaria: cuando el empleado acepta la oferta (o cuando una restriccion toma efecto)
  - Terminacion por decision de la entidad: cuando ha comunicado un plan que cumple TODOS estos criterios:
    1. Acciones requeridas indican que es improbable que haya cambios significativos
    2. Identifica numero de empleados, clasificaciones/funciones, y ubicaciones
    3. Establece los beneficios con suficiente detalle para que los empleados determinen tipo y monto

**Elemento interactivo**: Checklist interactivo de los 3 criterios — el alumno evalua un memo de redundancia y marca si cada criterio se cumple
**Quiz inline**: 2 preguntas sobre criterios de reconocimiento

---

### CHALLENGE NIVEL 4
- 6 preguntas de evaluacion
- Enfocadas en: otros largo plazo vs DB, past service cost, clasificacion de terminacion, criterios de reconocimiento
- Aprobacion: 75% (5/6)
- Al aprobar: se desbloquea Nivel 5

---
---

# NIVEL 5: MAESTRIA
### "Dominio total + certificacion"

**Objetivo del nivel**: Evaluacion integral de todos los niveles. El alumno demuestra dominio completo de IAS 19.

---

### Leccion 5.1 — Repaso express: mapa conceptual completo
- Resumen visual de todo IAS 19 en un solo diagrama interactivo
- El alumno puede navegar por cada concepto y ver su definicion, tratamiento contable, y ejemplo rapido
- Sirve como referencia rapida y herramienta de estudio

**Elemento interactivo**: Mapa mental interactivo expandible — IAS 19 completo en una sola vista

---

### EVALUACION FINAL
**Base de conocimiento**: Todo el contenido de los Niveles 1-5
**Referencia Deloitte para nivel de dificultad**: Lineas 2450-3126 (16 preguntas del assessment original — usamos el NIVEL de dificultad como referencia, NO las preguntas)

- **20 preguntas** (mas que las 16 originales para mayor cobertura)
- **Distribucion**:
  - 4 preguntas de Nivel 1 (fundamentos, clasificacion, DC)
  - 4 preguntas de Nivel 2 (medicion, PUC, pasivo neto DB)
  - 6 preguntas de Nivel 3 (asientos contables, interes neto, remediciones, tabla de movimientos)
  - 4 preguntas de Nivel 4 (otros largo plazo, terminacion)
  - 2 preguntas integradoras (mezclan conceptos de multiples niveles)
- **Tipos de pregunta**:
  - Multiple choice
  - Calculo con input numerico
  - Clasificacion (drag & drop)
  - Verdadero/Falso con justificacion
- **Aprobacion**: 75% (15/20)
- **Al aprobar**: Certificado de completacion Dafel Technologies

---
---

# ESPECIFICACIONES TECNICAS

## Navegacion del curso
```
/recursos/ias-19-employee-benefits              -> Landing (overview + niveles)
/recursos/ias-19-employee-benefits/nivel-1       -> Nivel 1 (todas las lecciones en scroll)
/recursos/ias-19-employee-benefits/nivel-2       -> Nivel 2
/recursos/ias-19-employee-benefits/nivel-3       -> Nivel 3
/recursos/ias-19-employee-benefits/nivel-4       -> Nivel 4
/recursos/ias-19-employee-benefits/nivel-5       -> Nivel 5 (repaso + evaluacion final)
```

## Componentes interactivos a construir
| Componente | Uso | Niveles |
|---|---|---|
| QuizInline | Preguntas multiple choice dentro del contenido | 1-5 |
| DragDropClassifier | Arrastrar items a categorias | 1, 3, 4 |
| NumericCalculator | Input numerico con validacion y feedback | 1, 2, 3, 4 |
| JournalEntryBuilder | Armar asientos contables (drag & drop debitos/creditos) | 1, 3 |
| MovementTableSimulator | Tabla interactiva de movimientos DB | 3 |
| ComparisonTable | Tabla comparativa lado a lado | 2, 4 |
| DecisionTree | Arbol de decision interactivo (si/no) | 3 |
| ProgressTracker | Barra de progreso por nivel + general | Todos |
| ConceptMap | Mapa mental expandible | 5 |

## Estado del progreso (client-side)
- Guardado en localStorage (sitio estatico, sin backend)
- Tracking de: lecciones completadas, quizzes aprobados, challenges desbloqueados
- Posibilidad futura: sincronizacion con backend

## Stack tecnico
- Next.js 14 (App Router, static export)
- Tailwind CSS
- Framer Motion (animaciones)
- React state para interactividad (useState, useReducer)
- localStorage para persistencia de progreso

---

# MAPEO COMPLETO: CONOCIMIENTO DELOITTE -> CURSO DAFEL

| Concepto | Deloitte (lineas) | Curso Dafel (leccion) |
|---|---|---|
| Que es IAS 19, objetivo, alcance | 69-114 | 1.1 |
| Contexto post-empleo (tasas bajas, fondos insuficientes) | 117-126 | 1.1 |
| Beneficios a corto plazo (definicion, tratamiento) | 195-282 | 1.2, 1.3 |
| Ausencias compensadas (acumulables vs no acumulables) | 222-270 | 1.3 |
| Bonos y participacion de utilidades (corto plazo) | 274-282 | 1.3 |
| Beneficios post-empleo (definicion, ejemplos) | 285-314 | 1.2 |
| Otros beneficios a largo plazo (definicion, ejemplos) | 316-329 | 1.2 |
| Planes DC vs DB (definicion, comparacion) | 332-381 | 1.4 |
| Multi-empleador, estatales, asegurados | 386-433 | 1.4 |
| Clasificacion practica de planes | 436-460 | 1.4 (quiz) |
| Contabilizacion de planes DC | 475-527, 757-812 | 1.5 |
| Clasificacion de beneficios (short-term vs otros) | 546-582 | 1.2 (quiz) |
| Calculo de vacaciones acumuladas | 586-638 | 1.3 (simulador) |
| Clasificacion de beneficios A-F | 660-720 | 1.4 (quiz) |
| DC vs DB: caracteristicas clave | 724-753 | 1.4 (quiz) |
| Enfoque de 6 pasos para DB | 909-927 | 2.1 |
| Paso 1: Atribucion de beneficios | 928-973 | 2.2 |
| Paso 2: PUC Method (descuento) | 984-995 | 2.3 |
| Paso 3: Valor razonable de activos | 990-995 | 2.4 |
| Paso 4: Pasivo (activo) neto DB | 998-1006 | 2.5 |
| Paso 5: Montos en P&L | 1008-1050 | 3.2, 3.3 |
| Current service cost | 1016-1021, 1196-1236 | 3.2 |
| Past service cost y settlements | 1022-1038 | 3.2, 4.2 |
| Net interest | 1040-1050, 1240-1273 | 3.3 |
| Tasa de descuento (determinacion) | 1256-1273 | 3.3 |
| Paso 6: Remediciones en OCI | 1052-1075 | 3.5 |
| Ganancias/perdidas actuariales | 1062-1064, 1288-1377 | 3.5 |
| Retorno de activos del plan | 1066-1068, 1276-1286 | 3.4 |
| Review: 6 pasos completos | 1078-1116 | 2.1 (quiz) |
| Calculo de pasivo/activo neto DB | 1119-1161 | 2.5 (quiz) |
| Contribuciones y beneficios pagados (asientos) | 1166-1193 | 3.1 |
| Net interest (calculo detallado) | 1240-1273 | 3.3 |
| Contribuciones de empleados a DB | 1381-1420 | 3.6 |
| Ejemplo integral DB (tabla de movimientos) | 1486-1997 | 3.7 (mecanica) |
| Otros beneficios largo plazo (reconocimiento) | 2075-2107 | 4.1 |
| Past service cost para otros largo plazo | 2109-2138 | 4.2 |
| Beneficios por terminacion (definicion, formas) | 2141-2158 | 4.3 |
| Terminacion: identificacion | 2161-2195 | 4.3 (quiz) |
| Terminacion: tratamiento contable | 2199-2228 | 4.4 |
| Terminacion: criterios de reconocimiento | 2213-2228, 2367-2403 | 4.4 |
| Evaluacion final (nivel de dificultad) | 2450-3126 | 5 (evaluacion) |
