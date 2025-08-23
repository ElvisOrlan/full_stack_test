<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class utilisateur extends Model
{
    protected $fillable = [
        'nom', 
        'email', 
        'password', 
        'role_id', 
        'actif'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    protected $casts = [
        'verified_at' => 'datetime',
        'role_id' => 'integer',
        'actif' => 'boolean',
        'password' => 'hashed',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

   
    /**
     * Relation avec le modèle Role     
     */
    public function role() {
    return $this->belongsTo(Role::class);
    }
}
