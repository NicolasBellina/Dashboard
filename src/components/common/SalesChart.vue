<!--
  Composant SalesChart
  Affiche un graphique en barres des ventes par catégorie avec Chart.js
-->
<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

/**
 * Composant SalesChart - Graphique en barres
 * Affiche les ventes par catégorie avec Chart.js
 */

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Props du composant
 * @param {Array} data - Données à afficher (format: {label, value})
 * @param {String} title - Titre du graphique
 */
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: 'Graphique de Ventes',
  },
});

/**
 * Configuration du graphique Chart.js
 */
const chartData = computed(() => ({
  labels: props.data.map((item) => item.label),
  datasets: [
    {
      label: 'Nombre de produits',
      data: props.data.map((item) => item.value),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(14, 165, 233, 0.8)',
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(34, 197, 94)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
        'rgb(168, 85, 247)',
        'rgb(14, 165, 233)',
      ],
      borderWidth: 1,
      borderRadius: 4,
    },
  ],
}));

/**
 * Options du graphique (responsif, animations, etc.)
 */
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: true,
      text: props.title,
      font: {
        size: 14,
        weight: 'bold',
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 350px;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
