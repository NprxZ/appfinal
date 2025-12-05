<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Services\SupabaseService;
use App\Services\RoqueApiService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProfesorController extends Controller
{
    private $authService;
    private $supabase;
    private $roqueApi;

    public function __construct(
        AuthService $authService, 
        SupabaseService $supabase,
        RoqueApiService $roqueApi
    ) {
        $this->authService = $authService;
        $this->supabase = $supabase;
        $this->roqueApi = $roqueApi;
    }

    /**
     * Login del profesor
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos incompletos',
                'errors' => $validator->errors()
            ], 400);
        }

        $loginResult = $this->authService->login($request->email, $request->password);

        if (!$loginResult['success']) {
            return response()->json([
                'success' => false,
                'message' => $loginResult['message']
            ], 401);
        }

        // Verificar que sea profesor
        if ($loginResult['tipo'] !== 'profesor') {
            return response()->json([
                'success' => false,
                'message' => 'Acceso no autorizado para este tipo de usuario'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'tipo' => 'profesor',
            'usuario' => $loginResult['usuario']
        ], 200);
    }

    /**
     * Obtener materias y horarios del profesor
     */
    public function getMaterias(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email requerido',
                'errors' => $validator->errors()
            ], 400);
        }

        $resultado = $this->supabase->getProfesorCompleto($request->email);

        if (!$resultado['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener materias'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => $resultado['materias']
        ], 200);
    }

    /**
     * Obtener asistencias de un grupo/materia específica
     */
    public function getAsistenciasGrupo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'clave_materia' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos incompletos',
                'errors' => $validator->errors()
            ], 400);
        }

        $idDocente = explode('@', $request->email)[0];
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');

        $resultado = $this->supabase->getAsistenciasGrupo(
            $idDocente, 
            $request->clave_materia,
            $fechaInicio,
            $fechaFin
        );

        if (!$resultado['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener asistencias'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => $resultado['data']
        ], 200);
    }

    /**
     * Obtener resumen de asistencias por materia
     */
    public function getResumenMateria(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'clave_materia' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos incompletos',
                'errors' => $validator->errors()
            ], 400);
        }

        $idDocente = explode('@', $request->email)[0];

        $resultado = $this->supabase->getResumenAsistenciasMateria(
            $idDocente, 
            $request->clave_materia
        );

        if (!$resultado['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener resumen'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => $resultado['data']
        ], 200);
    }

    /**
     * Obtener asistencias propias del profesor
     */
    public function getMisAsistencias(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email requerido',
                'errors' => $validator->errors()
            ], 400);
        }

        $resultado = $this->supabase->getAsistenciasProfesor($request->email);

        if (!$resultado['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener asistencias'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => $resultado['data']
        ], 200);
    }

 /**
 * Registrar asistencia del profesor (usa token QR)
 */
public function registrarAsistencia(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required',
        'token' => 'required|string'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Datos incompletos',
            'errors' => $validator->errors()
        ], 400);
    }

    // 1. Login del profesor
    $loginResult = $this->authService->login($request->email, $request->password);
    
    if (!$loginResult['success']) {
        return response()->json([
            'success' => false,
            'message' => 'Credenciales incorrectas'
        ], 401);
    }

    if ($loginResult['tipo'] !== 'profesor') {
        return response()->json([
            'success' => false,
            'message' => 'Esta ruta es solo para profesores'
        ], 403);
    }

    $email = $request->email;
    $idDocente = explode('@', $email)[0];
    $nombreUsuario = $loginResult['usuario']['nombre'] ?? '';

    Log::info("👨‍🏫 Registro de asistencia de PROFESOR", [
        'email' => $email,
        'id_docente' => $idDocente
    ]);

    // 2. Validar token del QR
    $tokenValidation = $this->supabase->validarToken($request->token);
    
    if (!$tokenValidation['valid']) {
        return response()->json([
            'success' => false,
            'message' => $tokenValidation['message']
        ], 400);
    }

    $tokenData = $tokenValidation['token_data'];
    $salonId = $tokenData['salon_id'];

    // 3. ✅ CAMBIO PRINCIPAL: Usar verificarHorarioProfesor en lugar de verificarHorarioAlumno
    $verificacion = $this->supabase->verificarHorarioProfesor($salonId, $idDocente);

    if (!$verificacion['tiene_clase']) {
        // Registrar intento fallido
        $this->supabase->registrarAsistencia([
            'alumno_email' => $email,
            'alumno_id' => $idDocente,
            'alumno_nombre' => $nombreUsuario,
            'salon_id' => $salonId,
            'token_usado' => $request->token,
            'validacion_exitosa' => false,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'metadata' => json_encode([
                'error' => $verificacion['message'],
                'tipo_usuario' => 'profesor'
            ])
        ]);

        return response()->json([
            'success' => false,
            'registrada' => false,
            'message' => $verificacion['message']
        ], 200);
    }

    // 4. Registrar asistencia exitosa
    $horario = $verificacion['horario'];
    $registrado = $this->supabase->registrarAsistencia([
        'alumno_email' => $email,
        'alumno_id' => $idDocente,
        'alumno_nombre' => $nombreUsuario,
        'horario_id' => $horario['id'],
        'salon_id' => $salonId,
        'token_usado' => $request->token,
        'validacion_exitosa' => true,
        'ip_address' => $request->ip(),
        'user_agent' => $request->userAgent(),
        'metadata' => json_encode([
            'tipo_usuario' => 'profesor'
        ])
    ]);

    if (!$registrado) {
        return response()->json([
            'success' => false,
            'message' => 'Error al registrar asistencia'
        ], 500);
    }

    // 5. Consumir token
    $this->supabase->consumirToken($tokenData['id'], $tokenData['usos_restantes'], $salonId);

    // 6. Respuesta exitosa
    return response()->json([
        'success' => true,
        'registrada' => true,
        'message' => 'Asistencia registrada correctamente',
        'data' => [
            'usuario' => $nombreUsuario,
            'tipo' => 'profesor',
            'materia' => $horario['nombre_materia'] ?? '',
            'salon' => $tokenData['salones']['clave_salon'] ?? '',
            'hora' => now()->format('H:i:s')
        ]
    ], 200);
}

    /**
     * Convertir horarios de profesor al formato esperado
     */
    private function convertirHorariosProfesor($materias)
    {
        $horariosConvertidos = [];
        
        foreach ($materias as $materia) {
            foreach ($materia['horarios'] as $horario) {
                $indexExistente = null;
                foreach ($horariosConvertidos as $index => $h) {
                    if (isset($h['id_horario']) && $h['id_horario'] == $horario['id']) {
                        $indexExistente = $index;
                        break;
                    }
                }

                $dia = strtolower($horario['dia']);
                $rangoHorario = substr($horario['hora_inicio'], 0, 5) . '-' . substr($horario['hora_fin'], 0, 5);
                
                if ($indexExistente !== null) {
                    $horariosConvertidos[$indexExistente][$dia] = $rangoHorario;
                    $horariosConvertidos[$indexExistente]["{$dia}_clave_salon"] = $horario['salon'];
                } else {
                    $horariosConvertidos[] = [
                        'id_grupo' => $horario['id'],
                        'id_horario' => $horario['id'],
                        'nombre_materia' => $materia['nombre_materia'],
                        'clave_materia' => $materia['clave_materia'],
                        $dia => $rangoHorario,
                        "{$dia}_clave_salon" => $horario['salon']
                    ];
                }
            }
        }
        
        return $horariosConvertidos;
    }
}