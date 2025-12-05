<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SupabaseService
{
    private $client;
    private $url;
    private $key;

    public function __construct()
    {
        $this->url = config('services.supabase.url');
        $this->key = config('services.supabase.key');
        
        $this->client = new Client([
            'base_uri' => $this->url . '/rest/v1/',
            'headers' => [
                'apikey' => $this->key,
                'Authorization' => "Bearer {$this->key}",
                'Content-Type' => 'application/json',
                'Prefer' => 'return=representation'
            ]
        ]);
    }

    /**
     * Validar token del QR
     */
    public function validarToken($token)
    {
        try {
            date_default_timezone_set('America/Mexico_City');
            $response = $this->client->get('tokens_salon', [
                'query' => [
                    'token' => "eq.{$token}",
                    'activo' => 'eq.true',
                    'select' => '*,salones(*)'
                ]
            ]);

            $tokens = json_decode($response->getBody()->getContents(), true);
            
            if (empty($tokens)) {
                return ['valid' => false, 'message' => 'Token no encontrado o inactivo'];
            }

            $tokenData = $tokens[0];
            
            // Verificar expiración
            $expiraEn = Carbon::parse($tokenData['expira_en']);
            if (Carbon::now()->greaterThan($expiraEn)) {
                return ['valid' => false, 'message' => 'Token expirado'];
            }

            // Verificar usos restantes
            if ($tokenData['usos_restantes'] <= 0) {
                return ['valid' => false, 'message' => 'Token sin usos disponibles'];
            }

            return [
                'valid' => true,
                'token_data' => $tokenData
            ];

        } catch (RequestException $e) {
            Log::error('Error validando token: ' . $e->getMessage());
            return ['valid' => false, 'message' => 'Error al validar token'];
        }
    }

/**
 * Consumir uso del token (restar 1)
 * Si llega a 0, sobrescribe el token y reinicia usos a 5
 */
public function consumirToken($tokenId, $usosRestantes, $salonId)
{
    try {
        date_default_timezone_set('America/Mexico_City');
        $nuevosUsos = $usosRestantes - 1;

        // Si llega a 0, sobrescribir con nuevo token y reiniciar usos
        if ($nuevosUsos <= 0) {
            $nuevoToken = $this->generarTokenUnico();
            $nuevaExpiracion = Carbon::now()->addMinutes(10)->toDateTimeString();

            $response = $this->client->patch("tokens_salon?id=eq.{$tokenId}", [
                'json' => [
                    'token' => $nuevoToken,
                    'usos_restantes' => 5,
                    'fecha_generacion' => Carbon::now()->toDateTimeString(),
                    'expira_en' => $nuevaExpiracion,
                    'activo' => true
                ]
            ]);

            $statusCode = $response->getStatusCode();
            $body = $response->getBody()->getContents();

            Log::info("Token sobrescrito automáticamente", [
                'token_id' => $tokenId,
                'salon_id' => $salonId,
                'nuevo_token' => $nuevoToken,
                'status' => $statusCode,
                'response' => $body
            ]);

        } else {
            // Si aún quedan usos, solo restar
            $response = $this->client->patch("tokens_salon?id=eq.{$tokenId}", [
                'json' => [
                    'usos_restantes' => $nuevosUsos
                ]
            ]);

            $statusCode = $response->getStatusCode();
            $body = $response->getBody()->getContents();

            Log::debug("Uso de token restado", [
                'token_id' => $tokenId,
                'usos_restantes' => $nuevosUsos,
                'status' => $statusCode,
                'response' => $body
            ]);
        }

        return $response->getStatusCode() >= 200 && $response->getStatusCode() < 300;

    } catch (RequestException $e) {
        Log::error('Error consumiendo token: ' . $e->getMessage());
        if ($e->hasResponse()) {
            Log::error('Response body: ' . $e->getResponse()->getBody()->getContents());
        }
        return false;
    }
}

/**
 * Generar un token único alfanumérico
 */
private function generarTokenUnico()
{
    do {
        // Generar token aleatorio de 32 caracteres
        $token = strtoupper(bin2hex(random_bytes(16)));
        
        // Verificar que no exista
        $existe = $this->verificarTokenExiste($token);
    } while ($existe);

    return $token;
}

/**
 * Verificar si un token ya existe en la base de datos
 */
private function verificarTokenExiste($token)
{
    try {
        $response = $this->client->get('tokens_salon', [
            'query' => [
                'token' => "eq.{$token}",
                'select' => 'id'
            ]
        ]);

        $body = $response->getBody()->getContents();
        
        // Validar que sea JSON válido
        if (empty($body)) {
            Log::warning('Respuesta vacía al verificar token');
            return false;
        }

        $result = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('Error parseando JSON al verificar token: ' . json_last_error_msg(), [
                'body' => $body
            ]);
            return false;
        }

        return !empty($result);

    } catch (RequestException $e) {
        Log::error('Error verificando existencia de token: ' . $e->getMessage());
        if ($e->hasResponse()) {
            Log::error('Response body: ' . $e->getResponse()->getBody()->getContents());
        }
        return false;
    }
}

   /**
 * Verificar si el alumno tiene clase en este horario y salón
 */
public function verificarHorarioAlumno($salonId, $horariosAlumno)
{
    try {
        date_default_timezone_set('America/Mexico_City');
        $now = Carbon::now();
        $diaSemana = $now->dayOfWeek;
        
        $diasMap = [
            0 => 'domingo',
            1 => 'lunes',
            2 => 'martes',
            3 => 'miercoles',
            4 => 'jueves',
            5 => 'viernes',
            6 => 'sabado'
        ];
        
        $diaActual = $diasMap[$diaSemana];
        $horaActual = $now->format('H:i:s');
        $diaId = $diaSemana == 0 ? 7 : $diaSemana;

        // ********************************************
        $diaActual = 'miercoles';
        $horaActual = '11:30:00';
        $diaId = 3;
        // ********************************************

        Log::debug("🔍 Verificando horario", [
            'salon_id' => $salonId,
            'dia_actual' => $diaActual,
            'dia_id' => $diaId,
            'hora_actual' => $horaActual
        ]);

        // ✅ PRIMERO: Ver qué hay en Supabase para este salón
        $response = $this->client->get('salones', [
            'query' => [
                'id' => "eq.{$salonId}",
                'select' => '*'
            ]
        ]);
        
        $salonInfo = json_decode($response->getBody()->getContents(), true);
        Log::debug("🏫 Info del salón desde Supabase", [
            'salon_info' => $salonInfo
        ]);

        // Buscar horarios en Supabase para este salón, día y hora
        $response = $this->client->get('horarios', [
            'query' => [
                'salon_id' => "eq.{$salonId}",
                'id_dia' => "eq.{$diaId}",
                'hora_inicio' => "lte.{$horaActual}",
                'hora_fin' => "gte.{$horaActual}",
                'select' => '*,salones(clave_salon)'
            ]
        ]);

        $horariosSupabase = json_decode($response->getBody()->getContents(), true);

        Log::debug("📅 Horarios encontrados en Supabase", [
            'count' => count($horariosSupabase),
            'horarios' => $horariosSupabase
        ]);

        if (empty($horariosSupabase)) {
            return [
                'tiene_clase' => false,
                'message' => 'No hay clases programadas en este salón a esta hora'
            ];
        }

        // ✅ MOSTRAR TODOS LOS HORARIOS DEL ALUMNO
        Log::debug("📚 Horarios del alumno de la API", [
            'total' => count($horariosAlumno),
            'grupos' => array_map(function($h) {
                return [
                    'id_grupo' => $h['id_grupo'],
                    'materia' => $h['nombre_materia'],
                    'miercoles' => $h['miercoles'] ?? null,
                    'miercoles_salon' => $h['miercoles_clave_salon'] ?? null
                ];
            }, $horariosAlumno)
        ]);

        // Verificar si el alumno tiene clase en este salón/horario
        foreach ($horariosSupabase as $horarioSupabase) {
            $salonSupabase = $horarioSupabase['salones']['clave_salon'] ?? null;
            
            Log::debug("🔎 Verificando horario de Supabase", [
                'id_grupo_supabase' => $horarioSupabase['id_grupo'],
                'salon_supabase' => $salonSupabase
            ]);
            
            foreach ($horariosAlumno as $horarioAlumno) {
                
                Log::debug("🔄 Comparando con horario del alumno", [
                    'id_grupo_alumno' => $horarioAlumno['id_grupo'] ?? 'N/A',
                    'id_grupo_supabase' => $horarioSupabase['id_grupo']
                ]);
                
                if (!isset($horarioAlumno['id_grupo']) || 
                    $horarioAlumno['id_grupo'] != $horarioSupabase['id_grupo']) {
                    continue;
                }
                
                Log::debug("✅ Grupos coinciden, verificando día y salón");
                
                $campoHorario = $diaActual;
                $campoSalon = $diaActual . '_clave_salon';
                
                Log::debug("📍 Verificando día específico", [
                    'grupo' => $horarioAlumno['id_grupo'],
                    'materia' => $horarioAlumno['nombre_materia'] ?? 'N/A',
                    'campo_horario' => $campoHorario,
                    'valor_horario_api' => $horarioAlumno[$campoHorario] ?? 'null',
                    'campo_salon' => $campoSalon,
                    'valor_salon_api' => $horarioAlumno[$campoSalon] ?? 'null',
                    'valor_salon_supabase' => $salonSupabase
                ]);
                
                if (empty($horarioAlumno[$campoHorario])) {
                    Log::debug("❌ Alumno no tiene clase este día en este grupo");
                    continue;
                }
                
                $salonAlumno = $horarioAlumno[$campoSalon] ?? null;
                if (empty($salonAlumno)) {
                    Log::debug("❌ No hay salón asignado para este día");
                    continue;
                }
                
                if (strtoupper($salonAlumno) !== strtoupper($salonSupabase)) {
                    Log::debug("❌ El salón no coincide", [
                        'salon_api' => $salonAlumno,
                        'salon_supabase' => $salonSupabase
                    ]);
                    continue;
                }
                
                $rangoHorario = explode('-', $horarioAlumno[$campoHorario]);
                if (count($rangoHorario) != 2) {
                    Log::warning("❌ Formato de horario inválido", [
                        'horario' => $horarioAlumno[$campoHorario]
                    ]);
                    continue;
                }
                
                $horaInicio = trim($rangoHorario[0]) . ':00';
                $horaFin = trim($rangoHorario[1]) . ':00';
                
                Log::debug("⏰ Comparando horas", [
                    'hora_actual' => $horaActual,
                    'hora_inicio' => $horaInicio,
                    'hora_fin' => $horaFin,
                    'en_rango' => ($horaActual >= $horaInicio && $horaActual <= $horaFin)
                ]);
                
                if ($horaActual >= $horaInicio && $horaActual <= $horaFin) {
                    Log::info("🎉 Clase verificada exitosamente", [
                        'grupo' => $horarioAlumno['id_grupo'],
                        'materia' => $horarioAlumno['nombre_materia'] ?? 'N/A',
                        'salon_api' => $salonAlumno,
                        'salon_supabase' => $salonSupabase
                    ]);
                    
                    return [
                        'tiene_clase' => true,
                        'horario' => $horarioSupabase
                    ];
                }
            }
        }

        return [
            'tiene_clase' => false,
            'message' => 'El alumno no tiene clase en este salón a esta hora'
        ];

    } catch (RequestException $e) {
        Log::error('Error verificando horario: ' . $e->getMessage());
        return ['tiene_clase' => false, 'message' => 'Error de conexión'];
    }
}

    /**
     * Registrar asistencia
     */
    public function registrarAsistencia($data)
    {
        try {
            $response = $this->client->post('asistencias', [
                'json' => $data
            ]);

            return $response->getStatusCode() >= 200 && $response->getStatusCode() < 300;

        } catch (RequestException $e) {
            Log::error('Error registrando asistencia: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtener asistencias del alumno
     */
    public function getAsistenciasAlumno($email)
    {
        try {
            $response = $this->client->get('asistencias', [
                'query' => [
                    'alumno_email' => "eq.{$email}",
                    'order' => 'fecha_hora_registro.desc',
                    'select' => '*,horarios(*,salones(*))'
                ]
            ]);

            $asistencias = json_decode($response->getBody()->getContents(), true);

            return [
                'success' => true,
                'data' => $asistencias
            ];

        } catch (RequestException $e) {
            Log::error('Error obteniendo asistencias: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Error de conexión'];
        }
    }

/**
 * Buscar profesor por email y contraseña
 */
public function buscarProfesor($email, $password)
{
    try {
        // Extraer id_docente del email (parte antes del @)
        $idDocente = explode('@', $email)[0];
        
        $response = $this->client->get('grupos_detalles', [
            'query' => [
                'id_docente' => "eq.{$idDocente}",
                'select' => 'id_docente,docente,departamento_academico'
            ],
            'headers' => [
                'Range' => '0-0' // Solo necesitamos un registro
            ]
        ]);

        $profesores = json_decode($response->getBody()->getContents(), true);
        
        if (empty($profesores)) {
            return ['success' => false, 'message' => 'Profesor no encontrado'];
        }

        $profesor = $profesores[0];
        
        // Validar contraseña (nombre del docente)
        if (strtolower(trim($profesor['docente'])) !== strtolower(trim($password))) {
            return ['success' => false, 'message' => 'Contraseña incorrecta'];
        }

        return [
            'success' => true,
            'data' => [
                'id_docente' => $profesor['id_docente'],
                'nombre' => $profesor['docente'],
                'departamento' => $profesor['departamento_academico'],
                'email' => $email
            ]
        ];

    } catch (\Exception $e) {
        Log::error('Error buscando profesor: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error de conexión'];
    }
}

/**
 * Obtener datos completos del profesor con sus materias
 */
public function getProfesorCompleto($email)
{
    try {
        $idDocente = explode('@', $email)[0];
        
        // Obtener horarios del profesor
        $response = $this->client->get('horarios', [
            'query' => [
                'id_docente' => "eq.{$idDocente}",
                'select' => '*,salones(clave_salon,nombre)',
                'order' => 'id_dia.asc,hora_inicio.asc'
            ]
        ]);

        $horarios = json_decode($response->getBody()->getContents(), true);

        // Agrupar por materia
        $materias = [];
        foreach ($horarios as $horario) {
            $claveMateria = $horario['clave_materia'];
            
            if (!isset($materias[$claveMateria])) {
                $materias[$claveMateria] = [
                    'clave_materia' => $claveMateria,
                    'nombre_materia' => $horario['nombre_materia'],
                    'semestre' => $horario['semestre'],
                    'grupo' => $horario['letra_grupo'],
                    'num_inscritos' => $horario['num_inscritos'],
                    'horarios' => []
                ];
            }
            
            $materias[$claveMateria]['horarios'][] = [
                'id' => $horario['id'],
                'dia' => $horario['dia'],
                'hora_inicio' => $horario['hora_inicio'],
                'hora_fin' => $horario['hora_fin'],
                'salon' => $horario['salones']['clave_salon'] ?? 'N/A'
            ];
        }

        return [
            'success' => true,
            'data' => [
                'id_docente' => $idDocente,
                'email' => $email
            ],
            'materias' => array_values($materias)
        ];

    } catch (\Exception $e) {
        Log::error('Error obteniendo datos de profesor: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error de conexión'];
    }
}

/**
 * Obtener asistencias de un grupo específico del profesor
 */
public function getAsistenciasGrupo($idDocente, $claveMateria, $fechaInicio = null, $fechaFin = null)
{
    try {
        // Primero obtener los horarios del grupo
        $queryHorarios = [
            'id_docente' => "eq.{$idDocente}",
            'clave_materia' => "eq.{$claveMateria}",
            'select' => 'id'
        ];

        $responseHorarios = $this->client->get('horarios', [
            'query' => $queryHorarios
        ]);

        $horarios = json_decode($responseHorarios->getBody()->getContents(), true);
        
        if (empty($horarios)) {
            return [
                'success' => true,
                'data' => [],
                'message' => 'No se encontraron horarios'
            ];
        }

        $horariosIds = array_column($horarios, 'id');

        // Construir query de asistencias
        $queryAsistencias = [
            'horario_id' => 'in.(' . implode(',', $horariosIds) . ')',
            'select' => '*,horarios(*,salones(clave_salon))',
            'order' => 'fecha_hora_registro.desc'
        ];

        if ($fechaInicio) {
            $queryAsistencias['fecha_hora_registro'] = "gte.{$fechaInicio}";
        }
        if ($fechaFin) {
            $queryAsistencias['fecha_hora_registro'] = "lte.{$fechaFin}";
        }

        $responseAsistencias = $this->client->get('asistencias', [
            'query' => $queryAsistencias
        ]);

        $asistencias = json_decode($responseAsistencias->getBody()->getContents(), true);

        return [
            'success' => true,
            'data' => $asistencias
        ];

    } catch (\Exception $e) {
        Log::error('Error obteniendo asistencias de grupo: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error de conexión'];
    }
}

/**
 * Obtener resumen de asistencias por materia
 */
public function getResumenAsistenciasMateria($idDocente, $claveMateria)
{
    try {
        // Obtener todos los alumnos inscritos del grupo
        $responseGrupo = $this->client->get('grupos_detalles', [
            'query' => [
                'id_docente' => "eq.{$idDocente}",
                'clave_materia' => "eq.{$claveMateria}",
                'select' => 'num_inscritos,id_grupo'
            ]
        ]);

        $grupos = json_decode($responseGrupo->getBody()->getContents(), true);
        
        if (empty($grupos)) {
            return ['success' => false, 'message' => 'Grupo no encontrado'];
        }

        $numInscritos = $grupos[0]['num_inscritos'] ?? 0;

        // Obtener asistencias de la materia
        $asistenciasResult = $this->getAsistenciasGrupo($idDocente, $claveMateria);
        
        if (!$asistenciasResult['success']) {
            return $asistenciasResult;
        }

        $asistencias = $asistenciasResult['data'];

        // Agrupar por alumno
        $resumenAlumnos = [];
        foreach ($asistencias as $asistencia) {
            $email = $asistencia['alumno_email'];
            
            if (!isset($resumenAlumnos[$email])) {
                $resumenAlumnos[$email] = [
                    'alumno_email' => $email,
                    'alumno_nombre' => $asistencia['alumno_nombre'],
                    'total_asistencias' => 0,
                    'asistencias_exitosas' => 0,
                    'asistencias_fallidas' => 0,
                    'ultima_asistencia' => null
                ];
            }
            
            $resumenAlumnos[$email]['total_asistencias']++;
            
            if ($asistencia['validacion_exitosa']) {
                $resumenAlumnos[$email]['asistencias_exitosas']++;
            } else {
                $resumenAlumnos[$email]['asistencias_fallidas']++;
            }
            
            if (!$resumenAlumnos[$email]['ultima_asistencia'] || 
                $asistencia['fecha_hora_registro'] > $resumenAlumnos[$email]['ultima_asistencia']) {
                $resumenAlumnos[$email]['ultima_asistencia'] = $asistencia['fecha_hora_registro'];
            }
        }

        return [
            'success' => true,
            'data' => [
                'num_inscritos' => $numInscritos,
                'alumnos_con_asistencias' => count($resumenAlumnos),
                'resumen_alumnos' => array_values($resumenAlumnos)
            ]
        ];

    } catch (\Exception $e) {
        Log::error('Error obteniendo resumen de asistencias: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error de conexión'];
    }
}

/**
 * Obtener asistencias del profesor (cuando registra su propia asistencia)
 */
public function getAsistenciasProfesor($email)
{
    try {
        $response = $this->client->get('asistencias', [
            'query' => [
                'alumno_email' => "eq.{$email}",
                'order' => 'fecha_hora_registro.desc',
                'select' => '*,horarios(*,salones(*))'
            ]
        ]);

        $asistencias = json_decode($response->getBody()->getContents(), true);

        return [
            'success' => true,
            'data' => $asistencias
        ];

    } catch (\Exception $e) {
        Log::error('Error obteniendo asistencias de profesor: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error de conexión'];
    }
}

/**
 * Verificar si el profesor tiene clase en este horario y salón
 * Validación simplificada: solo verifica que sea el docente asignado
 */
public function verificarHorarioProfesor($salonId, $idDocente)
{
    try {
        date_default_timezone_set('America/Mexico_City');
        $now = Carbon::now();
        $diaSemana = $now->dayOfWeek;
        
        $diaId = $diaSemana == 0 ? 7 : $diaSemana;
        $horaActual = $now->format('H:i:s');

        // ********************************************
        $diaId = 5;
        $horaActual = '11:30:00';
        // ********************************************

        Log::debug("🔍 Verificando horario de PROFESOR", [
            'salon_id' => $salonId,
            'id_docente' => $idDocente,
            'dia_id' => $diaId,
            'hora_actual' => $horaActual
        ]);

        // Buscar clases del profesor en este salón, día y hora actual
        $response = $this->client->get('horarios', [
            'query' => [
                'salon_id' => "eq.{$salonId}",
                'id_docente' => "eq.{$idDocente}",
                'id_dia' => "eq.{$diaId}",
                'hora_inicio' => "lte.{$horaActual}",
                'hora_fin' => "gte.{$horaActual}",
                'select' => '*,salones(clave_salon)'
            ]
        ]);

        $horariosProfesor = json_decode($response->getBody()->getContents(), true);

        Log::debug("📅 Horarios del profesor encontrados", [
            'count' => count($horariosProfesor),
            'horarios' => $horariosProfesor
        ]);

        if (empty($horariosProfesor)) {
            return [
                'tiene_clase' => false,
                'message' => 'No tienes clases programadas en este salón a esta hora'
            ];
        }

        // Si encontró al menos una clase, el profesor SÍ tiene clase aquí
        $horario = $horariosProfesor[0];

        Log::info("🎉 Clase de profesor verificada exitosamente", [
            'materia' => $horario['nombre_materia'],
            'salon' => $horario['salones']['clave_salon'] ?? 'N/A',
            'hora' => $horario['hora_inicio'] . ' - ' . $horario['hora_fin']
        ]);

        return [
            'tiene_clase' => true,
            'horario' => $horario
        ];

    } catch (RequestException $e) {
        Log::error('Error verificando horario de profesor: ' . $e->getMessage());
        return ['tiene_clase' => false, 'message' => 'Error de conexión'];
    }
}


}