import axios from 'axios';

// 设置 axios 默认配置
axios.defaults.baseURL = 'http://localhost:3000'; // 确保这是正确的后端地址

// 添加请求拦截器，确保每个请求都带有最新的 token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('/auth/refresh', {
      refreshToken
    });
    
    const { token } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return token;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

const getAllUsers = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('未登录');
  }
  
  try {
    const response = await axios.get('/users');
    return response;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('认证失败，请重新登录');
    }
    throw error;
  }
};

// 响应拦截器
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        throw new Error('认证失败，请重新登录');
      }
    }
    return Promise.reject(error);
  }
);

export { getAllUsers }; 