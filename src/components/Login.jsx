import React from 'react';
import { supabase } from '../supabaseClient';

export default function Login() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🌍
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Buscador de Países</h1>
        <p className="text-gray-500 mb-8">
          Explora el mundo a través de nuestra base de datos. Inicia sesión para continuar.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md"
        >
          Continuar con GitHub
        </button>
      </div>
    </div>
  );
}