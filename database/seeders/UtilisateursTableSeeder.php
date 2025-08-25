<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UtilisateursTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('utilisateurs')->insert([
            [
                'nom'       => 'Admin Principal',
                'email'     => 'admin@example.com',
                'password'  => Hash::make('password123'),
                'role_id'   => 1, // admin
                'actif'     => 1,
                'created_at'=> Carbon::now(),
                'updated_at'=> Carbon::now(),
            ],
            [
                'nom'       => 'Utilisateur Test',
                'email'     => 'user@example.com',
                'password'  => Hash::make('userpass123'),
                'role_id'   => 2, // user
                'actif'     => 1,
                'created_at'=> Carbon::now(),
                'updated_at'=> Carbon::now(),
            ],
            [
                'nom'       => 'Marie Roche',
                'email'     => 'marie.roche@example.com',
                'password'  => Hash::make('mariepass'),
                'role_id'   => 1,
                'actif'     => 0,
                'created_at'=> Carbon::now(),
                'updated_at'=> Carbon::now(),
            ],
            [
                'nom'       => 'David Leroy',
                'email'     => 'david.leroy@example.com',
                'password'  => Hash::make('mypassword'),
                'role_id'   => 2,
                'actif'     => 1,
                'created_at'=> Carbon::now(),
                'updated_at'=> Carbon::now(),
            ],
            [
                'nom'       => 'Julien Caron',
                'email'     => 'julien.caron@example.com',
                'password'  => Hash::make('julienpass'),
                'role_id'   => 2,
                'actif'     => 1,
                'created_at'=> Carbon::now(),
                'updated_at'=> Carbon::now(),
            ],
        ]);
    }
}
