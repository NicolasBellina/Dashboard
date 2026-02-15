<template>
  <div class="layout">
    <!-- Sidebar de navigation -->
    <Sidebar />

    <!-- Contenu principal avec breadcrumbs -->
    <div class="layout-content">
      <!-- Navigation en miettes de pain -->
      <Breadcrumbs />

      <!-- Zone principale du contenu -->
      <main class="main-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
/**
 * Composant Layout - Structure principale de l'application
 * Gère la mise en page globale avec sidebar et contenu principal
 */
import Sidebar from './Sidebar.vue';
import Breadcrumbs from '@/components/common/Breadcrumbs.vue';
</script>

<style scoped>
.layout {
  display: flex;
}

.layout-content {
  margin-left: 250px;
  flex: 1;
}

.main-content {
  background-color: #f3f4f6;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }

  .layout-content {
    margin-left: 0;
  }
}
</style>
