<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RoqueApiService
{
    private $baseUrl;
    private $token;

    public function __construct()
    {
        $this->baseUrl = config('services.roque.url');
    }

    /**
     * Login y obtener token JWT
     */
    public function login($email, $password)
    {
        try {
            $url = "{$this->baseUrl}/login";
            
            Log::info('Login request a Roque API', [
                'url' => $url,
                'email' => $email
            ]);

            $response = Http::timeout(15)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'User-Agent' => 'AsistenciasApp/1.0',
                    'Accept' => 'application/json'
                ])
                ->post($url, [
                    'email' => $email,
                    'password' => $password
                ]);

            Log::info('Login response', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // ← AJUSTAR PARA LA ESTRUCTURA REAL DE LA API
                if (isset($data['message']['login']['token'])) {
                    $this->token = $data['message']['login']['token'];
                    
                    return [
                        'success' => true,
                        'token' => $this->token,
                        'data' => $data
                    ];
                }
                
                return [
                    'success' => false,
                    'message' => 'Formato de respuesta inválido'
                ];
            }

            // Manejar respuesta 401 (credenciales incorrectas)
            if ($response->status() === 401) {
                return [
                    'success' => false,
                    'message' => 'Credenciales incorrectas'
                ];
            }

            return [
                'success' => false,
                'message' => 'Error al iniciar sesión'
            ];
        } catch (\Exception $e) {
            Log::error('Error en login Roque API: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error de conexión'
            ];
        }
    }

/**
 * Obtener datos del estudiante
 */
public function getEstudiante($token)
{
    try {
        $url = "{$this->baseUrl}/movil/estudiante";
        
        $response = Http::timeout(15)
            ->withHeaders([
                'User-Agent' => 'AsistenciasApp/1.0',
                'Accept' => 'application/json'
            ])
            ->withToken($token)
            ->get($url);

        Log::info('Respuesta estudiante', [
            'status' => $response->status(),
            'body' => $response->body()
        ]);

        if ($response->successful()) {
            $data = $response->json();
            
            // ✅ CORRECCIÓN: Devolver 'data' en lugar de 'message'
            if (isset($data['data'])) {
                return [
                    'success' => true,
                    'data' => $data['data']  // ✅ CAMBIAR AQUÍ TAMBIÉN
                ];
            }
            
            return [
                'success' => true,
                'data' => $data
            ];
        }

        return ['success' => false, 'message' => 'No se pudo obtener datos'];
    } catch (\Exception $e) {
        Log::error('Error al obtener estudiante: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error de conexión'];
    }
}

 /**
 * Obtener horarios del estudiante
 */
public function getHorarios($token)
{
    try {
        $url = "{$this->baseUrl}/movil/estudiante/horarios";
        
        $response = Http::timeout(15)
            ->withHeaders([
                'User-Agent' => 'AsistenciasApp/1.0',
                'Accept' => 'application/json'
            ])
            ->withToken($token)
            ->get($url);

        Log::info('Respuesta horarios', [
            'status' => $response->status(),
            'body' => $response->body()
        ]);

        if ($response->successful()) {
            $data = $response->json();
            
            // ✅ CORRECCIÓN: Devolver 'data' en lugar de 'message'
            if (isset($data['data'])) {
                return [
                    'success' => true,
                    'data' => $data['data']  // ✅ CAMBIAR AQUÍ
                ];
            }
            
            return [
                'success' => true,
                'data' => $data
            ];
        }

        return ['success' => false, 'message' => 'No se pudieron obtener horarios'];
    } catch (\Exception $e) {
        Log::error('Error al obtener horarios: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error de conexión'];
    }
}
}
