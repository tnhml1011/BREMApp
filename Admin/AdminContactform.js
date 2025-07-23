import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  Button,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from '../Components/Header';
import TopMenuBar from '../Components/TopMenuBar';
const AdminContactForm = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const snapshot = await firestore()
        .collection('contact_forms')
        .orderBy('createdAt', 'desc')
        .get();

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(list);
      setFiltered(list);
    } catch (error) {
      console.error('Lỗi tải form:', error);
    }
    setLoading(false);
  };
  const sendToDrive = async (formData) => {
  try {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const yyyy = now.getFullYear();
    const fileName = `${dd}_${mm}_${yyyy}.docx`;

    const res = await fetch('https://script.google.com/macros/s/AKfycbwknNSqqStR55mpYBLVHT_oTdycc192ufnjFkghEujYdTONAHCYwDPV-9MDqxtPZ1WASw/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        fileName,
      }),
    });

    const json = await res.json();
    if (json.success) {
      Alert.alert('✔️ Đã lưu file', `Tên file: ${fileName}\n${json.url}`);
    } else {
      Alert.alert('⚠️ Lỗi lưu file', json.error || 'Không thể tạo file Word');
    }
  } catch (err) {
    Alert.alert('⚠️ Lỗi kết nối', err.message);
  }
};


  const handleApprove = async (id) => {
  try {
    const doc = await firestore().collection('contact_forms').doc(id).get();
    const formData = doc.data();

    await firestore().collection('contact_forms').doc(id).update({ status: 'đã xử lý' });
    Alert.alert('✔️ Thành công', 'Đã chuyển trạng thái thành "đã xử lý"');

    await sendToDrive({
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      address: formData.address || '',
      subject: formData.subject || '',
      message: formData.message || '',
      createdAt: formData.createdAt?.toDate().toLocaleString() || '',
    });

    setSelected(null);
    fetchForms();
  } catch (e) {
    console.error('Lỗi duyệt:', e);
    Alert.alert('⚠️ Lỗi', 'Không thể xử lý form.');
  }
};

  const handleDelete = async (id) => {
  Alert.alert('Xác nhận xoá', 'Bạn có chắc muốn xoá form này?', [
    { text: 'Hủy', style: 'cancel' },
    {
      text: 'Xoá',
      style: 'destructive',
      onPress: async () => {
        try {
          await firestore().collection('contact_forms').doc(id).delete();
          Alert.alert('Đã xoá thành công');
          setSelected(null);
          fetchForms(); // refresh danh sách
        } catch (error) {
          console.error('Lỗi xoá:', error);
          Alert.alert('Lỗi', 'Không thể xoá form.');
        }
      },
    },
  ]);
};

  const handleFilter = () => {
    let results = data;

    if (search.trim()) {
      const lower = search.trim().toLowerCase();
      results = results.filter(item =>
        item.name.toLowerCase().includes(lower) ||
        item.subject.toLowerCase().includes(lower) ||
        item.address.toLowerCase().includes(lower)
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      results = results.filter(item => {
        const createdAt = item.createdAt?.toDate?.();
        return createdAt >= start && createdAt <= end;
      });
    }

    setFiltered(results);
    setCurrentPage(1);
  };

  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <ScrollView style={styles.container}>
      <Header/>
      <TopMenuBar/>
      <Text style={styles.title}>📬 Danh sách form liên hệ</Text>

      {/* Bộ lọc */}
      <TextInput
        style={styles.input}
        placeholder="🔍 Tìm theo tên, chủ đề, địa chỉ..."
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.dateRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Từ ngày (YYYY-MM-DD)"
          value={startDate}
          onChangeText={setStartDate}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 10 }]}
          placeholder="Đến ngày (YYYY-MM-DD)"
          value={endDate}
          onChangeText={setEndDate}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleFilter}>
        <Text style={styles.buttonText}>Lọc</Text>
      </TouchableOpacity>

      {/* Danh sách form */}
      {paginatedData.map(item => (
        <TouchableOpacity key={item.id} style={styles.itemBox} onPress={() => setSelected(item)}>
          <Text style={styles.itemText}>👤 {item.name}</Text>
          <Text>📌 Chủ đề: {item.subject}</Text>
          <Text>📍 Địa chỉ: {item.address}</Text>
          <Text>🕒 {item.createdAt.toDate().toLocaleString()}</Text>
          <Text>📌 Trạng thái: {item.status}</Text>
        </TouchableOpacity>
      ))}

      {/* Phân trang */}
      <View style={styles.pagination}>
        <Button title="◀" onPress={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
        <Text style={styles.pageNumber}>Trang {currentPage}</Text>
        <Button title="▶" onPress={() => setCurrentPage(p => p + 1)} disabled={currentPage * pageSize >= filtered.length} />
      </View>

      {/* Modal chi tiết */}
      {selected && (
        <Modal animationType="slide" transparent={true} visible={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chi tiết</Text>
              <Text>👤 Họ tên: {selected.name}</Text>
              <Text>📧 Email: {selected.email}</Text>
              <Text>📞 Điện thoại: {selected.phone}</Text>
              <Text>🏠 Địa chỉ: {selected.address}</Text>
              <Text>📌 Chủ đề: {selected.subject}</Text>
              <Text>📝 Nội dung: {selected.message}</Text>
              <Text>🕒 Gửi lúc: {selected.createdAt.toDate().toLocaleString()}</Text>
              <Text>📌 Trạng thái: {selected.status}</Text>

              {selected.status === 'đã gửi' && (
                <TouchableOpacity style={styles.button} onPress={() => handleApprove(selected.id)}>
                  <Text style={styles.buttonText}>✅ Duyệt</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setSelected(null)} style={styles.button}>
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#d32f2f' }]} onPress={() => handleDelete(selected.id)}>
                <Text style={styles.buttonText}>🗑️ Xoá</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
    
  );
  
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B6A77',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1B6A77',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemBox: {
    backgroundColor: '#e0f2f1',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  itemText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  pageNumber: {
    marginHorizontal: 12,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 6,
    maxHeight: '80%', 
    width: '90%',     
    alignSelf: 'center', 
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#1B6A77',
  },
});

export default AdminContactForm;
