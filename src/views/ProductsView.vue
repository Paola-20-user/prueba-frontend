<!-- Tabla Productos -->
 <!-- Crear Producto -->
 <!-- Eliminar producto -->
<template>
  <div class="max-w-6xl mx-auto p-4">
    <h2 class="text-4xl font-bold mb-4">📦 Productos</h2>

    <div v-if="loading" class="flex flex-col items-center justify-center text-gray-600 py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid mb-4"></div>
      <p class="text-lg font-medium">Cargando detalles del producto...</p>
    </div>

    <div v-else>
      <table class="w-full table-auto border-collapse shadow-lg">
        <thead class="bg-gray-200">
          <tr>
            <th class="p-2 border">Imagen</th>
            <th class="p-2 border">Título</th>
            <th class="p-2 border">Categoría</th>
            <th class="p-2 border">Precio</th>
            <th class="p-2 border">Rating</th>
            <th class="p-2 border">Stock</th>
            <th class="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
            <td class="p-2 border text-center">
              <img :src="product.thumbnail" alt="imagen" class="w-14 h-14 object-cover rounded" />
            </td>
            <td class="p-2 border">
              <router-link
                :to="{ path: `/products/${product.id}`, query: { page: page } }"
                class="text-blue-600 hover:underline"
              >
                {{ product.title }}
              </router-link>
            </td>
            <td class="p-2 border">{{ product.category }}</td>
            <td class="p-2 border">${{ product.price }}</td>
            <td class="p-2 border">{{ product.rating }}</td>
            <td class="p-2 border">{{ product.stock }}</td>
            <td class="p-6 border flex gap-2 justify-center">
              <router-link :to="`/products/edit/${product.id}`">
                <button class="px-3 py-1 bg-blue-400 hover:bg-blue-500 text-white rounded text-sm">Editar</button>
              </router-link>
              <button
                @click="eliminarProducto(product.id)"
                class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación con botones de inicio y final -->
      <div class="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <!-- Ir al inicio -->
        <button
          @click="cambiarPagina(1)"
          :disabled="page === 1"
          class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-sm rounded disabled:opacity-50"
        >
          «
        </button>

        <!-- Anterior -->
        <button
          @click="cambiarPagina(page - 1)"
          :disabled="page <= 1"
          class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-sm rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span class="text-sm font-medium">Página {{ page }}</span>

        <!-- Siguiente -->
        <button
          @click="cambiarPagina(page + 1)"
          :disabled="!hasMore"
          class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-sm rounded disabled:opacity-50"
        >
          Siguiente
        </button>

        <!-- Ir al final -->
        <button
          @click="cambiarPagina(lastPage)"
          :disabled="page === lastPage"
          class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-sm rounded disabled:opacity-50"
        >
          »
        </button>
      </div>

      <!-- Botón agregar producto -->
      <div class="mt-6 text-right">
        <router-link to="/products/add">
          <button class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded">
            ➕ Agregar nuevo producto
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const products = ref([])
const loading = ref(true)
const page = ref(parseInt(route.query.page) || 1)
const limit = 10
const hasMore = ref(true)
const lastPage = ref(1)

if (!route.query.page) {
  router.replace({ path: '/products', query: { page: 1 } })
}

const fetchProducts = async () => {
  loading.value = true

  const token = localStorage.getItem('token')
  if (!token) {
    alert('No hay token. Debes iniciar sesión.')
    router.push('/login')
    return
  }

  try {
    const skip = (page.value - 1) * limit
    const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    products.value = data.products
    hasMore.value = data.total > page.value * limit
    lastPage.value = Math.ceil(data.total / limit)
  } catch (err) {
    console.error('Error al cargar productos:', err)
  } finally {
    loading.value = false
  }
}

const cambiarPagina = (nuevaPagina) => {
  page.value = nuevaPagina
  router.push({ path: '/products', query: { page: nuevaPagina } })
  fetchProducts()
}

const eliminarProducto = async (id) => {
  const confirmar = confirm('¿Estás seguro de que deseas eliminar este producto?')

  if (!confirmar) return
  const token = localStorage.getItem('token')

  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error('Error al eliminar producto')
    alert('✅ Producto eliminado correctamente')

    // Refrescar tabla
    fetchProducts()

  } catch (err) {
    console.error('Error al eliminar:', err)
    alert('❌ Error al eliminar el producto')
  }
}

onMounted(fetchProducts)
</script>