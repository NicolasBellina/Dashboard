<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditMode ? '✏️ Modifier le produit' : '➕ Créer un nouveau produit' }}</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <!-- Titre -->
          <div class="form-group">
            <label for="title">Titre du produit *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              placeholder="Entrez le titre du produit"
              class="form-input"
              required
            />
            <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              v-model="form.description"
              placeholder="Entrez la description du produit"
              class="form-input"
              rows="4"
              required
            ></textarea>
            <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
          </div>

          <!-- Prix -->
          <div class="form-row">
            <div class="form-group">
              <label for="price">Prix (€) *</label>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                class="form-input"
                required
              />
              <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
            </div>

            <!-- Catégorie -->
            <div class="form-group">
              <label for="category">Catégorie *</label>
              <select
                id="category"
                v-model="form.category"
                class="form-input"
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
              <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
            </div>
          </div>

          <!-- Rating -->
          <div class="form-row">
            <div class="form-group">
              <label for="rating">Évaluation (0-5) *</label>
              <input
                id="rating"
                v-model.number="form.rating"
                type="number"
                placeholder="4.5"
                step="0.1"
                min="0"
                max="5"
                class="form-input"
                required
              />
              <span v-if="errors.rating" class="error-message">{{ errors.rating }}</span>
            </div>

            <!-- Nombre d'avis -->
            <div class="form-group">
              <label for="count">Nombre d'avis</label>
              <input
                id="count"
                v-model.number="form.count"
                type="number"
                placeholder="0"
                min="0"
                class="form-input"
              />
            </div>
          </div>

          <!-- Image URL -->
          <div class="form-group">
            <label for="image">URL de l'image</label>
            <input
              id="image"
              v-model="form.image"
              type="url"
              placeholder="https://exemple.com/image.jpg"
              class="form-input"
            />
          </div>

          <!-- Aperçu de l'image -->
          <div v-if="form.image" class="image-preview">
            <p>Aperçu :</p>
            <img :src="form.image" :alt="form.title" @error="handleImageError" />
          </div>

          <!-- Messages d'erreur de soumission -->
          <div v-if="submitError" class="submit-error">
            {{ submitError }}
          </div>

          <!-- Boutons -->
          <div class="form-actions">
            <Button
              type="button"
              variant="secondary"
              @click="closeModal"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '⏳ En cours...' : (isEditMode ? 'Modifier' : 'Créer') }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import Button from '@/components/common/Button.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  editingProduct: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'submit']);

const isSubmitting = ref(false);
const submitError = ref('');
const errors = ref({});

const defaultForm = {
  title: '',
  description: '',
  price: 0,
  category: '',
  rating: 5,
  count: 0,
  image: '',
};

const form = ref({ ...defaultForm });

const isEditMode = computed(() => props.editingProduct !== null);

// Remplir le formulaire si en mode édition
watch(
  () => props.editingProduct,
  (newProduct) => {
    if (newProduct) {
      form.value = {
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        rating: newProduct.rating?.rate || 5,
        count: newProduct.rating?.count || 0,
        image: newProduct.image,
      };
    }
  }
);

const validateForm = () => {
  errors.value = {};

  if (!form.value.title.trim()) {
    errors.value.title = 'Le titre est requis';
  }

  if (!form.value.description.trim()) {
    errors.value.description = 'La description est requise';
  }

  if (form.value.price <= 0) {
    errors.value.price = 'Le prix doit être supérieur à 0';
  }

  if (!form.value.category) {
    errors.value.category = 'La catégorie est requise';
  }

  if (form.value.rating < 0 || form.value.rating > 5) {
    errors.value.rating = 'L\'évaluation doit être entre 0 et 5';
  }

  return Object.keys(errors.value).length === 0;
};

const handleImageError = () => {
  submitError.value = 'L\'URL de l\'image est invalide';
};

const handleSubmit = async () => {
  submitError.value = '';

  if (!validateForm()) {
    submitError.value = 'Veuillez corriger les erreurs du formulaire';
    return;
  }

  isSubmitting.value = true;

  try {
    const productData = {
      ...form.value,
      rating: {
        rate: form.value.rating,
        count: form.value.count,
      },
    };

    // Si édition, ajouter l'ID
    if (isEditMode.value) {
      productData.id = props.editingProduct.id;
    }

    emit('submit', productData);
  } catch (error) {
    submitError.value = 'Erreur lors de la soumission du formulaire';
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  form.value = { ...defaultForm };
  errors.value = {};
  submitError.value = '';
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
  padding: 0;
}

.close-btn:hover {
  color: #1f2937;
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1f2937;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea.form-input {
  resize: vertical;
  font-family: inherit;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  display: block;
  margin-top: 0.25rem;
}

.submit-error {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.image-preview {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 6px;
}

.image-preview p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  color: #1f2937;
}

.image-preview img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 640px) {
  .modal-content {
    max-width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .close-btn {
    align-self: flex-end;
  }
}
</style>
