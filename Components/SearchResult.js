import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import TopMenuBar from './TopMenuBar';
import Header from './Header';
const removeVietnameseTones = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
};

const SearchResult = ({ route }) => {
  const { keyword, results } = route.params;

  const openInBrowser = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => console.error('Không mở được URL:', err));
    } else {
      alert('Không có liên kết chi tiết!');
    }
  };

  const normalizedKeyword = removeVietnameseTones(keyword);

  const filteredResults = results.filter(item => {
    const title = removeVietnameseTones(item.title || '');
    const description = removeVietnameseTones(item.description || '');
    return title.includes(normalizedKeyword) || description.includes(normalizedKeyword);
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openInBrowser(item.detail_link || item.url)}>
      {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>
        📅 {item.date || item.created_at?.toDate?.().toLocaleDateString('vi-VN') || '---'}
        {'   '}👁 {item.views || 0}
      </Text>
      {item.description && <Text style={styles.description}>{item.description}</Text>}
      <View style={styles.button}>
        <Text style={styles.buttonText}>Xem thêm</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 , backgroundColor :'#1B6A77'}}>
      <Header/>
      <TopMenuBar/>
      <Text style={styles.header}>Kết quả cho: “{keyword}” ({filteredResults.length})</Text>
      {filteredResults.length === 0 ? (
        <Text style={styles.noResult}>Không tìm thấy kết quả nào.</Text>
      ) : (
        <FlatList
          data={filteredResults}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.title + index}
          contentContainerStyle={styles.container}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 10,
    color: '#004d40',
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
  noResult: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default SearchResult;
