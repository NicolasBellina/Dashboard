<template>
  <Layout>
    <div class="analytics-container">
      <h1>📈 Analytique & Rapports</h1>

      <div class="analytics-grid">
        <div class="metric">
          <h3>Total des Commandes</h3>
          <p class="metric-value">{{ analyticsStore.totalOrders }}</p>
        </div>
        <div class="metric">
          <h3>Chiffre d'Affaires</h3>
          <p class="metric-value">{{ analyticsStore.totalSales }}€</p>
        </div>
        <div class="metric">
          <h3>Panier Moyen</h3>
          <p class="metric-value">
            {{
              analyticsStore.totalOrders > 0
                ? (analyticsStore.totalSales / analyticsStore.totalOrders).toFixed(2)
                : 0
            }}€
          </p>
        </div>
        <div class="metric">
          <h3>Produits Disponibles</h3>
          <p class="metric-value">{{ productStore.products.length }}</p>
        </div>
      </div>

      <div v-if="analyticsStore.loading" class="loading">
        ⏳ Chargement des données...
      </div>
      <div v-else-if="analyticsStore.error" class="error">
        ❌ {{ analyticsStore.error }}
      </div>
      <div v-else>
        <div class="chart-section">
          <h2>📊 Produits par Catégorie</h2>
          <div class="categories-summary">
            <div v-for="(count, category) in categoryStats" :key="category" class="category-stat">
              <span class="category-name">{{ category }}</span>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: (count / maxCategoryCount) * 100 + '%' }"
                ></div>
              </div>
              <span class="count">{{ count }} produits</span>
            </div>
          </div>
        </div>

        <div class="chart-section">
          <h2>💰 Produits les Plus Chers</h2>
          <div class="top-products">
            <div v-for="product in topExpensiveProducts" :key="product.id" class="product-stat">
              <span class="product-name">{{ product.title }}</span>
              <span class="product-price">{{ product.price }}€</span>
            </div>
          </div>
        </div>

        <div class="chart-section">
          <h2>⭐ Produits les Mieux Notés</h2>
          <div class="top-products">
            <div v-for="product in topRatedProducts" :key="product.id" class="product-stat">
              <span class="product-name">{{ product.title }}</span>
              <span class="rating">⭐ {{ product.rating?.rate || 0 }}/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAnalyticsStore } from '@/stores/analytics.js';
import { useProductStore } from '@/stores/products.js';
import Layout from '@/components/layout/Layout.vue';

const analyticsStore = useAnalyticsStore();
const productStore = useProductStore();

onMounted(async () => {
  await analyticsStore.fetchCarts();
  await productStore.fetchProducts();
});

const categoryStats = computed(() => {
  const stats = {};
  productStore.products.forEach((product) => {
    stats[product.category] = (stats[product.category] || 0) + 1;
  });
  return stats;
});

const maxCategoryCount = computed(() => {
  const counts = Object.values(categoryStats.value);
  return counts.length > 0 ? Math.max(...counts) : 1;
});

const topExpensiveProducts = computed(() => {
  return [...productStore.products].sort((a, b) => b.price - a.price).slice(0, 5);
});

const topRatedProducts = computed(() => {
  return [...productStore.products]
    .filter((p) => p.rating?.rate)
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 5);
});
</script>

<style scoped>
.analytics-container {
  padding: 2rem;
}

.analytics-container h1 {
  margin-top: 0;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
}

.metric h3 {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.chart-section {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.chart-section h2 {
  margin-top: 0;
  color: #1f2937;
}

.categories-summary,
.top-products {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-stat,
.product-stat {
  display: grid;
  grid-template-columns: 100px 1fr 120px;
  gap: 1rem;
  align-items: center;
}

.category-name,
.product-name {
  font-weight: 500;
  color: #374151;
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-bar {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transition: width 0.3s;
}

.count,
.product-price,
.rating {
  text-align: right;
  font-weight: 600;
  color: #3b82f6;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.125rem;
  color: #6b7280;
}

.error {
  color: #ef4444;
}

@media (max-width: 768px) {
  .analytics-container {
    padding: 1rem;
  }

  .category-stat,
  .product-stat {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .progress-bar,
  .count,
  .product-price,
  .rating {
    display: none;
  }
}
</style>
