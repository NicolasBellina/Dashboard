<template>
  <nav class="navbar">
    <div class="navbar-content">
      <h2>{{ pageTitle }}</h2>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const pageTitle = computed(() => {
  const titles = {
    Dashboard: 'Accueil',
    Products: 'Gestion des Produits',
    Users: 'Gestion des Utilisateurs',
    Analytics: 'Analytique',
  };
  return titles[route.name] || 'Dashboard';
});
</script>

<style scoped>
.navbar {
  margin-left: 250px;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-content {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.navbar-content h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1f2937;
}

@media (max-width: 768px) {
  .navbar {
    margin-left: 0;
  }

  .navbar-content h2 {
    font-size: 1.25rem;
  }
}
</style>
