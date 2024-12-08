import { Redirect } from 'expo-router';

export default function ServiceIndex() {
  // 重定向到标签页中的服务页面
  return <Redirect href="/(tabs)/service" />;
}
