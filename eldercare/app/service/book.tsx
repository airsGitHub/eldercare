import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function BookServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const serviceId = params.serviceId as string;
  const serviceName = params.serviceName as string;
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('权限错误', '需要位置权限来提供更好的服务');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        if (!mounted) return;
        
        setLocation(location);
        
        try {
          const [address] = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          
          if (!mounted) return;
          
          if (address) {
            const fullAddress = `${address.region || ''}${address.city || ''}${address.district || ''}${address.street || ''}${address.streetNumber || ''}`;
            setAddress(fullAddress);
          }
        } catch (error) {
          console.error('地址解析错误:', error);
          Alert.alert('提示', '无法获取详细地址，请手动输入');
        }
      } catch (error) {
        console.error('位置获取错误:', error);
        Alert.alert('错误', '获取位置信息失败，请确保开启了位置权限');
      } finally {
        if (mounted) {
          setInitializing(false);
        }
      }
    };

    initializeLocation();

    return () => {
      mounted = false;
    };
  }, []);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!location || !address || !date) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    try {
      setLoading(true);
      // TODO: 发送预约请求到后端
      // const response = await api.bookService({
      //   serviceId,
      //   location: {
      //     latitude: location.coords.latitude,
      //     longitude: location.coords.longitude,
      //   },
      //   address,
      //   date: date.toISOString(),
      //   notes,
      // });

      Alert.alert(
        '预约成功',
        '我们会尽快安排服务人员与您联系',
        [
          {
            text: '确定',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('预约错误:', error);
      Alert.alert('错误', '预约失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>正在获取位置信息...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>预约服务</Text>
        <Text style={styles.subtitle}>{serviceName}</Text>
      </View>

      <View style={styles.form}>
        {location && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="服务地点"
              />
            </MapView>
          </View>
        )}

        <View style={styles.formItem}>
          <Text style={styles.label}>服务地址</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="请输入详细地址"
            multiline
          />
        </View>

        <View style={styles.formItem}>
          <Text style={styles.label}>预约时间</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {date.toLocaleString('zh-CN')}
            </Text>
            <FontAwesome name="calendar" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.formItem}>
          <Text style={styles.label}>备注信息</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="请输入其他需求或注意事项"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? '提交中...' : '提交预约'}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  formItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
