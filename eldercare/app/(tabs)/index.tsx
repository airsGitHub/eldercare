import { Image, StyleSheet, Platform, ScrollView, TouchableOpacity, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>你好，{user?.name || '访客'}</Text>
        <Text style={styles.subtitle}>欢迎使用养老护理系统</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>紧急求助</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>预约服务</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>推荐服务</Text>
        <View style={styles.serviceList}>
          <TouchableOpacity style={styles.serviceItem}>
            <Text style={styles.serviceTitle}>日常护理</Text>
            <Text style={styles.serviceDesc}>专业护工上门服务</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <Text style={styles.serviceTitle}>康复理疗</Text>
            <Text style={styles.serviceDesc}>专业康复师指导</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <Text style={styles.serviceTitle}>健康监测</Text>
            <Text style={styles.serviceDesc}>定期体检和监测</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  serviceList: {
    gap: 10,
  },
  serviceItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  serviceDesc: {
    fontSize: 14,
    color: '#666',
  },
});
