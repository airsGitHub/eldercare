import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from './api';

interface User {
  id: number;
  name: string;
  // ... 其他用户属性
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 检查登录状态
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
      setError(null); // 清除之前的错误
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || '获取用户列表失败');
      
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

export default Dashboard; 