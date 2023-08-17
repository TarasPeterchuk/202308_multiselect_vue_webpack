import { createApp } from 'vue';
import App from './App.vue';
import './main.scss';

window.__VUE_OPTIONS_API__ = false;
window.__VUE_PROD_DEVTOOLS__ = false;

createApp(App).mount('#app');
