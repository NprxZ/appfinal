<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AsistenciaController;
use App\Http\Controllers\ProfesorController;

Route::post('/validar-asistencia', [AsistenciaController::class, 'validarAsistencia']);
Route::post('/consultar-asistencias', [AsistenciaController::class, 'consultarAsistencias']);



// Login de profesor
Route::post('/profesor/login', [ProfesorController::class, 'login']);

// Registrar asistencia del profesor (con token QR)
Route::post('/profesor/asistencia/validar', [ProfesorController::class, 'registrarAsistencia']);

// Obtener materias y horarios del profesor
Route::post('/profesor/materias', [ProfesorController::class, 'getMaterias']);

// Obtener asistencias de un grupo/materia específica
Route::post('/profesor/asistencias/grupo', [ProfesorController::class, 'getAsistenciasGrupo']);

// Obtener resumen de asistencias por materia
Route::post('/profesor/asistencias/resumen', [ProfesorController::class, 'getResumenMateria']);

// Obtener asistencias propias del profesor
Route::post('/profesor/mis-asistencias', [ProfesorController::class, 'getMisAsistencias']);