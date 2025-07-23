import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import CarouselSection from '../Components/Carousel';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import TopMenuBar from '../Components/TopMenuBar';
import AboutSection from '../Components/AboutSection';
import ServiceItem from '../Components/Serviceitem';
import { Text } from 'react-native-paper';
const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Nội dung có thể scroll */}
      <Header />
        <TopMenuBar/>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <CarouselSection /> 
        <Text style={styles.title}>Về Chúng Tôi</Text>
        <AboutSection/>
        <Text style={styles.title}>Dịch vụ nổi bật</Text>
        <ServiceItem/>
         <Footer />
      </ScrollView>

      {/* Footer cố định dưới */}
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  title:{
    
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1B6A77',
    marginBottom: 8,
    textAlign:'center',
  
  },
});

export default HomeScreen;
