import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      navigate(key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
      <Menu
        theme="dark"
        selectedKeys={[location.pathname]}
        mode="inline"
        onClick={({ key }) => handleMenuClick(key)}
        items={[
          {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: '仪表盘',
          },
          {
            key: '/users',
            icon: <UserOutlined />,
            label: '用户管理',
          },
          {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
