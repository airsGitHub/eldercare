import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';

export default function AvatarScreen() {
  const router = useRouter();
  const { user, updateAvatar } = useAuth();
  const [avatar, setAvatar] = useState<string>(user?.avatar || 'https://via.placeholder.com/150');
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    try {
      // 请求权限
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要权限', '请允许访问相册以选择头像');
        return;
      }

      // 选择图片
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        handleUpload(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('错误', '选择图片失败，请重试');
    }
  };

  const takePhoto = async () => {
    try {
      // 请求权限
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要权限', '请允许使用相机以拍摄头像');
        return;
      }

      // 拍照
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        handleUpload(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('错误', '拍照失败，请重试');
    }
  };

  const handleUpload = async (imageUri: string) => {
    try {
      setIsUploading(true);
      setAvatar(imageUri);

      // 更新头像
      await updateAvatar(imageUri);
      
      Alert.alert(
        '成功',
        '头像已更新',
        [
          {
            text: '确定',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
        {isUploading && (
          <View style={styles.uploadingOverlay}>
            <FontAwesome name="spinner" size={30} color="#fff" />
            <Text style={styles.uploadingText}>上传中...</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.photoButton]}
          onPress={takePhoto}
          disabled={isUploading}
        >
          <FontAwesome name="camera" size={20} color="#fff" />
          <Text style={styles.buttonText}>拍摄照片</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.albumButton]}
          onPress={pickImage}
          disabled={isUploading}
        >
          <FontAwesome name="image" size={20} color="#fff" />
          <Text style={styles.buttonText}>从相册选择</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ddd',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  photoButton: {
    backgroundColor: '#007AFF',
  },
  albumButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
