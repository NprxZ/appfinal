import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, MapPin, User, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

// Funciones API
const validarAsistencia = async (email, password, token) => {
  const response = await fetch(`${API_URL}/validar-asistencia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, token }),
  });
  return response.json();
};

const consultarAsistencias = async (email, password) => {
  const response = await fetch(`${API_URL}/consultar-asistencias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// ============ COMPONENTE LOGIN MEJORADO ============
const Login = ({ onLogin, hasToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-700 to-teal-900 flex items-center justify-center p-4">
      {/* Formas decorativas sutiles */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-2">
            Sistema de Asistencias
          </h1>
          <p className="text-gray-600 font-medium">
            {hasToken ? 'Validar asistencia con QR' : 'Consultar mis asistencias'}
          </p>
        </div>

        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Institucional
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="l20031363@celaya.tecnm.mx"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Botón */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Validando...</span>
              </div>
            ) : (
              hasToken ? 'Registrar Asistencia' : 'Consultar Asistencias'
            )}
          </button>
        </div>

        {/* Alerta QR */}
        {hasToken && (
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-800">
                  Código QR detectado
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Ingresa tus credenciales para registrar tu asistencia
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            TEC de Celaya - Sistema Académico
          </p>
        </div>
      </div>
    </div>
  );
};


// ============ COMPONENTE ASISTENCIA EXITOSA ============
const AsistenciaExitosa = ({ data, onVolver }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Asistencia Registrada!</h1>
        <p className="text-gray-600 mb-8">Tu asistencia se ha registrado correctamente</p>

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

// ============ COMPONENTE ASISTENCIA FALLIDA ============
const AsistenciaFallida = ({ message, onVolver }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 to-red-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Asistencia No Registrada</h1>
        <p className="text-gray-600 mb-8">{message || 'No se pudo registrar tu asistencia'}</p>

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

  // Agrupar asistencias por día - ELIMINANDO DUPLICADOS
  const agruparPorDia = (asistencias) => {
    const grupos = {};
    asistencias.forEach((asistencia) => {
      const fecha = new Date(asistencia.fecha_hora_registro);
      const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
      
      if (!grupos[key]) {
        grupos[key] = {
          fecha: fecha,
          asistencias: [],
          tieneExitosa: false,
          tieneFallida: false,
          materias: new Set()
        };
      }
      
      const materiaClave = asistencia.horarios?.clave_materia || 'sin-materia';
      if (!grupos[key].materias.has(materiaClave)) {
        grupos[key].materias.add(materiaClave);
        grupos[key].asistencias.push(asistencia);
        
        if (asistencia.validacion_exitosa) {
          grupos[key].tieneExitosa = true;
        } else {
          grupos[key].tieneFallida = true;
        }
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

  // Ordenar asistencias por fecha (más reciente primero) - SIN DUPLICADOS
  const obtenerAsistenciasUnicas = () => {
    const materiasVistas = new Map();
    const resultado = [];
    
    const ordenadas = [...asistenciasFiltradas].sort((a, b) => 
      new Date(b.fecha_hora_registro) - new Date(a.fecha_hora_registro)
    );
    
    ordenadas.forEach(asistencia => {
      const fecha = new Date(asistencia.fecha_hora_registro).toDateString();
      const materiaClave = asistencia.horarios?.clave_materia || 'sin-materia';
      const key = `${fecha}-${materiaClave}`;
      
      if (!materiasVistas.has(key)) {
        materiasVistas.set(key, true);
        resultado.push(asistencia);
      }
    });
    
    return resultado;
  };

  const asistenciasUnicas = obtenerAsistenciasUnicas();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      {/* Header Moderno con Gradiente Verde TEC */}
      <div style={{
        background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
        boxShadow: '0 10px 40px rgba(10, 95, 56, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          content: '',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div className="max-w-7xl mx-auto px-6 py-6" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                marginBottom: '0.5rem'
              }}>
                <Calendar style={{ display: 'inline', marginRight: '0.75rem', marginBottom: '0.25rem' }} size={32} />
                Control de Asistencias
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                {estudiante?.nombre || estudiante?.persona || 'Estudiante'} • {estudiante?.email || ''}
              </p>
            </div>
            <button
              onClick={onCerrarSesion}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                borderRadius: '0.75rem',
                fontWeight: '600',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Estadísticas Modernas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            borderLeft: '4px solid #17a2b8',
            boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 5px 25px rgba(0,0,0,0.08)';
          }}>
            <div className="flex justify-between items-start">
              <div>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Total Registros
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#212529', lineHeight: '1' }}>
                  {asistencias.length}
                </p>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar style={{ color: 'white' }} size={28} />
              </div>
            </div>
            <div style={{
              height: '8px',
              background: '#e9ecef',
              borderRadius: '10px',
              overflow: 'hidden',
              marginTop: '1rem'
            }}>
              <div style={{
                height: '100%',
                width: '100%',
                background: 'linear-gradient(90deg, #17a2b8 0%, #138496 100%)',
                borderRadius: '10px'
              }} />
            </div>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            borderLeft: '4px solid #28a745',
            boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 5px 25px rgba(0,0,0,0.08)';
          }}>
            <div className="flex justify-between items-start">
              <div>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Exitosas
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#212529', lineHeight: '1' }}>
                  {asistencias.filter((a) => a.validacion_exitosa).length}
                </p>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle style={{ color: 'white' }} size={28} />
              </div>
            </div>
            <div style={{
              height: '8px',
              background: '#e9ecef',
              borderRadius: '10px',
              overflow: 'hidden',
              marginTop: '1rem'
            }}>
              <div style={{
                height: '100%',
                width: `${(asistencias.filter((a) => a.validacion_exitosa).length / asistencias.length) * 100}%`,
                background: 'linear-gradient(90deg, #28a745 0%, #20c997 100%)',
                borderRadius: '10px',
                transition: 'width 0.6s ease'
              }} />
            </div>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            borderLeft: '4px solid #dc3545',
            boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 5px 25px rgba(0,0,0,0.08)';
          }}>
            <div className="flex justify-between items-start">
              <div>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Fallidas
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#212529', lineHeight: '1' }}>
                  {asistencias.filter((a) => !a.validacion_exitosa).length}
                </p>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <XCircle style={{ color: 'white' }} size={28} />
              </div>
            </div>
            <div style={{
              height: '8px',
              background: '#e9ecef',
              borderRadius: '10px',
              overflow: 'hidden',
              marginTop: '1rem'
            }}>
              <div style={{
                height: '100%',
                width: `${(asistencias.filter((a) => !a.validacion_exitosa).length / asistencias.length) * 100}%`,
                background: 'linear-gradient(90deg, #dc3545 0%, #c82333 100%)',
                borderRadius: '10px',
                transition: 'width 0.6s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Filtros Modernos */}
        <div style={{
          background: 'white',
          borderRadius: '1.25rem',
          padding: '1.5rem',
          boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
          marginBottom: '1.5rem'
        }}>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setFiltro('todas')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                background: filtro === 'todas' 
                  ? 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
                  : '#f8f9fa',
                color: filtro === 'todas' ? 'white' : '#212529'
              }}
              onMouseOver={(e) => {
                if (filtro !== 'todas') {
                  e.target.style.background = '#e9ecef';
                }
              }}
              onMouseOut={(e) => {
                if (filtro !== 'todas') {
                  e.target.style.background = '#f8f9fa';
                }
              }}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltro('exitosas')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                background: filtro === 'exitosas'
                  ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                  : '#f8f9fa',
                color: filtro === 'exitosas' ? 'white' : '#212529'
              }}
              onMouseOver={(e) => {
                if (filtro !== 'exitosas') {
                  e.target.style.background = '#e9ecef';
                }
              }}
              onMouseOut={(e) => {
                if (filtro !== 'exitosas') {
                  e.target.style.background = '#f8f9fa';
                }
              }}
            >
              Exitosas
            </button>
            <button
              onClick={() => setFiltro('fallidas')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                background: filtro === 'fallidas'
                  ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                  : '#f8f9fa',
                color: filtro === 'fallidas' ? 'white' : '#212529'
              }}
              onMouseOver={(e) => {
                if (filtro !== 'fallidas') {
                  e.target.style.background = '#e9ecef';
                }
              }}
              onMouseOut={(e) => {
                if (filtro !== 'fallidas') {
                  e.target.style.background = '#f8f9fa';
                }
              }}
            >
              Fallidas
            </button>
          </div>
        </div>

        {/* Calendario Moderno */}
        <div style={{
          background: 'white',
          borderRadius: '1.25rem',
          padding: '2rem',
          boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
          marginBottom: '1.5rem'
        }}>
          {/* Header del calendario */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#212529',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Calendar style={{ color: '#0a5f38' }} size={28} />
              {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => cambiarMes(-1)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(10, 95, 56, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <ChevronLeft size={20} /> Anterior
              </button>
              <button
                onClick={() => cambiarMes(1)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(10, 95, 56, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Siguiente <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Grid del calendario */}
          <div className="grid grid-cols-7 gap-2">
            {/* Headers días de la semana */}
            {diasSemana.map((dia) => (
              <div
                key={dia}
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#0a5f38',
                  padding: '0.75rem',
                  fontSize: '0.9rem',
                  background: '#f8f9fa',
                  borderRadius: '0.5rem'
                }}
              >
                {dia}
              </div>
            ))}

            {/* Días del calendario */}
            {calendario.map((dia, index) => {
              const asistenciasDia = obtenerAsistenciasDia(dia.fecha);
              const tieneAsistencias = asistenciasDia && asistenciasDia.asistencias.length > 0;
              const esHoy = new Date().toDateString() === dia.fecha.toDateString();
              const soloExitosas = tieneAsistencias && asistenciasDia.tieneExitosa && !asistenciasDia.tieneFallida;
              const soloFallidas = tieneAsistencias && !asistenciasDia.tieneExitosa && asistenciasDia.tieneFallida;

              return (
                <div
                  key={index}
                  onClick={() => abrirDetallesDia(dia.fecha, asistenciasDia)}
                  style={{
                    minHeight: '80px',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: esHoy ? '2px solid #0a5f38' : '2px solid #e9ecef',
                    background: dia.esOtroMes ? '#f8f9fa' : 'white',
                    color: dia.esOtroMes ? '#6c757d' : '#212529',
                    cursor: tieneAsistencias ? 'pointer' : 'default',
                    transition: 'all 0.3s ease',
                    boxShadow: esHoy ? '0 5px 15px rgba(10, 95, 56, 0.2)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (tieneAsistencias) {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                      e.currentTarget.style.borderColor = '#0a5f38';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (tieneAsistencias) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = esHoy ? '0 5px 15px rgba(10, 95, 56, 0.2)' : 'none';
                      e.currentTarget.style.borderColor = esHoy ? '#0a5f38' : '#e9ecef';
                    }
                  }}
                >
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: esHoy ? '#0a5f38' : 'inherit',
                    marginBottom: '0.5rem'
                  }}>
                    {dia.fecha.getDate()}
                  </div>
                  
                  {tieneAsistencias && (
                    <div>
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        padding: '0.35rem 0.5rem',
                        borderRadius: '1rem',
                        textAlign: 'center',
                        background: soloExitosas
                          ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                          : soloFallidas
                          ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                          : 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
                        color: 'white'
                      }}>
                        {soloExitosas ? '✓' : soloFallidas ? '✗' : '⚠'}
                      </div>
                      
                      <div style={{
                        fontSize: '0.65rem',
                        textAlign: 'center',
                        color: '#6c757d',
                        marginTop: '0.25rem',
                        fontWeight: '500'
                      }}>
                        {asistenciasDia.materias.size} {asistenciasDia.materias.size === 1 ? 'clase' : 'clases'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Historial de Asistencias */}
        <div style={{
          background: 'white',
          borderRadius: '1.25rem',
          padding: '2rem',
          boxShadow: '0 5px 25px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#212529',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Clock style={{ color: '#0a5f38' }} size={28} />
            Historial de Asistencias
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {asistenciasUnicas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Calendar style={{ margin: '0 auto', color: '#e9ecef', marginBottom: '1rem' }} size={64} />
                <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>No hay asistencias registradas</p>
              </div>
            ) : (
              asistenciasUnicas.map((asistencia) => (
                <div
                  key={asistencia.id}
                  style={{
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    borderLeft: asistencia.validacion_exitosa ? '4px solid #28a745' : '4px solid #dc3545',
                    background: asistencia.validacion_exitosa 
                      ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.05) 0%, rgba(32, 201, 151, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(220, 53, 69, 0.05) 0%, rgba(200, 35, 51, 0.05) 100%)',
                    border: asistencia.validacion_exitosa ? '1px solid rgba(40, 167, 69, 0.2)' : '1px solid rgba(220, 53, 69, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = asistencia.validacion_exitosa 
                      ? '0 10px 30px rgba(40, 167, 69, 0.2)'
                      : '0 10px 30px rgba(220, 53, 69, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h3 style={{
                        fontWeight: '700',
                        color: '#212529',
                        marginBottom: '1rem',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {asistencia.validacion_exitosa ? (
                          <CheckCircle style={{ color: '#28a745' }} size={20} />
                        ) : (
                          <XCircle style={{ color: '#dc3545' }} size={20} />
                        )}
                        {asistencia.horarios?.nombre_materia || 'Sin materia'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '35px',
                            height: '35px',
                            background: '#f8f9fa',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <MapPin style={{ color: '#0a5f38' }} size={18} />
                          </div>
                          <span><strong>Salón:</strong> {asistencia.horarios?.salones?.clave_salon || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '35px',
                            height: '35px',
                            background: '#f8f9fa',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <User style={{ color: '#0a5f38' }} size={18} />
                          </div>
                          <span><strong>Docente:</strong> {asistencia.horarios?.docente || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '35px',
                            height: '35px',
                            background: '#f8f9fa',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Clock style={{ color: '#0a5f38' }} size={18} />
                          </div>
                          <span>{formatearFecha(asistencia.fecha_hora_registro)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {asistencia.validacion_exitosa ? (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.25rem',
                          borderRadius: '2rem',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                          color: 'white',
                          boxShadow: '0 5px 15px rgba(40, 167, 69, 0.3)'
                        }}>
                          <CheckCircle size={16} />
                          Registrada
                        </div>
                      ) : (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.25rem',
                          borderRadius: '2rem',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                          color: 'white',
                          boxShadow: '0 5px 15px rgba(220, 53, 69, 0.3)'
                        }}>
                          <XCircle size={16} />
                          No válida
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalles del día - Estilo TEC */}
      {modalAbierto && diaSeleccionado && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 50,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1.25rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '85vh',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                content: '',
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  marginBottom: '0.5rem'
                }}>
                  Asistencias del día
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {formatearFechaCorta(diaSeleccionado.fecha)}
                </p>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  zIndex: 1
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'rotate(90deg)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'rotate(0deg)';
                }}
              >
                <X style={{ color: 'white' }} size={24} />
              </button>
            </div>
            
            <div style={{
              padding: '2rem',
              overflowY: 'auto',
              maxHeight: 'calc(85vh - 140px)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {diaSeleccionado.asistenciasDia.asistencias.map((asistencia) => (
                  <div
                    key={asistencia.id}
                    style={{
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      border: asistencia.validacion_exitosa ? '2px solid #28a745' : '2px solid #dc3545',
                      background: asistencia.validacion_exitosa
                        ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.08) 0%, rgba(32, 201, 151, 0.08) 100%)'
                        : 'linear-gradient(135deg, rgba(220, 53, 69, 0.08) 0%, rgba(200, 35, 51, 0.08) 100%)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <h4 style={{
                        fontWeight: '700',
                        color: '#212529',
                        fontSize: '1.1rem',
                        flex: 1
                      }}>
                        {asistencia.horarios?.nombre_materia || 'Sin materia'}
                      </h4>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: asistencia.validacion_exitosa
                          ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                          : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: asistencia.validacion_exitosa
                          ? '0 5px 15px rgba(40, 167, 69, 0.3)'
                          : '0 5px 15px rgba(220, 53, 69, 0.3)'
                      }}>
                        {asistencia.validacion_exitosa ? (
                          <CheckCircle style={{ color: 'white' }} size={24} />
                        ) : (
                          <XCircle style={{ color: 'white' }} size={24} />
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#6c757d' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: '#f8f9fa',
                          borderRadius: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <MapPin style={{ color: '#0a5f38' }} size={18} />
                        </div>
                        <span><strong>Salón:</strong> {asistencia.horarios?.salones?.clave_salon || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: '#f8f9fa',
                          borderRadius: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <User style={{ color: '#0a5f38' }} size={18} />
                        </div>
                        <span><strong>Docente:</strong> {asistencia.horarios?.docente || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: '#f8f9fa',
                          borderRadius: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Clock style={{ color: '#0a5f38' }} size={18} />
                        </div>
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

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Datos de ejemplo para demostración
const datosEjemplo = {
  estudiante: {
    nombre: 'Juan Pérez García',
    persona: 'Juan Pérez García',
    email: 'juan.perez@tec.mx'
  },
  asistencias: [
    {
      id: 1,
      fecha_hora_registro: '2024-12-01T08:00:00',
      validacion_exitosa: true,
      horarios: {
        nombre_materia: 'Cálculo Diferencial',
        clave_materia: 'MAT101',
        docente: 'Dr. Roberto Martínez',
        salones: { clave_salon: 'A-301' }
      }
    },
    {
      id: 2,
      fecha_hora_registro: '2024-12-01T10:00:00',
      validacion_exitosa: true,
      horarios: {
        nombre_materia: 'Programación Avanzada',
        clave_materia: 'CSC201',
        docente: 'Ing. María López',
        salones: { clave_salon: 'B-105' }
      }
    },
    {
      id: 3,
      fecha_hora_registro: '2024-12-02T09:00:00',
      validacion_exitosa: false,
      horarios: {
        nombre_materia: 'Bases de Datos',
        clave_materia: 'CSC301',
        docente: 'Mtro. Carlos Ruiz',
        salones: { clave_salon: 'C-202' }
      }
    },
    {
      id: 4,
      fecha_hora_registro: '2024-12-03T14:00:00',
      validacion_exitosa: true,
      horarios: {
        nombre_materia: 'Ingeniería de Software',
        clave_materia: 'CSC401',
        docente: 'Dra. Ana Sánchez',
        salones: { clave_salon: 'A-405' }
      }
    },
    {
      id: 5,
      fecha_hora_registro: '2024-12-04T11:00:00',
      validacion_exitosa: true,
      horarios: {
        nombre_materia: 'Redes de Computadoras',
        clave_materia: 'CSC302',
        docente: 'Ing. Pedro Gómez',
        salones: { clave_salon: 'B-210' }
      }
    }
  ]
};



// ============ APP PRINCIPAL ============
function App() {
  const [vista, setVista] = useState('login');
  const [token, setToken] = useState(null);
  const [datosAsistencia, setDatosAsistencia] = useState(null);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenUrl = params.get('token');
    console.log('Token detectado en URL:', tokenUrl);
    if (tokenUrl) {
      setToken(tokenUrl);
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      console.log('Iniciando login con token:', token);
      
      if (token) {
        // FLUJO CON TOKEN: Validar y registrar asistencia
        console.log('Validando asistencia con token...');
        const response = await validarAsistencia(email, password, token);
        
        console.log('Respuesta validación:', response);

        if (response.success && response.registrada) {
          setDatosAsistencia(response.data);
          setVista('exitosa');
        } else {
          setErrorMensaje(response.message || 'No se pudo registrar la asistencia');
          setVista('fallida');
        }
      } else {
        // FLUJO SIN TOKEN: Consultar historial de asistencias
        console.log('Consultando asistencias...');
        const response = await consultarAsistencias(email, password);
        
        console.log('Respuesta consulta:', response);

        if (response.success) {
          setEstudiante(response.estudiante);
          setAsistencias(response.asistencias);
          setVista('panel');
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error.response?.data || { message: error.message || 'Error de conexión' };
    }
  };

  const handleVolver = () => {
    setVista('login');
    setDatosAsistencia(null);
    setErrorMensaje('');
    window.history.replaceState({}, document.title, window.location.pathname);
    setToken(null);
  };

  const handleCerrarSesion = () => {
    setVista('login');
    setEstudiante(null);
    setAsistencias([]);
  };

  return (
    <>
      {vista === 'login' && <Login onLogin={handleLogin} hasToken={!!token} />}
      {vista === 'exitosa' && <AsistenciaExitosa data={datosAsistencia} onVolver={handleVolver} />}
      {vista === 'fallida' && <AsistenciaFallida message={errorMensaje} onVolver={handleVolver} />}
      {vista === 'panel' && (
        <PanelAsistencias
          estudiante={estudiante}
          asistencias={asistencias}
          onCerrarSesion={handleCerrarSesion}
        />
      )}
    </>
  );
}

export default App;