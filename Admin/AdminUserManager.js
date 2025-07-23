import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from '../Components/Header';
import TopMenuBar from '../Components/TopMenuBar';
const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Users')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(list);
      });

    return () => unsubscribe();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (selectedUser) {
      await firestore().collection('Users').doc(selectedUser.id).update({
        name: editName,
        role: editRole,
      });
      setEditModalVisible(false);
      Alert.alert('Đã cập nhật người dùng.');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa người dùng này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        onPress: async () => {
          await firestore().collection('Users').doc(id).delete();
          Alert.alert('Đã xóa người dùng.');
        },
        style: 'destructive',
      },
    ]);
  };

  const handleToggleBlock = async (id, currentStatus) => {
  const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
  await firestore().collection('Users').doc(id).update({ status: newStatus });
  Alert.alert(newStatus === 'blocked' ? 'Đã chặn người dùng.' : 'Đã bỏ chặn người dùng.');
};

  return (
    <View style={styles.container}>
      <Header/>
      <TopMenuBar/>
          <Text style={styles.title}>👥 Danh sách người dùng</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name} ({item.email})</Text>
            <Text style={styles.role}>🎯 Quyền: {item.role}</Text>
            <Text style={styles.status}>⚠️ Trạng thái: {item.status || 'active'}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnEdit} onPress={() => handleEdit(item)}>
                <Text style={styles.btnText}>Sửa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                    style={item.status === 'blocked' ? styles.btnUnblock : styles.btnBlock}
                    onPress={() => handleToggleBlock(item.id, item.status)}
                  >
                    <Text style={styles.btnText}>
                      {item.status === 'blocked' ? 'Bỏ chặn' : 'Chặn'}
                    </Text>
                  </TouchableOpacity>


              <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item.id)}>
                <Text style={styles.btnText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal chỉnh sửa */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✏️ Sửa người dùng</Text>

            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Tên"
            />
            <TextInput
              style={styles.input}
              value={editRole}
              onChangeText={setEditRole}
              placeholder="Quyền (user, admin...)"
            />

            <TouchableOpacity style={styles.modalBtn} onPress={handleSaveEdit}>
              <Text style={styles.btnText}>Lưu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.btnText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f1f1f1' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#1B6A77' },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  role: { fontSize: 14, color: '#333' },
  status: { fontSize: 14, color: '#888', marginBottom: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  btnEdit: { backgroundColor: '#1B6A77', padding: 8, borderRadius: 6 },
  btnBlock: { backgroundColor: '#d97706', padding: 8, borderRadius: 6 },
  btnDelete: { backgroundColor: '#dc2626', padding: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1B6A77',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  modalBtn: {
    backgroundColor: '#1B6A77',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnUnblock: { 
    backgroundColor: '#16a34a',
     padding: 8,
      borderRadius: 6 
    },

});

export default AdminUserManager;
