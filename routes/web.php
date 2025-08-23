<?php

use App\Http\Controllers\UtilisateurController;
use Dflydev\DotAccessData\Util;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::get('/', function () {
//     return view('admin.dashboard');
// });

Route::get('/',[UtilisateurController::class, 'index'])->name('utilisateurs.index');
