const AsistenciaFallida = ({ message, onVolver }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 to-red-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        {/* Icono de error */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Asistencia No Registrada
        </h1>
        <p className="text-gray-600 mb-8">
          {message || 'No se pudo registrar tu asistencia'}
        </p>

        {/* Razones comunes */}
        <div className="bg-red-50 rounded-lg p-6 text-left mb-8">
          <h3 className="font-semibold text-red-800 mb-3">Posibles razones:</h3>
          <ul className="space-y-2 text-sm text-red-700">
            <li>• No tienes clase en este salón ahora</li>
            <li>• El horario no coincide</li>
            <li>• Token QR expirado o inválido</li>
          </ul>
        </div>

        <button
          onClick={onVolver}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Volver a intentar
        </button>
      </div>
    </div>
  );
};

export default AsistenciaFallida;