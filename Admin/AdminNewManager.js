import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Modal, Alert, Image
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from '../Components/Header';
import TopMenuBar from '../Components/TopMenuBar';
const DEFAULT_THUMBNAIL = "https://moitruongbinhduong.gov.vn/upload/news/quan-trac-kk2322_300x228-698106613_300x228.jpg";

const AdminNewManager = () => {
  const [newsList, setNewsList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('news')
      .orderBy('crawledAt', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNewsList(list);
      });

    return () => unsubscribe();
  }, []);

  const openModal = (item = null) => {
    setSelectedItem(item);
    setTitle(item?.title || '');
    setDescription(item?.description || '');
    setUrl(item?.url || '');
    setThumbnail(item?.thumbnail || '');
    setDate(item?.date || '');
    setModalVisible(true);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setUrl('');
    setThumbnail('');
    setDate('');
    setSelectedItem(null);
  };

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert('❗ Vui lòng nhập tiêu đề');
    if (!url.trim()) return Alert.alert('❗ Vui lòng nhập URL');

    const data = {
      title,
      description,
      url,
      thumbnail: thumbnail.trim() || DEFAULT_THUMBNAIL,
      date,
      views: selectedItem?.views || 0,
      crawledAt: selectedItem?.crawledAt || new Date(),
    };

    try {
      if (selectedItem) {
        await firestore().collection('news').doc(selectedItem.id).update(data);
        Alert.alert('✅ Cập nhật thành công');
      } else {
        await firestore().collection('news').add(data);
        Alert.alert('✅ Thêm mới thành công');
      }
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('❌ Lỗi:', error.message);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('❗ Xác nhận xóa', 'Bạn có chắc muốn xóa tin tức này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await firestore().collection('news').doc(id).delete();
          Alert.alert('🗑️ Đã xóa');
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.thumbnail || DEFAULT_THUMBNAIL }}
        style={styles.thumbnail}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>
        📅 {item.date || '---'}   👁 {item.views || 0}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnEdit} onPress={() => openModal(item)}>
          <Text style={styles.btnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
        <Header/>
        <TopMenuBar/>
      <Text style={styles.header}>📰 Quản lý Tin Tức</Text>

      

      <FlatList
        data={newsList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedItem ? '✏️ Sửa tin tức' : '➕ Thêm tin tức'}
            </Text>

            <TextInput style={styles.input} placeholder="Tiêu đề" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Mô tả" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="URL bài viết" value={url} onChangeText={setUrl} />
            <TextInput style={styles.input} placeholder="Thumbnail (URL)" value={thumbnail} onChangeText={setThumbnail} />
            <TextInput style={styles.input} placeholder="Ngày đăng (dd.mm.yyyy)" value={date} onChangeText={setDate} />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Lưu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setModalVisible(false); resetForm(); }}>
              <Text style={styles.btnText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.btnText}>+ Thêm mới</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#1B6A77' },
  addButton: {
    backgroundColor: '#1B6A77',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderRadius: 6,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  meta: { fontSize: 12, color: '#666' },
  actions: { flexDirection: 'row', marginTop: 10 },
  btnEdit: {
    backgroundColor: '#00796b',
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  btnDelete: {
    backgroundColor: '#dc2626',
    padding: 8,
    borderRadius: 6,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B6A77',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  saveBtn: {
    backgroundColor: '#1B6A77',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelBtn: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
});

export default AdminNewManager;
