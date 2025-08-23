<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Exception;

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
     * Enregistrer un nouvel utilisateur
     */
    public function enregistrer(Request $request): JsonResponse
    {       
        try {             
            // validation des données recues
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'email' => 'required|string|max:255|unique:utilisateurs',
                'password' => 'required|string',
                'role' => 'required|string|in:admin,user',
                'actif' => 'required|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }
            $validatedData = $validator->validated();             

            // conversion du role en role_id
            $roleMapping = [
                'admin' => 1,
                'user' => 2
            ];
            $validatedData['role_id'] = $roleMapping[$validatedData['role']];
            unset($validatedData['role']);          

            $validatedData['password'] = Hash::make($validatedData['password']);            
        
            // création de l'utilisateur
            $user = Utilisateur::create($validatedData);

            // réponse de succès
            return response()->json([
                'success' => true,
                'message' => 'Utilisateur créé avec succès',
                'data' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                    'actif' => $user->actif,
                    'created_at' => $user->created_at
                ]
            ], 201);

        } catch (Exception $e) {
            // Gestion des erreurs générales
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur lors de l\'enregistrement',
                'error' => $e->getMessage()
            ], 500);
        }
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