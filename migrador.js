import { createClient } from '@supabase/supabase-js';

// Leer variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const apiKey = process.env.REST_COUNTRIES_API_KEY;

if (!supabaseUrl || !supabaseKey || !apiKey) {
  console.error('❌ Error: Faltan variables de entorno en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrarPaises() {
  console.log('🚀 Iniciando la transferencia de datos desde REST Countries v5 a Supabase...');
  
  try {
    // Endpoint oficial de v5 para obtener los países
    const response = await fetch('https://api.restcountries.com/countries/v5', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const json = await response.json();

    // Extraer el listado según la estructura de la API v5
    let countriesList = [];
    if (Array.isArray(json)) {
      countriesList = json;
    } else if (Array.isArray(json.data)) {
      countriesList = json.data;
    } else if (json.data && Array.isArray(json.data.objects)) {
      countriesList = json.data.objects;
    } else if (Array.isArray(json.results)) {
      countriesList = json.results;
    }

    if (!countriesList || countriesList.length === 0) {
      console.error(`❌ Error en la respuesta de la API:`, json);
      return;
    }

    console.log(`📥 Se recibieron ${countriesList.length} países. Formateando datos...`);

    // Mapeo adaptado a los campos de v5 y fallback a esquemas antiguos
    const countriesToInsert = countriesList.map((country) => {
      // Nombre
      const name = country.names?.common || country.name?.common || (typeof country.name === 'string' ? country.name : 'Desconocido');
      
      // Código de 3 letras (cca3)
      const cca3 = country.codes?.alpha_3 || country.cca3 || country.codes?.alpha_2 || country.cca2;
      
      // Región
      const region = country.region || country.geography?.region || 'Desconocida';
      
      // Bandera (URL de imagen)
      const flagUrl = country.flag?.url_png || country.flag?.png || country.flags?.png || country.flags?.svg || null;
      
      // Población
      const population = country.population || country.demographics?.population || 0;
      
      // Capital
      let capital = 'Desconocida';
      if (Array.isArray(country.capitals) && country.capitals.length > 0) {
        capital = country.capitals[0]?.name || country.capitals[0];
      } else if (Array.isArray(country.capital) && country.capital.length > 0) {
        capital = country.capital[0];
      } else if (typeof country.capital === 'string') {
        capital = country.capital;
      }

      return {
        cca3: cca3,
        name: name,
        region: region,
        flag_url: flagUrl,
        population: population,
        capital: capital,
      };
    }).filter(c => c.cca3); // Filtrar registros sin código válido

    console.log(`💾 Guardando ${countriesToInsert.length} países en Supabase...`);

    const { error } = await supabase
      .from('countries')
      .upsert(countriesToInsert, { onConflict: 'cca3' });

    if (error) {
      console.error(`❌ Error al insertar en Supabase:`, error.message);
    } else {
      console.log(`✅ ¡Migración completada con éxito! ${countriesToInsert.length} países guardados en tu base de datos.`);
    }

  } catch (err) {
    console.error(`❌ Error inesperado:`, err);
  }
}

migrarPaises();