<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class AuthService
{
    private $roqueApi;
    private $supabase;

    public function __construct(RoqueApiService $roqueApi, SupabaseService $supabase)
    {
        $this->roqueApi = $roqueApi;
        $this->supabase = $supabase;
    }

    /**
     * Login unificado: detecta si es alumno o profesor
     */
    public function login($email, $password)
    {
        // Detectar tipo de usuario por el formato del correo
        $esAlumno = $this->esCorreoAlumno($email);

        if ($esAlumno) {
            return $this->loginAlumno($email, $password);
        } else {
            return $this->loginProfesor($email, $password);
        }
    }

    /**
     * Verifica si el correo es de alumno (inicia con 'l')
     */
    private function esCorreoAlumno($email)
    {
        $usuario = strtolower(explode('@', $email)[0]);
        return str_starts_with($usuario, 'l');
    }

    /**
     * Login de alumno usando API de Roque
     */
    private function loginAlumno($email, $password)
    {
        $loginResult = $this->roqueApi->login($email, $password);
        
        if (!$loginResult['success']) {
            return [
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ];
        }

        $jwtToken = $loginResult['token'];
        $estudianteResult = $this->roqueApi->getEstudiante($jwtToken);
        
        if (!$estudianteResult['success']) {
            return [
                'success' => false,
                'message' => 'No se pudieron obtener datos del estudiante'
            ];
        }

        return [
            'success' => true,
            'tipo' => 'alumno',
            'token' => $jwtToken,
            'usuario' => $estudianteResult['data'],
            'email' => $email
        ];
    }

    /**
     * Login de profesor usando Supabase
     */
    private function loginProfesor($email, $password)
    {
        try {
            // Buscar profesor en grupos_detalles
            $profesor = $this->supabase->buscarProfesor($email, $password);
            
            if (!$profesor['success']) {
                return [
                    'success' => false,
                    'message' => 'Credenciales incorrectas'
                ];
            }

            return [
                'success' => true,
                'tipo' => 'profesor',
                'usuario' => $profesor['data'],
                'email' => $email
            ];

        } catch (\Exception $e) {
            Log::error('Error en login de profesor: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al iniciar sesión'
            ];
        }
    }

    /**
     * Obtener datos completos del usuario autenticado
     */
    public function getDatosUsuario($authData)
    {
        if ($authData['tipo'] === 'alumno') {
            return $this->getDatosAlumno($authData['token']);
        } else {
            return $this->getDatosProfesor($authData['email']);
        }
    }

    private function getDatosAlumno($token)
    {
        $estudianteResult = $this->roqueApi->getEstudiante($token);
        $horariosResult = $this->roqueApi->getHorarios($token);

        return [
            'success' => true,
            'tipo' => 'alumno',
            'datos' => $estudianteResult['data'],
            'horarios' => $horariosResult['data'][0]['horario'] ?? []
        ];
    }

    private function getDatosProfesor($email)
    {
        $profesor = $this->supabase->getProfesorCompleto($email);
        
        return [
            'success' => true,
            'tipo' => 'profesor',
            'datos' => $profesor['data'],
            'materias' => $profesor['materias'] ?? []
        ];
    }
}