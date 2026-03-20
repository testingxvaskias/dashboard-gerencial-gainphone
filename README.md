# OmniServe Dashboard Ejecutivo - Analitica de Modelo

Este repositorio contiene el sistema de Dashboard Ejecutivo focalizado en la telemetria, rendimiento y metricas de datos sinteticos del Agente Virtual de Voz. Su diseno y logica han sido construidos para mantener un entorno independiente (arquitectura en aislamiento), compartiendo unicamente el motor de base de datos relacional con el dashboard operativo central.

## Arquitectura y Estructura

El sistema esta disenado bajo un enfoque de Single Page Application ampliado (SSR / RSC) a traves de **Next.js 15 (App Router)**. Utiliza fuertemente el procesamiento dinamico de servidor en la entrega de metricas actualizadas.

### Tecnologias Principales
- **Framework Frontend/Backend**: Next.js (React 19, Turbopack habilitado).
- **Estilos y Visualizacion**: Tailwind CSS v4 para utilidades atomicas, Lucide React para iconografia y Recharts para modelado de datos en 2D.
- **Capa de Persistencia y ORM**: Prisma Client v7 adaptado de forma directa al ecosistema de Better SQLite3 a traves del adapatador prisma-better-sqlite3 para conexiones a Disco/Archivo mas eficientes en Node.
- **Tipado**: TypeScript estricto.

### Estructura de Directorios

- `src/app/page.tsx`: Punto de entrada frontal del dashboard que orquesta la carga de toda la data sincronamente en el servidor antes de montar.
- `src/app/api/webhook/model-telemetry/route.ts`: Capa de servicio de Inbound HTTP para ingesta de datos proveniente del Agente de Inteligencia Artificial.
- `src/components/ModelDashboard.tsx`: Componente cliente React estructurador de las visiones metricas. Incluye la orquestacion de multiples tarjetas de datos y diagramas de barras interactivos en pantalla doble.
- `src/lib/model-data.ts`: Capa de agregacion y queries de Prisma ejecutados directamente contra el cluster de base de datos para obtener conteos y ratios.
- `prisma/schema.prisma`: Esquema general de datos para la instanciacion correcta de Prisma Client. Contiene el bloque de metadatos `ModelInteraction`.
- `seed-raw.js`: Script Node primitivo (sin ORM), especializado para repoblar la base de datos de forma acelerada usando SQLite puro y prevenir problemas de resolucion ESM durante el ciclo de integracion continua.

## Casos de Uso y Funcionalidad (Visuales)

El dashboard esta segmentado visualmente en flujos de lectura ejecutiva:

1. **Vision General en Tarjetas**: Reporta el volumen total de interacciones (historicas y diarias), logrando capturar inmediatamente Tasa de Contencion, Satisfaccion, Precision del Modelo de Intenciones, Nivel y Riesgo de Churn calculado, y Latencia Promedia del LLM interviniente.
2. **Distribucion Analitica (Graficos de Ejes)**: Descomposicion de Sentimiento (Negativo, Neutral, Positivo) ponderando calificaciones en barras de progresion asimetricas, acompanado del calculo "Score Promedio", junto al analisis logaritmico de Intenciones o Top Intents en ejes horizontales bidimensionales.
3. **Comparativo Multimodelo**: Interfaz analitica de evaluacion de A/B Testing o Migracion Model-Voice-v2 (Recomendado/Advanced) frente al Legacy Model-Voice-v1. Calcula volumen absoluto, ratios de share, latencia base y tokens de consumo medio.
4. **Modulo de Recomendaciones Estrategicas**: Reglas funcionales alertan sobre desbordes operacionales, oportunidades de upselling latentes o incidencias transaccionales recurrentes basadas en los picos estadisticos del volumen extraido.

## Conectividad de Datos y Fuente Comun

**Importante**: Este proyecto no sostiene informacion aislada en silos, lee informacion directa del almacén central, manteniendo su naturaleza Stateless.

El dashboard ejecuta en su entorno una lectura concurrente a una base relacional incrustada (a traves de la configuracion de `dotenv` conectando `DATABASE_URL` al endpoint SQLite `.db` del dashboard central hermano). Solo accesa lectura y escritura transaccional para la tabla o modelo `ModelInteraction`.

El modelo subyacente soporta variables y booleanos determinantes del exito del agente, como `sentiment_score`, `latency_ms` y resolucion `ai_precision`. Si el archivo SQLite no se localiza, el sistema presentara una pantalla de fallback en `page.tsx`.

## Webhook de Produccion y Telemetria

Para garantizar un ecosistema independiente que reaccione asincronamente al ecosistema de la Inteligencia Artificial del telefono, se creo un endpoint dedícado en produccion:

**Ruta API REST (Inbound):**
`POST /api/webhook/model-telemetry`

**Proposito:** Consumir una carga JSON que se dispara al culminar, asentar y procesar la transcripcion de cada consulta telefonica. El Agente de Voz o PBX de IA ejecuta un Post Request enviando los siguientes datos (payload estricto esperado):
- `model_version`: (String) Identificador de arquitectura de la red (ej. v2-Advanced).
- `intent`: (String) Resultado de calificacion NLP de proposito.
- `sentiment`: (String) Positivo, Neutral, o Negativo.
- `latency_ms`: (Integer) Tiempo de respuesta en loop del webhook del agente.
- `tokens_used`: (Integer) Total consumido en sesion.
- Booleanos opcionales de exito de operacion y analisis: `ai_precision`, `churn_risk`, `contained`, `satisfaction`.

El API genera seguridad por validacion basica de payload, ejecuta una transaccion atomic a `dev.db` usando `PrismaClient` y devuelve HTTP Status `201 Created` al Agente Voice indicando confirmacion de ingesta.

## Proceso de Instalacion y Ejecucion

1. Ejecute dependencias en entorno puro (Node v18+ requerido):
   `npm install`

2. Asegurar en ruta raiz el archivo de variable de entorno (`.env`):
   Sintaxis requerida para encontrar la base de datos es: `DATABASE_URL="file:RutaA/SuDestino/dev.db"`

3. Generacion de Meta-cliente ORM:
   `npx prisma generate`
   Nota: Al usar Prisma version mayor a 7, la construccion necesita acceso al modulo importable desde Typescript en Next. El sistema utiliza bypass ignorado en compilacion para acoplar la lectura dinamicamente.

4. Validacion Inicial del Diseno o Repoblacion (Opcional):
   Puede generar la carga pre-sintetica de datos (236 registros controlados que igualan el marco de validacion diseno) utilizando el driver compilador Javascript local de repoblacion en vez de depender de Prisma en semilla:
   `node seed-raw.js`

5. Levantamiento Produccion y Desarrollo:
   Desarrollo: `npm run dev` (Inicia servidor local port-forwarding estandar `localhost:3000`).
   Produccion: Ejecutar compilacion previa usando motor Turbopack mediante `npm run build` y servicio regular a traves de `npm start`.
