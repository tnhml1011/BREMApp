import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';

const ServiceItem = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Điều hướng đến chi tiết dịch vụ nếu có
    navigation.navigate('ServiceDetail', {
      title: 'Quan trắc nước mặt, nước ngầm, trầm tích đáy, không khí và đất.',
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.innerContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: 'https://moitruongbinhduong.gov.vn/thumb/435x225/1/upload/news/12-4763.jpg' }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.infoWrapper}>
          <Text style={styles.title}>
            Quan trắc nước mặt, nước ngầm, trầm tích đáy, không khí và đất.
          </Text>
          <Text style={styles.description}>
            Trung tâm là đơn vị duy nhất trên địa bàn tỉnh có chức năng tổ chức thực hiện công tác quan trắc tài nguyên và môi trường, đo đạc và lập báo cáo giám sát môi trường, thực hiện trưng cầu giám định phục vụ công tác thanh kiểm tra về bảo vệ môi trường cho các cơ quan quản lý nhà nước trên địa bàn tỉnh Bình Dương
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://moitruongbinhduong.gov.vn/dich-vu/quan-trac-nuoc-mat-nuoc-ngam-tram-tich-day-khong-khi-va-dat-31.html')}>
                 <Text style={styles.link}>Xem chi tiết</Text>
            </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    overflow: 'hidden',
  },
  innerContainer: {
    flexDirection: 'column',
  },
  imageWrapper: {
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoWrapper: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B6A77',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    color: '#1B6A77',
    fontWeight: '600',
  },
});

export default ServiceItem;
