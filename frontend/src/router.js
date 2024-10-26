import { createRouter, createWebHistory } from 'vue-router';

import Time from './components/Time.vue';
import Login from "./components/Login.vue";
import Dashboard from './components/Dashboard.vue';

// Определяем маршруты
const routes = [
  { path: '/time', name: 'Time', component: Time },
  { path: '/login', name: 'Login', component: Login }, // Добавил имя маршрута 'Login'
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,  // Защищаем роут
    meta: { requiresAuth: true },

  },
];

// Создаем экземпляр маршрутизатора
const router = createRouter({
  history: createWebHistory(), // Используем историю браузера
  routes, // Указываем маршруты
});

// Проверка перед навигацией на защищенные страницы
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // Получаем токен

  // Если маршрут требует авторизации и токен отсутствует, перенаправляем на логин
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next({ name: 'Login' }); // Перенаправляем на страницу логина
  } else {
    next(); // Разрешаем переход
  }
});

export default router; // Экспортируем экземпляр маршрутизатора
