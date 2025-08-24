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
                'email' => 'required|email|max:255|unique:utilisateurs',
                'password' => 'required|string|min:8',
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
     * Mettre à jour un utilisateur existant
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            // Recherche de l'utilisateur
            $user = Utilisateur::find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non trouvé'
                ], 404);
            }

            // règles de validation
            $rules = [
                'nom' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:utilisateurs,email,' . $id,
                'role' => 'required|string|in:admin,user',
                'actif' => 'required|boolean'
            ];

            // validation conditionnelle du mot de passe
            if ($request->filled('password')) {
                $rules['password'] = 'string|min:8';
            }

            // M*messages de validation
            $messages = [
                'nom.required' => 'Le nom est obligatoire',
                'email.required' => 'L\'email est obligatoire',
                'email.email' => 'L\'email doit être valide',
                'email.unique' => 'Cette adresse email est déjà utilisée',
                'role.required' => 'Le rôle est obligatoire',
                'role.in' => 'Le rôle doit être admin (1) ou user (2)',
                'actif.required' => 'Le statut est obligatoire',
                'actif.boolean' => 'Le statut doit être actif ou inactif',
                'password.min' => 'Le mot de passe doit contenir au moins 8 caractères',
                'password.confirmed' => 'La confirmation du mot de passe ne correspond pas'
            ];

            // validation des données
            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreurs de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Mapping du rôle nom vers ID
            $roleMapping = ['admin' => 1, 'user' => 2];
            $roleId = $roleMapping[$request->role] ?? 2;

            // Préparation des données à mettre à jour
            $updateData = [
                'nom' => $request->nom,
                'email' => $request->email,
                'role_id' => $roleId,
                'actif' => $request->actif
            ];

            // Mise à jour du mot de passe si fourni
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            // Mise à jour de l'utilisateur
            $user->update($updateData);

            // Rechargement de l'utilisateur
            $user = Utilisateur::find($id);

            $roleNames = [1 => 'admin', 2 => 'user'];

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur mis à jour avec succès',                
            ], 200);

        } catch (Exception $e) {
            \Illuminate\Support\Facades\Log::error('Erreur lors de la mise à jour de l\'utilisateur: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur'
            ], 500);
        }
    }

    /**
     * Supprimer un utilisateur
     */

    public function destroy(Utilisateur $userId): JsonResponse
    {
        try {
            // vérifier si l'utilisateur tente de supprimer son propre compte
            // if ($utilisateur->id === auth()->id()) {
            //     return response()->json([
            //         'success' => false,
            //         'message' => 'Vous ne pouvez pas supprimer votre propre compte'
            //     ], 403);
            // }

            // supprimer l'utilisateur et retourner une réponse JSON
            $userId->delete();
            return response()->json([
                'success' => true,
                'message' => 'Utilisateur supprimé avec succès'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer plusieurs utilisateur en masse
    */
    public function suppressionGroupe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:utilisateurs,id'
        ]);
        
        try {
            // Vérifier si l'utilisateur connecté est dans la liste des IDs à supprimer
            // if (in_array(auth()->id(), $validated['ids'])) {
            //     return response()->json([
            //         'success' => false,
            //         'message' => 'Vous ne pouvez pas supprimer votre propre compte'
            //     ], 403);
            // }


            // Supprimer les utilisateurs dont les IDs sont dans le tableau
            $deletedCount = Utilisateur::whereIn('id', $validated['ids'])->delete();
            return response()->json([
                'success' => true,
                'message' => "{$deletedCount} utilisateur(s) supprimé(s) avec succès",
                'deleted_count' => $deletedCount
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression des utilisateurs',
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