import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'PHÒNG HÀNH CHÍNH TỔNG HỢP',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/7-5349.png',
    },
  },
  {
    id: 2,
    title: 'PHÒNG PHÂN TÍCH MÔI TRƯỜNG',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/1-8020.png',
    },
  },
  {
    id: 3,
    title: 'PHÒNG THỬ NGHIỆM',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/2-1295.png',
    },
  },
   {
    id: 4,
    title: 'PHÒNG QUAN TRẮC HIỆN TƯỢNG',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/3-4349.png',
    },
  },
  {
    id: 5,
    title: 'PHÒNG TƯ VẤN CÔNG NGHỆ',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/4-4053.png',
    },
  },
  {
    id: 6,
    title: 'PHÒNG QUAN TRẮC TỰ ĐỘNG & DỮ LIỆU ',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/5-8490.png',
    },
  },
  {
    id: 7,
    title: 'PHÒNG KẾ HOẠCH TÀI CHÍNH ',
    image: {
      uri: 'https://moitruongbinhduong.gov.vn/thumb/1366x570/1/upload/hinhanh/7-5349.png',
    },
  },
];
const CarouselSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={220}
        data={slides}
        autoPlay
        autoPlayInterval={4000}
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.text}>{item.title}</Text>
            </View>
          </View>
        )}
      />
      {/* Dot indicators */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  slide: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 80, 100, 0.7)',
    padding: 10,
    borderRadius: 6,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#1B6A77',
    width: 10,
    height: 10,
  },
});

export default CarouselSection;