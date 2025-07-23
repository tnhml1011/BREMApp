import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Modal, Alert, Image
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AdminDataManager = () => {
  const [dataList, setDataList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [title, setTitle] = useState('');
  const [detailLink, setDetailLink] = useState('');
  const [pdfLink, setPdfLink] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('dulieuquantrac')
      .orderBy('created_at', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDataList(list);
      });

    return () => unsubscribe();
  }, []);

  const openModal = (item = null) => {
    setSelectedItem(item);
    setTitle(item?.title || '');
    setDetailLink(item?.detail_link || '');
    setPdfLink(item?.pdf_link || '');
    setThumbnail(item?.thumbnail || '');
    setModalVisible(true);
  };

  const resetForm = () => {
    setTitle('');
    setDetailLink('');
    setPdfLink('');
    setThumbnail('');
    setSelectedItem(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Tiêu đề không được để trống!');
      return;
    }

    const data = {
      title,
      detail_link: detailLink,
      pdf_link: pdfLink,
      thumbnail,
      created_at: selectedItem ? selectedItem.created_at : new Date(),
    };

    try {
      if (selectedItem) {
        await firestore().collection('dulieuquantrac').doc(selectedItem.id).update(data);
        Alert.alert('Cập nhật thành công');
      } else {
        await firestore().collection('dulieuquantrac').add(data);
        Alert.alert('Thêm mới thành công');
      }
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Lỗi:', error.message);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc muốn xóa dữ liệu này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        onPress: async () => {
          await firestore().collection('dulieuquantrac').doc(id).delete();
          Alert.alert('Đã xóa dữ liệu');
        },
        style: 'destructive'
      }
    ]);
  };

  const renderItem = ({ item }) => (
  <View style={styles.card}>
    {item.thumbnail ? (
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
    ) : null}
    
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.date}>🕓 {item.created_at?.toDate?.().toLocaleDateString('vi-VN') || '...'}</Text>

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
      <Text style={styles.header}>📊 Quản lý dữ liệu quan trắc</Text>

  

      <FlatList
        data={dataList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem ? '✏️ Sửa dữ liệu' : '➕ Thêm dữ liệu'}</Text>

            <TextInput style={styles.input} placeholder="Tiêu đề" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Link chi tiết" value={detailLink} onChangeText={setDetailLink} />
            <TextInput style={styles.input} placeholder="Link PDF" value={pdfLink} onChangeText={setPdfLink} />
            <TextInput style={styles.input} placeholder="Ảnh thumbnail" value={thumbnail} onChangeText={setThumbnail} />

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
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#1B6A77' },
  addButton: {
    backgroundColor: '#1B6A77',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  thumbnail: {
  width: '100%',
  height: 160,
  borderRadius: 8,
  marginBottom: 10,
  resizeMode: 'cover',
},

  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  date: { fontSize: 12, color: '#555' },
  actions: { flexDirection: 'row', marginTop: 8 },
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

export default AdminDataManager;
