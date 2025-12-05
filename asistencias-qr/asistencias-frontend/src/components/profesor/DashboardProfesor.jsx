import { useState, useEffect } from 'react';
import { ArrowLeft,BookOpen,LogOut, Calendar, Users, CheckCircle, XCircle, Clock, MapPin, ChevronLeft, ChevronRight, Loader, BarChart3 } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

const DashboardProfesor = ({ usuario, email, onCerrarSesion }) => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState('materias'); // materias | detalle | mis-asistencias
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);

  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    try {
      const response = await fetch(`${API_URL}/profesor/materias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setMaterias(data.data);
      }
    } catch (error) {
      console.error('Error cargando materias:', error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalleMateria = (materia) => {
    setMateriaSeleccionada(materia);
    setVistaActual('detalle');
  };

  if (vistaActual === 'detalle' && materiaSeleccionada) {
    return (
      <DetalleMateria
        materia={materiaSeleccionada}
        email={email}
        onVolver={() => {
          setVistaActual('materias');
          setMateriaSeleccionada(null);
        }}
      />
    );
  }

  if (vistaActual === 'mis-asistencias') {
    return (
      <MisAsistenciasProfesor
        email={email}
        onVolver={() => setVistaActual('materias')}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      {/* Header Moderno con Gradiente Verde TEC */}
      <div style={{
        background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
        boxShadow: '0 10px 40px rgba(10, 95, 56, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Elemento decorativo */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '3px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <BookOpen style={{ color: 'white' }} size={32} />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'white',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    margin: 0
                  }}>
                    Portal Docente
                  </h1>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    margin: '0.25rem 0 0 0'
                  }}>
                    {usuario?.nombre || 'Profesor'}
                  </p>
                </div>
              </div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.95rem',
                margin: 0,
                marginLeft: '86px'
              }}>
                <Calendar style={{ display: 'inline', marginRight: '0.5rem', marginBottom: '0.15rem' }} size={16} />
                {email}
              </p>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setVistaActual('mis-asistencias')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Calendar size={20} />
                Mis Asistencias
              </button>
              
              <button
                onClick={onCerrarSesion}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(220, 53, 69, 0.9)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(200, 35, 51, 1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(220, 53, 69, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(220, 53, 69, 0.9)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Título de Sección */}
        <div style={{
          background: 'white',
          borderRadius: '1.25rem',
          padding: '2rem',
          boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#212529',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen style={{ color: 'white' }} size={24} />
            </div>
            Mis Materias
          </h2>
          <p style={{ color: '#6c757d', fontSize: '1rem', margin: 0, marginLeft: '66px' }}>
            Selecciona una materia para ver las asistencias de tus alumnos
          </p>
        </div>

        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            gap: '1rem'
          }}>
            <Loader 
              style={{ 
                animation: 'spin 1s linear infinite',
                color: '#0a5f38'
              }} 
              size={48} 
            />
            <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
              Cargando materias...
            </p>
          </div>
        ) : materias.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1.25rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 5px 25px rgba(0,0,0,0.08)'
          }}>
            <BookOpen style={{ margin: '0 auto', color: '#e9ecef', marginBottom: '1rem' }} size={64} />
            <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
              No se encontraron materias asignadas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materias.map((materia, index) => (
              <div
                key={index}
                onClick={() => verDetalleMateria(materia)}
                style={{
                  background: 'white',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: '2px solid transparent'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(10, 95, 56, 0.15)';
                  e.currentTarget.style.borderColor = '#0a5f38';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 25px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {/* Header de la Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
                  padding: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }} />
                  
                  <h3 style={{
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    marginBottom: '0.5rem',
                    position: 'relative',
                    zIndex: 1,
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                  }}>
                    {materia.nombre_materia}
                  </h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    position: 'relative',
                    zIndex: 1,
                    margin: 0
                  }}>
                    {materia.clave_materia}
                  </p>
                </div>

                {/* Contenido de la Card */}
                <div style={{ padding: '1.5rem' }}>
                  {/* Información Principal */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      background: '#f8f9fa',
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <BookOpen style={{ color: 'white' }} size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.75rem', color: '#6c757d', margin: 0, fontWeight: '500' }}>
                          Semestre
                        </p>
                        <p style={{ fontSize: '1rem', color: '#212529', margin: 0, fontWeight: '700' }}>
                          {materia.semestre}°
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      background: '#f8f9fa',
                      borderRadius: '0.75rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Users style={{ color: 'white' }} size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.75rem', color: '#6c757d', margin: 0, fontWeight: '500' }}>
                          Grupo / Inscritos
                        </p>
                        <p style={{ fontSize: '1rem', color: '#212529', margin: 0, fontWeight: '700' }}>
                          {materia.grupo} • {materia.num_inscritos} alumnos
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Horarios */}
                  <div style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(10, 95, 56, 0.05) 0%, rgba(13, 125, 77, 0.05) 100%)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(10, 95, 56, 0.1)',
                    marginBottom: '1rem'
                  }}>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#0a5f38',
                      fontWeight: '700',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Clock size={16} />
                      Horarios
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {materia.horarios.map((horario, i) => (
                        <div 
                          key={i} 
                          style={{
                            fontSize: '0.85rem',
                            color: '#495057',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem',
                            background: 'white',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(10, 95, 56, 0.1)'
                          }}
                        >
                          <span style={{ fontWeight: '600', color: '#0a5f38' }}>
                            {horario.dia}:
                          </span>
                          <span style={{ fontWeight: '500' }}>
                            {horario.hora_inicio.substring(0, 5)} - {horario.hora_fin.substring(0, 5)}
                          </span>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            background: '#0a5f38',
                            color: 'white',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {horario.salon}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón de Acción */}
                  <button 
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
                      color: 'white',
                      borderRadius: '0.75rem',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: '0.95rem'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(10, 95, 56, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Ver Asistencias
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

// Datos de ejemplo para demostración
const datosEjemplo = {
  usuario: {
    nombre: 'Dr. Carlos Mendoza Ramírez'
  },
  email: 'carlos.mendoza@tec.mx',
  materias: [
    {
      nombre_materia: 'Cálculo Diferencial e Integral',
      clave_materia: 'MAT-2301',
      semestre: 3,
      grupo: 'A',
      num_inscritos: 35,
      horarios: [
        {
          dia: 'Lunes',
          hora_inicio: '08:00:00',
          hora_fin: '10:00:00',
          salon: 'A-301'
        },
        {
          dia: 'Miércoles',
          hora_inicio: '08:00:00',
          hora_fin: '10:00:00',
          salon: 'A-301'
        }
      ]
    },
    {
      nombre_materia: 'Álgebra Lineal',
      clave_materia: 'MAT-2302',
      semestre: 2,
      grupo: 'B',
      num_inscritos: 28,
      horarios: [
        {
          dia: 'Martes',
          hora_inicio: '10:00:00',
          hora_fin: '12:00:00',
          salon: 'B-205'
        },
        {
          dia: 'Jueves',
          hora_inicio: '10:00:00',
          hora_fin: '12:00:00',
          salon: 'B-205'
        }
      ]
    },
    {
      nombre_materia: 'Ecuaciones Diferenciales',
      clave_materia: 'MAT-3401',
      semestre: 5,
      grupo: 'A',
      num_inscritos: 22,
      horarios: [
        {
          dia: 'Viernes',
          hora_inicio: '14:00:00',
          hora_fin: '16:00:00',
          salon: 'C-108'
        }
      ]
    }
  ]
};

// ============ COMPONENTE DETALLE MATERIA ============
const DetalleMateria = ({ materia, email, onVolver }) => {
  const [asistencias, setAsistencias] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState('calendario');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [mesActual, setMesActual] = useState(new Date());

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resResponse = await fetch(`${API_URL}/profesor/asistencias/resumen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          clave_materia: materia.clave_materia 
        }),
      });
      const resData = await resResponse.json();
      if (resData.success) {
        setResumen(resData.data);
      }

      const histResponse = await fetch(`${API_URL}/profesor/asistencias/grupo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          clave_materia: materia.clave_materia 
        }),
      });
      const histData = await histResponse.json();
      if (histData.success) {
        setAsistencias(histData.data);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
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

  const obtenerAsistenciasPorFecha = () => {
    const asistenciasPorFecha = {};
    asistencias.forEach(asistencia => {
      const fecha = new Date(asistencia.fecha_hora_registro).toLocaleDateString('es-MX');
      if (!asistenciasPorFecha[fecha]) {
        asistenciasPorFecha[fecha] = [];
      }
      asistenciasPorFecha[fecha].push(asistencia);
    });
    return asistenciasPorFecha;
  };

  const asistenciasPorFecha = obtenerAsistenciasPorFecha();

  const generarCalendario = () => {
    const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
    const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
    const diasMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();
    
    const dias = [];
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }
    for (let i = 1; i <= diasMes; i++) {
      dias.push(i);
    }
    return dias;
  };

  const cambiarMes = (direccion) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(mesActual.getMonth() + direccion);
    setMesActual(nuevoMes);
    setFechaSeleccionada(null);
  };

  const obtenerAsistenciasDelDia = (dia) => {
    if (!dia) return [];
    const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
    const fechaStr = fecha.toLocaleDateString('es-MX');
    return asistenciasPorFecha[fechaStr] || [];
  };

  const tieneClase = (dia) => {
    if (!dia) return false;
    const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
    const diaSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][fecha.getDay()];
    return materia.horarios.some(h => h.dia === diaSemana);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <Loader 
          style={{ 
            animation: 'spin 1s linear infinite',
            color: '#0a5f38'
          }} 
          size={48} 
        />
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Cargando información de la materia...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      {/* Header con Gradiente Verde TEC */}
      <div style={{
        background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
        boxShadow: '0 10px 40px rgba(10, 95, 56, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div className="max-w-7xl mx-auto px-6 py-6" style={{ position: 'relative', zIndex: 1 }}>
          <button
            onClick={onVolver}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              marginBottom: '1.5rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateX(-5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={20} />
            Volver a mis materias
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }}>
              <Calendar style={{ color: 'white' }} size={32} />
            </div>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                margin: 0,
                marginBottom: '0.5rem'
              }}>
                {materia.nombre_materia}
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                fontWeight: '500',
                margin: 0
              }}>
                {materia.clave_materia} • Grupo {materia.grupo} • Semestre {materia.semestre}°
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Pestañas de Vista */}
        <div style={{
          background: 'white',
          borderRadius: '1.25rem',
          padding: '1.5rem',
          boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
          marginBottom: '1.5rem'
        }}>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setVista('calendario')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: vista === 'calendario' 
                  ? 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)'
                  : '#f8f9fa',
                color: vista === 'calendario' ? 'white' : '#212529'
              }}
              onMouseOver={(e) => {
                if (vista !== 'calendario') {
                  e.currentTarget.style.background = '#e9ecef';
                }
              }}
              onMouseOut={(e) => {
                if (vista !== 'calendario') {
                  e.currentTarget.style.background = '#f8f9fa';
                }
              }}
            >
              <Calendar size={20} />
              Calendario
            </button>
            <button
              onClick={() => setVista('resumen')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: vista === 'resumen'
                  ? 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)'
                  : '#f8f9fa',
                color: vista === 'resumen' ? 'white' : '#212529'
              }}
              onMouseOver={(e) => {
                if (vista !== 'resumen') {
                  e.currentTarget.style.background = '#e9ecef';
                }
              }}
              onMouseOut={(e) => {
                if (vista !== 'resumen') {
                  e.currentTarget.style.background = '#f8f9fa';
                }
              }}
            >
              <BarChart3 size={20} />
              Resumen por Alumno
            </button>
          </div>
        </div>

        {vista === 'calendario' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendario */}
            <div className="lg:col-span-2">
              <div style={{
                background: 'white',
                borderRadius: '1.25rem',
                padding: '2rem',
                boxShadow: '0 5px 25px rgba(0,0,0,0.08)'
              }}>
                {/* Header del Calendario */}
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => cambiarMes(-1)}
                    style={{
                      padding: '0.75rem',
                      background: '#f8f9fa',
                      border: 'none',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#0a5f38';
                      e.currentTarget.querySelector('svg').style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                      e.currentTarget.querySelector('svg').style.color = '#212529';
                    }}
                  >
                    <ChevronLeft style={{ color: '#212529', transition: 'color 0.3s ease' }} size={24} />
                  </button>
                  
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#212529',
                    textTransform: 'capitalize'
                  }}>
                    {mesActual.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                  </h2>
                  
                  <button
                    onClick={() => cambiarMes(1)}
                    style={{
                      padding: '0.75rem',
                      background: '#f8f9fa',
                      border: 'none',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#0a5f38';
                      e.currentTarget.querySelector('svg').style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                      e.currentTarget.querySelector('svg').style.color = '#212529';
                    }}
                  >
                    <ChevronRight style={{ color: '#212529', transition: 'color 0.3s ease' }} size={24} />
                  </button>
                </div>

                {/* Headers días de la semana */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
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
                </div>

                {/* Grid de días */}
                <div className="grid grid-cols-7 gap-2">
                  {generarCalendario().map((dia, index) => {
                    const asistenciasDia = obtenerAsistenciasDelDia(dia);
                    const tieneClaseHoy = tieneClase(dia);
                    const esSeleccionado = fechaSeleccionada === dia;

                    return (
                      <button
                        key={index}
                        onClick={() => dia && setFechaSeleccionada(dia)}
                        disabled={!dia}
                        style={{
                          aspectRatio: '1',
                          padding: '0.75rem',
                          borderRadius: '0.75rem',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          border: '2px solid',
                          cursor: dia ? 'pointer' : 'default',
                          background: !dia
                            ? 'transparent'
                            : esSeleccionado
                            ? 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)'
                            : asistenciasDia.length > 0
                            ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)'
                            : tieneClaseHoy
                            ? 'linear-gradient(135deg, rgba(23, 162, 184, 0.1) 0%, rgba(19, 132, 150, 0.1) 100%)'
                            : 'white',
                          borderColor: !dia
                            ? 'transparent'
                            : esSeleccionado
                            ? '#0a5f38'
                            : asistenciasDia.length > 0
                            ? '#28a745'
                            : tieneClaseHoy
                            ? '#17a2b8'
                            : '#e9ecef',
                          color: esSeleccionado ? 'white' : '#212529',
                          fontWeight: esSeleccionado || asistenciasDia.length > 0 ? '700' : '500'
                        }}
                        onMouseOver={(e) => {
                          if (dia && !esSeleccionado) {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (dia) {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <span style={{ fontSize: '0.95rem' }}>{dia}</span>
                        {asistenciasDia.length > 0 && !esSeleccionado && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '8px',
                            height: '8px',
                            background: '#28a745',
                            borderRadius: '50%',
                            boxShadow: '0 0 0 2px white'
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Horarios de clase */}
                <div style={{
                  marginTop: '2rem',
                  paddingTop: '2rem',
                  borderTop: '2px solid #e9ecef'
                }}>
                  <h3 style={{
                    fontWeight: '700',
                    color: '#212529',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Clock style={{ color: '#0a5f38' }} size={20} />
                    Horarios de clase
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {materia.horarios.map((horario, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.875rem 1rem',
                          background: 'linear-gradient(135deg, rgba(10, 95, 56, 0.05) 0%, rgba(13, 125, 77, 0.05) 100%)',
                          borderRadius: '0.75rem',
                          border: '1px solid rgba(10, 95, 56, 0.15)',
                          fontSize: '0.95rem'
                        }}
                      >
                        <div style={{
                          width: '8px',
                          height: '8px',
                          background: '#17a2b8',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        <span style={{ fontWeight: '700', color: '#0a5f38', minWidth: '90px' }}>
                          {horario.dia}:
                        </span>
                        <span style={{ fontWeight: '600', color: '#495057' }}>
                          {horario.hora_inicio.substring(0, 5)} - {horario.hora_fin.substring(0, 5)}
                        </span>
                        <span style={{
                          marginLeft: 'auto',
                          padding: '0.35rem 0.75rem',
                          background: '#0a5f38',
                          color: 'white',
                          borderRadius: '0.5rem',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}>
                          <MapPin size={14} />
                          {horario.salon}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Panel de Asistencias del Día */}
            <div className="lg:col-span-1">
              <div style={{
                background: 'white',
                borderRadius: '1.25rem',
                padding: '2rem',
                boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
                position: 'sticky',
                top: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#212529',
                  marginBottom: '1.5rem'
                }}>
                  {fechaSeleccionada
                    ? `${fechaSeleccionada} de ${mesActual.toLocaleDateString('es-MX', { month: 'long' })}`
                    : 'Selecciona un día'}
                </h3>

                {fechaSeleccionada ? (
                  <div>
                    {(() => {
                      const asistenciasDia = obtenerAsistenciasDelDia(fechaSeleccionada);
                      
                      const alumnosUnicos = new Map();
                      asistenciasDia.forEach(asistencia => {
                        const key = asistencia.alumno_email;
                        if (!alumnosUnicos.has(key)) {
                          alumnosUnicos.set(key, asistencia);
                        } else {
                          const existente = alumnosUnicos.get(key);
                          if (!existente.validacion_exitosa && asistencia.validacion_exitosa) {
                            alumnosUnicos.set(key, asistencia);
                          }
                        }
                      });

                      const asistenciasUnicas = Array.from(alumnosUnicos.values());
                      const exitosas = asistenciasUnicas.filter(a => a.validacion_exitosa);
                      const fallidas = asistenciasUnicas.filter(a => !a.validacion_exitosa);

                      if (asistenciasUnicas.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                            <Calendar style={{ margin: '0 auto', color: '#e9ecef', marginBottom: '1rem' }} size={64} />
                            <p style={{ color: '#6c757d' }}>
                              No hay asistencias registradas este día
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div>
                          {/* Resumen */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div style={{
                              background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)',
                              borderRadius: '1rem',
                              padding: '1rem',
                              textAlign: 'center',
                              border: '2px solid rgba(40, 167, 69, 0.2)'
                            }}>
                              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#28a745', margin: 0 }}>
                                {exitosas.length}
                              </p>
                              <p style={{ fontSize: '0.8rem', color: '#20c997', margin: '0.25rem 0 0 0', fontWeight: '600' }}>
                                Presentes
                              </p>
                            </div>
                            <div style={{
                              background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(200, 35, 51, 0.1) 100%)',
                              borderRadius: '1rem',
                              padding: '1rem',
                              textAlign: 'center',
                              border: '2px solid rgba(220, 53, 69, 0.2)'
                            }}>
                              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#dc3545', margin: 0 }}>
                                {fallidas.length}
                              </p>
                              <p style={{ fontSize: '0.8rem', color: '#c82333', margin: '0.25rem 0 0 0', fontWeight: '600' }}>
                                No válidas
                              </p>
                            </div>
                          </div>

                          {/* Lista de Asistencias */}
                          <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {exitosas.length > 0 && (
                              <div>
                                <h4 style={{
                                  fontSize: '0.9rem',
                                  fontWeight: '700',
                                  color: '#28a745',
                                  marginBottom: '0.75rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <CheckCircle size={18} />
                                  Asistieron
                                </h4>
                                {exitosas
                                  .sort((a, b) => a.alumno_nombre.localeCompare(b.alumno_nombre))
                                  .map((asistencia) => (
                                    <div
                                      key={asistencia.id}
                                      style={{
                                        background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.08) 0%, rgba(32, 201, 151, 0.08) 100%)',
                                        border: '2px solid rgba(40, 167, 69, 0.2)',
                                        borderRadius: '0.75rem',
                                        padding: '0.875rem',
                                        marginBottom: '0.5rem',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                        e.currentTarget.style.borderColor = '#28a745';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.borderColor = 'rgba(40, 167, 69, 0.2)';
                                      }}
                                    >
                                      <p style={{
                                        fontWeight: '600',
                                        color: '#212529',
                                        fontSize: '0.9rem',
                                        margin: 0,
                                        marginBottom: '0.35rem'
                                      }}>
                                        {asistencia.alumno_nombre}
                                      </p>
                                      <p style={{
                                        fontSize: '0.8rem',
                                        color: '#6c757d',
                                        margin: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.35rem'
                                      }}>
                                        <Clock size={12} />
                                        {new Date(asistencia.fecha_hora_registro).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            )}

                            {fallidas.length > 0 && (
                              <div style={{ marginTop: exitosas.length > 0 ? '1rem' : 0 }}>
                                <h4 style={{
                                  fontSize: '0.9rem',
                                  fontWeight: '700',
                                  color: '#dc3545',
                                  marginBottom: '0.75rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <XCircle size={18} />
                                  No válidas
                                </h4>
                                {fallidas
                                  .sort((a, b) => a.alumno_nombre.localeCompare(b.alumno_nombre))
                                  .map((asistencia) => (
                                    <div
                                      key={asistencia.id}
                                      style={{
                                        background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.08) 0%, rgba(200, 35, 51, 0.08) 100%)',
                                        border: '2px solid rgba(220, 53, 69, 0.2)',
                                        borderRadius: '0.75rem',
                                        padding: '0.875rem',
                                        marginBottom: '0.5rem',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                        e.currentTarget.style.borderColor = '#dc3545';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.borderColor = 'rgba(220, 53, 69, 0.2)';
                                      }}
                                    >
                                      <p style={{
                                        fontWeight: '600',
                                        color: '#212529',
                                        fontSize: '0.9rem',
                                        margin: 0,
                                        marginBottom: '0.35rem'
                                      }}>
                                        {asistencia.alumno_nombre}
                                      </p>
                                      <p style={{
                                        fontSize: '0.8rem',
                                        color: '#6c757d',
                                        margin: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.35rem'
                                      }}>
                                        <Clock size={12} />
                                        {new Date(asistencia.fecha_hora_registro).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <Calendar style={{ margin: '0 auto', color: '#e9ecef', marginBottom: '1rem' }} size={64} />
                    <p style={{ color: '#6c757d', fontSize: '0.95rem' }}>
                      Haz clic en un día del calendario para ver las asistencias
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {vista === 'resumen' && resumen && (
          <div>
            {/* Estadísticas Generales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #17a2b8',
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
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  <Users style={{ color: 'white' }} size={28} />
                </div>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500', margin: 0, marginBottom: '0.5rem' }}>
                  Alumnos Inscritos
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#212529', lineHeight: '1', margin: 0 }}>
                  {resumen.num_inscritos}
                </p>
              </div>
              
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #28a745',
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
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  <CheckCircle style={{ color: 'white' }} size={28} />
                </div>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500', margin: 0, marginBottom: '0.5rem' }}>
                  Con Asistencias
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#212529', lineHeight: '1', margin: 0 }}>
                  {resumen.alumnos_con_asistencias}
                </p>
              </div>
              
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
                borderLeft: '4px solid #0a5f38',
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
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  <Calendar style={{ color: 'white' }} size={28} />
                </div>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500', margin: 0, marginBottom: '0.5rem' }}>
                  Total Registros
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#212529', lineHeight: '1', margin: 0 }}>
                  {asistencias.length}
                </p>
              </div>
            </div>

            {/* Lista de Alumnos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {resumen.resumen_alumnos.map((alumno, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: '1.25rem',
                    padding: '2rem',
                    boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(10, 95, 56, 0.15)';
                    e.currentTarget.style.borderColor = '#0a5f38';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 25px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{
                        fontWeight: '700',
                        color: '#212529',
                        fontSize: '1.2rem',
                        margin: 0,
                        marginBottom: '0.5rem'
                      }}>
                        {alumno.alumno_nombre}
                      </h3>
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#6c757d',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Users size={16} />
                        {alumno.alumno_email}
                      </p>
                    </div>
                    <div style={{
                      textAlign: 'right',
                      background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
                      borderRadius: '1rem',
                      padding: '1rem 1.5rem',
                      minWidth: '120px'
                    }}>
                      <p style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: 'white',
                        lineHeight: '1',
                        margin: 0,
                        marginBottom: '0.25rem'
                      }}>
                        {alumno.asistencias_exitosas}
                      </p>
                      <p style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontWeight: '500'
                      }}>
                        asistencias
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div style={{
                      background: '#f8f9fa',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      border: '2px solid #e9ecef'
                    }}>
                      <p style={{ fontSize: '0.85rem', color: '#6c757d', margin: 0, marginBottom: '0.5rem', fontWeight: '500' }}>
                        Total
                      </p>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#212529', margin: 0, lineHeight: '1' }}>
                        {alumno.total_asistencias}
                      </p>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      border: '2px solid rgba(40, 167, 69, 0.2)'
                    }}>
                      <p style={{ fontSize: '0.85rem', color: '#28a745', margin: 0, marginBottom: '0.5rem', fontWeight: '600' }}>
                        Exitosas
                      </p>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#20c997', margin: 0, lineHeight: '1' }}>
                        {alumno.asistencias_exitosas}
                      </p>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(200, 35, 51, 0.1) 100%)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      border: '2px solid rgba(220, 53, 69, 0.2)'
                    }}>
                      <p style={{ fontSize: '0.85rem', color: '#dc3545', margin: 0, marginBottom: '0.5rem', fontWeight: '600' }}>
                        Fallidas
                      </p>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#c82333', margin: 0, lineHeight: '1' }}>
                        {alumno.asistencias_fallidas}
                      </p>
                    </div>
                  </div>
                  
                  {alumno.ultima_asistencia && (
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#6c757d',
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '2px solid #e9ecef',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Clock size={16} style={{ color: '#0a5f38' }} />
                      <strong>Última asistencia:</strong> {formatearFecha(alumno.ultima_asistencia)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
// ============ COMPONENTE MIS ASISTENCIAS PROFESOR ============

const MisAsistenciasProfesor = ({ email, onVolver }) => {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mesActual, setMesActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);



  useEffect(() => {
    cargarAsistencias();
  }, []);

  const cargarAsistencias = async () => {
    try {
      const response = await fetch(`${API_URL}/profesor/mis-asistencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setAsistencias(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerAsistenciasPorFecha = () => {
    const asistenciasPorFecha = {};
    asistencias.forEach(asistencia => {
      const fecha = new Date(asistencia.fecha_hora_registro).toLocaleDateString('es-MX');
      if (!asistenciasPorFecha[fecha]) {
        asistenciasPorFecha[fecha] = {
          total: 0,
          exitosas: 0,
          fallidas: 0,
          registros: []
        };
      }
      asistenciasPorFecha[fecha].total++;
      if (asistencia.validacion_exitosa) {
        asistenciasPorFecha[fecha].exitosas++;
      } else {
        asistenciasPorFecha[fecha].fallidas++;
      }
      asistenciasPorFecha[fecha].registros.push(asistencia);
    });
    return asistenciasPorFecha;
  };

  const generarCalendario = () => {
    const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
    const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
    const diasMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();
    
    const dias = [];
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }
    for (let i = 1; i <= diasMes; i++) {
      dias.push(i);
    }
    return dias;
  };

  const cambiarMes = (direccion) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(mesActual.getMonth() + direccion);
    setMesActual(nuevoMes);
    setFechaSeleccionada(null);
  };

  const obtenerAsistenciasDelDia = (dia) => {
    if (!dia) return null;
    const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
    const fechaStr = fecha.toLocaleDateString('es-MX');
    const asistenciasPorFecha = obtenerAsistenciasPorFecha();
    return asistenciasPorFecha[fechaStr] || null;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <Loader 
          style={{ 
            animation: 'spin 1s linear infinite',
            color: '#0a5f38'
          }} 
          size={48} 
        />
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Cargando tus asistencias...
        </p>
      </div>
    );
  }

  const asistenciasPorFecha = obtenerAsistenciasPorFecha();
  const exitosasTotal = asistencias.filter(a => a.validacion_exitosa).length;
  const fallidasTotal = asistencias.filter(a => !a.validacion_exitosa).length;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      {/* Header con Gradiente Verde TEC */}
      <div style={{
        background: 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)',
        boxShadow: '0 10px 40px rgba(10, 95, 56, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div className="max-w-7xl mx-auto px-6 py-6" style={{ position: 'relative', zIndex: 1 }}>
          <button
            onClick={onVolver}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              marginBottom: '1.5rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateX(-5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={20} />
            Volver al dashboard
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }}>
              <CheckCircle style={{ color: 'white' }} size={32} />
            </div>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                margin: 0,
                marginBottom: '0.5rem'
              }}>
                Mis Asistencias
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                fontWeight: '500',
                margin: 0
              }}>
                Registro de mis asistencias como profesor
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #17a2b8',
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
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <Calendar style={{ color: 'white' }} size={28} />
            </div>
            <p style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500', margin: 0, marginBottom: '0.5rem' }}>
              Total Registros
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#212529', lineHeight: '1', margin: 0 }}>
              {asistencias.length}
            </p>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #28a745',
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
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <CheckCircle style={{ color: 'white' }} size={28} />
            </div>
            <p style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500', margin: 0, marginBottom: '0.5rem' }}>
              Exitosas
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#212529', lineHeight: '1', margin: 0 }}>
              {exitosasTotal}
            </p>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
            borderLeft: '4px solid #dc3545',
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
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <XCircle style={{ color: 'white' }} size={28} />
            </div>
            <p style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500', margin: 0, marginBottom: '0.5rem' }}>
              No Válidas
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#212529', lineHeight: '1', margin: 0 }}>
              {fallidasTotal}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendario */}
          <div className="lg:col-span-2">
            <div style={{
              background: 'white',
              borderRadius: '1.25rem',
              padding: '2rem',
              boxShadow: '0 5px 25px rgba(0,0,0,0.08)'
            }}>
              {/* Header del Calendario */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => cambiarMes(-1)}
                  style={{
                    padding: '0.75rem',
                    background: '#f8f9fa',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#0a5f38';
                    e.currentTarget.querySelector('svg').style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#f8f9fa';
                    e.currentTarget.querySelector('svg').style.color = '#212529';
                  }}
                >
                  <ChevronLeft style={{ color: '#212529', transition: 'color 0.3s ease' }} size={24} />
                </button>
                
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#212529',
                  textTransform: 'capitalize'
                }}>
                  {mesActual.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                </h2>
                
                <button
                  onClick={() => cambiarMes(1)}
                  style={{
                    padding: '0.75rem',
                    background: '#f8f9fa',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#0a5f38';
                    e.currentTarget.querySelector('svg').style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#f8f9fa';
                    e.currentTarget.querySelector('svg').style.color = '#212529';
                  }}
                >
                  <ChevronRight style={{ color: '#212529', transition: 'color 0.3s ease' }} size={24} />
                </button>
              </div>

              {/* Headers días de la semana */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
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
              </div>

              {/* Grid de días */}
              <div className="grid grid-cols-7 gap-2">
                {generarCalendario().map((dia, index) => {
                  const asistenciasDia = obtenerAsistenciasDelDia(dia);
                  const esSeleccionado = fechaSeleccionada === dia;

                  return (
                    <button
                      key={index}
                      onClick={() => dia && setFechaSeleccionada(dia)}
                      disabled={!dia}
                      style={{
                        aspectRatio: '1',
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        border: '2px solid',
                        cursor: dia ? 'pointer' : 'default',
                        background: !dia
                          ? 'transparent'
                          : esSeleccionado
                          ? 'linear-gradient(135deg, #0a5f38 0%, #0d7d4d 100%)'
                          : asistenciasDia
                          ? asistenciasDia.exitosas > 0
                            ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(200, 35, 51, 0.1) 100%)'
                          : 'white',
                        borderColor: !dia
                          ? 'transparent'
                          : esSeleccionado
                          ? '#0a5f38'
                          : asistenciasDia
                          ? asistenciasDia.exitosas > 0
                            ? '#28a745'
                            : '#dc3545'
                          : '#e9ecef',
                        color: esSeleccionado ? 'white' : '#212529',
                        fontWeight: esSeleccionado || asistenciasDia ? '700' : '500'
                      }}
                      onMouseOver={(e) => {
                        if (dia && !esSeleccionado) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (dia) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <span style={{ fontSize: '0.95rem' }}>{dia}</span>
                      {asistenciasDia && !esSeleccionado && (
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: '3px'
                        }}>
                          {asistenciasDia.exitosas > 0 && (
                            <div style={{
                              width: '6px',
                              height: '6px',
                              background: '#28a745',
                              borderRadius: '50%',
                              boxShadow: '0 0 0 2px white'
                            }} />
                          )}
                          {asistenciasDia.fallidas > 0 && (
                            <div style={{
                              width: '6px',
                              height: '6px',
                              background: '#dc3545',
                              borderRadius: '50%',
                              boxShadow: '0 0 0 2px white'
                            }} />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Leyenda */}
              <div style={{
                marginTop: '2rem',
                paddingTop: '2rem',
                borderTop: '2px solid #e9ecef',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                fontSize: '0.9rem',
                color: '#6c757d',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)',
                    border: '2px solid #28a745',
                    borderRadius: '0.35rem'
                  }} />
                  <span style={{ fontWeight: '500' }}>Con asistencias válidas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(200, 35, 51, 0.1) 100%)',
                    border: '2px solid #dc3545',
                    borderRadius: '0.35rem'
                  }} />
                  <span style={{ fontWeight: '500' }}>Solo no válidas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Detalle del Día */}
          <div className="lg:col-span-1">
            <div style={{
              background: 'white',
              borderRadius: '1.25rem',
              padding: '2rem',
              boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#212529',
                marginBottom: '1.5rem'
              }}>
                {fechaSeleccionada
                  ? `${fechaSeleccionada} de ${mesActual.toLocaleDateString('es-MX', { month: 'long' })}`
                  : 'Selecciona un día'}
              </h3>

              {fechaSeleccionada ? (
                <div>
                  {(() => {
                    const asistenciasDia = obtenerAsistenciasDelDia(fechaSeleccionada);

                    if (!asistenciasDia) {
                      return (
                        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                          <Calendar style={{ margin: '0 auto', color: '#e9ecef', marginBottom: '1rem' }} size={64} />
                          <p style={{ color: '#6c757d' }}>
                            No hay registros este día
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div>
                        {/* Resumen */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)',
                            borderRadius: '1rem',
                            padding: '1rem',
                            textAlign: 'center',
                            border: '2px solid rgba(40, 167, 69, 0.2)'
                          }}>
                            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#28a745', margin: 0 }}>
                              {asistenciasDia.exitosas}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#20c997', margin: '0.25rem 0 0 0', fontWeight: '600' }}>
                              Válidas
                            </p>
                          </div>
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(200, 35, 51, 0.1) 100%)',
                            borderRadius: '1rem',
                            padding: '1rem',
                            textAlign: 'center',
                            border: '2px solid rgba(220, 53, 69, 0.2)'
                          }}>
                            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#dc3545', margin: 0 }}>
                              {asistenciasDia.fallidas}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#c82333', margin: '0.25rem 0 0 0', fontWeight: '600' }}>
                              No válidas
                            </p>
                          </div>
                        </div>

                        {/* Lista de Registros */}
                        <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {asistenciasDia.registros
                            .sort((a, b) => new Date(a.fecha_hora_registro) - new Date(b.fecha_hora_registro))
                            .map((asistencia) => (
                              <div
                                key={asistencia.id}
                                style={{
                                  background: asistencia.validacion_exitosa
                                    ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.08) 0%, rgba(32, 201, 151, 0.08) 100%)'
                                    : 'linear-gradient(135deg, rgba(220, 53, 69, 0.08) 0%, rgba(200, 35, 51, 0.08) 100%)',
                                  border: asistencia.validacion_exitosa
                                    ? '2px solid rgba(40, 167, 69, 0.2)'
                                    : '2px solid rgba(220, 53, 69, 0.2)',
                                  borderLeft: asistencia.validacion_exitosa
                                    ? '4px solid #28a745'
                                    : '4px solid #dc3545',
                                  borderRadius: '0.75rem',
                                  padding: '1rem',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform = 'translateX(5px)';
                                  e.currentTarget.style.borderColor = asistencia.validacion_exitosa ? '#28a745' : '#dc3545';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform = 'translateX(0)';
                                  e.currentTarget.style.borderColor = asistencia.validacion_exitosa ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)';
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                  <h4 style={{
                                    fontWeight: '700',
                                    color: '#212529',
                                    fontSize: '0.9rem',
                                    margin: 0
                                  }}>
                                    {asistencia.horarios?.nombre_materia || 'Sin materia'}
                                  </h4>
                                  <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '2rem',
                                    fontWeight: '700',
                                    background: asistencia.validacion_exitosa
                                      ? '#28a745'
                                      : '#dc3545',
                                    color: 'white'
                                  }}>
                                    {asistencia.validacion_exitosa ? '✓' : '✗'}
                                  </span>
                                </div>
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.5rem',
                                  fontSize: '0.85rem',
                                  color: '#6c757d'
                                }}>
                                  <p style={{
                                    margin: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontWeight: '500'
                                  }}>
                                    <MapPin size={14} style={{ color: '#0a5f38' }} />
                                    {asistencia.horarios?.salones?.clave_salon || 'N/A'}
                                  </p>
                                  <p style={{
                                    margin: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontWeight: '500'
                                  }}>
                                    <Clock size={14} style={{ color: '#0a5f38' }} />
                                    {new Date(asistencia.fecha_hora_registro).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <Calendar style={{ margin: '0 auto', color: '#e9ecef', marginBottom: '1rem' }} size={64} />
                  <p style={{ color: '#6c757d', fontSize: '0.95rem' }}>
                    Selecciona un día del calendario para ver tus asistencias
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};



export default DashboardProfesor;