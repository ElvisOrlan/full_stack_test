<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Administration des Utilisateurs</title>
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
    <style>
    .toggle-password {
        position: absolute;
        right: 10px;
        top: 35px;
        cursor: pointer;
        font-size: 18px;
        user-select: none;
    }
</style>
</head>
<body>
    <!-- Entête de la page -->
    <header>
        <div class="header-container">
            <h1>Administration des Utilisateurs</h1>
            <button id="btn-add-user" class="btn-primary">Ajouter un utilisateur</button>
        </div>
    </header>

    <!-- zone de la page principale -->
    <main>
        <div class="main-container">

            <!-- filtres et recherche sur le tableau -->

            <div class="filters-section">

                <!-- recherche par nom ou par email -->
                <div class="search-container">
                    <input type="text" id="search-input" placeholder="Rechercher par nom ou email...">
                </div>
                <div class="filter-container">

                <!-- filtrer par rôle -->
                    <select id="role-filter">
                        <option value="">Tous les rôles</option>
                        <option value="admin">Admin</option>
                        <option value="utilisateur">Utilisateur</option>
                    </select>

                    <!-- filtrer par status    -->
                    <select id="status-filter">
                        <option value="">Tous les statuts</option>
                        <option value="actif">Actif</option>
                        <option value="inactif">Inactif</option>
                    </select>
                </div>
            </div>

            <!-- selection groupées pour supprission -->
            <div class="bulk-actions">
                <input type="checkbox" id="select-all">
                <label for="select-all">Tout sélectionner</label>
                <button id="bulk-delete" class="btn-danger" disabled>Supprimer la sélection</button>
            </div>

            <!-- e taableau des utilisateurs -->
            <div class="table-container">
                <table id="users-table">                    
                
                <!-- entête du taableau -->
                <thead>
                        <tr>
                            <th>
                                <input type="checkbox" class="select-all-checkbox">
                            </th>
                            <th>Photo</th>
                            <th data-sort="nom">Nom <span class="sort-indicator"></span></th>
                            <th data-sort="email">Email <span class="sort-indicator"></span></th>
                            <th data-sort="role">Rôle <span class="sort-indicator"></span></th>
                            <th data-sort="actif">Statut <span class="sort-indicator"></span></th>
                            <th data-sort="created_at">Date de création <span class="sort-indicator"></span></th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                <!-- fin entête du tableau -->

                    <tbody>
                            <!-- Les information du tableau seront affichées ici -->
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="pagination">
                <button class="btn-page" id="prev-page" disabled>Précédent</button>
                <span class="page-info">Page 1 sur 1</span>
                <button class="btn-page" id="next-page" disabled>Suivant</button>
            </div>
        </div>
    </main>

    <!-- Modal d'ajout d'utilisateur -->
    <div id="user-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">Ajouter un utilisateur</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="user-form">
                    <input type="hidden" id="user-id">
                    
                    <div class="form-group">
                        <label for="user-name">Nom complet *</label>
                        <input type="text" id="user-name" name="name" required>
                    </div>

                    <div class="form-group">
                        <label for="user-email">Email *</label>
                        <input type="email" id="user-email" name="email" required>
                    </div>

                    <div class="form-group" style="position: relative;">
                        <label for="user-password">Mot de passe *</label>
                        <input type="password" id="user-password" name="password">
                        <span class="toggle-password" data-target="user-password">Afficher</span>
                        </div>

                        <div class="form-group" style="position: relative;">
                        <label for="user-password-confirmation">Confirmation du mot de passe *</label>
                        <input type="password" id="user-password-confirmation" name="password-confirmation">
                        <span class="toggle-password" data-target="user-password-confirmation">Afficher</span>
                    </div>

                    <div class="form-group">
                        <label for="user-role">Rôle *</label>
                        <select id="user-role" name="role" required>
                            <option value="">Sélectionner un rôle</option>
                            <option value="admin">Admin</option>
                            <option value="user">Utilisateur</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="user-status">Statut *</label>
                        <select id="user-status" name="status" required>
                            <option value="">Sélectionner un statut</option>
                            <option value="actif">Actif</option>
                            <option value="inactif">Inactif</option>
                        </select>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn-secondary" id="cancel-btn">Annuler</button>
                        <button type="submit" class="btn-primary" id="save-btn">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal de modification d'utilisateur -->
    <!-- <div id="user-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">Ajouter un utilisateur</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="user-form">
                    <input type="hidden" id="user-id">
                    
                    <div class="form-group">
                        <label for="user-name">Nom complet *</label>
                        <input type="text" id="user-name" name="name" required>
                    </div>

                    <div class="form-group">
                        <label for="user-email">Email *</label>
                        <input type="email" id="user-email" name="email" required>
                    </div>

                    <div class="form-group">
                        <label for="user-role">Rôle *</label>
                        <select id="user-role" name="role" required>
                            <option value="">Sélectionner un rôle</option>
                            <option value="admin">Admin</option>
                            <option value="utilisateur">Utilisateur</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="user-status">Statut *</label>
                        <select id="user-status" name="status" required>
                            <option value="">Sélectionner un statut</option>
                            <option value="actif">Actif</option>
                            <option value="inactif">Inactif</option>
                        </select>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn-secondary" id="cancel-btn">Annuler</button>
                        <button type="submit" class="btn-primary" id="save-btn">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    </div> -->

    <!-- Modal de confirmation de suppression -->
    <div id="delete-modal" class="modal">
        <div class="modal-content small">
            <div class="modal-header">
                <h2>Confirmer la suppression</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p id="delete-message">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancel-delete">Annuler</button>
                    <button type="button" class="btn-danger" id="confirm-delete">Supprimer</button>
                </div>
            </div>
        </div>
    </div>

    <!-- création du modal de visualisation des détails -->
    <div id="view-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Détails de l'utilisateur</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="user-details">
                    <div class="detail-item">
                        <strong>Nom :</strong>
                        <span id="detail-name"></span>
                    </div>
                    <div class="detail-item">
                        <strong>Email :</strong>
                        <span id="detail-email"></span>
                    </div>
                    <div class="detail-item">
                        <strong>Rôle :</strong>
                        <span id="detail-role"></span>
                    </div>
                    <div class="detail-item">
                        <strong>Statut :</strong>
                        <span id="detail-status"></span>
                    </div>
                    <div class="detail-item">
                        <strong>Date de création :</strong>
                        <span id="detail-date"></span>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary modal-close">Fermer</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Overlay pour les modals -->
    <div id="modal-overlay" class="modal-overlay"></div>
    <!-- Scripts pour confirmation immediate de mot de passe -->
    <script>
        const passwordInput = document.getElementById('user-password');
        const confirmInput = document.getElementById('user-password-confirmation');
        const form = document.getElementById('user-form');

        // Création d’un petit message d’erreur
        const errorMsg = document.createElement('small');
        errorMsg.style.color = 'red';
        confirmInput.parentNode.appendChild(errorMsg);

        function validatePasswordMatch() {
            if (confirmInput.value === '') {
            errorMsg.textContent = '';
            confirmInput.setCustomValidity('');
            return;
            }

            if (passwordInput.value !== confirmInput.value) {
            errorMsg.textContent = 'Les mots de passe ne correspondent pas.';
            confirmInput.setCustomValidity('Les mots de passe ne correspondent pas.');
            } else {
            errorMsg.textContent = '';
            confirmInput.setCustomValidity('');
            }
        }

        passwordInput.addEventListener('input', validatePasswordMatch);
        confirmInput.addEventListener('input', validatePasswordMatch);

        form.addEventListener('submit', function (e) {
            validatePasswordMatch();
            if (!form.checkValidity()) {
            e.preventDefault(); // Empêche l’envoi si validation échoue
            }
        });
    </script>
    <script>
        document.querySelectorAll('.toggle-password').forEach(function (eyeIcon) {
            eyeIcon.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const isPassword = input.getAttribute('type') === 'password';

            input.setAttribute('type', isPassword ? 'text' : 'password');
            this.textContent = isPassword ? 'Masquer' : 'Afficher'; 
            });
        });
    </script>

    <script src="{{ asset('js/dashboard.js') }}"></script>
</body>
</html>