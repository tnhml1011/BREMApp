import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Linking, Image,
  StyleSheet, ActivityIndicator, Button
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

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [visibleNews, setVisibleNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'news'));
        const news = querySnapshot.docs.map(doc => doc.data());
        news.sort((a, b) => new Date(b.crawledAt) - new Date(a.crawledAt));
        setNewsList(news);
        setVisibleNews(news.slice(0, PAGE_SIZE));
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const moreNews = newsList.slice(start, end);
    setVisibleNews(prev => [...prev, ...moreNews]);
    setPage(nextPage);
  };

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
        <Text style={styles.buttonText}>Xem thêm</Text>
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
        data={visibleNews}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
      />
      {visibleNews.length < newsList.length && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
          <Text style={styles.loadMoreText}>Tải thêm</Text>
        </TouchableOpacity>
      )}
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

export default News;
