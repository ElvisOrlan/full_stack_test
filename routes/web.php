<?php

use App\Http\Controllers\UtilisateurController;
use Dflydev\DotAccessData\Util;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });

// Route pour afficher la liste des utilisateurs
Route::get('/dashboard',[UtilisateurController::class, 'index'])->name('utilisateurs.index');

// Route pour afficher le formulaire de connexion
Route::get('/',[UtilisateurController::class,'connexion'])->name('utilisateurs.connexion');