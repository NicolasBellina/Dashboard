<template>
  <Layout>
    <div class="products-container">
      <!-- Messages de succès/erreur -->
      <div v-if="productStore.successMessage" class="success-banner">
        {{ productStore.successMessage }}
      </div>
      <div v-if="productStore.error" class="error-banner">
        {{ productStore.error }}
      </div>

      <div class="header">
        <h1>📦 Gestion des Produits</h1>
        <Button variant="primary" size="md" @click="openCreateModal">
          ➕ Créer un produit
        </Button>
      </div>

      <div class="filter-section">
        <select v-model="selectedCategory" @change="handleCategoryChange" class="filter-select">
          <option value="">Toutes les catégories</option>
          <option v-for="cat in productStore.categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher..."
          class="search-input"
        />
      </div>

      <div v-if="productStore.loading" class="loading">
        ⏳ Chargement des produits...
      </div>
      <div v-else-if="productStore.products.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>Aucun produit disponible</p>
        <Button variant="primary" size="sm" @click="openCreateModal">
          Créer le premier produit
        </Button>
      </div>
      <div v-else class="products-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div class="product-image-container">
            <img :src="product.image" :alt="product.title" class="product-image" />
          </div>
          <h3>{{ product.title }}</h3>
          <p class="category">{{ product.category }}</p>
          <div class="product-info">
            <span class="price">{{ product.price }}€</span>
            <span class="rating">⭐ {{ product.rating?.rate || 0 }}</span>
          </div>
          <div class="actions">
            <Button size="sm" variant="secondary" @click="openEditModal(product)">
              ✏️ Éditer
            </Button>
            <Button size="sm" variant="danger" @click="openDeleteModal(product)">
              🗑️ Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <ProductModal
      :is-open="isProductModalOpen"
      :editing-product="editingProduct"
      :categories="productStore.categories"
      @close="closeProductModal"
      @submit="handleProductSubmit"
    />

    <!-- Modal de confirmation de suppression -->
    <DeleteConfirmModal
      :is-open="isDeleteModalOpen"
      :product-id="deletingProductId"
      :product-name="deletingProductName"
      @close="closeDeleteModal"
      @confirm="handleProductDelete"
    />
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '@/stores/products.js';
import Layout from '@/components/layout/Layout.vue';
import Button from '@/components/common/Button.vue';
import ProductModal from '@/components/products/ProductModal.vue';
import DeleteConfirmModal from '@/components/products/DeleteConfirmModal.vue';

const productStore = useProductStore();
const selectedCategory = ref('');
const searchQuery = ref('');

// États des modales
const isProductModalOpen = ref(false);
const editingProduct = ref(null);
const isDeleteModalOpen = ref(false);
const deletingProductId = ref(null);
const deletingProductName = ref('');

const filteredProducts = computed(() => {
  return productStore.products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleCategoryChange = async () => {
  if (selectedCategory.value) {
    await productStore.fetchProductsByCategory(selectedCategory.value);
  } else {
    await productStore.fetchProducts();
  }
};

// Méthodes des modales
const openCreateModal = () => {
  editingProduct.value = null;
  isProductModalOpen.value = true;
};

const openEditModal = (product) => {
  editingProduct.value = product;
  isProductModalOpen.value = true;
};

const closeProductModal = () => {
  isProductModalOpen.value = false;
  editingProduct.value = null;
};

const handleProductSubmit = async (productData) => {
  try {
    if (editingProduct.value) {
      // Modification
      await productStore.updateProduct(editingProduct.value.id, productData);
    } else {
      // Création
      await productStore.createProduct(productData);
    }
    closeProductModal();
  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
  }
};

const openDeleteModal = (product) => {
  deletingProductId.value = product.id;
  deletingProductName.value = product.title;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deletingProductId.value = null;
  deletingProductName.value = '';
};

const handleProductDelete = async (productId) => {
  try {
    await productStore.deleteProduct(productId);
    closeDeleteModal();
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  }
};

onMounted(async () => {
  await productStore.fetchProducts();
  await productStore.fetchCategories();
});
</script>

<style scoped>
.products-container {
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

.filter-section {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.filter-select,
.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  line-height: 1.3;
  height: 2.6em;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0.5rem 0;
  text-transform: capitalize;
}

.product-info {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
}

.price {
  font-weight: bold;
  color: #3b82f6;
  font-size: 1.125rem;
}

.rating {
  color: #f59e0b;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.125rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .header h1 {
    width: 100%;
  }

  .filter-section {
    width: 100%;
  }

  .filter-select,
  .search-input {
    flex: 1;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}
</style>
