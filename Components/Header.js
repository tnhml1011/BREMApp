import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <View>
        <Text style={styles.title}>SỞ NÔNG NGHIỆP VÀ MÔI TRƯỜNG</Text>
        <Text style={styles.subtitle}>TRUNG TÂM QUAN TRẮC - KỸ THUẬT TN&MT</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    color: '#1B6A77',
  },
  subtitle: {
    fontSize: 12,
    color: '#1B6A77',
  },
});

export default Header;
