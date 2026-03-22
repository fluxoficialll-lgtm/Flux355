
import React from 'react';
import { AuthLayout } from '../Componentes/ComponentesDeAuth/AuthLayout';
import { HookRedefinirSenha } from '../hooks/Hook.Redefinir.Senha';

export const ResetPassword: React.FC = () => {
  const {
    password,
    setPassword,
    confirm,
    setConfirm,
    error,
    loading,
    handleSubmit,
    isValid
  } = HookRedefinirSenha();

  const inputClasses = "w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500";
  const labelClasses = "block mb-2 text-sm font-medium text-gray-400";

  return (
    <AuthLayout title="Redefinir Senha" subtitle="Crie uma nova senha">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className={labelClasses}>Nova Senha</label>
          <input 
            id="password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className={inputClasses}
          />
        </div>
        
        <div>
          <label htmlFor="confirm" className={labelClasses}>Confirmar Senha</label>
          <input
            id="confirm"
            type="password" 
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repita a nova senha"
            className={inputClasses}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center">
            {error}
          </div>
        )}

        <button type="submit" disabled={!isValid || loading} className="w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </form>
    </AuthLayout>
  );
};
