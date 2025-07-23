import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Header from '../Components/Header';
import TopMenuBar from '../Components/TopMenuBar';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// 👉 Đảm bảo bạn có firebaseConfig đúng hoặc import từ file riêng
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

const Service = () => {
  const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services')); // 🔄 Bạn đổi tên collection nếu cần
        const services = querySnapshot.docs.map(doc => doc.data());
        services.sort((a, b) => new Date(b.crawledAt) - new Date(a.crawledAt)); // Ưu tiên theo ngày crawl
        setServiceList(services);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const openInBrowser = (url) => {
    Linking.openURL(url).catch(err => console.error("Không mở được URL:", err));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openInBrowser(item.url)}>
      {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>📅 {item.date}   👁 {item.views}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Xem chi tiết</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
        <TopMenuBar/>
    <FlatList
      data={serviceList}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
    </View>
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

export default Service;
