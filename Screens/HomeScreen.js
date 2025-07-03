import React from 'react';
import { ScrollView, Image, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Header from '../Components/Header.js';
import Carousel from '../Components/Carousel';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Header />
      <Carousel />
      {/* Thêm các phần khác nếu có */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B6A77', // màu xanh của site
  },
});

export default HomeScreen;
