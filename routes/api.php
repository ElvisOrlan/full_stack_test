<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
*/

// route pour l'authentification
Route::post('/login', [AuthController::class, 'login']);

// Route pour récupérer la liste des roles
Route::get('/roles', [UtilisateurController::class, 'getRoles'])->name('api.users.roles');

// Route pour récupérer les informations de l'utilisateur authentifié
Route::middleware('auth:api')->get('/me', [AuthController::class, 'me']);

// Route pour la déconnexion
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

// Route pour récupérer la liste des utilisateurs
Route::middleware('auth:api')->get('/users', [UtilisateurController::class, 'getUsers'])->name('api.users.index');

// Route pour enregistrer un nouvel utilisateur
Route::middleware('auth:api')->post('users', [UtilisateurController::class, 'enregistrer']);

// Route pour mettre à jour un utilisateur existant
Route::middleware('auth:api')->put('/users/{id}', [UtilisateurController::class, 'update']);

// Route pour supprimer un utilisateur
Route::middleware('auth:api')->delete('/users/{userId}', [UtilisateurController::class, 'destroy']);

// Route pour supprimer plusieurs utilisateurs
Route::middleware('auth:api')->post('/users/suppression-groupe', [UtilisateurController::class, 'suppressionGroupe']);