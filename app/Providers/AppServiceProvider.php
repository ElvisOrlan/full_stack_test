<?php

namespace App\Providers;

// use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;


class AppServiceProvider extends ServiceProvider
{

   /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        
        parent::boot();

        // Routes API avec middleware et préfixe
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        // Routes Web avec middleware
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    
    }

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

 
}
