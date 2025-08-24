<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UtilisateurController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route pour récupérer la liste des utilisateurs
Route::get('/users', [UtilisateurController::class, 'getUsers'])->name('api.users.index');

// Route pour enregistrer un nouvel utilisateur
Route::post('users', [UtilisateurController::class, 'enregistrer']);

// Route pour mettre à jour un utilisateur existant
Route::put('/users/{id}', [UtilisateurController::class, 'update']);

// Route pour supprimer un utilisateur
Route::delete('/users/{utilisateur}', [UtilisateurController::class, 'destroy']);