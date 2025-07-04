import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const menuList = [
  'Trang chủ',
  'Giới thiệu',
  'Dịch vụ',
  'Tra cứu kết quả phân tích',
  'Tra cứu hồ sơ',
  'Thông tin quan trắc',
  'Tài liệu',
  'Thông tin nội bộ',
  'Thông báo',
  'Lịch làm việc',
  'Báo cáo kết quả tuần',
];

const TopMenuBar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleMenuItemPress = (item) => {
    toggleMenu();

    if (item === 'Trang chủ') {
      navigation.navigate('HomeScreen');
    } else if (item === 'Giới thiệu') {
      navigation.navigate('Profile');
    } else {
      console.log('Chọn:', item);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
          <Icon name="menu" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.menuItems}>
          <TouchableOpacity onPress={() => handleMenuItemPress('TIN TỨC')}>
            <Text style={styles.menuText}>TIN TỨC</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuItemPress('Trang chủ')}>
            <Text style={styles.menuText}>TRANG CHỦ</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.menuText}>BẢNG GIÁ</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Icon name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <>
          <Pressable style={styles.overlay} onPress={toggleMenu} />
          <Animated.View style={[styles.menuModal, { height: slideAnim }]}>
            <ScrollView>
              {menuList.map((item, index) => (
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
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#1B6A77',
    zIndex: 10,
    overflow: 'hidden',
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
});

export default TopMenuBar;
