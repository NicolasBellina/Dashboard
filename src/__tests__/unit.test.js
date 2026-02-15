/**
 * Fichier de tests unitaires
 * Tests pour les stores Pinia et utilitaires
 *
 * Pour exécuter les tests:
 * npm install -D vitest
 * npm run test
 *
 * @module tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useProductStore } from '@/stores/products.js';
import { useUserStore } from '@/stores/users.js';
import { useAnalyticsStore } from '@/stores/analytics.js';
import { useAuthStore } from '@/stores/auth.js';

/**
 * Tests du Store Products
 */
describe('Product Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  /**
   * Test: Initialisation du store
   */
  it('initialise le store avec les bonnes valeurs', () => {
    const store = useProductStore();
    expect(store.products).toEqual([]);
    expect(store.categories).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  /**
   * Test: Création d'un produit
   */
  it('crée un nouveau produit', async () => {
    const store = useProductStore();
    const newProduct = {
      title: 'Produit Test',
      description: 'Description test',
      price: 99.99,
      category: 'test',
      rating: { rate: 5, count: 0 },
    };

    await store.createProduct(newProduct);

    expect(store.products).toHaveLength(1);
    expect(store.products[0].title).toBe('Produit Test');
    expect(store.products[0].price).toBe(99.99);
  });

  /**
   * Test: Modification d'un produit
   */
  it('modifie un produit existant', async () => {
    const store = useProductStore();

    // Créer un produit
    await store.createProduct({
      title: 'Produit Original',
      description: 'Description',
      price: 50,
      category: 'test',
    });

    // Modifier le produit
    const productId = store.products[0].id;
    await store.updateProduct(productId, {
      title: 'Produit Modifié',
      description: 'Description modifiée',
      price: 75,
      category: 'test',
    });

    expect(store.products[0].title).toBe('Produit Modifié');
    expect(store.products[0].price).toBe(75);
  });

  /**
   * Test: Suppression d'un produit
   */
  it('supprime un produit', async () => {
    const store = useProductStore();

    // Créer et supprimer un produit
    await store.createProduct({
      title: 'Produit à Supprimer',
      description: 'Description',
      price: 50,
      category: 'test',
    });

    const productId = store.products[0].id;
    await store.deleteProduct(productId);

    expect(store.products).toHaveLength(0);
  });

  /**
   * Test: Nettoyage des messages
   */
  it('nettoie les messages', () => {
    const store = useProductStore();
    store.error = 'Une erreur';
    store.successMessage = 'Succès!';

    store.clearMessages();

    expect(store.error).toBeNull();
    expect(store.successMessage).toBe('');
  });
});

/**
 * Tests du Store Users
 */
describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  /**
   * Test: Initialisation du store
   */
  it('initialise le store avec les bonnes valeurs', () => {
    const store = useUserStore();
    expect(store.users).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  /**
   * Test: Création d'un utilisateur
   */
  it('crée un nouvel utilisateur', async () => {
    const store = useUserStore();
    const newUser = {
      name: 'Jean Dupont',
      username: 'jeandupont',
      email: 'jean@example.com',
      phone: '+33 1 23 45 67 89',
      address: { street: '', city: '', zipcode: '', country: '' },
      company: { name: '', catchPhrase: '' },
    };

    await store.createUser(newUser);

    expect(store.users).toHaveLength(1);
    expect(store.users[0].username).toBe('jeandupont');
    expect(store.users[0].email).toBe('jean@example.com');
  });

  /**
   * Test: Suppression d'un utilisateur
   */
  it('supprime un utilisateur', async () => {
    const store = useUserStore();

    await store.createUser({
      name: 'Utilisateur Test',
      username: 'usertest',
      email: 'user@test.com',
      phone: '+33 1 00 00 00 00',
      address: {},
      company: {},
    });

    const userId = store.users[0].id;
    await store.deleteUser(userId);

    expect(store.users).toHaveLength(0);
  });
});

/**
 * Tests du Store Analytics
 */
describe('Analytics Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  /**
   * Test: Initialisation du store
   */
  it('initialise le store avec les bonnes valeurs', () => {
    const store = useAnalyticsStore();
    expect(store.carts).toEqual([]);
    expect(store.totalSales).toBe('0.00');
    expect(store.totalOrders).toBe(0);
  });

  /**
   * Test: Calcul du chiffre d'affaires
   */
  it('calcule correctement le chiffre d\'affaires', () => {
    const store = useAnalyticsStore();

    // Simuler des paniers
    store.carts = [
      { id: 1, userId: 1, date: '2024-01-01', products: [] },
      { id: 2, userId: 2, date: '2024-01-02', products: [] },
      { id: 3, userId: 3, date: '2024-01-03', products: [] },
    ];

    expect(store.totalOrders).toBe(3);
    expect(store.totalSales).toBe('450.00'); // 3 * 150
  });

  /**
   * Test: Calcul du montant moyen par commande
   */
  it('calcule correctement le montant moyen', () => {
    const store = useAnalyticsStore();

    store.carts = [
      { id: 1 },
      { id: 2 },
    ];

    expect(store.averageOrderValue).toBe('150.00');
  });
});

/**
 * Tests du Store Auth
 */
describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  /**
   * Test: Login
   */
  it('effectue un login', () => {
    const store = useAuthStore();
    const result = store.login('test@example.com', 'password');

    expect(result).toBe(true);
    expect(store.isAuthenticated).toBe(true);
    expect(store.user.email).toBe('test@example.com');
  });

  /**
   * Test: Logout
   */
  it('effectue un logout', () => {
    const store = useAuthStore();

    store.login('test@example.com', 'password');
    expect(store.isAuthenticated).toBe(true);

    store.logout();
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
  });

  /**
   * Test: Persistance du login
   */
  it('persiste l\'authentification', () => {
    const store1 = useAuthStore();
    store1.login('test@example.com', 'password');

    const store2 = useAuthStore();
    expect(store2.isAuthenticated).toBe(true);
  });
});

/**
 * Tests des Utilitaires
 */
describe('Utility Functions', () => {
  /**
   * Test: Validation d'email
   */
  it('valide correctement un email', () => {
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@domain')).toBe(false);
  });

  /**
   * Test: Formatage de prix
   */
  it('formate correctement les prix', () => {
    const formatPrice = (price) => `${price.toFixed(2)}€`;

    expect(formatPrice(99.5)).toBe('99.50€');
    expect(formatPrice(100)).toBe('100.00€');
    expect(formatPrice(10.1)).toBe('10.10€');
  });

  /**
   * Test: Troncature de texte
   */
  it('tronque correctement le texte', () => {
    const truncate = (text, length) => {
      return text.length > length ? text.substring(0, length) + '...' : text;
    };

    expect(truncate('Bonjour le monde', 7)).toBe('Bonjour...');
    expect(truncate('Hi', 7)).toBe('Hi');
  });
});
