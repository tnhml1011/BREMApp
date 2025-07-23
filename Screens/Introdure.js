import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Linking, Image,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Header from '../Components/Header';
import TopMenuBar from '../Components/TopMenuBar';
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
const PAGE_SIZE = 6;

const Introdure = () => {
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'introdure'));
        const list = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            title: d.title,
            thumbnail: d.thumbnail,
            pdf_link: d.pdf_link,
            created_at: d.created_at?.toDate?.().toLocaleDateString('vi-VN') || ''
          };
        });

        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setData(list);
        setVisibleData(list.slice(0, PAGE_SIZE));
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    const more = data.slice(nextPage * PAGE_SIZE - PAGE_SIZE, nextPage * PAGE_SIZE);
    setVisibleData(prev => [...prev, ...more]);
    setPage(nextPage);
  };

  const openPdf = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => console.error("Không thể mở PDF:", err));
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openPdf(item.pdf_link)}>
      {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>📅 {item.created_at}</Text>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Xem tài liệu</Text>
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
        data={visibleData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
      />
      {visibleData.length < data.length && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
          <Text style={styles.loadMoreText}>Tải thêm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
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
  loadMoreButton: {
    padding: 14,
    backgroundColor: '#004d40',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderRadius: 8,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Introdure;
