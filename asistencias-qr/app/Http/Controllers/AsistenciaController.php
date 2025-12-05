<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RoqueApiService;
use App\Services\SupabaseService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AsistenciaController extends Controller
{
    private $roqueApi;
    private $supabase;

    public function __construct(RoqueApiService $roqueApi, SupabaseService $supabase)
    {
        $this->roqueApi = $roqueApi;
        $this->supabase = $supabase;
    }

    public function validarAsistencia(Request $request)
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

        // 1. Login en API de Roque
        $loginResult = $this->roqueApi->login($request->email, $request->password);
        
        if (!$loginResult['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $jwtToken = $loginResult['token'];

        // 2. Obtener datos del estudiante
        $estudianteResult = $this->roqueApi->getEstudiante($jwtToken);
        if (!$estudianteResult['success']) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudieron obtener datos del estudiante'
            ], 500);
        }

        $estudiante = $estudianteResult['data'];

        // 3. Obtener horarios del estudiante
        $horariosResult = $this->roqueApi->getHorarios($jwtToken);

        Log::debug("📋 Respuesta completa de getHorarios", [
            'horariosResult' => $horariosResult
        ]);


        if (!$horariosResult['success']) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudieron obtener horarios'
            ], 500);
        }

        $horariosAlumno = [];
        if (!empty($horariosResult['data']) && isset($horariosResult['data'][0]['horario'])) {
            $horariosAlumno = $horariosResult['data'][0]['horario'];
            
            // ✅ AGREGAR ESTE LOG
            Log::debug("✅ Horarios extraídos correctamente", [
                'count' => count($horariosAlumno),
                'primer_horario' => $horariosAlumno[0] ?? 'ninguno'
            ]);
        } else {
            // ✅ AGREGAR ESTE LOG PARA VER POR QUÉ FALLA
            Log::error("❌ No se pudieron extraer horarios", [
                'data_empty' => empty($horariosResult['data']),
                'has_horario_key' => isset($horariosResult['data'][0]['horario']),
                'data_structure' => $horariosResult['data'] ?? 'null'
            ]);
        }



        Log::info("📚 Horarios del alumno extraídos", [
            'total' => count($horariosAlumno),
            'materias' => array_column($horariosAlumno, 'nombre_materia')
        ]);

        // Validar que se obtuvieron horarios
        if (empty($horariosAlumno)) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron horarios para este periodo'
            ], 500);
        }

        // 4. Validar token del QR
        $tokenValidation = $this->supabase->validarToken($request->token);
        
        if (!$tokenValidation['valid']) {
            return response()->json([
                'success' => false,
                'message' => $tokenValidation['message']
            ], 400);
        }

        $tokenData = $tokenValidation['token_data'];
        $salonId = $tokenData['salon_id'];

        // 5. Verificar si el alumno tiene clase en ese salón ahora
        $verificacion = $this->supabase->verificarHorarioAlumno($salonId, $horariosAlumno);

        if (!$verificacion['tiene_clase']) {
            // Registrar intento fallido
            $this->supabase->registrarAsistencia([
                'alumno_email' => $request->email,
                'alumno_id' => $estudiante['numero_control'] ?? null,
                'alumno_nombre' => $estudiante['persona'] ?? '',
                'salon_id' => $salonId,
                'token_usado' => $request->token,
                'validacion_exitosa' => false,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'metadata' => json_encode(['error' => $verificacion['message']])
            ]);

            return response()->json([
                'success' => false,
                'registrada' => false,
                'message' => $verificacion['message']
            ], 200);
        }

        // 6. Registrar asistencia exitosa
        $horario = $verificacion['horario'];
        $registrado = $this->supabase->registrarAsistencia([
            'alumno_email' => $request->email,
            'alumno_id' => $estudiante['numero_control'] ?? null,
            'alumno_nombre' => $estudiante['persona'] ?? '',
            'horario_id' => $horario['id'],
            'salon_id' => $salonId,
            'token_usado' => $request->token,
            'validacion_exitosa' => true,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        if (!$registrado) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar asistencia'
            ], 500);
        }

        // 7. Consumir token
        $this->supabase->consumirToken($tokenData['id'], $tokenData['usos_restantes'], $salonId);

        // 8. Respuesta exitosa
        return response()->json([
            'success' => true,
            'registrada' => true,
            'message' => 'Asistencia registrada correctamente',
            'data' => [
                'alumno' => $estudiante['persona'] ?? '',
                'materia' => $horario['nombre_materia'] ?? '',
                'salon' => $tokenData['salones']['clave_salon'] ?? '',
                'hora' => now()->format('H:i:s')
            ]
        ], 200);
    }

    public function consultarAsistencias(Request $request)
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

        $loginResult = $this->roqueApi->login($request->email, $request->password);
        
        if (!$loginResult['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $jwtToken = $loginResult['token'];

        $estudianteResult = $this->roqueApi->getEstudiante($jwtToken);
        if (!$estudianteResult['success']) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudieron obtener datos'
            ], 500);
        }

        $estudiante = $estudianteResult['data'];

        $asistenciasResult = $this->supabase->getAsistenciasAlumno($request->email);

        if (!$asistenciasResult['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener asistencias'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'estudiante' => $estudiante,
            'asistencias' => $asistenciasResult['data']
        ], 200);
    }
}