import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import TopMenuBar from '../Components/TopMenuBar';
import Header from '../Components/Header';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const fetchUserInfo = async () => {
    const user = auth().currentUser;
    if (user) {
      const doc = await firestore().collection('Users').doc(user.uid).get();
      if (doc.exists) {
        setUserData(doc.data());
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleUpdate = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('Users').doc(user.uid).update(userData);
        Alert.alert('Cập nhật thành công');
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      Alert.alert('Cập nhật thất bại');
    }
  };

  return (
    <View style={styles.container}>
        <Header/>
        <TopMenuBar/>
      <Text style={styles.title}>Thông tin cá nhân</Text>

      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={userData.fullName}
        onChangeText={(text) => setUserData({ ...userData, fullName: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userData.email}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={userData.phone}
        onChangeText={(text) => setUserData({ ...userData, phone: text })}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={userData.address}
        onChangeText={(text) => setUserData({ ...userData, address: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1B6A77',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UserProfile;
