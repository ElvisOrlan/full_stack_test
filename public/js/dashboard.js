// gestionnaire des utilisateurs et des actions
class UserManager {
    constructor() {
        this.users = [];
        this.filteredUsers = [];
        this.currentSort = { field: null, direction: "asc" };
        this.roles = [];
        this.isLoading = false;
        this.init();
    }

    // initialisation et chargement des données depuis l'API
    async init() {
        this.bindEvents();
        await this.loadUsersFromAPI();
    }

    // Chargement des utilisateurs depuis l'API
    async loadUsersFromAPI(filters = {}) {
        try {
            this.isLoading = true;
            this.showLoadingState();

            // Construction des parametre de la  requête
            const params = new URLSearchParams();

            if (filters.search) {
                params.append("search", filters.search);
            }
            if (filters.role_id) {
                params.append("role_id", filters.role_id);
            }
            if (filters.status) {
                params.append("status", filters.status);
            }
            if (filters.sort_by) {
                params.append("sort_by", filters.sort_by);
            }
            if (filters.sort_direction) {
                params.append("sort_direction", filters.sort_direction);
            }

            const response = await fetch(`/api/users?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                // formattage des variables pour correspondre au format qui est attendu par le  front
                this.users = result.data.map((user) => ({
                    id: user.id,
                    name: user.nom,
                    email: user.email,
                    role: user.role,
                    role_id: user.role_id,
                    status: user.actif,
                    created_date: user.created_at,
                    initials: user.initials,
                }));

                this.roles = Array.isArray(result.roles) ? result.roles : [];
                this.filteredUsers = [...this.users];
                this.renderTable();
                this.populateRoleFilter();
            } else {
                throw new Error(
                    result.message || "Erreur lors du chargement des données"
                );
            }
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs:", error);
            this.showNotification(
                "Erreur lors du chargement des utilisateurs",
                "error"
            );
            this.users = [];
            this.filteredUsers = [];
            this.roles = [];
            this.renderTable();
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    // chargement
    showLoadingState() {
        const tbody = document.querySelector("#users-table tbody");
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <div style="width: 20px; height: 20px; border: 2px solid #e2e8f0; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        Chargement des utilisateurs...
                    </div>
                </td>
            </tr>
        `;
    }

    // Masquage de l'état de chargement
    hideLoadingState() {
        // La methode renderTable() va remplacé le contenu de chargement
    }

    // chargement du filtre de rôles avec les données de l'API
    populateRoleFilter() {
        const roleFilter = document.getElementById("role-filter");
        if (!roleFilter) {
            return;
        }

        const currentValue = roleFilter.value;
        roleFilter.innerHTML = '<option value="">Tous les rôles</option>';

        if (Array.isArray(this.roles) && this.roles.length > 0) {
            this.roles.forEach((role) => {
                if (role && role.nom) {
                    const option = document.createElement("option");
                    option.value = role.id;
                    option.textContent =
                        role.nom.charAt(0).toUpperCase() + role.nom.slice(1);
                    roleFilter.appendChild(option);
                }
            });
        } else {
            // Fallback avec des rôles par défaut si l'API ne retourne rien
            const defaultRoles = [
                { id: "admin", nom: "Administrateur" },
                { id: "user", nom: "Utilisateur" },
            ];

            defaultRoles.forEach((role) => {
                const option = document.createElement("option");
                option.value = role.id;
                option.textContent = role.nom;
                roleFilter.appendChild(option);
            });
        }

        // Restaurer la valeur précédente si elle existe
        if (currentValue) {
            roleFilter.value = currentValue;
        }
    }

    // Liaison entre les événements
    bindEvents() {
        // Action du bouton d'ajout des utilisateur
        document
            .getElementById("btn-add-user")
            .addEventListener("click", () => {
                this.openUserModal();
            });

        // recherche instantané
        let searchTimeout;
        document
            .getElementById("search-input")
            .addEventListener("input", (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterUsers();
                }, 300);
            });

        // règles générales de filtrage

        // filtre par role
        document
            .getElementById("role-filter")
            .addEventListener("change", () => {
                this.filterUsers();
            });

        // filtre par status
        document
            .getElementById("status-filter")
            .addEventListener("change", () => {
                this.filterUsers();
            });

        // Triage des colonnes
        document.querySelectorAll("th[data-sort]").forEach((th) => {
            th.addEventListener("click", () => {
                const field = th.dataset.sort;
                this.sortUsers(field);
            });
        });

        // option des sélections multiple
        document
            .getElementById("select-all")
            .addEventListener("change", (e) => {
                this.toggleAllSelection(e.target.checked);
            });

        document.getElementById("bulk-delete").addEventListener("click", () => {
            this.bulkDelete();
        });

        // formulaire de creation d'un utilisateur
        document.getElementById("user-form").addEventListener("submit", (e) => {
            e.preventDefault();
            this.saveUser();
        });

        // fermeture modale
        document
            .querySelectorAll(".modal-close, #cancel-btn, #cancel-delete")
            .forEach((btn) => {
                btn.addEventListener("click", () => {
                    this.closeModals();
                });
            });

        // overlay modale
        document
            .getElementById("modal-overlay")
            .addEventListener("click", () => {
                this.closeModals();
            });

        // confirmation de la suppression
        document
            .getElementById("confirm-delete")
            .addEventListener("click", () => {
                this.confirmDelete();
            });

        // événements pour les actions des lignes
        document
            .getElementById("users-table")
            .addEventListener("click", (e) => {
                if (e.target.classList.contains("btn-action")) {
                    const action = e.target.dataset.action;
                    const userId = parseInt(e.target.dataset.userId);
                    this.handleRowAction(action, userId);
                }

                if (e.target.classList.contains("user-checkbox")) {
                    this.updateBulkActionButton();
                }
            });
    }

    // filtrage des utilisateurs via l'API
    async filterUsers() {
        if (this.isLoading) return;

        const searchTerm = document
            .getElementById("search-input")
            .value.toLowerCase();
        const roleFilter = document.getElementById("role-filter").value;
        const statusFilter = document.getElementById("status-filter").value;

        const filters = {};

        if (searchTerm) {
            filters.search = searchTerm;
        }
        if (roleFilter) {
            filters.role_id = roleFilter;
        }
        if (statusFilter) {
            filters.status = statusFilter;
        }

        // Conserver le tri actuel
        if (this.currentSort.field) {
            filters.sort_by = this.mapSortFieldToAPI(this.currentSort.field);
            filters.sort_direction = this.currentSort.direction;
        }

        await this.loadUsersFromAPI(filters);
    }

    // Mapping des champs de tri pour l'API
    mapSortFieldToAPI(field) {
        const mapping = {
            name: "nom",
            email: "email",
            role: "role_id",
            status: "actif",
            created_date: "created_at",
        };
        return mapping[field] || field;
    }

    // triage des utilisateurs via l'API
    async sortUsers(field) {
        if (this.isLoading) return;

        if (this.currentSort.field === field) {
            this.currentSort.direction =
                this.currentSort.direction === "asc" ? "desc" : "asc";
        } else {
            this.currentSort.field = field;
            this.currentSort.direction = "asc";
        }

        // récupération des filtres
        const searchTerm = document.getElementById("search-input").value;
        const roleFilter = document.getElementById("role-filter").value;
        const statusFilter = document.getElementById("status-filter").value;

        const filters = {
            sort_by: this.mapSortFieldToAPI(this.currentSort.field),
            sort_direction: this.currentSort.direction,
        };

        if (searchTerm) filters.search = searchTerm;
        if (roleFilter) filters.role_id = roleFilter;
        if (statusFilter) filters.status = statusFilter;

        this.updateSortIndicators();
        await this.loadUsersFromAPI(filters);
    }

    // mise à jour du triage
    updateSortIndicators() {
        document.querySelectorAll(".sort-indicator").forEach((indicator) => {
            indicator.textContent = "";
        });

        if (this.currentSort.field) {
            const indicator = document.querySelector(
                `th[data-sort="${this.currentSort.field}"] .sort-indicator`
            );
            if (indicator) {
                indicator.textContent =
                    this.currentSort.direction === "asc" ? "↑" : "↓";
            }
        }
    }

    // rendu de l'affichage du tableau
    renderTable() {
        const tbody = document.querySelector("#users-table tbody");
        tbody.innerHTML = "";

        if (this.filteredUsers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                        Aucun utilisateur trouvé
                    </td>
                </tr>
            `;
            this.updateBulkActionButton();
            return;
        }

        this.filteredUsers.forEach((user) => {
            const row = this.createUserRow(user);
            tbody.appendChild(row);
        });

        this.updateBulkActionButton();
    }

    // creation d'un nouveau utilisateur
    createUserRow(user) {
        const row = document.createElement("tr");
        row.dataset.userId = user.id;

        // Utiliser les initiales de l'API ou générer à partir du nom
        const initials = user.initials || this.generateInitials(user.name);

        // sécurisé les valeurs qui peut être nul
        const roleName = user.role || "utilisateur";
        const statusName = user.status || "inactif";

        row.innerHTML = `
            <td><input type="checkbox" class="user-checkbox" value="${
                user.id
            }"></td>
            <td>
                <div class="profile-pic">${initials}</div>
            </td>
            <td>${user.name || "N/A"}</td>
            <td>${user.email || "N/A"}</td>
            <td><span class="role-badge ${roleName}">${
            roleName.charAt(0).toUpperCase() + roleName.slice(1)
        }</span></td>
            <td><span class="status-badge ${statusName}">${
            statusName.charAt(0).toUpperCase() + statusName.slice(1)
        }</span></td>
            <td>${this.formatDate(user.created_date)}</td>
            <td>
                <div class="actions-buttons">
                    <button class="btn-action btn-view" data-action="view" data-user-id="${
                        user.id
                    }" title="Voir">👁</button>
                    <button class="btn-action btn-edit" data-action="edit" data-user-id="${
                        user.id
                    }" title="Modifier">✏️</button>
                    <button class="btn-action btn-delete" data-action="delete" data-user-id="${
                        user.id
                    }" title="Supprimer">🗑️</button>
                </div>
            </td>
        `;

        return row;
    }

    // méthode pour générer les initiales côté client en cas de fallback
    generateInitials(name) {
        if (!name) return "NU";

        return name
            .split(" ")
            .slice(0, 2) // Maximum 2 mots
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    }

    // formatage de la date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("fr-FR");
    }

    //gestion des actions par ligne
    handleRowAction(action, userId) {
        const user = this.users.find((u) => u.id === userId);

        switch (action) {
            case "view":
                this.viewUser(user);
                break;
            case "edit":
                this.editUser(user);
                break;
            case "delete":
                this.deleteUser(userId);
                break;
        }
    }

    //ouvrir le modale utilisateur (ajouter/modifier)
    openUserModal(user = null) {
        const modal = document.getElementById("user-modal");
        const overlay = document.getElementById("modal-overlay");
        const title = document.getElementById("modal-title");
        const form = document.getElementById("user-form");

        if (user) {
            title.textContent = "Modifier l'utilisateur";
            this.fillUserForm(user);
        } else {
            title.textContent = "Ajouter un utilisateur";
            form.reset();
            document.getElementById("user-id").value = "";
        }

        // charger  le selecteur des rôles dans le formulaire
        this.populateModalRoleSelect();

        modal.classList.add("active");
        overlay.classList.add("active");
    }

    // Chargement du select des rôles dans la modale
    populateModalRoleSelect() {
        const roleSelect = document.getElementById("user-role");
        if (!roleSelect) return;

        const currentValue = roleSelect.value;
        roleSelect.innerHTML = "";

        // vérifier si this.roles existe
        if (Array.isArray(this.roles)) {
            this.roles.forEach((role) => {
                if (role && (role.nom || role.name)) {
                    const option = document.createElement("option");
                    const roleName = role.nom || role.name || "role";
                    option.value = roleName.toLowerCase();
                    option.textContent =
                        roleName.charAt(0).toUpperCase() + roleName.slice(1);
                    roleSelect.appendChild(option);
                }
            });
        } else {
            // Fallback avec des rôles par défaut si l'API ne retourne rien
            const defaultRoles = [{ nom: "user" }, { nom: "admin" }];

            defaultRoles.forEach((role) => {
                const option = document.createElement("option");
                option.value = role.nom.toLowerCase();
                option.textContent =
                    role.nom.charAt(0).toUpperCase() + role.nom.slice(1);
                roleSelect.appendChild(option);
            });
        }

        if (currentValue) {
            roleSelect.value = currentValue;
        }
    }

    // remplissage du formulaire des utilisateur
    fillUserForm(user) {
        document.getElementById("user-id").value = user.id;
        document.getElementById("user-name").value = user.name;
        document.getElementById("user-email").value = user.email;
        document.getElementById("user-password").value = "";
        document.getElementById("user-password-confirmation").value = "";
        document.getElementById("user-role").value = user.role;
        document.getElementById("user-status").value = user.status;
    }

    // Sauvegarde de l'utilisateur
    async saveUser() {
        const formData = new FormData(document.getElementById("user-form"));
        const userData = {
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            role: formData.get("role"),
            status: formData.get("status"),
            password: formData.get("password"),
        };

        if (!this.validateUserData(userData)) {
            return;
        }

        const userId = document.getElementById("user-id").value;

        try {
            if (userId) {
                // modification via API
                await this.updateUserAPI(parseInt(userId), userData);
            } else {
                // ajout via API
                await this.addUserAPI(userData);
            }

            this.closeModals();
            await this.loadUsersFromAPI();
            this.showNotification(
                "Utilisateur enregistré avec succès",
                "success"
            );
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            this.showNotification("Erreur lors de l'enregistrement", "error");
        }
    }

    // ajouter d'un utilisateur via API
    async addUserAPI(userData) {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                )?.content,
            },
            body: JSON.stringify({
                nom: userData.name,
                email: userData.email,
                role: userData.role,
                actif: userData.status === "actif",
                password: userData.password,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de l'ajout");
        }

        return response.json();
    }

    // modification d'un utilisateur via API
    async updateUserAPI(userId, userData) {
        const response = await fetch(`/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                )?.content,
            },
            body: JSON.stringify({
                nom: userData.name,
                email: userData.email,
                role: userData.role,
                actif: userData.status === "actif",
                password: userData.password ? userData.password : undefined,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la modification");
        }

        return response.json();
    }

    // validation des données utilisateur
    validateUserData(userData) {
        const userId = document.getElementById("user-id").value;
        const isEdit = !!userId;

        // validation des champs obligatoires (sauf mot de passe en édition)
        if (
            !userData.name ||
            !userData.email ||
            !userData.role ||
            !userData.status
        ) {
            this.showNotification("Tous les champs sont obligatoires", "error");
            return false;
        }

        // Validation du mot de passe (obligatoire seulement en création)
        if (!isEdit && !userData.password) {
            this.showNotification("Le mot de passe est obligatoire", "error");
            return false;
        }

        // Validation de la confirmation du mot de passe si un mot de passe est fourni
        const passwordConfirmation = document.getElementById(
            "user-password-confirmation"
        ).value;

        if (userData.password && userData.password !== passwordConfirmation) {
            this.showNotification(
                "Les mots de passe ne correspondent pas",
                "error"
            );
            return false;
        }

        // Si on est en édition et qu'un mot de passe est fourni, on vérifie la confirmation
        if (isEdit && userData.password && !passwordConfirmation) {
            this.showNotification(
                "Veuillez confirmer le nouveau mot de passe",
                "error"
            );
            return false;
        }

        // Validation du format email
        if (!this.isValidEmail(userData.email)) {
            this.showNotification("Adresse email invalide", "error");
            return false;
        }

        const emailExists = this.users.some(
            (u) => u.email === userData.email && u.id !== parseInt(userId || 0)
        );

        if (emailExists) {
            this.showNotification(
                "Cette adresse email est déjà utilisée",
                "error"
            );
            return false;
        }

        return true;
    }

    // validation email
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ajout d'un utilisateur
    addUser(userData) {
        const newUser = {
            id: Math.max(...this.users.map((u) => u.id)) + 1,
            ...userData,
            created_date: new Date().toISOString().split("T")[0],
        };

        this.users.push(newUser);
    }

    // mise à jour d'un utilisateur
    updateUser(userId, userData) {
        const userIndex = this.users.findIndex((u) => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...userData };
        }
    }

    // affichage des détails d'un utilisateur
    viewUser(user) {
        document.getElementById("detail-name").textContent = user.name || "N/A";
        document.getElementById("detail-email").textContent =
            user.email || "N/A";
        document.getElementById("detail-role").textContent = user.role
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : "Non défini";
        document.getElementById("detail-status").textContent = user.status
            ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
            : "Non défini";
        document.getElementById("detail-date").textContent = this.formatDate(
            user.created_date
        );

        document.getElementById("view-modal").classList.add("active");
        document.getElementById("modal-overlay").classList.add("active");
    }

    // modification d'un utilisateur
    editUser(user) {
        this.openUserModal(user);
    }

    // suppression d'un utilisateur
    deleteUser(userId) {
        const user = this.users.find((u) => u.id === userId);
        document.getElementById(
            "delete-message"
        ).textContent = `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`;

        document.getElementById("delete-modal").classList.add("active");
        document.getElementById("modal-overlay").classList.add("active");

        this.userToDelete = userId;
    }

    // confirmation de suppression
    async confirmDelete() {
        try {
            if (this.userToDelete) {
                await this.deleteUserAPI(this.userToDelete);
                await this.loadUsersFromAPI(); // Recharger les données
                this.showNotification(
                    "Utilisateur supprimé avec succès",
                    "success"
                );
                this.userToDelete = null;
            } else if (this.usersToDelete) {
                await this.bulkDeleteAPI(this.usersToDelete);
                await this.loadUsersFromAPI();
                this.showNotification(
                    `${this.usersToDelete.length} utilisateur(s) supprimé(s)`,
                    "success"
                );
                this.usersToDelete = null;
            }
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            this.showNotification("Erreur lors de la suppression", "error");
        }

        this.closeModals();
    }

    // Supprimé un utilisateur via API
    async deleteUserAPI(userId) {
        const response = await fetch(`/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                )?.content,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la suppression");
        }

        return response.json();
    }

    // Suppression groupée via API
    async bulkDeleteAPI(userIds) {
        const response = await fetch("/api/users/suppression-groupe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                )?.content,
            },
            body: JSON.stringify({ ids: userIds }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.message || "Erreur lors de la suppression groupée"
            );
        }

        return response.json();
    }

    // sélection multiple
    toggleAllSelection(checked) {
        document.querySelectorAll(".user-checkbox").forEach((checkbox) => {
            checkbox.checked = checked;
        });
        this.updateBulkActionButton();
    }

    // mise à jour du bouton d'actions groupées
    updateBulkActionButton() {
        const selectedCheckboxes = document.querySelectorAll(
            ".user-checkbox:checked"
        );
        const bulkDeleteBtn = document.getElementById("bulk-delete");

        bulkDeleteBtn.disabled = selectedCheckboxes.length === 0;

        const selectAllCheckbox = document.getElementById("select-all");
        const totalCheckboxes = document.querySelectorAll(".user-checkbox");

        if (selectedCheckboxes.length === 0) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = false;
        } else if (selectedCheckboxes.length === totalCheckboxes.length) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.indeterminate = true;
        }
    }

    // suppression groupée
    bulkDelete() {
        const selectedIds = Array.from(
            document.querySelectorAll(".user-checkbox:checked")
        ).map((cb) => parseInt(cb.value));

        if (selectedIds.length === 0) return;

        const confirmMessage = `Êtes-vous sûr de vouloir supprimer ${selectedIds.length} utilisateur(s) ?`;
        document.getElementById("delete-message").textContent = confirmMessage;

        document.getElementById("delete-modal").classList.add("active");
        document.getElementById("modal-overlay").classList.add("active");

        this.usersToDelete = selectedIds;
    }

    // fermeture des modals
    closeModals() {
        document.querySelectorAll(".modal").forEach((modal) => {
            modal.classList.remove("active");
        });
        document.getElementById("modal-overlay").classList.remove("active");
    }

    // notifications
    showNotification(message, type = "info") {
        // création de la notification
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // styles pour la notification
        Object.assign(notification.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            color: "white",
            fontWeight: "500",
            zIndex: "10000",
            maxWidth: "300px",
            transform: "translateX(400px)",
            transition: "transform 0.3s ease",
        });

        // couleurs selon le type
        switch (type) {
            case "success":
                notification.style.backgroundColor = "#48bb78";
                break;
            case "error":
                notification.style.backgroundColor = "#f56565";
                break;
            default:
                notification.style.backgroundColor = "#4299e1";
        }

        document.body.appendChild(notification);

        // animation d'apparition
        setTimeout(() => {
            notification.style.transform = "translateX(0)";
        }, 100);

        // suppression automatique
        setTimeout(() => {
            notification.style.transform = "translateX(400px)";
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {
    // Vérifier que le token CSRF est présent
    if (!document.querySelector('meta[name="csrf-token"]')) {
        console.warn(
            'Token CSRF manquant. Assurez-vous d\'avoir <meta name="csrf-token" content="{{ csrf_token() }}"'
        );
    }

    const userManager = new UserManager();

    // ajouter les styles CSS pour animation de chargement
    const style = document.createElement("style");
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
