import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [avatar, setAvatar] = useState<string>(user?.avatar || 'https://via.placeholder.com/100');

  // 当用户头像更新时，更新本地状态
  useEffect(() => {
    if (user?.avatar) {
      setAvatar(user.avatar);
    }
  }, [user?.avatar]);

  const handleAvatarPress = () => {
    router.push('/avatar');
  };

  const menuItems = [
    {
      id: 'orders',
      title: '我的订单',
      icon: 'file-text-o',
      badge: '2',
    },
    {
      id: 'demands',
      title: '我的需求',
      icon: 'list-ul',
      badge: '1',
    },
    {
      id: 'favorites',
      title: '我的收藏',
      icon: 'heart-o',
    },
    {
      id: 'address',
      title: '地址管理',
      icon: 'map-marker',
    },
    {
      id: 'settings',
      title: '设置',
      icon: 'cog',
    },
    {
      id: 'help',
      title: '帮助与反馈',
      icon: 'question-circle-o',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handleAvatarPress}>
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
            />
            <View style={styles.avatarOverlay}>
              <FontAwesome name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || '未登录'}</Text>
            <Text style={styles.userEmail}>{user?.email || '点击登录'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>已完成</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>进行中</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>待评价</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <FontAwesome name={item.icon} size={20} color="#666" />
              <Text style={styles.menuItemTitle}>{item.title}</Text>
            </View>
            <View style={styles.menuItemRight}>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <FontAwesome name="angle-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>退出登录</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 15,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#ff4d4f',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ff4d4f',
    fontSize: 16,
    fontWeight: '600',
  },
});
