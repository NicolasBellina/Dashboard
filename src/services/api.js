import axios from 'axios';

/**
 * Service API - Configuration et endpoints
 * Gère toutes les requêtes HTTP vers l'API Fake Store
 * Utilise Axios pour les appels HTTP
 *
 * @module services/api
 */

// URL de base de l'API Fake Store
const API_BASE_URL = 'https://fakestoreapi.com';

/**
 * Instance Axios configurée avec les paramètres par défaut
 * - Timeout: 10 secondes
 * - Base URL: https://fakestoreapi.com
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * Service API - Collection d'endpoints disponibles
 */
export const apiService = {
  // ========================
  // PRODUCTS (Produits)
  // ========================

  /**
   * Récupère tous les produits
   * @async
   * @returns {Promise<AxiosResponse>} Liste de tous les produits
   */
  getProducts: () => api.get('/products'),

  /**
   * Récupère un produit spécifique par ID
   * @async
   * @param {Number} id - L'ID du produit
   * @returns {Promise<AxiosResponse>} Détails du produit
   */
  getProduct: (id) => api.get(`/products/${id}`),

  /**
   * Récupère toutes les catégories de produits disponibles
   * @async
   * @returns {Promise<AxiosResponse>} Liste des catégories
   */
  getCategories: () => api.get('/products/categories'),

  /**
   * Récupère les produits filtrés par catégorie
   * @async
   * @param {String} category - Nom de la catégorie
   * @returns {Promise<AxiosResponse>} Produits de la catégorie
   */
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),

  // ========================
  // USERS (Utilisateurs)
  // ========================

  /**
   * Récupère tous les utilisateurs
   * @async
   * @returns {Promise<AxiosResponse>} Liste de tous les utilisateurs
   */
  getUsers: () => api.get('/users'),

  /**
   * Récupère un utilisateur spécifique par ID
   * @async
   * @param {Number} id - L'ID de l'utilisateur
   * @returns {Promise<AxiosResponse>} Détails de l'utilisateur
   */
  getUser: (id) => api.get(`/users/${id}`),

  // ========================
  // CARTS/ORDERS (Commandes)
  // ========================

  /**
   * Récupère tous les paniers (représentant les commandes)
   * Utilisé pour les statistiques de ventes
   * @async
   * @returns {Promise<AxiosResponse>} Liste de tous les paniers
   */
  getCarts: () => api.get('/carts'),
};

export default api;
