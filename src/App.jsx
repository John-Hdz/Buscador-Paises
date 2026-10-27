import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import CountryModal from './components/CountryModal';

const COUNTRIES_PER_PAGE = 12;

export default function App() {
  const [session, setSession] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCountries, setTotalCountries] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchCountries();
    }
  }, [session, currentPage, searchTerm, regionFilter]);

  const fetchCountries = async () => {
    setLoading(true);
    const from = (currentPage - 1) * COUNTRIES_PER_PAGE;
    const to = from + COUNTRIES_PER_PAGE - 1;

    let query = supabase.from('countries').select('*', { count: 'exact' });

    if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);
    if (regionFilter) query = query.eq('region', regionFilter);

    const { data, count, error } = await query.order('name').range(from, to);

    if (!error) {
      setCountries(data || []);
      setTotalCountries(count || 0);
    }
    setLoading(false);
  };

  const totalPages = Math.ceil(totalCountries / COUNTRIES_PER_PAGE);

  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar y Filtros */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <h1 className="text-2xl font-extrabold text-blue-600 flex items-center gap-2">
            <span>🌍</span> Catálogo de Países
          </h1>
          
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="text"
              placeholder="Buscar país..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <select
              value={regionFilter}
              onChange={(e) => { setRegionFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Todas las regiones</option>
              <option value="Africa">África</option>
              <option value="Americas">América</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europa</option>
              <option value="Oceania">Oceanía</option>
            </select>
            <button onClick={() => supabase.auth.signOut()} className="px-4 py-2 text-sm text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition font-medium">
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Grid de Países */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-500 mb-6 font-medium">Mostrando {totalCountries} resultados de tu base de datos</p>

        {loading ? (
          <div className="text-center py-20 text-blue-600 font-bold text-xl">Cargando...</div>
        ) : countries.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">No se encontraron países con esos filtros.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {countries.map((country) => (
              <div
                key={country.cca3}
                onClick={() => setSelectedCountry(country)}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transition duration-200 transform hover:-translate-y-1"
              >
                <img src={country.flag_url} alt={country.name} className="w-full h-40 object-cover border-b border-gray-100" />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 truncate mb-1">{country.name}</h3>
                  <p className="text-sm text-gray-500">{country.region}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginador */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium"
            >
              Anterior
            </button>
            <span className="text-gray-600 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium"
            >
              Siguiente
            </button>
          </div>
        )}
      </main>

      <CountryModal country={selectedCountry} onClose={() => setSelectedCountry(null)} />
    </div>
  );
}