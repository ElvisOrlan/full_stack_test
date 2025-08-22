<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('roles', function (Blueprint $table) {
        $table->id()->comment('id du role pour la liaison avec la table utilsateur ');
        $table->string('nom_role')->unique()->comment(' 	Nom du role: admin ou user ');
        $table->string('description_role')->nullable()->comment(' 	La table roles définit les différents niveaux d’accès ou responsabilités attribués aux utilisateurs de l’application. Chaque rôle représente une catégorie fonctionnelle (ex. : administrateur, utilisateur) et peut être utilisé pour contrôler les permissions, l\’affichage de contenu, ou l\’accès à certaines fonctionnalités.');
        $table->timestamps();
    });

    // j'insère par défaut les roles Admin et User puisque ce sont des données statiques
    DB::table('roles')->insert([
        [
            'nom_role' => 'Admin',
            'description_role' => 'Administrateur du système',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'nom_role' => 'User',
            'description_role' => 'Utilisateur standard',
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
        Schema::dropIfExists('roles');
    }
};
