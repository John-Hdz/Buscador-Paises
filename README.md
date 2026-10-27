# Buscador de Países

Aplicación web interactiva para la consulta y filtrado de información geográfica global, desarrollada con React, Vite y Supabase. El sistema implementa un patrón de arquitectura desacoplada que separa la recolección de datos desde una API externa del consumo en la interfaz de usuario.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Arquitectura de Software](#arquitectura-de-software)
- [Stack Tecnológico](#stack-tecnológico)
- [Modelo de Datos](#modelo-de-datos)
- [Instalación y Configuración](#instalación-y-configuración)
  - [Prerrequisitos](#prerrequisitos)
  - [Variables de Entorno](#variables-de-entorno)
  - [Base de Datos y Seguridad (RLS)](#base-de-datos-y-seguridad-rls)
  - [Proceso de Carga de Datos (ETL)](#proceso-de-carga-de-datos-etl)
  - [Servidor de Desarrollo](#servidor-de-desarrollo)

---

## Descripción General

El proyecto ofrece un catálogo estructurado para explorar información detallada de países. Cumple de manera estricta con los requerimientos de arquitectura donde la interfaz del cliente no realiza solicitudes directas a servicios de terceros, utilizando Supabase como única fuente de datos para consultas, búsquedas y filtros.

---

## Características Principales

- **Autenticación OAuth:** Control de acceso mediante el proveedor de identidad GitHub utilizando Supabase Auth.
- **Filtro Multinivel en Servidor:** Capacidad de búsqueda por nombre e inserción de filtros por región geográfica directamente en las consultas a la base de datos.
- **Paginación Nativa:** Segmentación de resultados basada en límites de rango (`range`) para optimizar el rendimiento en pantalla.
- **Diseño tipo Catálogo:** Interfaz limpia y adaptativa construida con Tailwind CSS v4, que incluye vista en cuadrícula y ventana modal para información detallada.

---

## Arquitectura de Software

La solución se compone de dos módulos principales:

1. **Pipeline de Carga (ETL / Backend):** Script ejecutado en Node.js que consume la API de REST Countries v5 utilizando autenticación Bearer token, transforma y valida las estructuras de datos y realiza operaciones de inserción/actualización (*upsert*) en PostgreSQL.
2. **Cliente Web (Frontend):** Aplicación SPA en React que gestiona el estado de la sesión y consulta exclusivamente la base de datos a través de `@supabase/supabase-js`.

---

## Stack Tecnológico

- **Frontend:** React, Vite, Tailwind CSS v4, React Router DOM
- **Backend & Almacenamiento:** Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Herramientas ETL:** Node.js, Fetch API
- **Fuente de Datos Externa:** REST Countries API (Versión 5)

---

## Modelo de Datos

Estructura de la tabla `countries` en Supabase:

| Campo | Tipo | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `cca3` | VARCHAR(3) | PRIMARY KEY | Código alfanumérico ISO de 3 letras |
| `name` | TEXT | NOT NULL | Nombre común del país |
| `region` | TEXT | NULLABLE | Región o continente |
| `flag_url` | TEXT | NULLABLE | Enlace a la imagen de la bandera nacional |
| `population` | BIGINT | NULLABLE | Cantidad total de habitantes |
| `capital` | TEXT | NULLABLE | Ciudad capital |

---

## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 20.6.0 o superior para el soporte de `--env-file`).
- Proyecto configurado en Supabase.
- Clave de API en REST Countries v5.

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del repositorio con los siguientes parámetros:

```env
VITE_SUPABASE_URL=[https://tu-proyecto.supabase.co](https://tu-proyecto.supabase.co)
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
REST_COUNTRIES_API_KEY=tu_api_key_de_rest_countries

```

### Base de Datos y Seguridad (RLS)

Ejecuta las siguientes sentencias en el **SQL Editor** de Supabase para generar el esquema e implementar las políticas de acceso:

```sql
CREATE TABLE countries (
    cca3 VARCHAR(3) PRIMARY KEY, 
    name TEXT NOT NULL,
    region TEXT,
    flag_url TEXT,
    population BIGINT,
    capital TEXT
);

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso total a countries" ON countries
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

```

### Proceso de Carga de Datos (ETL)

Para sincronizar la base de datos con la API externa, ejecuta el script de migración:

```bash
node --env-file=.env.local migrador.js

```

### Servidor de Desarrollo

1. Instala las dependencias del proyecto:
```bash
npm install

```


2. Inicia el entorno local de desarrollo:
```bash
npm run dev

```


3. Abre el navegador e ingresa a `http://localhost:5173`.

