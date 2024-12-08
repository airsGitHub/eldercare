import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    // 如果没有token或用户信息，重定向到登录页
    return <Navigate to="/login" replace />;
  }

  try {
    // 验证用户信息是否有效
    const userData = JSON.parse(user);
    if (!userData.email || !userData.role) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // 如果用户信息无效，清除本地存储并重定向到登录页
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
