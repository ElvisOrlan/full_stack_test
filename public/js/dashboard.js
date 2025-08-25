// gestion des utilisateurs et des actions
class UserManager {
    constructor() {
        this.users = [];
        this.filteredUsers = [];
        this.currentSort = { field: null, direction: "asc" };
        this.roles = [];
        this.isLoading = false;
        this.pagination = {
            current_page: 1,
            per_page: 10,
            total: 0,
            last_page: 1,
            from: 0,
            to: 0,
        };

        // Initialisation du role de l'utilisateur connecté
        this.currentUserRole = null;

        // Initialisation des informations complètes de l'utilisateur connecté
        this.currentUser = {
            id: null,
            name: null,
            email: null,
            role: null,
        };

        // initialisation des variables de suppression
        this.userToDelete = null;
        this.usersToDelete = null;

        // Récupération du rôle de l'utilisateur à l'initialisation
        this.getCurrentUserRole();

        this.init();
    }

    // initialisation et chargement des données depuis l'API
    async init() {
        try {
            // Vérification supplémentaire d'authentification
            if (this.redirectToLoginIfNotAuthenticated()) {
                return;
            }
            this.bindEvents();
            await this.loadUsersFromAPI();

            // Appliquer les restrictions selon le rôle après chargement
            this.applyRoleRestrictions();
        } catch (error) {
            this.showNotification(
                "Erreur lors de l'initialisation de l'interface",
                "error"
            );
        }
    }

    // Applique les restrictions d'interface selon le rôle utilisateur
    applyRoleRestrictions() {
        const addButton = document.getElementById("btn-add-user");
        const bulkDeleteButton = document.getElementById("bulk-delete");
        const selectAllCheckbox = document.getElementById("select-all");
        const editButtons = document.querySelectorAll('[data-action="edit"]');
        const deleteButtons = document.querySelectorAll(
            '[data-action="delete"]'
        );

        // si l'utilisateur n'est pas admin
        if (!this.isAdmin()) {
            // masquer le bouton d'ajout
            if (addButton) {
                addButton.style.display = "none";
            }

            // masquer les actions de suppression groupée
            if (bulkDeleteButton) {
                bulkDeleteButton.style.display = "none";
            }

            // desactiver tous les boutons d'édition
            editButtons.forEach((btn) => {
                btn.disabled = true;
            });

            // desactiver tous les boutons de suppression
            deleteButtons.forEach((btn) => {
                btn.disabled = true;
            });
        } else {
            // Pour les admins, tout est visible

            if (addButton) addButton.style.display = "block";
            if (bulkDeleteButton) bulkDeleteButton.style.display = "block";
            if (selectAllCheckbox) selectAllCheckbox.style.display = "block";

            const selectColumn = document.querySelector("th:first-child");
            if (selectColumn) {
                selectColumn.style.display = "table-cell";
            }
            // Réafficher tous les boutons d'édition
            editButtons.forEach((btn) => {
                btn.disabled = false;
            });

            // Réafficher tous les boutons de suppression
            deleteButtons.forEach((btn) => {
                btn.disabled = false;
            });

            document.body.classList.add("admin-role");
        }
    }

    // Désactive complètement l'interface en cas de problème d'authentification
    disableAllInterface() {
        // Désactiver tous les boutons
        document.querySelectorAll("button").forEach((btn) => {
            btn.disabled = true;
            btn.style.opacity = "0.5";
        });

        // Désactiver tous les inputs
        document.querySelectorAll("input, select").forEach((input) => {
            input.disabled = true;
            input.style.opacity = "0.5";
        });

        // Afficher un message dans le tableau
        const tbody = document.querySelector("#users-table tbody");
        if (tbody) {
            tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #dc2626;">
                    ⚠️ Session expirée. Redirection en cours...
                </td>
            </tr>
        `;
        }
    }

    // Gestion du cas utilisateur non authentifié
    handleUnauthenticated() {
        this.showNotification(
            "Session expirée. Redirection vers la page de connexion...",
            "error"
        );

        this.clearUserData();

        setTimeout(() => {
            this.redirectToLoginIfNotAuthenticated();
        }, 5000);

        this.disableAllInterface();
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

            // Ajout des paramètres de pagination
            if (filters.page) {
                params.append("page", filters.page);
            }
            if (filters.per_page) {
                params.append("per_page", filters.per_page);
            }

            const jwtToken = localStorage.getItem("token");
            const response = await fetch(`/api/users?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${jwtToken}`,
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

                // Mise à jour des informations de pagination
                if (result.pagination) {
                    this.pagination = result.pagination;
                }

                this.renderTable();
                this.populateRoleFilter();
                this.renderPagination();
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
        //le table sera rendu par le renderTable
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
                { id: "1", nom: "admin" },
                { id: "2", nom: "User" },
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
                    this.resetToFirstPage();
                    this.filterUsers();
                }, 300);
            });

        // règles générales de filtrage

        // filtre par role
        document
            .getElementById("role-filter")
            .addEventListener("change", () => {
                this.resetToFirstPage();
                this.filterUsers();
            });

        // filtre par status
        document
            .getElementById("status-filter")
            .addEventListener("change", () => {
                this.resetToFirstPage();
                this.filterUsers();
            });

        // Triage des colonnes
        document.querySelectorAll("th[data-sort]").forEach((th) => {
            th.addEventListener("click", () => {
                const field = th.dataset.sort;
                this.resetToFirstPage();
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

    // Réinitialiser à la première page
    resetToFirstPage() {
        this.pagination.current_page = 1;
    }

    // filtrage des utilisateurs via l'API
    async filterUsers() {
        if (this.isLoading) return;

        const searchTerm = document
            .getElementById("search-input")
            .value.toLowerCase();
        const roleFilter = document.getElementById("role-filter").value;
        const statusFilter = document.getElementById("status-filter").value;

        const filters = {
            page: this.pagination.current_page,
            per_page: this.pagination.per_page,
        };

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
            page: this.pagination.current_page,
            per_page: this.pagination.per_page,
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

    // Navigation vers une page spécifique
    async goToPage(page) {
        if (page < 1 || page > this.pagination.last_page || this.isLoading) {
            return;
        }

        this.pagination.current_page = page;
        await this.filterUsers();
    }

    // Rendu de la pagination
    renderPagination() {
        const paginationContainer = document.getElementById(
            "pagination-container"
        );
        if (!paginationContainer) {
            return;
        }

        const { current_page, last_page, from, to, total } = this.pagination;

        if (last_page <= 1) {
            paginationContainer.innerHTML = "";
            return;
        }

        let paginationHTML = `
            <div class="pagination-info">
                Affichage de ${from} à ${to} sur ${total} utilisateurs
            </div>
            <div class="pagination-controls">
        `;

        // Bouton précédent
        if (current_page > 1) {
            paginationHTML += `
                <button class="pagination-btn" onclick="userManager.goToPage(${
                    current_page - 1
                })">
                    ‹ Précédent
                </button>
            `;
        }

        // Numéros de pages
        const startPage = Math.max(1, current_page - 2);
        const endPage = Math.min(last_page, current_page + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="userManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === current_page ? "active" : "";
            paginationHTML += `
                <button class="pagination-btn ${activeClass}" onclick="userManager.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        if (endPage < last_page) {
            if (endPage < last_page - 1) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="userManager.goToPage(${last_page})">${last_page}</button>`;
        }

        // Bouton suivant
        if (current_page < last_page) {
            paginationHTML += `
                <button class="pagination-btn" onclick="userManager.goToPage(${
                    current_page + 1
                })">
                    Suivant ›
                </button>
            `;
        }

        paginationHTML += `</div>`;

        paginationContainer.innerHTML = paginationHTML;
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
        const roleName = user.role || "user";
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
        const jwtToken = localStorage.getItem("token");

        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${jwtToken}`,
                "X-Requested-With": "XMLHttpRequest",
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
        const jwtToken = localStorage.getItem("token");
        const response = await fetch(`/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${jwtToken}`,
                "X-Requested-With": "XMLHttpRequest",
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
        const jwtToken = localStorage.getItem("token");
        const response = await fetch(`/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${jwtToken}`,
                "X-Requested-With": "XMLHttpRequest",
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
        const jwtToken = localStorage.getItem("token");

        const response = await fetch("/api/users/suppression-groupe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${jwtToken}`,
                "X-Requested-With": "XMLHttpRequest",
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

    // Décodage du token JWT
    decodeJWTToken(token = null) {
        try {
            // Utiliser le token récupérer depuis localStorage
            const jwtToken = localStorage.getItem("token");

            if (!jwtToken) {
                console.warn("Aucun token JWT trouvé");
                return null;
            }

            // Séparer les parties du token JWT (header.payload.signature)
            const tokenParts = jwtToken.split(".");

            if (tokenParts.length !== 3) {
                console.error("Format de token JWT invalide");
                return null;
            }

            // Décoder la partie payload (base64)
            const payload = tokenParts[1];

            // Ajouter le padding nécessaire pour base64
            const paddedPayload =
                payload + "=".repeat((4 - (payload.length % 4)) % 4);

            // Décoder et parser le JSON
            const decodedPayload = JSON.parse(atob(paddedPayload));

            // Vérifier l'expiration du token
            if (
                decodedPayload.exp &&
                decodedPayload.exp < Math.floor(Date.now() / 1000)
            ) {
                console.warn("Token JWT expiré");

                localStorage.removeItem("token");
                return null;
            }

            return decodedPayload;
        } catch (error) {
            console.error("Erreur lors du décodage du token JWT:", error);
            return null;
        }
    }

    // Récupération du rôle utilisateur actuel à partir du token JWT
    getCurrentUserRole() {
        try {
            const tokenData = this.decodeJWTToken();

            if (!tokenData) {
                console.warn("Impossible de récupérer les données utilisateur");
                return null;
            }

            // Extraire le rôle selon la structure de votre JWT
            const userRole_id = tokenData.role_id || null;

            let userRole = null;

            if (userRole_id === 1) {
                userRole = "admin";
            } else if (userRole_id === 2) {
                userRole = "user";
            } else {
                userRole = "null";
            }

            // Stocker le rôle et autres infos utilisateur
            this.currentUserRole = userRole ? userRole.toLowerCase() : null;
            this.currentUser = {
                id: tokenData.id,
                name: tokenData.nom,
                email: tokenData.email,
                role: this.currentUserRole,
            };

            return this.currentUserRole;
        } catch (error) {
            console.error(
                "Erreur lors de la récupération du rôle utilisateur:",
                error
            );
            return null;
        }
    }

    /**
     * Vérifie si l'utilisateur a les permissions pour effectuer une action
     */
    checkPermission(action) {
        // Si le rôle n'est pas défini, refuser toutes les actions sauf 'read'
        if (!this.currentUserRole) {
            return action === "read" || action === "view";
        }

        // Définition des permissions par rôle
        const permissions = {
            admin: {
                create: true,
                read: true,
                update: true,
                delete: true,
                bulk_delete: true,
                view: true,
                manage_users: true,
            },
            user: {
                create: false,
                read: true,
                update: false,
                delete: false,
                bulk_delete: false,
                view: true,
                manage_users: false,
            },
        };

        // Récupérer les permissions pour le rôle actuel
        const rolePermissions = permissions[this.currentUserRole.toLowerCase()];

        if (!rolePermissions) {
            console.warn(`Rôle non reconnu: ${this.currentUserRole}`);
            // Par défaut, donner seulement les permissions de lecture
            return action === "read" || action === "view";
        }

        // Vérifier si l'action est autorisée
        const isAllowed = rolePermissions[action] || false;

        if (!isAllowed) {
            console.warn(
                `Action '${action}' non autorisée pour le rôle '${this.currentUserRole}'`
            );
        }
        return isAllowed;
    }

    /**
     * Vérifie si l'utilisateur connecté est administrateur
     */
    isAdmin() {
        return (
            this.currentUserRole &&
            this.currentUserRole.toLowerCase() === "admin"
        );
    }

    /**
     * Vérifie si l'utilisateur est authentifié et a un rôle valide
     */
    isAuthenticated() {
        const tokenData = this.decodeJWTToken();
        return tokenData !== null && this.currentUserRole !== null;
    }

    /**
     * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
     */
    redirectToLoginIfNotAuthenticated() {
        if (!this.isAuthenticated()) {
            console.warn(
                "Utilisateur non authentifié, redirection vers la page de connexion"
            );
            window.location.href = "/";
            return true;
        }
        return false;
    }

    /**
     * Affiche une notification d'accès refusé
     */
    showAccessDeniedNotification(action = "") {
        const message = action
            ? `Accès refusé: vous n'avez pas les permissions pour ${action}`
            : "Accès refusé: permissions insuffisantes";

        this.showNotification(message, "error");
    }

    /**
     * Nettoie les données utilisateur (déconnexion)
     */
    clearUserData() {
        this.currentUserRole = null;
        this.currentUser = null;
        localStorage.removeItem("token");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("btn-logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            const jwtToken = localStorage.getItem("token");

            if (!jwtToken) {
                console.warn(
                    "Aucun token trouvé. Redirection vers la page de connexion."
                );
                window.location.href = "/";
                return;
            }

            try {
                const response = await fetch("/api/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                        "X-Requested-With": "XMLHttpRequest",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(
                        "Erreur lors de la déconnexion:",
                        errorData.message || "Erreur inconnue"
                    );
                    return;
                }

                // Nettoyer le token et rediriger
                localStorage.removeItem("token");
                clearUserData();
                console.log("Déconnexion réussie. Redirection...");
                window.location.href = "/"; // ou page d'accueil
            } catch (error) {
                console.error("Erreur réseau lors de la déconnexion:", error);
            }
        });
    }
});

// Variable globale pour accéder à l'instance depuis les boutons de pagination
let userManager;

document.addEventListener("DOMContentLoaded", () => {
    if (!document.querySelector('meta[name="csrf-token"]')) {
        console.warn(
            'Token CSRF manquant. Assurez-vous d\'avoir <meta name="csrf-token" content="{{ csrf_token() }}"'
        );
    }

    userManager = new UserManager();

    // styles CSS pour animation de chargement et pagination

    const style = document.createElement("style");
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Styles de pagination */
        #pagination-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
            padding: 1rem 0;
            border-top: 1px solid #e2e8f0;
        }
        
        .pagination-info {
            font-size: 0.875rem;
            color: #666;
        }
        
        .pagination-controls {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }
        
        .pagination-btn {
            padding: 0.5rem 0.75rem;
            border: 1px solid #d1d5db;
            background: white;
            color: #374151;
            cursor: pointer;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            transition: all 0.2s;
        }
        
        .pagination-btn:hover {
            background-color: #f9fafb;
            border-color: #9ca3af;
        }
        
        .pagination-btn.active {
            background-color: #3b82f6;
            color: white;
            border-color: #3b82f6;
        }
        
        .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .pagination-dots {
            padding: 0 0.25rem;
            color: #9ca3af;
        }
        
        @media (max-width: 768px) {
            #pagination-container {
                flex-direction: column;
                gap: 1rem;
            }
            
            .pagination-controls {
                flex-wrap: wrap;
                justify-content: center;
            }
        }


.user-role-restricted .user-checkbox {
    display: none !important;
}

.user-role-restricted th:first-child,
.user-role-restricted td:first-child {
    display: none !important;
}

.btn-action:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.role-restricted {
    opacity: 0.6;
    pointer-events: none;
}

/* Indicateur visuel pour les admins */
.admin-role::before {
    content: "👑 Administrateur";
    position: fixed;
    top: 10px;
    left: 10px;
    background: #059669;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    z-index: 9999;
}

/* Indicateur visuel pour les utilisateurs */
.user-role-restricted::before {
    content: "👤 Utilisateur";
    position: fixed;
    top: 10px;
    left: 10px;
    background: #0369a1;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    z-index: 9999;
}

    `;
    document.head.appendChild(style);
});
