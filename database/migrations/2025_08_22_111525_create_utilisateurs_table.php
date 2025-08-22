<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id()->comment('identifiant de l\'utilisateur');
            $table->string('nom')->comment('nom complet de l\'utilisateur');
            $table->string('email')->unique()->comment('adresse email de l\'utilisateur, doit être unique');
            $table->string('password')->comment('mot de passe hash& de l\'utilisateur');
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade')->comment('clé étrangère qui lie la table utilisateur à la table roles');
            $table->boolean('actif')->default(false)->comment('indique si l\'utilisateur est actif ou non, par défaut il est inactif');
            $table->timestamps();
        });

         DB::table('utilisateurs')->insert([
            [
                'nom' => 'Elvis Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin123'),
                'role_id' => 1, 
                'actif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Elvis User',
                'email' => 'user@example.com',
                'password' => Hash::make('user123'),
                'role_id' => 2,
                'actif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Elvis Autre User',
                'email' => 'autre@example.com',
                'password' => Hash::make('autre123'),
                'role_id' => 2,
                'actif' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
