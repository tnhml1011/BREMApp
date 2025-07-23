import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  FlatList,
} from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import TopMenuBar from '../Components/TopMenuBar';
import Header from '../Components/Header';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Profile = () => {
  const [expanded, setExpanded] = useState({
    observe: false,
    consult: false,
    tech: false,
  });
  const [news, setNews] = useState([]);
const navigation = useNavigation();

  const toggle = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };
const openInApp = (url) => {
  navigation.navigate('WebviewScreen', { url });
};

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const snapshot = await firestore()
          .collection('Information')
          .orderBy('crawledAt', 'desc')
          .limit(10)
          .get();

        const data = snapshot.docs.map((doc) => doc.data());
        setNews(data);
      } catch (error) {
        console.error('Error fetching profile news:', error);
      }
    };

    fetchNews();
  }, []);

  const openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert(`Không thể mở URL: ${url}`);
    }
  };

 const renderItem = ({ item }) => (
  <TouchableOpacity
    style={styles.newsItem}
    onPress={() => openURL(item.url)}
    activeOpacity={0.8}
  >
    <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />

    <View style={styles.row}>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <MaterialIcons name="open-in-new" size={18} color="#1B6A77" />
    </View>

    <Text style={styles.date}>{item.date}</Text>
    <Text style={styles.views}>👁 {item.views}</Text>
  </TouchableOpacity>
);


  return (
    <ScrollView style={styles.container}>
      <Header />
      <TopMenuBar />
      <Text style={styles.header}>
        TRUNG TÂM QUAN TRẮC - KỸ THUẬT TÀI NGUYÊN MÔI TRƯỜNG TỈNH BÌNH DƯƠNG
      </Text>

      <Text style={styles.paragraph}>
        Trung tâm Quan trắc - Kỹ thuật Tài nguyên và Môi trường (BREM) là đơn vị sự nghiệp công trực thuộc Sở Tài nguyên và Môi trường tỉnh Bình Dương, thành lập theo Quyết định số 4715/QĐ-UBND ngày 29/10/2007.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>🏢 Trụ sở:</Text>
        <Text style={styles.info}>Số 26, đường Huỳnh Văn Nghệ, Phường Phú Lợi, TP. Thủ Dầu Một, Bình Dương</Text>

        <Text style={styles.label}>📞 Điện thoại:</Text>
        <Text style={styles.info}>(0274) 3824753 - 0979 82 11 41</Text>

        <Text style={styles.label}>📧 Email:</Text>
        <Text style={styles.info}>quantrac.tnmt@binhduong.gov.vn</Text>

        <Text style={styles.label}>🌐 Website:</Text>
        <Text style={styles.info}>www.moitruongbinhduong.gov.vn</Text>
      </View>

      <Divider style={{ marginVertical: 10 }} />

      <List.Section title="Chức năng, nhiệm vụ chính">
        <List.Accordion
          title="📊 Hoạt động Quan trắc và phân tích"
          expanded={expanded.observe}
          onPress={() => toggle('observe')}
        >
          <List.Item title="• Quan trắc nước mặt, nước dưới đất, trầm tích đáy, không khí và đất." />
          <List.Item title="• Giám định môi trường phục vụ công tác quản lý." />
          <List.Item title="• Phân tích các thành phần: nước thải, khí thải, đất, chất thải nguy hại, không khí..." />
          <List.Item title="• Đo đạc môi trường lao động và lập hồ sơ an toàn vệ sinh lao động." />
        </List.Accordion>

        <List.Accordion
          title="📚 Hoạt động Tư vấn và nghiên cứu khoa học"
          expanded={expanded.consult}
          onPress={() => toggle('consult')}
        >
          <List.Item title="• Lập báo cáo đánh giá tác động môi trường, hồ sơ xin phép môi trường." />
          <List.Item title="• Lập hồ sơ khai thác tài nguyên nước, khoáng sản." />
          <List.Item title="• Xử lý sự cố môi trường, cải tạo, phục hồi môi trường." />
          <List.Item title="• Thực hiện đề tài nghiên cứu khoa học, truyền thông môi trường." />
          <List.Item title="• Tư vấn vay vốn từ Quỹ bảo vệ môi trường." />
        </List.Accordion>

        <List.Accordion
          title="🛠️ Hoạt động Kỹ thuật, công nghệ"
          expanded={expanded.tech}
          onPress={() => toggle('tech')}
        >
          <List.Item title="• Hiệu chuẩn, kiểm định thiết bị quan trắc." />
          <List.Item title="• Thiết kế, thi công công trình xử lý môi trường." />
          <List.Item title="• Quan trắc tự động nước thải, khí thải, chất thải rắn, nước mặt, không khí..." />
          <List.Item title="• Khảo sát địa hình, địa chất công trình, khoan giếng, trám giếng..." />
        </List.Accordion>
      </List.Section>

      <Text style={styles.newsHeader}>📢 Tin liên quan</Text>
      <FlatList
        data={news}
        keyExtractor={(item, index) => item.url + index}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.newsList}
        
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B6A77',
    marginBottom: 10,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 12,
    color: '#333',
    textAlign: 'justify',
  },
  infoBox: {
    backgroundColor: '#e0f7fa',
    padding: 12,
    borderRadius: 6,
  },
  label: {
    fontWeight: 'bold',
    color: '#00796B',
    marginTop: 6,
  },
  info: {
    fontSize: 14,
    color: '#1f1e1d',
  },
  newsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#1B6A77',
  },
  newsList: {
    paddingBottom: 30,
  },
  newsItem: {
    width: 200,
    marginRight: 12,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 6,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  views: {
    fontSize: 12,
    color: '#888',
  },
  row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
},

});

export default Profile;
