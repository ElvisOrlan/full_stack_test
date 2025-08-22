<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    // Nom de la table
    protected $table = 'roles';


    // Champs remplissables
    protected $fillable = [
        'nom_role', 
        'description_role'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

// Liaison du modele Role au modele Utilisateurs
    public function utilisateur()
    {
        return $this->hasMany(Utilisateur::class);
    }
}
