<template>
  <Layout>
    <div class="dashboard-container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <h3>Ventes Totales</h3>
            <span class="stat-icon">💰</span>
          </div>
          <p class="stat-value">{{ analyticsStore.totalSales }}€</p>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <h3>Commandes</h3>
            <span class="stat-icon">📦</span>
          </div>
          <p class="stat-value">{{ analyticsStore.totalOrders }}</p>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <h3>Produits</h3>
            <span class="stat-icon">📊</span>
          </div>
          <p class="stat-value">{{ productStore.products.length }}</p>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <h3>Utilisateurs</h3>
            <span class="stat-icon">👥</span>
          </div>
          <p class="stat-value">{{ userStore.users.length }}</p>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="section">
          <h2>Produits Récents</h2>
          <div v-if="productStore.loading" class="loading">⏳ Chargement...</div>
          <div v-else-if="productStore.error" class="error">{{ productStore.error }}</div>
          <div v-else class="products-list">
            <div
              v-for="product in productStore.products.slice(0, 5)"
              :key="product.id"
              class="product-item"
            >
              <span class="product-name">{{ product.title }}</span>
              <span class="product-price">{{ product.price }}€</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Actions Rapides</h2>
          <div class="quick-actions">
            <router-link to="/products" class="action-link">
              ➕ Gérer Produits
            </router-link>
            <router-link to="/users" class="action-link">
              👥 Gérer Utilisateurs
            </router-link>
            <router-link to="/analytics" class="action-link">
              📈 Voir Analytics
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductStore } from '@/stores/products.js';
import { useUserStore } from '@/stores/users.js';
import { useAnalyticsStore } from '@/stores/analytics.js';
import Layout from '@/components/layout/Layout.vue';

const productStore = useProductStore();
const userStore = useUserStore();
const analyticsStore = useAnalyticsStore();

onMounted(async () => {
  await productStore.fetchProducts();
  await userStore.fetchUsers();
  await analyticsStore.fetchCarts();
});
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-header h3 {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.section {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.section h2 {
  margin-top: 0;
  color: #1f2937;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.product-name {
  color: #374151;
  font-weight: 500;
}

.product-price {
  color: #3b82f6;
  font-weight: bold;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-link {
  padding: 1rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.375rem;
  text-decoration: none;
  color: #1e40af;
  text-align: center;
  font-weight: 500;
  transition: all 0.2s;
}

.action-link:hover {
  background-color: #dbeafe;
}

.loading,
.error {
  text-align: center;
  color: #6b7280;
  padding: 2rem;
}

.error {
  color: #ef4444;
}
</style>
