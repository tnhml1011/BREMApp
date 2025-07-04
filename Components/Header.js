import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Image
        source={{ uri: 'https://moitruongbinhduong.gov.vn/upload/hinhanh/brem-(1)-1764.png' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>SỞ NÔNG NGHIỆP VÀ MÔI TRƯỜNG</Text>
        <Text style={styles.subtitle}>TRUNG TÂM QUAN TRẮC - KỸ THUẬT TN&MT</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 60,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent:'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#1B6A77',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#1B6A77',
  },
});


export default Header;
