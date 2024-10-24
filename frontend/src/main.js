import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Импортируем маршрутизатор

createApp(App)
  .use(router)  // Используем маршрутизатор
  .mount('#app');
