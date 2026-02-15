import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '@/services/api.js';

/**
 * Store Pinia pour la gestion des produits
 * Gère l'état, les fetches API, et les opérations CRUD
 *
 * @module stores/products
 */
export const useProductStore = defineStore('products', () => {
  // ========================
  // ÉTAT (State)
  // ========================

  /** @type {Ref<Array>} Liste de tous les produits */
  const products = ref([]);

  /** @type {Ref<Array>} Liste des catégories disponibles */
  const categories = ref([]);

  /** @type {Ref<Boolean>} Indicateur de chargement */
  const loading = ref(false);

  /** @type {Ref<String|null>} Message d'erreur si une erreur survient */
  const error = ref(null);

  /** @type {Ref<String|null>} Catégorie actuellement filtrée */
  const filteredCategory = ref(null);

  /** @type {Ref<String|null>} Message de succès temporaire */
  const successMessage = ref('');

  /** @type {Ref<Number>} Compteur pour générer les IDs des nouveaux produits */
  const localProductIdCounter = ref(1000);

  // ========================
  // ACTIONS (Methods)
  // ========================

  /**
   * Récupère tous les produits depuis l'API
   * @async
   * @returns {Promise<void>}
   */
  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.getProducts();
      products.value = response.data;
    } catch (err) {
      error.value = 'Erreur lors du chargement des produits';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Récupère les catégories de produits disponibles
   * @async
   * @returns {Promise<void>}
   */
  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      categories.value = response.data;
    } catch (err) {
      error.value = 'Erreur lors du chargement des catégories';
      console.error(err);
    }
  };

  /**
   * Récupère les produits filtrés par catégorie
   * @async
   * @param {String} category - La catégorie à filtrer
   * @returns {Promise<void>}
   */
  const fetchProductsByCategory = async (category) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.getProductsByCategory(category);
      products.value = response.data;
      filteredCategory.value = category;
    } catch (err) {
      error.value = 'Erreur lors du chargement des produits';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crée un nouveau produit
   * @async
   * @param {Object} productData - Les données du produit à créer
   * @returns {Promise<Object>} Le produit créé
   */
  const createProduct = async (productData) => {
    error.value = null;
    successMessage.value = '';
    try {
      const newProduct = {
        id: ++localProductIdCounter.value,
        ...productData,
        rating: productData.rating || { rate: 5, count: 0 },
      };

      products.value.unshift(newProduct);
      successMessage.value = `✅ Produit "${productData.title}" créé avec succès !`;

      setTimeout(() => {
        successMessage.value = '';
      }, 3000);

      return newProduct;
    } catch (err) {
      error.value = 'Erreur lors de la création du produit';
      console.error(err);
      throw err;
    }
  };

  /**
   * Modifie un produit existant
   * @async
   * @param {Number} productId - L'ID du produit à modifier
   * @param {Object} productData - Les nouvelles données du produit
   * @returns {Promise<Object>} Le produit modifié
   */
  const updateProduct = async (productId, productData) => {
    error.value = null;
    successMessage.value = '';
    try {
      const index = products.value.findIndex((p) => p.id === productId);

      if (index === -1) {
        throw new Error('Produit non trouvé');
      }

      const updatedProduct = {
        ...products.value[index],
        ...productData,
        id: productId,
        rating: productData.rating || products.value[index].rating,
      };

      products.value[index] = updatedProduct;
      successMessage.value = `✅ Produit "${productData.title}" modifié avec succès !`;

      setTimeout(() => {
        successMessage.value = '';
      }, 3000);

      return updatedProduct;
    } catch (err) {
      error.value = 'Erreur lors de la modification du produit';
      console.error(err);
      throw err;
    }
  };

  /**
   * Supprime un produit
   * @async
   * @param {Number} productId - L'ID du produit à supprimer
   * @returns {Promise<void>}
   */
  const deleteProduct = async (productId) => {
    error.value = null;
    successMessage.value = '';
    try {
      const product = products.value.find((p) => p.id === productId);
      const productName = product?.title || 'le produit';

      products.value = products.value.filter((p) => p.id !== productId);

      successMessage.value = `✅ "${productName}" a été supprimé avec succès !`;

      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } catch (err) {
      error.value = 'Erreur lors de la suppression du produit';
      console.error(err);
      throw err;
    }
  };

  /**
   * Nettoie les messages d'erreur et de succès
   * @returns {void}
   */
  const clearMessages = () => {
    error.value = null;
    successMessage.value = '';
  };

  // ========================
  // GETTERS (Computed)
  // ========================

  /**
   * Retourne la liste des produits filtrés
   * @returns {Array} Liste des produits
   */
  const filteredProducts = computed(() => {
    return products.value;
  });

  return {
    // State
    products,
    categories,
    loading,
    error,
    successMessage,
    filteredCategory,

    // Actions
    fetchProducts,
    fetchCategories,
    fetchProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    clearMessages,

    // Getters
    filteredProducts,
  };
});
