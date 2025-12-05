import { useState } from 'react';
import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, X } from 'lucide-react';

const PanelAsistencias = ({ estudiante, asistencias, onCerrarSesion }) => {
  const [filtro, setFiltro] = useState('todas');
  const [mesActual, setMesActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const asistenciasFiltradas = asistencias.filter((asistencia) => {
    if (filtro === 'exitosas') return asistencia.validacion_exitosa;
    if (filtro === 'fallidas') return !asistencia.validacion_exitosa;
    return true;
  });

  // Agrupar asistencias por día (SIN DUPLICADOS - solo cuenta el día)
  const agruparPorDia = (asistencias) => {
    const grupos = {};
    asistencias.forEach((asistencia) => {
      const fecha = new Date(asistencia.fecha_hora_registro);
      const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
      if (!grupos[key]) {
        grupos[key] = {
          fecha: fecha,
          asistencias: [],
          exitosas: 0,
          fallidas: 0,
          total: 0
        };
      }
      grupos[key].asistencias.push(asistencia);
      grupos[key].total++;
      if (asistencia.validacion_exitosa) {
        grupos[key].exitosas++;
      } else {
        grupos[key].fallidas++;
      }
    });
    return grupos;
  };

  const asistenciasPorDia = agruparPorDia(asistenciasFiltradas);

  // Generar calendario
  const generarCalendario = () => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    
    const diasPrevios = primerDia.getDay();
    const diasMes = ultimoDia.getDate();
    
    const dias = [];
    
    for (let i = diasPrevios - 1; i >= 0; i--) {
      const fecha = new Date(año, mes, -i);
      dias.push({ fecha, esOtroMes: true });
    }
    
    for (let dia = 1; dia <= diasMes; dia++) {
      const fecha = new Date(año, mes, dia);
      dias.push({ fecha, esOtroMes: false });
    }
    
    const diasRestantes = 42 - dias.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const fecha = new Date(año, mes + 1, dia);
      dias.push({ fecha, esOtroMes: true });
    }
    
    return dias;
  };

  const cambiarMes = (direccion) => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + direccion, 1));
  };

  const obtenerAsistenciasDia = (fecha) => {
    const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
    return asistenciasPorDia[key];
  };

  const abrirDetallesDia = (fecha, asistenciasDia) => {
    if (asistenciasDia) {
      setDiaSeleccionado({ fecha, asistenciasDia });
      setModalAbierto(true);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearFechaCorta = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const calendario = generarCalendario();

  // Ordenar asistencias por fecha (más reciente primero)
  const asistenciasOrdenadas = [...asistenciasFiltradas].sort((a, b) => 
    new Date(b.fecha_hora_registro) - new Date(a.fecha_hora_registro)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Control de Asistencias
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {estudiante?.nombre || estudiante?.persona || 'Estudiante'} • {estudiante?.email || ''}
              </p>
            </div>
            <button
              onClick={onCerrarSesion}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registros</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{asistencias.length}</p>
              </div>
              <Calendar className="text-blue-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Exitosas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {asistencias.filter((a) => a.validacion_exitosa).length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Fallidas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {asistencias.filter((a) => !a.validacion_exitosa).length}
                </p>
              </div>
              <XCircle className="text-red-500" size={24} />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('todas')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'todas'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltro('exitosas')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'exitosas'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Exitosas
            </button>
            <button
              onClick={() => setFiltro('fallidas')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'fallidas'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fallidas
            </button>
          </div>
        </div>

        {/* Calendario */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Header del calendario */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => cambiarMes(-1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                ← Anterior
              </button>
              <button
                onClick={() => cambiarMes(1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                Siguiente →
              </button>
            </div>
          </div>

          {/* Grid del calendario */}
          <div className="grid grid-cols-7 gap-2">
            {/* Headers días de la semana */}
            {diasSemana.map((dia) => (
              <div
                key={dia}
                className="text-center font-semibold text-gray-600 py-2 text-sm"
              >
                {dia}
              </div>
            ))}

            {/* Días del calendario */}
            {calendario.map((dia, index) => {
              const asistenciasDia = obtenerAsistenciasDia(dia.fecha);
              const tieneAsistencias = asistenciasDia && asistenciasDia.asistencias.length > 0;
              const esHoy = new Date().toDateString() === dia.fecha.toDateString();
              const todoExitosas = tieneAsistencias && asistenciasDia.fallidas === 0;
              const todasFallidas = tieneAsistencias && asistenciasDia.exitosas === 0;

              return (
                <div
                  key={index}
                  onClick={() => abrirDetallesDia(dia.fecha, asistenciasDia)}
                  className={`min-h-20 p-2 rounded-lg border transition relative ${
                    dia.esOtroMes
                      ? 'bg-gray-50 border-gray-200 text-gray-400'
                      : 'bg-white border-gray-200 text-gray-900'
                  } ${esHoy ? 'ring-2 ring-blue-500 border-blue-500' : ''} ${
                    tieneAsistencias ? 'cursor-pointer hover:shadow-md hover:border-blue-300' : ''
                  }`}
                >
                  <div className={`text-sm font-semibold ${esHoy ? 'text-blue-600' : ''}`}>
                    {dia.fecha.getDate()}
                  </div>
                  
                  {tieneAsistencias && (
                    <div className="mt-1">
                      {/* Indicador único por día */}
                      <div
                        className={`text-xs font-bold px-2 py-1 rounded-full text-center ${
                          todoExitosas
                            ? 'bg-green-100 text-green-700'
                            : todasFallidas
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {asistenciasDia.total} {asistenciasDia.total === 1 ? 'registro' : 'registros'}
                      </div>
                      
                      {/* Mini indicadores */}
                      {!todoExitosas && !todasFallidas && (
                        <div className="flex gap-1 mt-1 justify-center">
                          {asistenciasDia.exitosas > 0 && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                          {asistenciasDia.fallidas > 0 && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Catálogo de Asistencias */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Historial de Asistencias
          </h2>
          
          <div className="space-y-3">
            {asistenciasOrdenadas.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No hay asistencias registradas</p>
              </div>
            ) : (
              asistenciasOrdenadas.map((asistencia) => (
                <div
                  key={asistencia.id}
                  className={`rounded-lg p-4 border-l-4 ${
                    asistencia.validacion_exitosa
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {asistencia.horarios?.nombre_materia || 'Sin materia'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>Salón: {asistencia.horarios?.salones?.clave_salon || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>Docente: {asistencia.horarios?.docente || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{formatearFecha(asistencia.fecha_hora_registro)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {asistencia.validacion_exitosa ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                          <CheckCircle size={14} />
                          Registrada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
                          <XCircle size={14} />
                          No válida
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalles del día */}
      {modalAbierto && diaSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Asistencias del día
                </h3>
                <p className="text-sm text-gray-600 mt-1 capitalize">
                  {formatearFechaCorta(diaSeleccionado.fecha)}
                </p>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {diaSeleccionado.asistenciasDia.asistencias.map((asistencia) => (
                  <div
                    key={asistencia.id}
                    className={`rounded-lg p-4 border ${
                      asistencia.validacion_exitosa
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {asistencia.horarios?.nombre_materia || 'Sin materia'}
                      </h4>
                      {asistencia.validacion_exitosa ? (
                        <CheckCircle className="text-green-600" size={20} />
                      ) : (
                        <XCircle className="text-red-600" size={20} />
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>Salón: {asistencia.horarios?.salones?.clave_salon || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>Docente: {asistencia.horarios?.docente || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{formatearFecha(asistencia.fecha_hora_registro)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelAsistencias;