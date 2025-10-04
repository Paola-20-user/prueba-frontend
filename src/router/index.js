import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import LoginView from '../views/LoginView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import ProductFormView from '../views/ProductFormView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/products', component: ProductsView },
  { path: '/products/:id', component: ProductDetailView },
  { path: '/products/add', component: ProductFormView },
  { path: '/products/edit/:id', component: ProductFormView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router