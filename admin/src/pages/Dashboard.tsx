import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Avatar, message } from 'antd';
import { UserOutlined, TeamOutlined, SolutionOutlined } from '@ant-design/icons';
import { userAPI, getCurrentUser } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      console.log('Current user:', currentUser);
      console.log('User role type:', typeof currentUser?.role);
      console.log('Is admin?', currentUser?.role === 'admin');
      console.log('Fetched users:', await userAPI.getAllUsers()); // 添加日志
      console.log('Current user in dashboard:', getCurrentUser()); // 添加调试日志
      const data = await userAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error); // 添加详细错误日志
      message.error(error.response?.data?.message || '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) => (
        <Avatar src={avatar} icon={<UserOutlined />} />
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  // 计算统计数据
  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.role === 'admin').length;
  const regularUsers = users.filter(user => user.role === 'user').length;

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总用户数"
              value={totalUsers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="管理员数量"
              value={adminUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="普通用户数量"
              value={regularUsers}
              prefix={<SolutionOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近注册用户">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
