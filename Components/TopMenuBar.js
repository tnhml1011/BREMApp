import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import AdminContactform from '../Admin/AdminContactform';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const TopMenuBar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('user');
  const [userName, setUserName] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth().currentUser;
      if (user) {
        const doc = await firestore().collection('Users').doc(user.uid).get();
        if (doc.exists) {
          const data = doc.data();
          setRole(data.role || 'user');
          setUserName(data.fullName || 'admin');
          const firstName = fullName.split(' ').slice(-1)[0]; // lấy từ cuối cùng
          setUserName(firstName);
        }
      }
    };
    fetchUserInfo();
  }, []);

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

 const navigateTo = async (item) => {
  switch (item) {
    case 'Trang chủ': navigation.navigate('HomeScreen'); break;
    case 'Giới thiệu': navigation.navigate('Profile'); break;
    case 'TIN TỨC': navigation.navigate('NewsScreen'); break;
    case 'Dịch vụ': navigation.navigate('ServiceScreen'); break;
    case 'Liên hệ': navigation.navigate('Contact'); break;
    case 'BẢNG GIÁ': navigation.navigate('BangGia'); break;
    case 'Tài liệu': navigation.navigate('Introdure'); break;
    case 'Thông tin quan trắc': navigation.navigate('Dulieu'); break;
    case 'Đăng nhập': navigation.navigate('Login'); break;
    case 'Quản lý người dùng': navigation.navigate('AdminUserManager'); break;
    case 'Quản lý dữ liệu': navigation.navigate('AdminDataManager'); break;
    case 'Thông tin cá nhân': navigation.navigate('UserProfile'); break;
    case 'Quản lý liên hệ': navigation.navigate('Adminscreen'); break;
    case 'Quản lý nhận tin': navigation.navigate('AdminContactform');break;
    case 'Quản lý tin tức' : navigation.navigate('AdminNewManager'); break;
    case 'Đăng xuất':
      try {
        await auth().signOut();
        setUserName('');
        setRole('user');
        navigation.navigate('HomeScreen'); // hoặc về màn Login
      } catch (error) {
        console.error('Lỗi đăng xuất:', error);
      }
      break;
    default: break;
  }
};


  const handleMenuItemPress = (item) => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      navigateTo(item);
    });
  };

  const removeVietnameseTones = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
};

const handleSearch = async () => {
  if (!keyword.trim()) return;

  try {
    const [serviceSnap, newsSnap, dataSnap] = await Promise.all([
      firestore().collection('service').get(),
      firestore().collection('news').get(),
      firestore().collection('dulieuquantrac').get(),
    ]);

    const normalizedKeyword = removeVietnameseTones(keyword.trim());

    const filterDocs = (snap, type) =>
      snap.docs
        .map(doc => ({ ...doc.data(), type }))
        .filter(item =>
          removeVietnameseTones(item.title || '').includes(normalizedKeyword)
        );

    const results = [
      ...filterDocs(serviceSnap, 'service'),
      ...filterDocs(newsSnap, 'news'),
      ...filterDocs(dataSnap, 'dulieuquantrac'),
    ];

    navigation.navigate('SearchResult', { keyword, results });
    setSearchVisible(false);
    setKeyword('');
  } catch (error) {
    console.error('Lỗi tìm kiếm:', error);
  }
};


  const getMenuList = () => {
  const base = [
    
    'Giới thiệu',
    'Dịch vụ',
    'Thông tin quan trắc',
    'Tài liệu',
    'Liên hệ',
  ];

  if (auth().currentUser) {
  base.push('Thông tin cá nhân');

  if (role.toLowerCase() === 'admin') {
    base.push('Quản lý người dùng', 'Quản lý dữ liệu','Quản lý liên hệ','Quản lý nhận tin','Quản lý tin tức');
  }

  base.push('Đăng xuất');
} else {
  base.push('Đăng nhập');
}
  return base;
};


  return (
    <>
      <View style={styles.container}>
        
        <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
          <Text style={styles.iconText}>≡</Text>
        </TouchableOpacity>

        <View style={styles.menuItems}>
          <TouchableOpacity onPress={() => handleMenuItemPress('TIN TỨC')}>
            <Text style={styles.menuText}>TIN TỨC</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuItemPress('Trang chủ')}>
            <Text style={styles.menuText}>TRANG CHỦ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuItemPress('BẢNG GIÁ')}>
            <Text style={styles.menuText}>BẢNG GIÁ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightSide}>
          <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)} style={styles.iconButton}>
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>
          {/* {userName !== '' && (
            <Text style={styles.userText}>{userName}</Text>
          )} */}
        </View>
      </View>

      {searchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Nhập từ khóa..."
            value={keyword}
            onChangeText={setKeyword}
            style={styles.searchInput}
            placeholderTextColor="#ccc"
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={{ color: '#fff' }}>Tìm</Text>
          </TouchableOpacity>
        </View>
      )}

      {menuVisible && (
        <>
          <Pressable style={styles.overlay} onPress={toggleMenu} />
          <Animated.View
            style={[
              styles.menuModal,
              {
                transform: [{ scaleY: slideAnim }],
              },
            ]}
          >
            <View style={styles.menuHeader}>
              <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                <Text style={styles.iconText}>≡</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {getMenuList().map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item)}
                >
                  <Text style={styles.menuItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1B6A77',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 50,
  },
  iconButton: {
    padding: 5,
  },
  iconText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  menuItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menuModal: {
    transformOrigin: 'top',
    backgroundColor: '#1B6A77',
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#146066',
  },
  closeButton: {
    padding: 5,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#146066',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#134e55',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
  },
  searchButton: {
    backgroundColor: '#1B6A77',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
  },
});

export default TopMenuBar;
