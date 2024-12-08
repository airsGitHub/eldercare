import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/user';
import { message } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });

    if (error.response) {
      const errorMessage = error.response.data?.message || '请求失败';
      if (error.response.status === 401 || error.response.status === 403) {
        // 对于 401 和 403 错误，检查 token 是否过期
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expTime = payload.exp * 1000; // 转换为毫秒
            if (Date.now() >= expTime) {
              console.log('Token expired, logging out');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
              return Promise.reject(new Error('登录已过期，请重新登录'));
            }
          } catch (e) {
            console.error('Error parsing token:', e);
          }
        }
      }
      return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(new Error('网络错误，请稍后重试'));
  }
);

// 认证相关API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
    }
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    return await api.post('/auth/register', data);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};

// 用户相关API
export const userAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const user = getCurrentUser();
    if (!user || user.role.toUpperCase() !== 'ADMIN') {
      throw new Error('没有权限访问用户列表');
    }
    return await api.get('/users');
  },

  getUser: async (id: string): Promise<User> => {
    const user = getCurrentUser();
    if (!user || user.role.toUpperCase() !== 'ADMIN') {
      throw new Error('没有权限访问用户详情');
    }
    return await api.get(`/users/${id}`);
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const user = getCurrentUser();
    if (!user || user.role.toUpperCase() !== 'ADMIN') {
      throw new Error('没有权限修改用户');
    }
    return await api.patch(`/users/${id}`, data);
  },

  deleteUser: async (id: string): Promise<void> => {
    const user = getCurrentUser();
    if (!user || user.role.toUpperCase() !== 'ADMIN') {
      throw new Error('没有权限删除用户');
    }
    return await api.delete(`/users/${id}`);
  },
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user:', error);
    return null;
  }
};

export default api;
