<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration des Utilisateurs</title>
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
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
                            <th data-sort="name">Nom <span class="sort-indicator"></span></th>
                            <th data-sort="email">Email <span class="sort-indicator"></span></th>
                            <th data-sort="role">Rôle <span class="sort-indicator"></span></th>
                            <th data-sort="status">Statut <span class="sort-indicator"></span></th>
                            <th data-sort="created_date">Date de création <span class="sort-indicator"></span></th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                <!-- fin entête du tableau -->

                    <tbody>
                        <!-- Données Utilisateur  -->
                        <tr data-user-id="1">
                            <td><input type="checkbox" class="user-checkbox" value="1"></td>
                            <td>
                                <div class="profile-pic">JD</div>
                            </td>
                            <td>Jean françois Konan</td>
                            <td>jean.françois@mail.com</td>
                            <td><span class="role-badge admin">Admin</span></td>
                            <td><span class="status-badge actif">Actif</span></td>
                            <td>2024-01-15</td>
                            <td>

                                <!-- boutons d'action -->
                                <div class="actions-buttons">
                                    <button class="btn-action btn-view" data-action="view" data-user-id="1" title="Voir">👁</button>
                                    <button class="btn-action btn-edit" data-action="edit" data-user-id="1" title="Modifier">✏️</button>
                                    <button class="btn-action btn-delete" data-action="delete" data-user-id="1" title="Supprimer">🗑️</button>
                                </div>
                            </td>
                        </tr>

                        <tr data-user-id="2">
                            <td><input type="checkbox" class="user-checkbox" value="2"></td>
                            <td>
                                <div class="profile-pic">MS</div>
                            </td>
                            <td>Kacou hugues Bertin</td>
                            <td>kacou.hugues@mail.com</td>
                            <td><span class="role-badge utilisateur">Utilisateur</span></td>
                            <td><span class="status-badge actif">Actif</span></td>
                            <td>2024-02-20</td>
                            <td>
                                <div class="actions-buttons">
                                    <button class="btn-action btn-view" data-action="view" data-user-id="2" title="Voir">👁</button>
                                    <button class="btn-action btn-edit" data-action="edit" data-user-id="2" title="Modifier">✏️</button>
                                    <button class="btn-action btn-delete" data-action="delete" data-user-id="2" title="Supprimer">🗑️</button>
                                </div>
                            </td>
                        </tr>

                        <tr data-user-id="3">
                            <td><input type="checkbox" class="user-checkbox" value="3"></td>
                            <td>
                                <div class="profile-pic">PL</div>
                            </td>
                            <td>N'guessan Lambert</td>
                            <td>nguessan.lambert@mail.com</td>
                            <td><span class="role-badge utilisateur">Utilisateur</span></td>
                            <td><span class="status-badge inactif">Inactif</span></td>
                            <td>2024-03-10</td>
                            <td>
                                <div class="actions-buttons">
                                    <button class="btn-action btn-view" data-action="view" data-user-id="3" title="Voir">👁</button>
                                    <button class="btn-action btn-edit" data-action="edit" data-user-id="3" title="Modifier">✏️</button>
                                    <button class="btn-action btn-delete" data-action="delete" data-user-id="3" title="Supprimer">🗑️</button>
                                </div>
                            </td>
                        </tr>

                        <tr data-user-id="4">
                            <td><input type="checkbox" class="user-checkbox" value="4"></td>
                            <td>
                                <div class="profile-pic">AB</div>
                            </td>
                            <td>Zocou Bernard</td>
                            <td>zocou.bernard@mail.com</td>
                            <td><span class="role-badge admin">Admin</span></td>
                            <td><span class="status-badge actif">Actif</span></td>
                            <td>2024-01-25</td>
                            <td>
                                <div class="actions-buttons">
                                    <button class="btn-action btn-view" data-action="view" data-user-id="4" title="Voir">👁</button>
                                    <button class="btn-action btn-edit" data-action="edit" data-user-id="4" title="Modifier">✏️</button>
                                    <button class="btn-action btn-delete" data-action="delete" data-user-id="4" title="Supprimer">🗑️</button>
                                </div>
                            </td>
                        </tr>

                        <tr data-user-id="5">
                            <td><input type="checkbox" class="user-checkbox" value="5"></td>
                            <td>
                                <div class="profile-pic">LM</div>
                            </td>
                            <td>Lakota Martin</td>
                            <td>lakota.martin@mail.com</td>
                            <td><span class="role-badge utilisateur">Utilisateur</span></td>
                            <td><span class="status-badge actif">Actif</span></td>
                            <td>2024-04-05</td>
                            <td>
                                <div class="actions-buttons">
                                    <button class="btn-action btn-view" data-action="view" data-user-id="5" title="Voir">👁</button>
                                    <button class="btn-action btn-edit" data-action="edit" data-user-id="5" title="Modifier">✏️</button>
                                    <button class="btn-action btn-delete" data-action="delete" data-user-id="5" title="Supprimer">🗑️</button>
                                </div>
                            </td>
                        </tr>

                        <tr data-user-id="6">
                            <td><input type="checkbox" class="user-checkbox" value="6"></td>
                            <td>
                                <div class="profile-pic">SD</div>
                            </td>
                            <td>N'guoran parfait</td>
                            <td>ngoran.parfait@mail.com</td>
                            <td><span class="role-badge utilisateur">Utilisateur</span></td>
                            <td><span class="status-badge inactif">Inactif</span></td>
                            <td>2024-02-15</td>
                            <td>
                                <div class="actions-buttons">
                                    <button class="btn-action btn-view" data-action="view" data-user-id="6" title="Voir">👁</button>
                                    <button class="btn-action btn-edit" data-action="edit" data-user-id="6" title="Modifier">✏️</button>
                                    <button class="btn-action btn-delete" data-action="delete" data-user-id="6" title="Supprimer">🗑️</button>
                                </div>
                            </td>
                        </tr>

                        <tr data-user-id="7">
                            <td><input type="checkbox" class="user-checkbox" value="7"></td>
                            <td>
                                <div class="profile-pic">MR</div>
                            </td>
                            <td>Kouakou Marc Olivier </td>
                            <td>kouakou.marc@email.com</td>
                            <td><span class="role-badge utilisateur">Utilisateur</span></td>
                            <td><span class="status-badge actif">Actif</span></td>
                            <td>2024-03-22</td>
                            <td>
                                <div class="actions-buttons">
                                    <button class="btn-action btn-view" data-action="view" data-user-id="7" title="Voir">👁</button>
                                    <button class="btn-action btn-edit" data-action="edit" data-user-id="7" title="Modifier">✏️</button>
                                    <button class="btn-action btn-delete" data-action="delete" data-user-id="7" title="Supprimer">🗑️</button>
                                </div>
                            </td>
                        </tr>

                        <tr data-user-id="8">
                            <td><input type="checkbox" class="user-checkbox" value="8"></td>
                            <td>
                                <div class="profile-pic">CB</div>
                            </td>
                            <td>Zossou blanchard</td>
                            <td>zossou.blanchard@mail.com</td>
                            <td><span class="role-badge admin">Admin</span></td>
                            <td><span class="status-badge actif">Actif</span></td>
                            <td>2024-01-30</td>
                            <td>
                                <div class="actions-buttons">
                                    <button class="btn-action btn-view" data-action="view" data-user-id="8" title="Voir">👁</button>
                                    <button class="btn-action btn-edit" data-action="edit" data-user-id="8" title="Modifier">✏️</button>
                                    <button class="btn-action btn-delete" data-action="delete" data-user-id="8" title="Supprimer">🗑️</button>
                                </div>
                            </td>
                        </tr>
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

    <!-- Modal d'ajout/modification d'utilisateur -->
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
    </div>

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

    <script src="{{ asset('js/dashboard.js') }}"></script>
</body>
</html>