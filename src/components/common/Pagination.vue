<!--
  Composant Pagination
  Composant réutilisable pour paginer les listes
  Affiche les numéros de pages, boutons précédent/suivant
-->
<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
      class="pagination-btn"
      :disabled="currentPage === 1"
      @click="$emit('update:currentPage', currentPage - 1)"
    >
      ◀ Précédent
    </button>

    <div class="page-numbers">
      <!-- Première page -->
      <button
        v-if="startPage > 1"
        class="pagination-btn"
        @click="$emit('update:currentPage', 1)"
      >
        1
      </button>

      <!-- Points de suspension au début -->
      <span v-if="startPage > 2" class="ellipsis">...</span>

      <!-- Pages au milieu -->
      <button
        v-for="page in visiblePages"
        :key="page"
        :class="{ active: page === currentPage }"
        class="pagination-btn"
        @click="$emit('update:currentPage', page)"
      >
        {{ page }}
      </button>

      <!-- Points de suspension à la fin -->
      <span v-if="endPage < totalPages - 1" class="ellipsis">...</span>

      <!-- Dernière page -->
      <button
        v-if="endPage < totalPages"
        class="pagination-btn"
        @click="$emit('update:currentPage', totalPages)"
      >
        {{ totalPages }}
      </button>
    </div>

    <button
      class="pagination-btn"
      :disabled="currentPage === totalPages"
      @click="$emit('update:currentPage', currentPage + 1)"
    >
      Suivant ▶
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

/**
 * Composant Pagination - Contrôle de pagination
 * Affiche les numéros de pages et boutons de navigation
 */

/**
 * Props du composant
 * @param {Number} currentPage - Numéro de la page actuelle
 * @param {Number} totalPages - Nombre total de pages
 */
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

defineEmits(['update:currentPage']);

/**
 * Nombre maximum de pages visibles dans le contrôle
 */
const maxVisiblePages = 5;

/**
 * Calcul du numéro de page de départ
 * Centré autour de la page actuelle si possible
 */
const startPage = computed(() => {
  const start = Math.max(1, props.currentPage - Math.floor(maxVisiblePages / 2));
  return Math.min(start, props.totalPages - maxVisiblePages + 1);
});

/**
 * Calcul du numéro de page de fin
 */
const endPage = computed(() => {
  return Math.min(startPage.value + maxVisiblePages - 1, props.totalPages);
});

/**
 * Liste des numéros de pages visibles
 */
const visiblePages = computed(() => {
  const pages = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i);
  }
  return pages;
});
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
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

.page-numbers {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.ellipsis {
  color: #9ca3af;
  padding: 0 0.5rem;
}

@media (max-width: 640px) {
  .pagination {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .pagination-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
  }
}
</style>
