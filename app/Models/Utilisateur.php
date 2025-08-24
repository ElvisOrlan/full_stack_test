<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class Utilisateur extends Authenticatable implements JWTSubject{
 
    use HasFactory, Notifiable;
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return []; 
    }

    protected $table = 'utilisateurs';
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
