import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
  useEffect(() => {
    // 清除可能存在的旧数据
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout>
                  <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                    <Dashboard />
                  </Content>
                </Layout>
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout>
                  <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                    <UserManagement />
                  </Content>
                </Layout>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
