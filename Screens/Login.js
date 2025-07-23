import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const loadSavedLogin = async () => {
      try {
        const savedRemember = await AsyncStorage.getItem('rememberMe');
        if (savedRemember === 'true') {
          const savedEmail = await AsyncStorage.getItem('savedEmail');
          const savedPassword = await AsyncStorage.getItem('savedPassword');
          if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
          }
        }
      } catch (e) {
        console.log('Lỗi đọc AsyncStorage', e);
      }
    };

    loadSavedLogin();
  }, []);

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Vui lòng nhập email và mật khẩu');
    return;
  }

  setLoading(true);
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    const userDoc = await firestore().collection('Users').doc(uid).get();

    if (userDoc.exists && userDoc.data().status === 'blocked') {
      await auth().signOut();
      Alert.alert('Tài khoản đã bị chặn', 'Vui lòng liên hệ quản trị viên của BREM để biết thêm thông tin.');
      setLoading(false);
      return;
    }

    if (rememberMe) {
      await AsyncStorage.setItem('savedEmail', email);
      await AsyncStorage.setItem('savedPassword', password);
      await AsyncStorage.setItem('rememberMe', 'true');
    } else {
      await AsyncStorage.removeItem('savedEmail');
      await AsyncStorage.removeItem('savedPassword');
      await AsyncStorage.setItem('rememberMe', 'false');
    }

    Alert.alert('Đăng nhập thành công! Chào mừng bạn đến với BREM');
    navigation.replace('HomeScreen');
  } catch (error) {
    Alert.alert('Đăng nhập thất bại', error.message);
  } finally {
    setLoading(false);
  }
};


  const toggleRememberMe = () => setRememberMe(prev => !prev);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
       <Image
        source={{ uri: 'https://moitruongbinhduong.gov.vn/upload/hinhanh/brem-(1)-1764.png' }}
        style={styles.logo}
        />

        <Text style={styles.title}>Chào mừng bạn!</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#666"
        />
        <TextInput
          placeholder="Mật khẩu"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#666"
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={toggleRememberMe} style={styles.checkbox}>
            <View style={[styles.checkboxBox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Ghi nhớ đăng nhập</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#004D40" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Chưa có tài khoản? Đăng ký ngay</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
  width: 300,
  height: 90,
  marginBottom: 16,
  alignSelf: 'center',
  backgroundColor: '#E0F2F1',
},
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#004D40',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderColor: '#B2DFDB',
    borderWidth: 1,
    elevation: 2,
  },
  checkboxContainer: {
    width: 300,
    marginBottom: 12,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#004D40',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1B6A77',
    borderColor: '#1B6A77',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: '#004D40',
    fontSize: 15,
  },
  button: {
    width: 300,
    backgroundColor: '#1B6A77',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  link: {
    color: '#004D40',
    marginTop: 20,
    fontSize: 15,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default Login;
