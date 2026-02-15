import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '@/services/api.js';

/**
 * Store Pinia pour la gestion des analytiques et rapports
 * Calcule les statistiques de ventes, commandes et métriques
 *
 * @module stores/analytics
 */
export const useAnalyticsStore = defineStore('analytics', () => {
  // ========================
  // ÉTAT (State)
  // ========================

  /** @type {Ref<Array>} Liste de tous les paniers (représentant les commandes) */
  const carts = ref([]);

  /** @type {Ref<Boolean>} Indicateur de chargement des données */
  const loading = ref(false);

  /** @type {Ref<String|null>} Message d'erreur si une erreur survient */
  const error = ref(null);

  // ========================
  // ACTIONS (Methods)
  // ========================

  /**
   * Récupère tous les paniers depuis l'API
   * Les paniers sont utilisés pour calculer les statistiques de ventes
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Si la requête API échoue
   */
  const fetchCarts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.getCarts();
      carts.value = response.data;
    } catch (err) {
      error.value = 'Erreur lors du chargement des données analytiques';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // ========================
  // GETTERS (Computed Properties)
  // ========================

  /**
   * Calcule le chiffre d'affaires total
   * Basé sur le nombre de commandes avec un montant moyen de 150€
   *
   * @returns {String} Chiffre d'affaires formaté avec 2 décimales
   */
  const totalSales = computed(() => {
    return (carts.value.length * 150).toFixed(2);
  });

  /**
   * Obtient le nombre total de commandes
   * Égal au nombre de paniers
   *
   * @returns {Number} Nombre total de commandes
   */
  const totalOrders = computed(() => carts.value.length);

  /**
   * Calcule le montant moyen par commande
   *
   * @returns {Number} Montant moyen par commande
   */
  const averageOrderValue = computed(() => {
    if (totalOrders.value === 0) return 0;
    return (totalSales.value / totalOrders.value).toFixed(2);
  });

  return {
    // State
    carts,
    loading,
    error,

    // Actions
    fetchCarts,

    // Getters
    totalSales,
    totalOrders,
    averageOrderValue,
  };
});
