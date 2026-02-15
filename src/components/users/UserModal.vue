<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditMode ? '✏️ Modifier l\'utilisateur' : '➕ Créer un nouvel utilisateur' }}</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <!-- Informations personnelles -->
          <div class="form-section">
            <h3>Informations personnelles</h3>

            <!-- Nom complet -->
            <div class="form-group">
              <label for="fullname">Nom complet *</label>
              <input
                id="fullname"
                v-model="form.name"
                type="text"
                placeholder="Jean Dupont"
                class="form-input"
                required
              />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <!-- Nom d'utilisateur -->
            <div class="form-group">
              <label for="username">Nom d'utilisateur *</label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="jeandupont"
                class="form-input"
                required
              />
              <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">Email *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="jean@example.com"
                class="form-input"
                required
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <!-- Téléphone -->
            <div class="form-group">
              <label for="phone">Téléphone</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="+33 1 23 45 67 89"
                class="form-input"
              />
            </div>
          </div>

          <!-- Adresse -->
          <div class="form-section">
            <h3>Adresse</h3>

            <div class="form-group">
              <label for="street">Rue</label>
              <input
                id="street"
                v-model="form.address.street"
                type="text"
                placeholder="123 Rue de la Paix"
                class="form-input"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">Ville</label>
                <input
                  id="city"
                  v-model="form.address.city"
                  type="text"
                  placeholder="Paris"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="zipcode">Code postal</label>
                <input
                  id="zipcode"
                  v-model="form.address.zipcode"
                  type="text"
                  placeholder="75001"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="country">Pays</label>
              <input
                id="country"
                v-model="form.address.country"
                type="text"
                placeholder="France"
                class="form-input"
              />
            </div>
          </div>

          <!-- Coordonnées géographiques -->
          <div class="form-section">
            <h3>Coordonnées géographiques</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="latitude">Latitude</label>
                <input
                  id="latitude"
                  v-model.number="form.address.geolocation.lat"
                  type="number"
                  step="0.0001"
                  placeholder="48.8566"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="longitude">Longitude</label>
                <input
                  id="longitude"
                  v-model.number="form.address.geolocation.long"
                  type="number"
                  step="0.0001"
                  placeholder="2.3522"
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Entreprise -->
          <div class="form-section">
            <h3>Entreprise</h3>

            <div class="form-group">
              <label for="company">Nom de l'entreprise</label>
              <input
                id="company"
                v-model="form.company.name"
                type="text"
                placeholder="Acme Corp"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="catchPhrase">Phrase accroche</label>
              <input
                id="catchPhrase"
                v-model="form.company.catchPhrase"
                type="text"
                placeholder="Expert en innovation"
                class="form-input"
              />
            </div>
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
  editingUser: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'submit']);

const isSubmitting = ref(false);
const submitError = ref('');
const errors = ref({});

const defaultForm = {
  name: '',
  username: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    zipcode: '',
    country: '',
    geolocation: {
      lat: '',
      long: '',
    },
  },
  company: {
    name: '',
    catchPhrase: '',
  },
};

const form = ref(JSON.parse(JSON.stringify(defaultForm)));

const isEditMode = computed(() => props.editingUser !== null);

// Remplir le formulaire si en mode édition
watch(
  () => props.editingUser,
  (newUser) => {
    if (newUser) {
      form.value = {
        name: newUser.name || '',
        username: newUser.username || '',
        email: newUser.email || '',
        phone: newUser.phone || '',
        address: {
          street: newUser.address?.street || '',
          city: newUser.address?.city || '',
          zipcode: newUser.address?.zipcode || '',
          country: newUser.address?.country || '',
          geolocation: {
            lat: newUser.address?.geolocation?.lat || '',
            long: newUser.address?.geolocation?.long || '',
          },
        },
        company: {
          name: newUser.company?.name || '',
          catchPhrase: newUser.company?.catchPhrase || '',
        },
      };
    }
  }
);

const validateForm = () => {
  errors.value = {};

  if (!form.value.name.trim()) {
    errors.value.name = 'Le nom complet est requis';
  }

  if (!form.value.username.trim()) {
    errors.value.username = 'Le nom d\'utilisateur est requis';
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'L\'email est invalide';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  submitError.value = '';

  if (!validateForm()) {
    submitError.value = 'Veuillez corriger les erreurs du formulaire';
    return;
  }

  isSubmitting.value = true;

  try {
    const userData = {
      ...form.value,
    };

    // Si édition, ajouter l'ID
    if (isEditMode.value) {
      userData.id = props.editingUser.id;
    }

    emit('submit', userData);
  } catch (error) {
    submitError.value = 'Erreur lors de la soumission du formulaire';
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  form.value = JSON.parse(JSON.stringify(defaultForm));
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
  max-width: 700px;
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
  position: sticky;
  top: 0;
  background-color: white;
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

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #1f2937;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f3f4f6;
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

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  position: sticky;
  bottom: 0;
  background-color: white;
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

  .modal-body {
    padding: 1.5rem;
  }
}
</style>
