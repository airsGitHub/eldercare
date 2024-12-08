import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function DemandScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const demands = [
    {
      id: 1,
      title: '需要专业护工',
      description: '老人需要专业护工提供日常生活照料，每天8小时',
      location: '上海市浦东新区',
      status: '待接单',
      price: '200元/天',
      urgency: '普通'
    },
    {
      id: 2,
      title: '康复理疗服务',
      description: '需要康复师上门提供康复训练，每周3次',
      location: '上海市徐汇区',
      status: '待接单',
      price: '300元/次',
      urgency: '紧急'
    },
    {
      id: 3,
      title: '居家照护',
      description: '老人术后恢复期，需要24小时专业护理',
      location: '上海市长宁区',
      status: '已接单',
      price: '500元/天',
      urgency: '加急'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.publishButton}>
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.publishButtonText}>发布需求</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索需求"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.demandList}>
        {demands.map((demand) => (
          <TouchableOpacity key={demand.id} style={styles.demandCard}>
            <View style={styles.demandHeader}>
              <Text style={styles.demandTitle}>{demand.title}</Text>
              <Text style={[
                styles.urgencyTag,
                { backgroundColor: demand.urgency === '紧急' ? '#ff4d4f' : 
                                 demand.urgency === '加急' ? '#ffa940' : '#52c41a' }
              ]}>
                {demand.urgency}
              </Text>
            </View>
            <Text style={styles.demandDescription}>{demand.description}</Text>
            <View style={styles.demandInfo}>
              <Text style={styles.location}>
                <FontAwesome name="map-marker" size={14} color="#666" /> {demand.location}
              </Text>
              <Text style={styles.price}>{demand.price}</Text>
            </View>
            <View style={styles.demandFooter}>
              <Text style={[
                styles.statusTag,
                { backgroundColor: demand.status === '待接单' ? '#e6f7ff' : '#f6ffed',
                  color: demand.status === '待接单' ? '#1890ff' : '#52c41a' }
              ]}>
                {demand.status}
              </Text>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>
                  {demand.status === '待接单' ? '接单' : '查看详情'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'flex-end',
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  demandList: {
    padding: 10,
    gap: 10,
  },
  demandCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    gap: 10,
  },
  demandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demandTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  urgencyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    color: '#fff',
    fontSize: 12,
  },
  demandDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  demandInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  demandFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    fontSize: 12,
  },
  acceptButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
