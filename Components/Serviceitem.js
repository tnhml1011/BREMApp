import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// 🔧 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAuhJXzsujtgdwiNYyNNaRe6IFefxz_kmQ",
  authDomain: "brem-82e48.firebaseapp.com",
  projectId: "brem-82e48",
  storageBucket: "brem-82e48.appspot.com",
  messagingSenderId: "548387353397",
  appId: "1:548387353397:android:5de4b9701b08c02f0a927c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ServiceItem = () => {
  const [services, setServices] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'services'));
        let data = snapshot.docs.map(doc => doc.data());
        data.sort((a, b) => b.views - a.views);
        setServices(data.slice(0, 3));
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      }
    };

    fetchServices();
  }, []);

  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error('Không mở được URL:', err));
  };

  return (
    <ScrollView style={styles.container}>
      {services.map((item, index) => (
        <View key={index} style={styles.card}>
          <Image source={{ uri: item.thumbnail }} style={styles.image} resizeMode="cover" />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>📅 {item.date}   👁 {item.views}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <TouchableOpacity style={styles.button} onPress={() => openLink(item.url)}>
            <Text style={styles.buttonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={[styles.button, { backgroundColor: '#004d40' }]} onPress={() => navigation.navigate('ServiceScreen')}>
        <Text style={styles.buttonText}>Xem thêm dịch vụ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d40',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    color: '#444',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#00796b',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ServiceItem;
