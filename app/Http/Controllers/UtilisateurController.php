<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UtilisateurController extends Controller
{
    /**
     * appelle de la vue dashboard chargé de la liste des utilisateurs et leurs roles
     */
    public function index()
    {     
        // retourne la vue dashboard
        return view('admin.dashboard');
    }

    /**
     * Retourne les utilisateurs au format JSON pour les requêtes AJAX
     */
    public function getUsers(Request $request): JsonResponse
    {
        $query = Utilisateur::with('role');
        
        // Recherche par nom ou email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Filtre par rôle
        if ($request->filled('role_id')) {
            $query->where('role_id', $request->role_id);
        }
        
        // Filtre par statut
        if ($request->filled('status')) {
            $actif = $request->status === 'actif';
            $query->where('actif', $actif);
        }
        
        // Tri
        $sortField = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');  
        $query->orderBy($sortField, $sortDirection);
        
        $utilisateurs = $query->get();
        
        // Formatage pour le frontend
        $data = $utilisateurs->map(function ($user) {
            $roleName = $user->role->nom_role; // Valeur par défaut
            
            return [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'role' => $roleName, // Toujours une chaîne
                'role_id' => $user->role_id,
                'actif' => $user->actif ? 'actif' : 'inactif',
                'created_at' => $user->created_at->format('Y-m-d'),
                'created_at_formatted' => $user->created_at->format('d/m/Y'),
                'initials' => $this->generateInitials($user->nom)
            ];
        });
        
        // Récupération des rôles pour les filtres
        $roles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'nom' => $role->nom_role
            ];
        });
        
        return response()->json([
            'success' => true,
            'data' => $data,
            'total' => $data->count(),
            'roles' => $roles
        ]);
    }
   
    /**
     * Générer les initiales à partir du nom
     */
  private function generateInitials($nom)
    {
        if (empty($nom)) {
            return 'NU'; // No User
        }
        
        $words = explode(' ', trim($nom));
        $initials = '';
        
        foreach (array_slice($words, 0, 2) as $word) { // Maximum 2 initiales
            if (!empty($word)) {
                $initials .= strtoupper(mb_substr($word, 0, 1));
            }
        }
        
        return $initials ?: 'NU';
    }
}