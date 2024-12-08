import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FontAwesome } from '@expo/vector-icons';
import { Linking } from 'expo';

interface AvatarUploadSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onAvatarUpdate: (uri: string) => void;
  currentAvatar?: string;
}

export default function AvatarUploadSheet({
  bottomSheetRef,
  onAvatarUpdate,
  currentAvatar,
}: AvatarUploadSheetProps) {
  const requestPermission = useCallback(async (useCamera: boolean) => {
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '需要权限',
          '需要相机权限来拍摄照片',
          [
            { text: '取消', style: 'cancel' },
            { 
              text: '去设置', 
              onPress: () => {
                // 在iOS中打开设置
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                }
              }
            }
          ]
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '需要权限',
          '需要相册权限来选择照片',
          [
            { text: '取消', style: 'cancel' },
            { 
              text: '去设置', 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                }
              }
            }
          ]
        );
        return false;
      }
    }
    return true;
  }, []);

  const pickImage = useCallback(async (useCamera: boolean) => {
    try {
      const hasPermission = await requestPermission(useCamera);
      if (!hasPermission) return;

      const options: ImagePicker.ImagePickerOptions = {
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      };

      const result = await (useCamera
        ? ImagePicker.launchCameraAsync(options)
        : ImagePicker.launchImageLibraryAsync(options));

      if (!result.canceled && result.assets[0].uri) {
        // 先关闭底部弹出层
        bottomSheetRef.current?.close();
        
        // 显示加载提示
        Alert.alert('提示', '头像上传中...');
        
        // TODO: 这里添加实际的上传逻辑
        // const formData = new FormData();
        // formData.append('avatar', {
        //   uri: result.assets[0].uri,
        //   type: 'image/jpeg',
        //   name: 'avatar.jpg',
        // });
        // const response = await fetch('YOUR_API_ENDPOINT', {
        //   method: 'POST',
        //   body: formData,
        // });
        
        // 临时直接更新UI
        setTimeout(() => {
          onAvatarUpdate(result.assets[0].uri);
          Alert.alert('成功', '头像已更新');
        }, 1000);
      }
    } catch (error) {
      Alert.alert('错误', '上传头像失败，请重试');
      console.error('Error picking image:', error);
    }
  }, [onAvatarUpdate, requestPermission]);

  return (
    <View style={styles.container}>
      <BlurView intensity={100} style={styles.blurContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>更换头像</Text>
          {currentAvatar && (
            <Image source={{ uri: currentAvatar }} style={styles.previewImage} />
          )}
        </View>
        
        <TouchableOpacity
          style={styles.option}
          onPress={() => pickImage(true)}
        >
          <FontAwesome name="camera" size={24} color="#007AFF" />
          <Text style={styles.optionText}>拍摄照片</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => pickImage(false)}
        >
          <FontAwesome name="image" size={24} color="#007AFF" />
          <Text style={styles.optionText}>从相册选择</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, styles.cancelButton]}
          onPress={() => bottomSheetRef.current?.close()}
        >
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    marginTop: 10,
    justifyContent: 'center',
  },
  cancelText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
});
