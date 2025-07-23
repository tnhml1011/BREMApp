import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { WebView } from 'react-native-webview';
import Header from '../Components/Header';
import TopMenuBar from '../Components/TopMenuBar';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [contactInfo, setContactInfo] = useState(null);
  const [loadingContact, setLoadingContact] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const doc = await firestore().collection('Information').doc('main').get();
        if (doc.exists) {
          setContactInfo(doc.data());
        }
      } catch (error) {
        console.error('Lỗi tải thông tin liên hệ:', error);
      } finally {
        setLoadingContact(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const { name, address, phone, email, subject, message } = form;

    if (!name || !address || !phone || !email || !subject || !message) {
      Alert.alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      await firestore().collection('contact_forms').add({
        ...form,
        status: 'đã gửi',
        createdAt: new Date(),
      });
      Alert.alert('Đã gửi thông tin thành công!');
      setForm({
        name: '',
        address: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi gửi thông tin.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <Header />
        <TopMenuBar />

        <Text style={styles.header}>
          {contactInfo?.tentt || 'TRUNG TÂM QUAN TRẮC'}
        </Text>

        {loadingContact ? (
          <Text style={{ textAlign: 'center', color: '#888' }}>Đang tải thông tin...</Text>
        ) : (
          contactInfo && (
            <View style={styles.infoBox}>
              <Text style={styles.text}>📍 {contactInfo.diachi}</Text>
              <Text style={styles.text}>📞 {contactInfo.sdt}</Text>
              <Text style={styles.text}>📱 {contactInfo.didong}</Text>
              <Text style={styles.text}>📧 {contactInfo.email}</Text>
              <Text style={styles.text}>🌐 {contactInfo.website}</Text>
            </View>
          )
        )}

        <Text style={styles.sectionTitle}>📩 Đăng ký nhận tin</Text>

        {[
          { label: 'Họ và tên', key: 'name' },
          { label: 'Địa chỉ', key: 'address' },
          { label: 'Điện thoại', key: 'phone' },
          { label: 'Email', key: 'email' },
          { label: 'Chủ đề', key: 'subject' },
          { label: 'Nội dung', key: 'message', multiline: true },
        ].map(({ label, key, multiline }) => (
          <View key={key} style={{ marginBottom: 12 }}>
            <Text style={styles.inputLabel}>
              {label} <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <TextInput
              value={form[key]}
              onChangeText={(text) => handleChange(key, text)}
              style={[styles.input, multiline && styles.multilineInput]}
              multiline={multiline}
            />
          </View>
        ))}

        <Button title="Gửi" color="#1B6A77" onPress={handleSubmit} />

        <Text style={styles.sectionTitle}>🗺️ Bản đồ</Text>
        <View style={styles.mapContainer}>
          <WebView
            source={{
              uri:
                contactInfo?.mapUrl ||
                'https://www.openstreetmap.org/?mlat=10.9856924&mlon=106.6762736#map=17/10.9856924/106.6762736',
            }}
            style={styles.map}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#f9f9f9',
  },
  inputLabel: {
    fontSize: 14,
    color: '#1B6A77',
    marginBottom: 4,
    fontWeight: '500',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#004d40',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#e0f2f1',
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#1f1e1d',
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f1e1d',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 40,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});

export default Contact;
