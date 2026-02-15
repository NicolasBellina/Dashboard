import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '@/services/api.js';

/**
 * Store Pinia pour la gestion des utilisateurs
 * Gère l'état, les fetches API, et les opérations CRUD
 *
 * @module stores/users
 */
export const useUserStore = defineStore('users', () => {
  // ========================
  // ÉTAT (State)
  // ========================

  /** @type {Ref<Array>} Liste de tous les utilisateurs */
  const users = ref([]);

  /** @type {Ref<Boolean>} Indicateur de chargement */
  const loading = ref(false);

  /** @type {Ref<String|null>} Message d'erreur si une erreur survient */
  const error = ref(null);

  /** @type {Ref<String|null>} Message de succès temporaire */
  const successMessage = ref('');

  /** @type {Ref<Number>} Compteur pour générer les IDs des nouveaux utilisateurs */
  const localUserIdCounter = ref(10);

  // ========================
  // ACTIONS (Methods)
  // ========================

  /**
   * Récupère tous les utilisateurs depuis l'API
   * @async
   * @returns {Promise<void>}
   */
  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.getUsers();
      users.value = response.data;
    } catch (err) {
      error.value = 'Erreur lors du chargement des utilisateurs';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crée un nouvel utilisateur
   * @async
   * @param {Object} userData - Les données de l'utilisateur à créer
   * @param {String} userData.name - Nom complet
   * @param {String} userData.username - Nom d'utilisateur unique
   * @param {String} userData.email - Email valide
   * @param {String} userData.phone - Numéro de téléphone
   * @param {Object} userData.address - Adresse complète
   * @param {Object} userData.company - Informations de l'entreprise
   * @returns {Promise<Object>} L'utilisateur créé
   */
  const createUser = async (userData) => {
    error.value = null;
    successMessage.value = '';
    try {
      const newUser = {
        id: ++localUserIdCounter.value,
        ...userData,
        address: userData.address || {
          street: '',
          city: '',
          zipcode: '',
          country: '',
          geolocation: { lat: '', long: '' },
        },
        company: userData.company || {
          name: '',
          catchPhrase: '',
        },
      };

      users.value.unshift(newUser);
      successMessage.value = `✅ Utilisateur "${userData.username}" créé avec succès !`;

      setTimeout(() => {
        successMessage.value = '';
      }, 3000);

      return newUser;
    } catch (err) {
      error.value = 'Erreur lors de la création de l\'utilisateur';
      console.error(err);
      throw err;
    }
  };

  /**
   * Modifie un utilisateur existant
   * @async
   * @param {Number} userId - L'ID de l'utilisateur à modifier
   * @param {Object} userData - Les nouvelles données de l'utilisateur
   * @returns {Promise<Object>} L'utilisateur modifié
   */
  const updateUser = async (userId, userData) => {
    error.value = null;
    successMessage.value = '';
    try {
      const index = users.value.findIndex((u) => u.id === userId);

      if (index === -1) {
        throw new Error('Utilisateur non trouvé');
      }

      const updatedUser = {
        ...users.value[index],
        ...userData,
        id: userId,
      };

      users.value[index] = updatedUser;
      successMessage.value = `✅ Utilisateur "${userData.username}" modifié avec succès !`;

      setTimeout(() => {
        successMessage.value = '';
      }, 3000);

      return updatedUser;
    } catch (err) {
      error.value = 'Erreur lors de la modification de l\'utilisateur';
      console.error(err);
      throw err;
    }
  };

  /**
   * Supprime un utilisateur
   * @async
   * @param {Number} userId - L'ID de l'utilisateur à supprimer
   * @returns {Promise<void>}
   */
  const deleteUser = async (userId) => {
    error.value = null;
    successMessage.value = '';
    try {
      const user = users.value.find((u) => u.id === userId);
      const userName = user?.username || 'l\'utilisateur';

      users.value = users.value.filter((u) => u.id !== userId);

      successMessage.value = `✅ "${userName}" a été supprimé avec succès !`;

      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } catch (err) {
      error.value = 'Erreur lors de la suppression de l\'utilisateur';
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

  return {
    // State
    users,
    loading,
    error,
    successMessage,

    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearMessages,
  };
});
