<!-- Ver Producto -->
<template>
  <div class="max-w-4xl mx-auto p-6 bg-gradient-to-r from-purple-200 to-blue-200">
    <div v-if="loading" class="flex flex-col items-center justify-center text-gray-600 py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid mb-4"></div>
      <p class="text-lg font-medium">Cargando detalles del producto...</p>
    </div>

    <div v-else-if="product" class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-3xl font-bold mb-4 text-center">{{ product.title }}</h2>

      <!-- Imagen principal -->
      <div class="flex justify-center mb-6">
        <img
          :src="product.thumbnail"
          alt="Thumbnail"
          class="w-64 h-64 object-cover rounded border"
        />
      </div>

      <!-- Galería -->
      <h3 class="text-lg font-semibold mb-2">Galería</h3>
      <div class="flex gap-3 flex-wrap mb-6">
        <img
          v-for="img in product.images"
          :key="img"
          :src="img"
          alt="galería"
          class="w-24 h-24 object-cover rounded border hover:scale-105 transition"
        />
      </div>

      <!-- Detalles -->
      <div class="space-y-2 text-gray-700">
        <p><span class="font-semibold">Categoría:</span> {{ product.category }}</p>
        <p><span class="font-semibold">Descripción:</span> {{ product.description }}</p>
        <p><span class="font-semibold">Precio:</span> ${{ product.price }}</p>
        <p><span class="font-semibold">Rating:</span> {{ product.rating }}</p>
        <p><span class="font-semibold">Stock:</span> {{ product.stock }}</p>
      </div>

      <!-- Botón Volver -->
      <div class="mt-6 text-right">
        <button
          @click="volver"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded"
        >
          ← Volver
        </button>
      </div>
    </div>

    <div v-else class="text-center text-red-600 mt-8">
      No se encontró el producto.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(true)

const fetchProduct = async () => {
  loading.value = true
  const id = route.params.id
  const token = localStorage.getItem('token')

  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw new Error('No se pudo cargar el producto.')

    const data = await res.json()
    product.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const volver = () => {
  const page = route.query.page || 1
  router.push({ path: '/products', query: { page } })
}

onMounted(fetchProduct)
</script>