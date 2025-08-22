// gestionnaire des utilisateurs et des actions
class UserManager {
    constructor() {
        this.users = this.loadInitialUsers();
        this.filteredUsers = [...this.users];
        this.currentSort = { field: null, direction: "asc" };
        this.init();
    }

    //chargement des données des utilisateurs (données de test pour voir à quoi devra ressembler l'interface)
    loadInitialUsers() {
        return [
            {
                id: 1,
                name: "Jean françois Konan",
                email: "jean.françois@mail.com",
                role: "admin",
                status: "actif",
                created_date: "2024-01-15",
            },
            {
                id: 2,
                name: "Kacou hugues Bertin",
                email: "kacou.hugues@mail.com",
                role: "utilisateur",
                status: "actif",
                created_date: "2024-02-20",
            },
            {
                id: 3,
                name: "N'guessan Lambert",
                email: "nguessan.lambert@mail.com",
                role: "utilisateur",
                status: "inactif",
                created_date: "2024-03-10",
            },
            {
                id: 4,
                name: "Zocou Bernard",
                email: "zocou.bernard@mail.com",
                role: "admin",
                status: "actif",
                created_date: "2024-01-25",
            },
            {
                id: 5,
                name: "Lakota Martin",
                email: "lakota.martin@mail.com",
                role: "utilisateur",
                status: "actif",
                created_date: "2024-04-05",
            },
            {
                id: 6,
                name: "N'guoran parfait",
                email: "ngoran.parfait@mail.com",
                role: "utilisateur",
                status: "inactif",
                created_date: "2024-02-15",
            },
            {
                id: 7,
                name: "Kouakou Marc Olivier",
                email: "kouakou.marc@email.com",
                role: "utilisateur",
                status: "actif",
                created_date: "2024-03-22",
            },
            {
                id: 8,
                name: "Zossou blanchard",
                email: "zossou.blanchard@mail.com",
                role: "admin",
                status: "actif",
                created_date: "2024-01-30",
            },
        ];
    }

    // intialisation de tous les événements
    init() {
        this.bindEvents();
        this.renderTable();
    }

    // Liaison entre les événements
    bindEvents() {
        // Action du outon d'ajout des utilisateur
        document
            .getElementById("btn-add-user")
            .addEventListener("click", () => {
                this.openUserModal();
            });

        // recherche instantané en temps réel
        document
            .getElementById("search-input")
            .addEventListener("input", (e) => {
                this.filterUsers();
            });

        // Filtres
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

        // formulaire de creation d'unutilisateur
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

    // filtrage des utilisateurs
    filterUsers() {
        const searchTerm = document
            .getElementById("search-input")
            .value.toLowerCase();
        const roleFilter = document.getElementById("role-filter").value;
        const statusFilter = document.getElementById("status-filter").value;

        this.filteredUsers = this.users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm);
            const matchesRole = !roleFilter || user.role === roleFilter;
            const matchesStatus = !statusFilter || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });

        this.renderTable();
    }

    // triage des utilisateurs
    sortUsers(field) {
        if (this.currentSort.field === field) {
            this.currentSort.direction =
                this.currentSort.direction === "asc" ? "desc" : "asc";
        } else {
            this.currentSort.field = field;
            this.currentSort.direction = "asc";
        }

        this.filteredUsers.sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            // conversion des dates
            if (field === "created_date") {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            if (typeof aVal === "string") {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal)
                return this.currentSort.direction === "asc" ? -1 : 1;
            if (aVal > bVal)
                return this.currentSort.direction === "asc" ? 1 : -1;
            return 0;
        });

        this.updateSortIndicators();
        this.renderTable();
    }

    // mise à jour des indicateurs de triage
    updateSortIndicators() {
        document.querySelectorAll(".sort-indicator").forEach((indicator) => {
            indicator.textContent = "";
        });

        if (this.currentSort.field) {
            const indicator = document.querySelector(
                `th[data-sort="${this.currentSort.field}"] .sort-indicator`
            );
            indicator.textContent =
                this.currentSort.direction === "asc" ? "↑" : "↓";
        }
    }

    // rendu de l'affichage du tableau
    renderTable() {
        const tbody = document.querySelector("#users-table tbody");
        tbody.innerHTML = "";

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

        const initials = user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

        row.innerHTML = `
            <td><input type="checkbox" class="user-checkbox" value="${
                user.id
            }"></td>
            <td>
                <div class="profile-pic">${initials}</div>
            </td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role}">${
            user.role.charAt(0).toUpperCase() + user.role.slice(1)
        }</span></td>
            <td><span class="status-badge ${user.status}">${
            user.status.charAt(0).toUpperCase() + user.status.slice(1)
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

        modal.classList.add("active");
        overlay.classList.add("active");
    }

    // remplissage du formulaire des utilisateur
    fillUserForm(user) {
        document.getElementById("user-id").value = user.id;
        document.getElementById("user-name").value = user.name;
        document.getElementById("user-email").value = user.email;
        document.getElementById("user-role").value = user.role;
        document.getElementById("user-status").value = user.status;
    }

    // Sauvegarde de l'utilisateur
    saveUser() {
        const formData = new FormData(document.getElementById("user-form"));
        const userData = {
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            role: formData.get("role"),
            status: formData.get("status"),
        };

        // validation
        if (!this.validateUserData(userData)) {
            return;
        }

        const userId = document.getElementById("user-id").value;

        if (userId) {
            // modification
            this.updateUser(parseInt(userId), userData);
        } else {
            // ajout
            this.addUser(userData);
        }

        this.closeModals();
        this.filterUsers();
        this.showNotification("Utilisateur enregistré avec succès", "success");
    }

    // validation des données utilisateur
    validateUserData(userData) {
        if (
            !userData.name ||
            !userData.email ||
            !userData.role ||
            !userData.status
        ) {
            this.showNotification("Tous les champs sont obligatoires", "error");
            return false;
        }

        if (!this.isValidEmail(userData.email)) {
            this.showNotification("Adresse email invalide", "error");
            return false;
        }

        const userId = document.getElementById("user-id").value;
        const emailExists = this.users.some(
            (u) => u.email === userData.email && u.id !== parseInt(userId)
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
        document.getElementById("detail-name").textContent = user.name;
        document.getElementById("detail-email").textContent = user.email;
        document.getElementById("detail-role").textContent =
            user.role.charAt(0).toUpperCase() + user.role.slice(1);
        document.getElementById("detail-status").textContent =
            user.status.charAt(0).toUpperCase() + user.status.slice(1);
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
    confirmDelete() {
        if (this.userToDelete) {
            this.users = this.users.filter((u) => u.id !== this.userToDelete);
            this.filterUsers();
            this.showNotification(
                "Utilisateur supprimé avec succès",
                "success"
            );
            this.userToDelete = null;
        }
        this.closeModals();
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

    // confirmation suppression groupée
    confirmBulkDelete() {
        if (this.usersToDelete) {
            this.users = this.users.filter(
                (u) => !this.usersToDelete.includes(u.id)
            );
            this.filterUsers();
            this.showNotification(
                `${this.usersToDelete.length} utilisateur(s) supprimé(s)`,
                "success"
            );
            this.usersToDelete = null;
        }
        this.closeModals();
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

// initialisation
document.addEventListener("DOMContentLoaded", () => {
    const userManager = new UserManager();

    // modification de la fonction confirmDelete pour gérer les suppressions groupées
    const originalConfirmDelete = userManager.confirmDelete;
    userManager.confirmDelete = function () {
        if (this.usersToDelete) {
            this.confirmBulkDelete();
        } else {
            originalConfirmDelete.call(this);
        }
    };
});
