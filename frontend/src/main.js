import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Импортируем маршрутизатор
import 'core-js/stable';
import 'regenerator-runtime/runtime';

createApp(App)
  .use(router)  // Используем маршрутизатор
  .mount('#app');
