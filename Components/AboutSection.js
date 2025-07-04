import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AboutSection = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://moitruongbinhduong.gov.vn/thumb/590x465/1/upload/hinhanh/anh-chup-man-hinh-2023-05-16-luc-16.25.29-5567-76780.png' }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.title}>Về chúng tôi</Text>

        <Text style={styles.description}>
          TRUNG TÂM QUAN TRẮC KỸ THUẬT - TÀI NGUYÊN VÀ MÔI TRƯỜNG trực thuộc SỞ TÀI NGUYÊN VÀ MÔI TRƯỜNG BÌNH DƯƠNG xin kính chào Quý khách.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Xem thêm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B6A77',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  button: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#1B6A77',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AboutSection;
