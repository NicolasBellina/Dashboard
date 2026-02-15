<template>
  <div v-if="isOpen" class="modal-overlay" @click.prevent="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>⚠️ Confirmer la suppression</h2>
      </div>

      <div class="modal-body">
        <div class="warning-icon">🗑️</div>
        <p class="warning-text">
          Êtes-vous sûr de vouloir <strong>supprimer ce produit</strong> ?
        </p>
        <p v-if="productName" class="product-name">
          {{ productName }}
        </p>
        <p class="warning-note">
          Cette action est <strong>irréversible</strong> et supprimera définitivement le produit.
        </p>
      </div>

      <div class="modal-actions">
        <Button
          variant="secondary"
          @click="closeModal"
          :disabled="isDeleting"
        >
          Annuler
        </Button>
        <Button
          variant="danger"
          @click="confirmDelete"
          :disabled="isDeleting"
        >
          {{ isDeleting ? '⏳ Suppression...' : 'Supprimer définitivement' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from '@/components/common/Button.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  productId: {
    type: [String, Number],
    default: null,
  },
  productName: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close', 'confirm']);

const isDeleting = ref(false);

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    emit('confirm', props.productId);
  } finally {
    isDeleting.value = false;
  }
};

const closeModal = () => {
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
  max-width: 400px;
  width: 100%;
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
  font-size: 1.25rem;
  color: #1f2937;
}

.modal-body {
  padding: 2rem;
  text-align: center;
}

.warning-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.warning-text {
  font-size: 1rem;
  color: #1f2937;
  margin: 1rem 0;
}

.product-name {
  font-size: 0.95rem;
  color: #6b7280;
  background-color: #f9fafb;
  padding: 0.75rem;
  border-radius: 6px;
  margin: 1rem 0;
  word-break: break-word;
}

.warning-note {
  font-size: 0.875rem;
  color: #ef4444;
  margin: 1rem 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .modal-actions {
    flex-direction: column;
  }
}
</style>
