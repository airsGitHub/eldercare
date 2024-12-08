import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

export default function ServiceScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      id: 1,
      title: '日常护理',
      description: '专业护工提供生活照料、个人卫生等服务',
      price: '200元/天',
      category: '护理服务'
    },
    {
      id: 2,
      title: '康复理疗',
      description: '专业康复师提供运动康复、物理治疗等服务',
      price: '300元/次',
      category: '医疗服务'
    },
    {
      id: 3,
      title: '营养配餐',
      description: '专业营养师定制健康餐单，专人送餐上门',
      price: '50元/餐',
      category: '生活服务'
    },
    {
      id: 4,
      title: '心理咨询',
      description: '专业心理咨询师提供心理疏导和情感支持',
      price: '200元/次',
      category: '心理服务'
    },
  ];

  const categories = [...new Set(services.map(service => service.category))];

  const handleBook = (service) => {
    // 使用相对路径进行导航
    router.push({
      pathname: '../../service/book',
      params: {
        serviceId: service.id.toString(),
        serviceName: service.title,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索服务"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categories}>
        {categories.map((category) => (
          <TouchableOpacity key={category} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.serviceList}>
        {services.map((service) => (
          <TouchableOpacity key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.servicePrice}>{service.price}</Text>
            </View>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <View style={styles.serviceFooter}>
              <Text style={styles.serviceCategory}>{service.category}</Text>
              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => handleBook(service)}
              >
                <Text style={styles.bookButtonText}>立即预约</Text>
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
  categories: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  serviceList: {
    padding: 10,
    gap: 10,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    gap: 10,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  servicePrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  serviceCategory: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
