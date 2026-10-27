import React from 'react';

export default function CountryModal({ country, onClose }) {
  if (!country) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold transition"
        >
          ✕
        </button>
        
        {country.flag_url ? (
          <img src={country.flag_url} alt={`Bandera de ${country.name}`} className="w-full h-56 object-cover border-b" />
        ) : (
          <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">Sin Bandera</div>
        )}

        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">{country.name}</h2>
          <p className="text-blue-600 font-semibold mb-4">{country.region}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="block text-xs text-gray-500 uppercase tracking-wider font-semibold">Capital</span>
              <span className="text-gray-800 font-medium">{country.capital}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="block text-xs text-gray-500 uppercase tracking-wider font-semibold">Población</span>
              <span className="text-gray-800 font-medium">{country.population.toLocaleString()}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
              <span className="block text-xs text-gray-500 uppercase tracking-wider font-semibold">Código ISO</span>
              <span className="text-gray-800 font-medium">{country.cca3}</span>
            </div>
          </div>
          
          <button onClick={onClose} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}