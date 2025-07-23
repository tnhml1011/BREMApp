import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !address || !password || !confirm) {
      Alert.alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Mật khẩu không trùng khớp.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mật khẩu phải từ 6 ký tự trở lên.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { uid, email: userEmail } = userCredential.user;

      await firestore().collection('Users').doc(uid).set({
        fullName,
        email: userEmail,
        phone,
        address,
        role: 'user',
        status:'active',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Đăng ký thất bại', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>Tạo tài khoản mới</Text>

        <TextInput
          placeholder="Họ và tên"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#666"
        />
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
          placeholder="Số điện thoại"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#666"
        />
        <TextInput
          placeholder="Địa chỉ"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
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
        <TextInput
          placeholder="Xác nhận mật khẩu"
          style={styles.input}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          placeholderTextColor="#666"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#004D40" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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

export default Register;
