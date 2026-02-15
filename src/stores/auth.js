import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);

  const login = (email, password) => {
    if (email && password) {
      user.value = {
        email,
        name: email.split('@')[0],
        id: Math.random()
      };
      localStorage.setItem('user', JSON.stringify(user.value));
      return true;
    }
    return false;
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('user');
  };

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      user.value = JSON.parse(savedUser);
    }
  };

  return { user, isAuthenticated, login, logout, initializeAuth };
});
