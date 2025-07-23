import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from '../Components/Header';
import TopMenuBar from '../Components/TopMenuBar';
const Adminscreen = () => {
  const [info, setInfo] = useState({
    tentt: '',
    diachi: '',
    sdt: '',
    didong: '',
    email: '',
    website: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doc = await firestore().collection('Information').doc('main').get();
        if (doc.exists) {
          setInfo(doc.data());
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu :', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await firestore().collection('Information').doc('main').set(info);
      Alert.alert('Thành công', 'Thông tin đã được cập nhật.');
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      Alert.alert('Lỗi', 'Không thể lưu thông tin.');
    }
    setLoading(false);
  };

  const fields = [
    { label: 'Tên trung tâm', key: 'tentt' },
    { label: 'Địa chỉ', key: 'diachi' },
    { label: 'Số điện thoại cố định', key: 'sdt' },
    { label: 'Di động', key: 'didong' },
    { label: 'Email', key: 'email' },
    { label: 'Website', key: 'website' },
  ];

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
        <Header/>
        <TopMenuBar/>
      <Text style={styles.title}>Quản lý thông tin</Text>

      {fields.map(({ label, key }) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            value={info[key]}
            onChangeText={(text) => handleChange(key, text)}
            style={styles.input}
            placeholder={`Nhập ${label.toLowerCase()}`}
            placeholderTextColor="#999"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
   
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B6A77',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: '#000',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#1B6A77',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Adminscreen;
