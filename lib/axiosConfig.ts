import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useUserStore } from '../store/useUserStore';

const api = axios.create({
  baseURL: 'https://api.kjhjhkjhkj.shop/api',
  withCredentials: true,

//  headers: {
//    'ngrok-skip-browser-warning': 'true' // ✅ Header específico para ngrok
//  }
});
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Variable para evitar múltiples redirects
let isRedirecting = false;

api.interceptors.response.use(
  res => res,
  async (err) => {
    const status   = err.response?.status;
    const endpoint = err.config?.url || '';

    // Don't redirect on 401 for login or logout endpoints
    if (status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/logout') && !isRedirecting) {
      console.log('⚠️ Axios interceptor: 401 detected, redirecting to login');
      isRedirecting = true;
      await AsyncStorage.removeItem('usuario');
      await AsyncStorage.removeItem('auth_token');

      // Reset store
      const { resetStore } = useUserStore.getState();
      await resetStore();

      console.log('➡️ Axios interceptor: Navigating to /login');

      // Use setTimeout to allow cleanup
      setTimeout(() => {
        router.replace('/login');
        // Reset after navigation completes
        setTimeout(() => { isRedirecting = false; }, 500);
      }, 100);
    }

    return Promise.reject(err);
  }
);

export default api;
