<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1>📊 Dashboard</h1>
    </div>
    <nav class="sidebar-nav">
      <router-link to="/" :class="{ active: $route.path === '/' }">
        🏠 Accueil
      </router-link>
      <router-link
        to="/products"
        :class="{ active: $route.path === '/products' }"
      >
        📦 Produits
      </router-link>
      <router-link
        to="/users"
        :class="{ active: $route.path === '/users' }"
      >
        👥 Utilisateurs
      </router-link>
      <router-link
        to="/analytics"
        :class="{ active: $route.path === '/analytics' }"
      >
        📈 Analytics
      </router-link>
    </nav>

    <!-- Profil en bas du sidebar -->
    <div class="sidebar-footer">
      <div class="user-profile">
        <span class="user-avatar">👤</span>
        <div class="user-info">
          <p class="user-name">{{ authStore.user?.name }}</p>
          <p class="user-email">{{ authStore.user?.email }}</p>
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        @click="handleLogout"
        class="logout-btn"
      >
        🚪 Déconnexion
      </Button>
    </div>
  </aside>
</template>

<script setup>
/**
 * Composant Sidebar - Navigation principale et profil
 * Gère la navigation entre les pages et l'accès au profil utilisateur
 */
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import Button from '@/components/common/Button.vue';

const router = useRouter();
const authStore = useAuthStore();

/**
 * Gère la déconnexion de l'utilisateur
 * Appelle logout() du store auth et redirige vers la page de login
 */
const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #1f2937;
  color: white;
  padding: 1.5rem 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid #374151;
}

.sidebar-header h1 {
  font-size: 1.5rem;
  margin: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
}

.sidebar-nav a {
  padding: 1rem 1.5rem;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.sidebar-nav a:hover {
  background-color: #374151;
  color: white;
}

.sidebar-nav a.active {
  background-color: #3b82f6;
  color: white;
  border-left-color: #60a5fa;
}

/* Section profil en bas */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #374151;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #374151;
  border-radius: 0.5rem;
}

.user-avatar {
  font-size: 1.5rem;
  min-width: 30px;
  text-align: center;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  margin: 0.25rem 0 0 0;
  font-size: 0.8rem;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn {
  width: 100%;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    padding: 1rem 0;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    flex: auto;
  }

  .sidebar-nav a {
    flex: 1;
    min-width: 150px;
    padding: 0.75rem;
    text-align: center;
  }

  .sidebar-footer {
    padding: 1rem;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    border-top: 1px solid #374151;
    margin-top: 0;
  }

  .user-profile {
    flex: 1;
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .user-name {
    font-size: 0.85rem;
  }

  .user-email {
    display: none;
  }

  .logout-btn {
    width: auto;
    white-space: nowrap;
  }
}
</style>
