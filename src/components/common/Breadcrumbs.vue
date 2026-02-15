<!--
  Composant Breadcrumbs
  Affiche le chemin de navigation actuel avec des liens interactifs
  Utilise automatiquement le nom de la route actuelle
-->
<template>
  <nav class="breadcrumbs">
    <div class="breadcrumbs-container">
      <!-- Accueil (toujours présent) -->
      <router-link to="/" class="breadcrumb-link">
        🏠 Accueil
      </router-link>

      <!-- Breadcrumbs dynamiques basés sur la route -->
      <span v-for="(breadcrumb, index) in breadcrumbsList" :key="index" class="breadcrumb-separator">
        /
      </span>

      <router-link
        v-for="(breadcrumb, index) in breadcrumbsList"
        :key="`breadcrumb-${index}`"
        :to="breadcrumb.path"
        :class="{ active: breadcrumb.active }"
        class="breadcrumb-link"
      >
        {{ breadcrumb.label }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

/**
 * Composant Breadcrumbs - Navigation en miettes de pain
 * Affiche le chemin complet vers la page actuelle
 */

const route = useRoute();

/**
 * Liste des breadcrumbs calculée automatiquement
 * Basée sur la route actuelle
 */
const breadcrumbsList = computed(() => {
  // Mappage des noms de routes vers leurs labels et icônes
  const routeLabels = {
    Products: '📦 Produits',
    Users: '👥 Utilisateurs',
    Analytics: '📈 Analytics',
    Dashboard: '🏠 Accueil',
  };

  const routePath = route.name;
  if (!routePath || routePath === 'Dashboard') {
    return [];
  }

  // Retourner le breadcrumb pour la page actuelle
  const paths = {
    Products: '/products',
    Users: '/users',
    Analytics: '/analytics',
  };

  return [
    {
      label: routeLabels[routePath] || routePath,
      path: paths[routePath] || '/',
      active: true,
    },
  ];
});
</script>

<style scoped>
.breadcrumbs {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 2rem;
  margin-left: 250px;
}

.breadcrumbs-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 100%;
  overflow-x: auto;
}

.breadcrumb-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.95rem;
  white-space: nowrap;
  transition: color 0.2s;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.breadcrumb-link:hover {
  color: #1d4ed8;
  background-color: #f3f4f6;
}

.breadcrumb-link.active {
  color: #1f2937;
  font-weight: 600;
  pointer-events: none;
}

.breadcrumb-separator {
  color: #9ca3af;
  margin: 0 0.25rem;
}

@media (max-width: 768px) {
  .breadcrumbs {
    margin-left: 0;
    padding: 0.5rem 1rem;
  }

  .breadcrumb-link {
    font-size: 0.85rem;
  }
}
</style>
