<!-- Inicio de Seción, Login -->
<template>
  <div class="login-bg flex justify-center items-center min-h-screen">
    <div class="bg-white bg-opacity-90 p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block mb-1 text-gray-700">Username:</label>
          <input
            type="text"
            v-model="username"
            required
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label class="block mb-1 text-gray-700">Password:</label>
          <input
            type="password"
            v-model="password"
            required
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ loading ? 'Iniciando sesión...' : 'Entrar' }}
        </button>
      </form>

      <!-- Alerta de error -->
      <div
        v-if="error"
        class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <!-- Alerta de bienvenida -->
      <div
        v-if="user"
        class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-fade-in"
        role="alert"
      >
        <strong class="font-bold">¡Bienvenido! </strong>
        <span class="block sm:inline">Hola, {{ user.firstName }}. Redirigiendo...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)
const user = ref(null)

const router = useRouter()

const handleLogin = async () => {
  error.value = null
  loading.value = true

  try {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    if (!response.ok) throw new Error('Credenciales incorrectas')

    const data = await response.json()

    // Guarda el token y el usuario en localStorage
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))

    user.value = data

    // Redirigir a /products luego de 1 segundo
    setTimeout(() => {
      router.push('/products')
    }, 1000)

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>