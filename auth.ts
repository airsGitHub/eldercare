import axios from 'axios';

interface LoginResponse {
  token: string;
  refreshToken: string;
}

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post<LoginResponse>('/auth/login', {
      username,
      password
    });
    
    const { token, refreshToken } = response.data;
    
    // 保存 tokens
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    // 设置默认 header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '登录失败');
  }
}; 