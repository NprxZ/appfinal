const AsistenciaExitosa = ({ data, onVolver }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        {/* Icono de éxito */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Asistencia Registrada!
        </h1>
        <p className="text-gray-600 mb-8">
          Tu asistencia se ha registrado correctamente
        </p>

        {/* Detalles */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-left mb-8">
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Alumno:</span>
            <span className="text-gray-800 font-semibold">{data.alumno}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Materia:</span>
            <span className="text-gray-800 font-semibold">{data.materia}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Salón:</span>
            <span className="text-gray-800 font-semibold">{data.salon}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Hora:</span>
            <span className="text-gray-800 font-semibold">{data.hora}</span>
          </div>
        </div>

        <button
          onClick={onVolver}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default AsistenciaExitosa;