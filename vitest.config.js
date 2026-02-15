import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

/**
 * Configuration Vitest pour les tests unitaires
 * Lance les tests avec: npm run test
 */
export default defineConfig({
  plugins: [vue()],
  test: {
    // Environnement de test
    environment: 'jsdom',

    // Pattern des fichiers de test
    include: ['src/**/*.{test,spec}.{js,ts}'],

    // Globals (describe, it, expect sans import)
    globals: true,

    // Couverture de code
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
      ],
    },

    // Reporter
    reporters: ['verbose'],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
