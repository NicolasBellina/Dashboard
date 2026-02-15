<template>
  <Layout>
    <div class="users-container">
      <!-- Messages de succès/erreur -->
      <div v-if="userStore.successMessage" class="success-banner">
        {{ userStore.successMessage }}
      </div>
      <div v-if="userStore.error" class="error-banner">
        {{ userStore.error }}
      </div>

      <div class="header">
        <h1>👥 Gestion des Utilisateurs</h1>
        <Button variant="primary" size="md" @click="openCreateModal">
          ➕ Créer un utilisateur
        </Button>
      </div>

      <div class="search-section">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un utilisateur..."
          class="search-input"
        />
      </div>

      <div v-if="userStore.loading" class="loading">
        ⏳ Chargement des utilisateurs...
      </div>
      <div v-else-if="userStore.users.length === 0" class="empty-state">
        <div class="empty-icon">👥</div>
        <p>Aucun utilisateur disponible</p>
        <Button variant="primary" size="sm" @click="openCreateModal">
          Créer le premier utilisateur
        </Button>
      </div>
      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Ville</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.address?.city || '-' }}</td>
              <td class="actions-cell">
                <Button size="sm" variant="secondary" @click="openEditModal(user)">
                  ✏️ Éditer
                </Button>
                <Button size="sm" variant="danger" @click="openDeleteModal(user)">
                  🗑️ Supprimer
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <UserModal
      :is-open="isUserModalOpen"
      :editing-user="editingUser"
      @close="closeUserModal"
      @submit="handleUserSubmit"
    />

    <!-- Modal de confirmation de suppression -->
    <UserDeleteConfirmModal
      :is-open="isDeleteModalOpen"
      :user-id="deletingUserId"
      :user-name="deletingUserName"
      @close="closeDeleteModal"
      @confirm="handleUserDelete"
    />
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/users.js';
import Layout from '@/components/layout/Layout.vue';
import Button from '@/components/common/Button.vue';
import UserModal from '@/components/users/UserModal.vue';
import UserDeleteConfirmModal from '@/components/users/UserDeleteConfirmModal.vue';

const userStore = useUserStore();
const searchQuery = ref('');

// États des modales
const isUserModalOpen = ref(false);
const editingUser = ref(null);
const isDeleteModalOpen = ref(false);
const deletingUserId = ref(null);
const deletingUserName = ref('');

const filteredUsers = computed(() => {
  return userStore.users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Méthodes des modales
const openCreateModal = () => {
  editingUser.value = null;
  isUserModalOpen.value = true;
};

const openEditModal = (user) => {
  editingUser.value = user;
  isUserModalOpen.value = true;
};

const closeUserModal = () => {
  isUserModalOpen.value = false;
  editingUser.value = null;
};

const handleUserSubmit = async (userData) => {
  try {
    if (editingUser.value) {
      // Modification
      await userStore.updateUser(editingUser.value.id, userData);
    } else {
      // Création
      await userStore.createUser(userData);
    }
    closeUserModal();
  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
  }
};

const openDeleteModal = (user) => {
  deletingUserId.value = user.id;
  deletingUserName.value = user.username;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deletingUserId.value = null;
  deletingUserName.value = '';
};

const handleUserDelete = async (userId) => {
  try {
    await userStore.deleteUser(userId);
    closeDeleteModal();
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  }
};

onMounted(() => {
  userStore.fetchUsers();
});
</script>

<style scoped>
.users-container {
  padding: 2rem;
}

.success-banner,
.error-banner {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

.success-banner {
  background-color: #dcfce7;
  border: 1px solid #86efac;
  color: #166534;
}

.error-banner {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header h1 {
  margin: 0;
}

.search-section {
  margin-bottom: 2rem;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #6b7280;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.table-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead tr {
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:hover {
  background-color: #f9fafb;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.125rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .users-container {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .header h1 {
    width: 100%;
  }

  th,
  td {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .actions-cell {
    flex-direction: column;
  }
}
</style>
