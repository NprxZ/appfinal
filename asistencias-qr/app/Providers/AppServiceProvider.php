<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\RoqueApiService;
use App\Services\SupabaseService;
use App\Services\AuthService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Registrar servicios como singletons
        $this->app->singleton(RoqueApiService::class, function ($app) {
            return new RoqueApiService();
        });

        $this->app->singleton(SupabaseService::class, function ($app) {
            return new SupabaseService();
        });

        // ✅ NUEVO: Registrar AuthService
        $this->app->singleton(AuthService::class, function ($app) {
            return new AuthService(
                $app->make(RoqueApiService::class),
                $app->make(SupabaseService::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}