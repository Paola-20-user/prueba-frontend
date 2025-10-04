<!-- Crear Producto y Actualizar Producto -->
<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-bold mb-6 text-center">
      {{ isEditMode ? '✏️ Editar Producto' : '➕ Crear Producto' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Título -->
      <div>
        <label class="block text-sm font-medium mb-1">Título:</label>
        <input
          v-model="form.title"
          required
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      <!-- Descripción -->
      <div>
        <label class="block text-sm font-medium mb-1">Descripción:</label>
        <textarea
          v-model="form.description"
          required
          rows="3"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
        ></textarea>
      </div>

      <!-- Precio -->
      <div>
        <label class="block text-sm font-medium mb-1">Precio:</label>
        <input
          type="text"
          v-model="rawPrice"
          required
          placeholder="Ej: 10.99 o 10,99"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      <!-- Categoría -->
      <div>
        <label class="block text-sm font-medium mb-1">Categoría:</label>
        <input
          v-model="form.category"
          required
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      <!-- Stock -->
      <div>
        <label class="block text-sm font-medium mb-1">Stock:</label>
        <input
          type="number"
          v-model.number="form.stock"
          required
          min="0"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      <!-- Rating -->
      <div>
        <label class="block text-sm font-medium mb-1">Rating:</label>
        <input
          type="text"
          v-model="rawRating"
          required
          placeholder="Ej: 4.5 o 4,5"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      <!-- Botones -->
      <div class="flex justify-between items-center mt-6">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded disabled:opacity-50"
        >
          {{ loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear' }}
        </button>

        <router-link to="/products">
          <button type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
            Cancelar
          </button>
        </router-link>
      </div>
    </form>

    <!-- Mensajes -->
    <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Estado inicial
const form = ref({
  title: '',
  description: '',
  category: '',
  stock: 0,
  rating: 0,
  price: 0
})

// Inputs como texto para permitir comas y puntos
const rawPrice = ref('')
const rawRating = ref('')

// Otros estados
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const isEditMode = ref(false)
const productId = route.params.id

// Modo edición: cargar datos
onMounted(async () => {
  if (productId) {
    isEditMode.value = true
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`https://dummyjson.com/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      form.value = {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        rating: data.rating ?? 0
      }
      rawPrice.value = String(data.price).replace('.', ',')
      rawRating.value = String(data.rating ?? 0).replace('.', ',')
    } catch (err) {
      errorMessage.value = 'Error al cargar el producto.'
    }
  }
})

// Enviar formulario
const handleSubmit = async () => {
  // Validar y convertir precio
  const priceNumber = parseFloat(rawPrice.value.replace(',', '.'))
  if (isNaN(priceNumber)) {
    alert('El precio ingresado no es válido.')
    return
  }

  // Validar y convertir rating
  const ratingNumber = parseFloat(rawRating.value.replace(',', '.'))
  if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 5) {
    alert('El rating debe estar entre 0 y 5.')
    return
  }

  // Asignar valores ya convertidos
  form.value.price = parseFloat(priceNumber.toFixed(2))
  form.value.rating = parseFloat(ratingNumber.toFixed(2))

  // actualizar visualmente los inputs
  rawPrice.value = form.value.price.toFixed(2).replace('.', ',')
rawRating.value = form.value.rating.toFixed(2).replace('.', ',')

  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  const token = localStorage.getItem('token')
  const url = isEditMode.value
    ? `https://dummyjson.com/products/${productId}`
    : 'https://dummyjson.com/products/add'

  const method = isEditMode.value ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })

    if (!res.ok) throw new Error('Error en la solicitud')

    const data = await res.json()
    successMessage.value = isEditMode.value
      ? '✅ Producto actualizado correctamente'
      : '✅ Producto creado correctamente'

    setTimeout(() => {
      router.push('/products')
    }, 1000)
  } catch (err) {
    errorMessage.value = '❌ Ocurrió un error. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}
</script>