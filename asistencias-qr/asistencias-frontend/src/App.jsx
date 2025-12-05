import { useState, useEffect } from 'react';

// Importar componentes de alumnos (los que ya tienes)
import Login from './components/alumno/Login';
import AsistenciaExitosa from './components/alumno/AsistenciaExitosa';
import AsistenciaFallida from './components/alumno/AsistenciaFallida';
import PanelAsistencias from './components/alumno/PanelAsistenciasNuevo';

// Importar componentes de profesores (nuevos)
import LoginProfesor from './components/profesor/LoginProfesor';
import DashboardProfesor from './components/profesor/DashboardProfesor';

function App() {
  const [tipoUsuario, setTipoUsuario] = useState(null); // 'alumno' | 'profesor'
  const [vista, setVista] = useState('seleccion'); // seleccion | login | dashboard | etc
  const [token, setToken] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Estados para alumnos
  const [datosAsistencia, setDatosAsistencia] = useState(null);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenUrl = params.get('token');
    const tipo = params.get('tipo'); // ?tipo=profesor para login directo de profesor
    
    if (tokenUrl) {
      setToken(tokenUrl);
    }
    
    if (tipo === 'profesor') {
      setTipoUsuario('profesor');
      setVista('login');
    }
  }, []);

  // ============ FUNCIONES API PARA ALUMNOS (las que ya tienes) ============
  const API_URL = 'http://localhost:8000/api';

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

  // ============ HANDLERS PARA ALUMNOS ============
  const handleLoginAlumno = async (email, password) => {
    try {
      if (token) {
        const response = await validarAsistencia(email, password, token);
        
        if (response.success && response.registrada) {
          setDatosAsistencia(response.data);
          setVista('exitosa');
        } else {
          setErrorMensaje(response.message || 'No se pudo registrar la asistencia');
          setVista('fallida');
        }
      } else {
        const response = await consultarAsistencias(email, password);
        
        if (response.success) {
          setEstudiante(response.estudiante);
          setAsistencias(response.asistencias);
          setVista('panel');
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error) {
      console.error('Error en login alumno:', error);
      throw error.response?.data || { message: error.message || 'Error de conexión' };
    }
  };

  // ============ HANDLERS PARA PROFESORES ============
  const handleLoginProfesor = (resultado) => {
    if (resultado.tipo === 'dashboard') {
      setDatosUsuario(resultado.usuario);
      setVista('dashboard-profesor');
    } else if (resultado.tipo === 'asistencia_registrada') {
      if (resultado.registrada) {
        setDatosAsistencia(resultado.data);
        setVista('exitosa');
      } else {
        setErrorMensaje('No se pudo registrar la asistencia');
        setVista('fallida');
      }
    }
  };

  // ============ HANDLERS GENERALES ============
  const handleVolverInicio = () => {
    setVista('seleccion');
    setTipoUsuario(null);
    setDatosUsuario(null);
    setDatosAsistencia(null);
    setErrorMensaje('');
    setEstudiante(null);
    setAsistencias([]);
    window.history.replaceState({}, document.title, window.location.pathname);
    setToken(null);
  };

  const seleccionarTipoUsuario = (tipo) => {
    setTipoUsuario(tipo);
    setVista('login');
  };

  // ============ PANTALLA DE SELECCIÓN - VERDE TEC ============
  if (vista === 'seleccion') {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-700 to-teal-900">
        {/* Formas decorativas de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Grid de puntos decorativos */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-5xl mx-auto">
            {/* Header principal */}
            <div className="mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl mb-6 shadow-lg border border-white/20">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
                Sistema de
                <span className="block bg-gradient-to-r from-emerald-200 via-green-200 to-white bg-clip-text text-transparent">
                  Asistencias
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-green-100 font-light">
                TEC de Celaya - Selecciona tu tipo de usuario
              </p>
            </div>

            {/* Cards de selección */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Card Alumno */}
              <button
                onClick={() => seleccionarTipoUsuario('alumno')}
                onMouseEnter={() => setHoveredCard('alumno')}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 hover:scale-105 hover:bg-white/15"
              >
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-emerald-400/0 to-emerald-400/0 group-hover:from-emerald-400/20 group-hover:via-green-400/10 group-hover:to-transparent transition-all duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icono */}
                  <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${hoveredCard === 'alumno' ? 'rotate-6 scale-110' : ''}`}>
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>

                  {/* Texto */}
                  <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors duration-300">
                    Alumno
                  </h2>
                  <p className="text-green-100 text-lg leading-relaxed mb-6">
                    Registra tu asistencia y consulta tu historial de clases
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Registro rápido de asistencia</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-green-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Historial completo</span>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <div className="inline-flex items-center gap-2 text-green-200 font-semibold group-hover:gap-4 transition-all duration-300">
                    <span>Ingresar</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Indicador de hover */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-b-3xl transition-all duration-500 ${hoveredCard === 'alumno' ? 'opacity-100' : 'opacity-0'}`}></div>
              </button>

              {/* Card Profesor */}
              <button
                onClick={() => seleccionarTipoUsuario('profesor')}
                onMouseEnter={() => setHoveredCard('profesor')}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-teal-500/50 transition-all duration-500 hover:scale-105 hover:bg-white/15"
              >
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-400/0 via-teal-400/0 to-teal-400/0 group-hover:from-teal-400/20 group-hover:via-emerald-400/10 group-hover:to-transparent transition-all duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icono */}
                  <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${hoveredCard === 'profesor' ? 'rotate-6 scale-110' : ''}`}>
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Texto */}
                  <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-teal-200 transition-colors duration-300">
                    Profesor
                  </h2>
                  <p className="text-green-100 text-lg leading-relaxed mb-6">
                    Gestiona las asistencias de tus grupos y estudiantes
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Control total de asistencias</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-green-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Reportes y estadísticas</span>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <div className="inline-flex items-center gap-2 text-green-200 font-semibold group-hover:gap-4 transition-all duration-300">
                    <span>Ingresar</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Indicador de hover */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-b-3xl transition-all duration-500 ${hoveredCard === 'profesor' ? 'opacity-100' : 'opacity-0'}`}></div>
              </button>
            </div>

            {/* Footer decorativo */}
            <div className="mt-16 flex items-center justify-center gap-8 text-green-200/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>Rápido</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>Intuitivo</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // ============ RUTAS PARA ALUMNOS ============
  if (tipoUsuario === 'alumno') {
    return (
      <>
        {vista === 'login' && (
          <Login onLogin={handleLoginAlumno} hasToken={!!token} />
        )}
        {vista === 'exitosa' && (
          <AsistenciaExitosa 
            data={datosAsistencia} 
            onVolver={handleVolverInicio} 
          />
        )}
        {vista === 'fallida' && (
          <AsistenciaFallida 
            message={errorMensaje} 
            onVolver={handleVolverInicio} 
          />
        )}
        {vista === 'panel' && (
          <PanelAsistencias
            estudiante={estudiante}
            asistencias={asistencias}
            onCerrarSesion={handleVolverInicio}
          />
        )}
      </>
    );
  }

  // ============ RUTAS PARA PROFESORES ============
  if (tipoUsuario === 'profesor') {
    return (
      <>
        {vista === 'login' && (
          <LoginProfesor 
            onLoginExitoso={handleLoginProfesor} 
            hasToken={token}
          />
        )}
        {vista === 'dashboard-profesor' && (
          <DashboardProfesor
            usuario={datosUsuario}
            email={datosUsuario?.email}
            onCerrarSesion={handleVolverInicio}
          />
        )}
        {vista === 'exitosa' && (
          <AsistenciaExitosa 
            data={datosAsistencia} 
            onVolver={handleVolverInicio} 
          />
        )}
        {vista === 'fallida' && (
          <AsistenciaFallida 
            message={errorMensaje} 
            onVolver={handleVolverInicio} 
          />
        )}
      </>
    );
  }

  return null;
}

export default App;